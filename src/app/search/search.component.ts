import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { BusService } from '../services/bus.service';
import { BusInfo,Seat } from '../contracts/busInfo';
import { TitleCasePipe } from '@angular/common';
import { faBus, faChair } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [TitleCasePipe] 
})
export class SearchComponent {

  toDatepicker: Date = new Date();
  search() { }
  from: string = '';
  to: string = '';
  date: string = '';
  fromstore: string = '';
  departure: Date = new Date();
  departureDate: string = '';
  public username: string | null = null;
  public busList: BusInfo[] = [];
  public filteredBusList: BusInfo[] = [];
  public itemCount: number = 0;
  public showSeatsFor: number|null  = null;
  faBus = faBus;
  faChair = faChair;
  selectedSeats: Seat[] = [];
  seat:any;

  constructor(private userService: UserService, private busService: BusService, private titleCasePipe: TitleCasePipe) { }

  ngOnInit() {
    this.username = this.userService.getUsername();
    this.seat = [
      { seatNumber: '1A', isBooked: false }, // Example seat object
      { seatNumber: '1B', isBooked: true }, // Example seat object
      // Add more seat objects as needed
    ];
  }

  searchBuses(): void {
    const transformedFrom = this.titleCasePipe.transform(this.from);
    const transformedTo = this.titleCasePipe.transform(this.to);

    this.busService.Buslist(transformedFrom, transformedTo, this.date).subscribe(res => {
      this.busList = res;
      this.filteredBusList = this.busList; // Initialize filtered list with all buses
      this.itemCount = this.busList.length;
    });
  }

  calculateDepartureDate(date: string, arrivalTime: string, departureTime: string) {
    const arrival = new Date(`${date} ${arrivalTime}`);
    this.departure = new Date(`${date} ${departureTime}`);

    if (this.departure < arrival) {
      this.departure.setDate(this.departure.getDate() + 1);
    }
    this.departureDate = this.departure.toISOString().split('T')[0];
  }

  calculateTravelTime(arrivalTime: string, departureTime: string): string {
    const arrival = new Date('2000-01-01 ' + arrivalTime);
    let departure = new Date('2000-01-01 ' + departureTime);
    if (departure < arrival) {
      departure = new Date(departure.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    }

    const travelTime = Math.abs(departure.getTime() - arrival.getTime()) / 36e5; // Convert milliseconds to hours
    return travelTime.toString() + ' hours';
  }

  switch(): void {
    this.fromstore = this.from;
    this.from = this.to;
    this.to = this.fromstore;
  }

  sortBuslistByPrice() {
    this.filteredBusList.sort((a, b) => (a.price-this.discount(a)) - (b.price-this.discount(b)));
  }

  sortBuslistByRating() {
    this.filteredBusList.sort((a, b) => a.rating - b.rating);
  }

  sortBuslistByArrivaltime() {
    this.filteredBusList.sort((a, b) => a.arrivaltime.localeCompare(b.arrivaltime));
  }

  sortBusByDeparturetime() {
    this.filteredBusList.sort((a, b) => {
      let dateA = new Date(this.departure);
      let dateB = new Date(this.departure);

      if (a.arrivaltime > a.departuretime) {
        dateA.setDate(dateA.getDate() + 1);
      }
      if (b.arrivaltime > b.departuretime) {
        dateB.setDate(dateB.getDate() + 1);
      }

      const departureA = this.combineDateAndTime(dateA, a.departuretime).getTime();
      const departureB = this.combineDateAndTime(dateB, b.departuretime).getTime();

      return departureA - departureB; // Sort in ascending order
    });
  }

  combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate;
  }

  filterTypeAc() {
    this.filteredBusList = this.busList.filter(bus =>
      bus.type.some(t => t.toLowerCase() === 'ac')
    );
    this.itemCount = this.filteredBusList.length;
}
  filterTypeNonAc() {
    this.filteredBusList = this.busList.filter(bus =>
      bus.type.some(t => t.toLowerCase().includes('non-ac'))
    );
    this.itemCount = this.filteredBusList.length;
  }

  filterTypeSeater() {
    this.filteredBusList = this.busList.filter(bus =>
      bus.type.some(t => t.toLowerCase().includes('seater'))
    );
    this.itemCount = this.filteredBusList.length;
  }

  filterTypeSleeper() {
    this.filteredBusList = this.busList.filter(bus =>
      bus.type.some(t => t.toLowerCase().includes('sleeper'))
    );
    this.itemCount = this.filteredBusList.length;
  }

  filterBusesBefore10AM() {
    const currentTime = new Date().getTime();
    this.filteredBusList= this.busList.filter(bus => {
      const departureTime = new Date().setHours(
        parseInt(bus.departuretime.split(':')[0]),
        parseInt(bus.departuretime.split(':')[1]),
        0
      );
      return departureTime < currentTime;
    });
    this.itemCount = this.filteredBusList.length;
  }

  filterBusesAfter11PM() {
    const timeBoundary = '23:00:00'; // 11:00 PM in 24-hour format
    this.filteredBusList= this.busList.filter(bus => {
      const departureDateTime = this.convertToDate(bus.departuretime);
      const boundaryDateTime = this.convertToDate(timeBoundary);

      // If the departure time is past 11 PM and before midnight or after midnight
      return (departureDateTime > boundaryDateTime || bus.departuretime.startsWith('00') || bus.departuretime.startsWith('01'));
    });
    this.itemCount = this.filteredBusList.length;
  }

  convertToDate(time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
  }

  filterBusesBetween10AMAnd5PM() {
    const startTime = '10:00:00'; // 10:00 AM in 24-hour format
    const endTime = '17:00:00'; // 5:00 PM in 24-hour format

    this.filteredBusList= this.busList.filter(bus => {
      const departureTime = bus.departuretime;
      return departureTime >= startTime && departureTime <= endTime;
    });
    this.itemCount = this.filteredBusList.length;
  }

  filterBusesBetween5PMAnd11PM() {
    const startTime = '17:00:00'; // 10:00 AM in 24-hour format
    const endTime = '23:00:00'; // 5:00 PM in 24-hour format

    this.filteredBusList= this.busList.filter(bus => {
      const departureTime = bus.departuretime;
      return departureTime >= startTime && departureTime <= endTime;
    });
    this.itemCount = this.filteredBusList.length;
  }
  toggleSeats(bus: any) {
    // Toggle seat display only for the selected bus
    if (this.showSeatsFor === bus.busno) {
      this.showSeatsFor = null; // Hide seats if already shown
    } else {
      this.showSeatsFor = bus.busno; // Show seats for clicked bus
    }
  }
  discount(bus:BusInfo):number{
    if(bus.busno===1222)return 0;
     else if(bus.busno===1221)return 500;
    else return 100;
  }

  isSeater(bus: any): boolean {
    // If bus.type is an array, check if it includes 'seater'
    if (Array.isArray(bus.type)) {
      return bus.type.includes('Sleeper');
    }
    // If bus.type is a string, directly compare
    return bus.type === 'Sleeper';
  }
  
  toggleSeatSelection(seat: Seat): void {
    const index = this.selectedSeats.findIndex(s => s === seat);
    if (index !== -1) {
      this.selectedSeats.splice(index, 1); // Remove seat if already selected
    } else {
      this.selectedSeats.push(seat); // Add seat if not already selected
    }
  }
  isSelected(seat: any): boolean {
    // Your logic to determine if the seat is selected
    return false; // Replace false with your actual logic
  }
 
}
