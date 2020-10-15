import { Component, OnInit } from '@angular/core';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { RouterExtensions } from 'nativescript-angular';
import {HelperService} from '../utils/servicios/helper.service'
import * as utils from "tns-core-modules/utils/utils";
import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { ActivatedRoute } from '@angular/router';
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { UserService } from '../utils/servicios/user.service';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { EventData, Page, View} from 'tns-core-modules/ui/page';
registerElement('MapView', () => MapView);

@Component({
	selector: 'profileRestaurant',
	templateUrl: './profileRestaurant.component.html',
	styleUrls: ['./profileRestaurant.component.css']
})

export class ProfileRestaurantComponent implements OnInit {
id;
profile;
reviews;
star0;
star2;
star3;
star4;
star5;
star1;


	constructor(private Helper: HelperService, private UserService: UserService,
        private route: ActivatedRoute, private routerEx: RouterExtensions ) { }

	ngOnInit() {
		this.id = +this.route.snapshot.params.id;
		console.log("se pedirán los datos")
		this.loadData(this.id);
		this.reviews = "";//aqui se pondrá la solicitud de todas las reviews de el restaurante actual
		this.star0 = "~/assets/images/0star.png"
		this.star1 = "~/assets/images/1star.png";
        this.star2 = "~/assets/images/2star.png";
        this.star3 = "~/assets/images/3star.png"; 
        this.star4 = "~/assets/images/4star.png";
        this.star5 = "~/assets/images/5star.png";
	 }




	 getStars(rate){
		if (rate<=0.49){return this.star0} 
		if ((rate>=0.5)&&(rate<=1.49)){return this.star1}
		if ((rate>=1.5) && (rate <= 2.49)){return this.star2}
		if ((rate>=2.5) && (rate <= 3.49)){return this.star3}
		if ((rate>=3.5) && (rate <= 4.49)){return this.star4}
		if (rate>=4.5){return this.star5}
	  }
	  latitude =  10.6417;
	  longitude = -71.6295;
	  mapDisplay=0;
	  zoom = 19;
	  minZoom = 18;
	  maxZoom = 20;
	  bearing = 0;
	  tilt = 0;
	  padding = [10, 10, 10, 10];
	  userDataIndex = 1
	  mapView: MapView;
	  lastCamera: String;
	  mapbool = false;
	  statusMap ="~/assets/images/mapsIcon_desactivado.png";

	  loadData(id){
		this.UserService.getUserInfo(id).subscribe((resp: any,) => {
			console.log("se recibieron los datos");
			this.profile = resp;
			this.UserService.Datos_Restaurante.name=this.profile.restaurantName;
			this.UserService.Datos_Restaurante.foto = this.addUrl(this.profile.ruta);

			this.latitude = this.profile.latitud;
			this.longitude = this.profile.longitud;
			console.log("se cambió la ubicación a: [" + this.latitude + "," + this.longitude + "]")
			this.zoom = 18;
		});
	  }
	  
	  onMapReady(event) 
	  {	
		  this.mapView = event.object;
		  this.mapView.settings.mapToolbarEnabled = true;
		  this.mapView.settings.myLocationButtonEnabled = true;
		  this.mapView.settings.compassEnabled = true;
		  this.mapView.settings.zoomControlsEnabled = false;
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
			message: "Aquí pronto podrás realizar una búsqueda con solo tocar un botón",
			okButtonText: "OK",
			cancelable: false
		  };

		  alert(mensaje);
	  }
	  
	  openGMaps(){
		  var url = "https://www.google.com/maps/dir/?api=1";
		  var origin = "&origin=" + this.UserService.UserLocation[0] + "," + this.UserService.UserLocation[1];
		  var destination = "&destination=" + this.latitude + "," + this.longitude;
		  var newUrl =""
		if((this.UserService.UserLocation[0]==0) &&(this.UserService.UserLocation[1]==0) ){
			newUrl = url + destination;
		}else{
			newUrl = url + origin + destination;
		}
		dialogs.confirm({
			title: "Abrir Google Maps",
			message: "¿Desea ir a google Maps© para ver cómo llegar a este restaurante?",
			okButtonText: "Sí",
			cancelButtonText: "Cancelar"
		}).then(result => {
			// result argument is boolean
			if(result){
			  //aquí se redirecciona al usuario a google maps
			  utils.openUrl(newUrl);
			}
			else{
			  return
			}
		});
	}
	
	public addUrl(b){
		const a = "https://www.arpicstudios.com/storage/"+ b;
		return a;		
	}

	openPic(id){
		this.Helper.getPost(id).subscribe((resp: any,) => {
			console.log("se recibieron los datos");
			console.log(resp);
			this.UserService.Datos_Post.id=resp.id;
			this.UserService.Datos_Post.titulo = resp.titulo;
			this.UserService.Datos_Post.ruta = "https://arpicstudios.com/storage/"+ resp.ruta;
			this.UserService.Datos_Post.fecha = resp.fecha;
			this.UserService.Datos_Post.descripcion = resp.descripcion;
			this.routerEx.navigate(['Post/', id], {
				animated: true,
				transition:
				{
					name: 'fade',
					duration: 250,
					curve: 'linear'
				}
			});
		});

	}
	
  
}