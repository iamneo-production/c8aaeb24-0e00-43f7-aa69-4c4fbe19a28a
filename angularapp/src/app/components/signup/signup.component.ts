import { Component, OnInit } from '@angular/core';
import { signup } from '../../signup';
import { SignupService } from '../../signup.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  Signup:signup = new signup();
  constructor(private signupservice: SignupService) { }

  ngOnInit(): void {
  }
  go_signup(){
    this.signupservice.createSignup(this.Signup).subscribe( data =>{
      console.log(data);
    },
    error => console.log(error));
  }
  onSubmit()
  {
    console.log(this.Signup);
    this.go_signup();
  }
}
