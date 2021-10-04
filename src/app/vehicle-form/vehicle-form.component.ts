import * as _ from 'underscore';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { SaveVehicle } from '../models/SaveVehicle';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  // Data binders from ts to the template (form)
  makes: any[];
  models: any[];
  features: any[];

  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      email: '',
      phone: ''
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastrService: ToastrService) {
      route.params.subscribe(p => {
        // The "+" in the begining makes the property an int
        this.vehicle.id = +p['id'] || 0;
      })
     }

  ngOnInit(): void {

    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
    ];

    // We make this call inside conditional statement because we
    // dont want to pass a vehicle obj in the create new vehicle
    if(this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    // forkJoin allows the compiler to execute
    // multiple Observables in one go

    // as of RxJS 6.5+ we can use a dictionary of sources
    forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];
      if(this.vehicle.id)
      {
        this.setVehicle(data[2]);
        this.populateModels();
      }
    });
  }

  private setVehicle(v: any){
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;

    // Using underscore library
    this.vehicle.features = _.pluck(v.features, "id");
  }

  onMakeChange(){
    this.populateModels();
    // To reset the Models dropdown whenever
    // we change the value of the Makes dorpdown
    delete this.vehicle.modelId;
  }

  private populateModels(){
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  // Since we cant use [(ngModel)] in dynamic
  // checkboxes we can use the approach below.
  onFeatureToggle(featureId: any, $event: any){
    if($event.target.checked)
      this.vehicle.features.push(featureId);
    else{
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit(){
    var result$ = (this.vehicle.id) ? this.vehicleService.updateVehicle(this.vehicle) : this.vehicleService.createVehicle(this.vehicle);
    result$.subscribe(vehicle => {
      this.toastrService.success("The vehicle was saved successfully", "Saved");
    });
    this.router.navigate(['/vehicles/', this.vehicle.id]);
  }

  deleteVehicle(){
    if(confirm("Are you sure you want to delete vehicel?")) {
      this.vehicleService.deleteVehicle(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/']);
        });
    }
  }
}
