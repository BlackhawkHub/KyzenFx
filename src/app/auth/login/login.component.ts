import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/shared/storage.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  client: any;
  search: boolean;
  notFound: boolean;
  notActive: boolean;
  creating: boolean;
  signin: boolean;
  returnUrl: string = '';

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute, 
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(
      params => this.returnUrl = params['returnUrl'] || '/home'
    )

    sessionStorage.clear();
    
    this.registerForm = this.fb.group({
      firstName: '',
      lastName: '',
      username: '',
      password: ['', Validators.required],
      matchingPassword: ['', Validators.required],
      email: '',
      clientId: 0
    });
  }

  searchInfo(){
    let pnum = $('#myPhoneNum').val();

    if(!pnum){
      this.toast.warning('Enter Phone Number.');
      return false;
    }
    this.search = true;
    
    this.authService.searchClient(pnum)
    .subscribe(
      resp => {
        // console.log(resp);
        if(!resp.clientRegistered){
          this.toast.error('Client Not Found.');
          this.notFound = true;
        }
        else{
          if(resp.client.status == 'APPROVED'){
            this.client = resp.client;
            this.notFound = false;
            this.notActive = false;
            this.handleClientFound(resp.clientHasUserAccount);
          }
          else{
            this.toast.error('Client Not Approved.');
            this.notFound = false;
            this.notActive = true;
          }
        }
        this.search = false;
      },
      err => {
        console.log(err);
        this.search = false;
        this.toast.error('Client Not Found or Disabled.');
      }
    )
  }

  handleClientFound(available){
    // console.log(this.client);

    this.registerForm = this.fb.group({
      firstName: this.client.firstName,
      lastName: this.client.lastName,
      username: this.client.phoneNumber,
      password: ['', Validators.required],
      matchingPassword: ['', Validators.required],
      email: this.client.email,
      clientId: this.client.id
    });
    
    if(available){
      $('#createArea').hide();
      $('#passwordArea').show();
    }
    else{
      $('#passwordArea').hide();
      $('#createArea').show();
    }

    $('#searchArea').hide();
    $('#accountArea').show();
  }

  clientLogin(){
    this.signin = true;
    let pnum = $('#myPhoneNum').val();
    let pass = $('#myPassword').val();

    if(pnum && pass){
      // console.log(pnum, pass);
    }
    else{
      this.toast.warning('Enter Credentials');
      return false;
    }

    var data = {
      username: pnum,
      password: pass,
      clientSecret: "appclient@123",
      clientId: "CLIENT"
    }

    this.authService.newSignIn(data)
    .subscribe(
      res => {
        console.log(res);
        
        sessionStorage.setItem('access_token', this.storageService.encrypt(res.access_token));
        sessionStorage.setItem('display_name', this.storageService.encrypt(res.firstName + ' ' + res.lastName));

        sessionStorage.setItem('client_id', this.storageService.encrypt(res.clientId.toString()));

        this.signin = false;

        $('#accountArea').hide();
        $('#loadArea').show();
        
        // this.router.navigateByUrl('/home');
        // window.location.href = '/home';

        window.location.href = this.returnUrl;
      },
      error => {
        console.log(error);
        this.signin = false;
        if(error.status == 0){
          this.toast.error("Oops!! No Network.");
          this.signin = false;
        }
        if(error.status == 401){
          this.toast.error("Oops!! Access Denied.");
          this.signin = false;
        }
        else{
          if(error.error.message != null){
            if(error.error.message == "Please set a new password" || error.error.message == "Password expired, please set a new password"){
              sessionStorage.setItem('my_username', this.storageService.encrypt($('#myPhoneNum').val()));
              this.toast.warning("Please change your password.");
              this.router.navigate(['password/changePassword']);
            }
            else{
              let respo = error.error.message.split(" : ");

              if(respo[0].includes("Bad credentials")){
                this.toast.error("Bad Credentials");
              }
              else if(respo[0].includes("User is disabled")){
                this.toast.error("User is Disabled");
              }
              else{
                this.toast.error("Invalid Credentials");
              }
            }           
            
          }
          else{
            this.toast.error('Invalid credentials');
          }
        }      
      }
    )
    
  }

  showFormStart(){
    $('#accountArea').hide();
    $('#searchArea').show();
  }

  createAccount(form: FormGroup){

    if(!this.validatePasswords(form.value.password)){
      $('#pwdErr').html('Weak Password. (8 Characters with 1 Capital, 1 Number and 1 Symbol)');
      return false;
    }
    else{
      $('#pwdErr').html('');
    }
    if(!this.validatePasswords(form.value.matchingPassword)){
      $('#pwd2Err').html('Weak Password. (8 Characters with 1 Capital, 1 Number and 1 Symbol)');
      return false;
    }
    else{
      $('#pwd2Err').html('');
    }

    // console.log(form.value);
    if(form.valid){
      this.creating = true;
      this.authService.createAccount(form.value)
      .subscribe(
        resp => {
          // console.log(resp);
          this.creating = false;
          this.toast.success('Account Created. Please Login.!');
          $('#passwordArea').hide();
          $('#createArea').hide();
          $('#searchArea').show();
          $('#accountArea').hide();
        },
        err => {
          console.log(err);
          this.creating = false;
          if(err.error.message){
            this.toast.error(err.error.message);
          }
          else{
            this.toast.error('Oops. Something Happened.!!');
          }
        }
      )
    }
    
  }

  checkPasswords(){
    if($('#myPass1').val() != $('#myPass2').val()){
      $('#myPass2').removeClass('is-valid');
      $('#myPass2').addClass('is-invalid');
      $('#btnSubmit').attr('disabled', true);
    }
    else{
      $('#myPass2').removeClass('is-invalid');
      $('#myPass2').addClass('is-valid');
      $('#btnSubmit').attr('disabled', false);
    }
  }

  validatePasswords(pwd){
    const rd = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return rd.test(pwd);
  }

  resetPassword(){
    this.router.navigate(['/resetPassword']);
  }

}
