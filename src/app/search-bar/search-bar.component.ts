import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  toDatepicker:Date=new Date;
  search(){}
  from: string = '';
  to: string = '';
  date: string = '';
  fromstore:string='';
  public username: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.username = this.userService.getUsername();
  }

  searchBuses(): void {
    console.log('Search Buses:', {
      from: this.from,
      to: this.to,
      date: this.date
    });
    
    // Implement search logic here
  }
  switch():void{
       this.fromstore=this.from;
       this.from=this.to;
       this.to=this.fromstore;
  }
}
