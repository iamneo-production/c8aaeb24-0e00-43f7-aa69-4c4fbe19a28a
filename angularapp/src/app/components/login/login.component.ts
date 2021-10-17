import { Component, OnInit } from '@angular/core';
import { login } from '../../login';
import { LoginService } from '../../login.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Login:login = new login();
  constructor(private loginservice: LoginService,private router: Router) { }

  ngOnInit(): void {
  }
  ans:any;
  go_login(){
    this.loginservice.createLogin(this.Login).subscribe( (data:any) =>{
      console.log(data);
      if(data.result==false)
      {
        // console.log("hooo");
      }
      else
      {
        localStorage.setItem("token",data.message);
        try{
          this.ans= jwt_decode(data.message);
          }
        catch(Error){
               this.ans= null;
          }
          console.log(this.ans);
          if(this.ans.roles[0]=='admin')
          {
            this.router.navigate(['/admin']);
          }
          else if(this.ans.roles[0]=='user')
          {
            this.router.navigate(['/home']);
          }
      }
    },
    error => console.log(error));
  }
  onSubmit()
  {
    console.log(this.Login);
    this.go_login();
  }

}
