import { Component, OnInit } from '@angular/core';
import { login } from '../../login';
import { LoginService } from '../../login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Login:login = new login();
  constructor(private loginservice: LoginService) { }

  ngOnInit(): void {
  }
  go_login(){
    this.loginservice.createLogin(this.Login).subscribe( data =>{
      console.log(data);
    },
    error => console.log(error));
  }
  onSubmit()
  {
    console.log(this.Login);
    this.go_login();
  }
}
