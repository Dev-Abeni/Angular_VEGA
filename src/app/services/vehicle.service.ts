import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/Vehicle';
import { SaveVehicle } from '../models/SaveVehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehiclesEndPoint = "https://localhost:44387/api/";

  constructor(private http: HttpClient) {}

  getMakes():Observable<any[]>{
    return this.http.get<any>(this.vehiclesEndPoint + 'makes');
  }

  getFeatures():Observable<any[]>{
    return this.http.get<any>(this.vehiclesEndPoint + 'features');
  }

  getVehicles(filter : any):Observable<any[]>{
    return this.http.get<any>(this.vehiclesEndPoint + 'vehicles' + '?' + this.toQueryString(filter));
  }

  toQueryString(obj : any){
    var parts = [];
    for(var property in obj){
      var value = obj[property];
      if(value != null && value!=undefined)
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }

    return parts.join('&');
  }

  getVehicle(id: any):Observable<any>{
    return this.http.get(this.vehiclesEndPoint + 'vehicles/' + id);
  }

  createVehicle(vehicle: any):Observable<any>{

    return this.http.post<any>(this.vehiclesEndPoint + 'vehicles/', JSON.stringify(vehicle));
  }

  updateVehicle(vehicle: any):Observable<any>{
    return this.http.put(this.vehiclesEndPoint + 'vehicles/' + vehicle.id, vehicle);
  }

  deleteVehicle(id: any):Observable<any>{
    return this.http.delete<any>(this.vehiclesEndPoint + 'vehicles/' + id);
  }
}
