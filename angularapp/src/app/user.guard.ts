// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserGuard implements CanActivate {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return true;
//   }
  
// }
import { Injectable } from '@angular/core';
import {  CanActivate,Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  canActivate():boolean {
    return this.is_user();
  }
  constructor(private router:Router){}
  ans:any;
  token:any;
  public is_user()
  {
    if(!!localStorage.getItem('token'))
    {
      this.token=localStorage.getItem('token')
    }
    // console.log(token);
    try{
      this.ans= jwt_decode(this.token);
      }
    catch(Error){
           this.ans= null;
      }
      if(this.ans==null)
      {
        this.router.navigate(['/login'])
        return false;
      }
      if(this.ans.roles[0]=='user')
      {
        return true;
      }
      else{
        this.router.navigate(['/admin'])
        return false;
      }
  }
  
}

