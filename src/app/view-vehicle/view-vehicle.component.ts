import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PhotoService } from '../services/photo.service';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {

  vehicle: any;
  vehicleId: number;
  photos: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastrService: ToastrService,
    private photoService: PhotoService) {

      route.params.subscribe(p => {
        this.vehicleId = +p['id'];
        if(isNaN(this.vehicleId) || this.vehicleId <= 0){
          router.navigate(['/vehicles']);
          return;
        }
      });
    }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(v =>
        this.vehicle = v,
        err => {
          if(err.status == 400){
            this.router.navigate(['/vehicles']);
            return;
          }
        });
  }

  deleteVehicle(){
    if(confirm("Are you sure you want to delete vehicel?")) {
      this.vehicleService.deleteVehicle(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/']);
        });
    }
  }

  uploadPhoto(){
    var nativeEl1ement: HTMLInputElement = this.fileInput.nativeElement;
    this.photoService.upload(this.vehicleId, nativeEl1ement.files[0])
      .subscribe(photo => {
        this.photos.push(photo);
      });
  }

}
