import { Component, inject } from '@angular/core';
import { CustomInputComponent } from '../../shared/ui/custom-input/custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CustomInputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

 private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  loginForm : FormGroup =new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),

  } );

  isLoading: boolean = false
  loginSubscribe: Subscription = new Subscription()



  onSubmit() :void {
if (this.loginForm.valid) {
    this.isLoading = true

  this.loginSubscribe.unsubscribe
  this.loginSubscribe =  this.authService.signIn(this.loginForm.value).subscribe({

    next:(res)=>{

      console.log(res);
      localStorage.setItem('socialToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));


      if (res.success) {
        //navigate
        this.router.navigate(['/feed'])

      }
    } ,

    error:()=>{
      this.isLoading = false
    } ,

    complete:()=>{
      this.isLoading = false
    }


  })


} else{
  this.loginForm.markAllAsTouched();
}
  }

}
