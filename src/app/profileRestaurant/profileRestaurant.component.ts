import { Component, OnInit } from '@angular/core';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { RouterExtensions } from 'nativescript-angular';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { registerElement } from 'nativescript-angular/element-registry';
import { ActivatedRoute } from '@angular/router';
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import * as dialogs from "tns-core-modules/ui/dialogs";
registerElement('MapView', () => MapView);
@Component({
	selector: 'profileRestaurant',
	templateUrl: './profileRestaurant.component.html',
	styleUrls: ['./profileRestaurant.component.css']
})

export class ProfileRestaurantComponent implements OnInit {
profile;
reviews;
star2;
star3;
star4;
star5;
star1;
	mapView: any;
	constructor(private itemService: homeRestaurantService,
        private route: ActivatedRoute) { }

	ngOnInit() {
		const id = +this.route.snapshot.params.id;
        this.profile = this.itemService.getProfilebyID(id);
		this.reviews = this.itemService.getReviews(id);
		this.star1 = "~/assets/images/1star.png";
        this.star2 = "~/assets/images/2star.png";
        this.star3 = "~/assets/images/3star.png"; 
        this.star4 = "~/assets/images/4star.png";
        this.star5 = "~/assets/images/5star.png";
	 }

	 getStars(rate){
		if (rate<=1.49){return this.star1}
		if ((rate>=1.5) && (rate <= 2.49)){return this.star2}
		if ((rate>=2.5) && (rate <= 3.49)){return this.star3}
		if ((rate>=3.5) && (rate <= 4.49)){return this.star4}
		if (rate>=4.5){return this.star5}
	  }
	  mapDisplay=0;
	  zoom = 19;
	  minZoom = 14;
	  maxZoom = 22;
	  bearing = 0;
	  tilt = 0;
	  padding = [10, 10, 10, 10];
	  userDataIndex = 1
	  mapbool = false;
	  statusMap ="~/assets/images/mapsIcon_desactivado.png";
	  lastCamera: String;
	  onMapReady(event) 
	  {	this.mapView = event.object;
		  this.mapView.settings.mapToolbarEnabled = true;
		  this.mapView.settings.myLocationButtonEnabled = true;
		  this.mapView.settings.compassEnabled = true;
		  this.mapView.settings.zoomControlsEnabled = false;
		  
		  // alert("Configurando marcador inicial...");
  
		  // Aqui se crea el primer marcador al iniciar el mapa que es maracaibo
		  var marker = new Marker();
		  marker.position = Position.positionFromLatLng(this.profile.location[0], this.profile.location[1]);
		  marker.title = this.profile.name;
		  marker.snippet = "Maracaibo";
		  this.mapView.addMarker(marker);
	  }

	  showMap(bool){
		  if(bool===false){
			const start = Date.now();

			const timer = setInterval(()=>{
				const timepassed = Date.now() - start;

				if (timepassed >= 240){
					clearInterval(timer);
					this.mapDisplay= 240;
					return;
				}

				this.mapDisplay = timepassed;
			}, 17)

			this.statusMap = "~/assets/images/mapsIcon.png";
			this.mapbool = true;
		  }else{
			const start = Date.now();

			const timer = setInterval(()=>{
				const timepassed = Date.now() - start;

				if (timepassed >= 240){
					clearInterval(timer);
					this.mapDisplay= 0;
					return;
				}

				this.mapDisplay = this.mapDisplay - timepassed;
			}, 17)
			this.statusMap = "~/assets/images/mapsIcon_desactivado.png";
			this.mapbool = false;
		  }
	  }

	  aber(a){
		const mensaje: AlertOptions = {
			title: a,
			message: "Inspeccionaremos el contenido de la reseña. ¡Muchas gracias!",
			okButtonText: "OK",
			cancelable: false
		  };

		  alert(mensaje);
	  }
  
}