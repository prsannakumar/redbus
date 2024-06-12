
export interface BusInfo {
    id: number;
    busno: number;
    arrivaltime: string;
    departuretime: string;
    price: number;
    startingpoint: string;
    dropingpoint: string;
    type: string[];
    rating: number;

    seats: {
        seater: Seat[];
        sleeper: Seat[];
      };
}
export interface Seat {
    seatNumber: string;
    isBooked: boolean;
  }