import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()

export class PhotoService {

  private vehiclesEndPoint = "https://localhost:44387/api/";

  constructor(private http: HttpClient ) { }

  upload(vehicleId: any, photo: any){
    var formData = new FormData();
    formData.append('file', photo);
    return this.http.post(`${this.vehiclesEndPoint}vehicles/${vehicleId}/photos`, formData);
  }

  getPhotos(vehicleId: any){
    return this.http.get(`${this.vehiclesEndPoint}vehicles/${vehicleId}/photos`);
  }
}
