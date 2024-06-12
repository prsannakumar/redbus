import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusService } from '../services/bus.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public registrationForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  public response: string = '';
  public showmsg: string = '';

  constructor(private serv: BusService, private router: Router,private userService:UserService) {}

  LoginDetails(data: any) {
    console.log('Form Data:', data); // Add logging
    this.serv.LoginDetails(data).subscribe(
      res => {
        this.response = res;
        console.log('Response:', res); // Add logging
        if (this.response === 'login') {
          this.userService.setUsername(data.userName); 
          this.router.navigate(['/home']);
        } else {
          this.showmsg = 'Invalid username or password';
        }
      },
      err => {
        console.error('Error:', err); // Add error logging
        this.showmsg = 'Invalid username or password';
      }
    );
  }
}
