import { Component, OnInit } from '@angular/core';
import { signup } from '../../signup';
import { SignupService } from '../../signup.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  Signup:signup = new signup();
  emailinvalid:Boolean = false;
  mobileinvalid:Boolean = false;
  useralready:Boolean = false;
  constructor(private signupservice: SignupService, private router: Router) { }

  ngOnInit(): void {
  }
  go_signup(){
    this.signupservice.createSignup(this.Signup).subscribe( (data:any )=>{
      console.log(data);
      if(data.result==true)
      {
        this.goToLogin();
      }
      else
      {
        // if(data.message==='Username already exists')
        // {
        //   this.useralready=true;
        // }
        // for (let i = 0; i < data.errors.length; i++) {
        //   if(data.errors[i]==="Email address is invalid")
        //   {
        //     this.emailinvalid=true;
        //   }
        //   if(data.errors[i]==="Invalid mobile number")
        //   {
        //     this.mobileinvalid=true;
        //   }
        // }
      }

    },
    error => console.log(error));
  }
  onSubmit()
  {
    console.log(this.Signup);
    this.go_signup();
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToSignup()
  {
    this.router.navigate(['/signup']);
  }
}
