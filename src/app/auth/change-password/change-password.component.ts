import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  updateForm: FormGroup;
  loader: boolean;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      matchingPassword: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  changeUserPassword(form: FormGroup){
    if(!this.validatePasswords(form.value.newPassword)){
      $('#pwdErr').html('Weak Password. (8 Characters with 1 Capital, 1 Number and 1 Symbol)');
      return false;
    }
    else{
      $('#pwdErr').html('');
    }
    if(!this.validatePasswords(form.value.matchingPassword)){
      $('#pwdErr2').html('Weak Password. (8 Characters with 1 Capital, 1 Number and 1 Symbol)');
      return false;
    }
    else{
      $('#pwdErr2').html('');
    }

    // console.log(form.value);

    if(form.valid){
      this.loader = true;
      this.authService.changeUserPassword(form.value)
      .subscribe(
        resp => {
          console.log(resp);
          this.toast.success('Password Changed.');
          this.updateForm = this.fb.group({
            matchingPassword: ['', Validators.required],
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required]
          });
          this.loader = false;
        },
        err => {
          console.log(err);
          this.toast.error('Oops. Something Happened.');
          this.loader = false;
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
