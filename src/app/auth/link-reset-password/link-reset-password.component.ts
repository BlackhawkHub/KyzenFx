import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-link-reset-password',
  templateUrl: './link-reset-password.component.html',
  styleUrls: ['./link-reset-password.component.css']
})
export class LinkResetPasswordComponent implements OnInit {

  token: string;
  updateForm: FormGroup;
  updateloading: boolean;

  constructor(
    private activeRoute: ActivatedRoute,
    private toast: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(
      params => this.token = params['token']
    );

    // console.log(this.token);
    this.updateForm = this.fb.group({
      token: this.token,
      newPassword: ['', Validators.required]
    });
    
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
              this.toast.success(resp.message);
            }

            this.router.navigateByUrl('/login');

            this.updateloading = false;
          },
          err => {
            console.log(err);
            if(err.error.message){
              this.toast.error(err.error.message);
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
