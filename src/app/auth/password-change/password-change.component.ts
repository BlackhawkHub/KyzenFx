import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/shared/storage.service';
declare var $: any;

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  loader: boolean;
  changeForm: FormGroup;

  myUsername: any;

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.myUsername = this.storageService.decrypt(sessionStorage.getItem('my_username'));
    // console.log(this.myUsername);
    
    this.changeForm = this.fb.group({
      username: [this.myUsername, Validators.required],
      oldPassword: ['', Validators.required],
      matchingPassword: ['', Validators.required],
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
      this.authService.changeExpiredPassword(form.value)
      .subscribe(
        resp => {
          // console.log(resp);
          this.loader = false;
          this.changeForm.reset();
          this.toast.success('Password Changed.');
          this.router.navigate(['/login']);
        },
        err => {
          console.log(err);
          this.loader = false;
          this.toast.error('An Error Occured. Please Try Again.!');
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
