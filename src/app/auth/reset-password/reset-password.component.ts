import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  updateForm: FormGroup;
  resetloading: boolean;
  loading: boolean;
  updateloading: boolean;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', Validators.required]
    });

    this.updateForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  resetUser(){
    
    if(this.resetForm.valid){
      this.resetloading = true;

      this.authService.resetUser(this.resetForm.value.email)
      .subscribe(
        res => {
          // console.log(res); 

          let respo = res.message;

          if(respo == "User with that email does not exist"){
            this.toast.error(respo);
            this.resetloading = false;
          }
          else{
            this.toast.success(respo);
            this.resetloading = false;

            $('#onSucc2').html('Reset Request Initiated. Check Email.');

            // $('#updateArea').show();
            // $('#emailArea').hide();
            this.resetForm = this.fb.group({
              email: ['', Validators.required]
            });
          }
          
        },
        error => {
          console.log(error);
          this.resetloading = false;

          if(error.error.message != ""){
            let respo = error.error.message;
            this.toast.error(respo);
          }
          else{
            let respo = error.error;
            this.toast.error(respo.error);
          }       
        }
      );
    }
    
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  checkEmail(ele){
    // console.log(ele);

    var typed = ele.target.value;

    if(this.validateEmail(typed)){
      $(ele.target).removeClass('is-invalid');
      $(ele.target).addClass('is-valid');
      $('#btnReset').attr('disabled', false);
    }
    else{
      $(ele.target).removeClass('is-valid');
      $(ele.target).addClass('is-invalid');
      $('#btnReset').attr('disabled', true);
    }
  }

  showUpdateArea(sho, hid){
    $('#' + hid).hide();
    $('#' + sho).show();
  }

  resetUserPassword(form: FormGroup){
    if(!this.validatePasswords(form.value.newPassword)){
      $('#pwdErr').html('Weak Password. (8 Characters with 1 Capital, 1 Number and 1 Symbol)');
      return false;
    }
    else{
      $('#pwdErr').html('');
    }
    if(!this.validatePasswords($('#myPass2').val())){
      $('#pwdErr2').html('Weak Password. (8 Characters with 1 Capital, 1 Number and 1 Symbol)');
      return false;
    }
    else{
      $('#pwdErr2').html('');
    }

    // console.log(form.value);
    
    if(form.valid){
      this.updateloading = true;

      this.authService.resetUserPassword(form.value)
        .subscribe(
          resp => {
            console.log(resp);
            if(resp.message){
              this.toast.info(resp.message);
            }

            this.router.navigateByUrl('/login');

            this.updateloading = false;
          },
          err => {
            console.log(err);
            if(err.message){
              this.toast.error(err.message);
            }
            else {
              this.toast.error('Oops. Something Happened.');
            }
            this.updateloading = false;
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

}
