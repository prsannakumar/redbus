import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http:HttpClient) { }
  public Adddetails(data:any):Observable<string>{
   return this.http.post<string>('http://localhost:8080/signup',data,{ responseType: 'text' as 'json' });
  }

  public Getusers():Observable<string[]>{
    return this.http.get<string[]>('http://localhost:8080/users');
  }

  public LoginDetails(data:any):Observable<string>{
      return this.http.post<string>('http://localhost:8080/login',data,{responseType: 'text' as 'json'});
  }

  public Buslist(from:string,to:string,date:string):Observable<any[]>{
    const params = new HttpParams()
    .set('from', from)
    .set('to', to)
    .set('date',date);
    return this.http.get<any[]>('http://localhost:8080/buslist',{params});
  }
}
