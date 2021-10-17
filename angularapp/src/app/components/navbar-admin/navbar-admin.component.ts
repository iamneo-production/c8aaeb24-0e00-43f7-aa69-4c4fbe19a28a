import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  @Input() deviceXs: boolean = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  onexit()
  {
    console.log(4);
    localStorage.removeItem('token');
    // localStorage.clear();
    this.router.navigate(['/login']);
  }
}
