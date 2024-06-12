import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusService } from '../services/bus.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public registrationForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    userName: new FormControl(''),
    age: new FormControl(),
    password: new FormControl('')
  });

  public users: string[] = [];
  public UserError: string = '';
  public isInvalid: boolean = false;

  constructor(private serv: BusService, private fb: FormBuilder,private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.serv.Getusers().subscribe((res: string[]) => {
      this.users = res;
    });

    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      age: ['', [Validators.required, Validators.min(18),Validators.max(110)]],
      password: ['', Validators.required]
    });
  }

  VerifyUser(e: any) {
    let user = e.target.value;
    this.UserError = '';
    this.isInvalid = false;

    for (var u of this.users) {
      if (u === user) {
        this.UserError = 'Username already taken. Try another';
        this.isInvalid = true;
        break;
      } else {
        this.UserError = 'Username available';
        this.isInvalid = false;
      }
    }
  }

  Adddetails(data: any) {
    if (this.registrationForm.valid) {
      this.serv.Adddetails(data).subscribe(
        res => {
          console.log('Post created successfully:', res);
          alert('User Register successfully');
          this.userService.setUsername(data.userName);  // Store the username
          this.router.navigate(['/home']); // Navigate to the home page
        },
        error => {
          console.error('Error creating post:', error);
        }
      );
    } else {
      alert('Form is invalid. Please correct the errors.');
    }
  }
}
