import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'departureDate'
})
export class DepartureDatePipe implements PipeTransform {

  transform(value: Date | string | null, format: string = 'yyyy-MM-dd'): string {
    if (!value || value === null) return ''; // Return empty string if value is null or undefined
  
    // Convert string to Date object if value is a string
    const date = typeof value === 'string' ? new Date(value) : value;
  
    // Use Angular's DatePipe to format the date
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format) || ''; // Ensure that the transform result is not null
  }
  

}
