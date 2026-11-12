import { Component, inject } from '@angular/core';
import { CustomInputComponent } from '../../shared/ui/custom-input/custom-input.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [CustomInputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',

})
export class RegisterComponent {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  registerForm : FormGroup =new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl('' , [Validators.required , Validators.pattern(/^[a-z0-9_]{3,30}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateOfBirth: new FormControl('' , Validators.required),
    gender: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    rePassword:new FormControl('', Validators.required)
  } , {validators:this.confirmPassword});

  isLoading: boolean = false
  registerSubscribe: Subscription = new Subscription()

  confirmPassword(group:AbstractControl){
   const password =  group.get('password')?.value
   const rePassword =  group.get('rePassword')?.value
    if (rePassword !== password && rePassword !== "") {
      group.get('rePassword')?.setErrors({mismatch:true})
    return  {mismatch:true}
    }
    else{
      return null 
    }
    

  }

  onSubmit() :void {
if (this.registerForm.valid) {
    this.isLoading = true

  this.registerSubscribe.unsubscribe
  this.registerSubscribe =  this.authService.signUp(this.registerForm.value).subscribe({

    next:(res)=>{

      console.log(res);


      if (res.success) {
        //navigate
        this.router.navigate(['/login'])

      }
    } ,

    error:()=>{
      this.isLoading = false
    } ,

    complete:()=>{
      this.isLoading = false
    }


  })

  // console.log(this.registerForm.value);
} else{
  this.registerForm.markAllAsTouched();
}
  }

}
