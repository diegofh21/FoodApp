import { Component, OnInit } from "@angular/core";
import { isUserInteractionEnabledProperty, Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from "@angular/router";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";

import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import { SearchBar } from 'tns-core-modules/ui/search-bar';
import * as geocoding from 'nativescript-geocoding';

// Servicios
import { AuthService } from '../utils/servicios/auth.service';
import { HelperService } from '../utils/servicios/helper.service'
// Utils
import { Cliente, Restaurante } from '../utils/models/user.model';
import { caracteristica } from './mock-caracteristicas';

registerElement('MapView', () => MapView); 

@Component({
  selector: "ns-login",
  templateUrl: "./login.component.html",
  moduleId: module.id,
  styleUrls: ["./login.component.css", "../../assets/css/margin-padding.css"]
})

export class LoginComponent implements OnInit
{ 	public searchString = '';
public location = new geocoding.Location();
  confirmedLatitude = 0;
  confirmedLongitude = 0;
  confirmedName = '';
	cliente: Cliente;
	restaurante: Restaurante;
	
	status: 'login' | 'restReg' | 'userReg' = 'login';
	paso: string = '1';
	pasoMapa: 'showBtn' | 'showMap' = 'showBtn';
	socialLogin: boolean;

	checkboxs: any = [];
	private checkboxData: any = []

	caracteristicas = caracteristica;

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private helper: HelperService) 
  { 
		this.cliente = new Cliente();
		this.restaurante = new Restaurante();
  }

  ngOnInit() 
  {
		this.page.actionBarHidden = true;
		console.log("La aplicación inicio y estas sincronizado.");
		// this.getCheckboxData();
	}
	
	isBusy: boolean = false;

	
	
	login()
	{
		this.routerEx.navigate(['/home'], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}

  loginrestaurante()
  {
	  this.routerEx.navigate(['homeRestaurant/', 2], {
		  animated: true,
		  transition:
		  {
			  name: 'fade',
			  duration: 250,
			  curve: 'linear'
		  }
	  });
	}

	// INICIO DE SESIÓN CON GOOGLE 
	google()
	{
		this.authService.tnsOauthLogin('google').then((tokenResult) => 
		{
			this.authService.login(tokenResult).subscribe((resp: any) => {
				
				console.log("id:", resp.id);
				console.log("email:", resp.email);
				console.log("nombre:", resp.name);
				console.log("typeUser:", resp.typeUser);

				switch (resp.typeUser) 
				{
					case 'CLIENTE':

						setTimeout(() => {
							this.routerEx.navigate(['home']), {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							}
						}, 1000)
						break;

					case 'RESTAURANTE':
						setTimeout(() => {
							this.routerEx.navigate(['homeRestaurant']), {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							}
						});
						break;

					case null:
						var userID = resp.id;
						setTimeout(() => {
							console.log("entre en el timeout");
							this.routerEx.navigate(['/register', userID], {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							});
						}, 1000); // 1 Segundo de Timeout al volver antes de irse a la pantalla de registro
						break;
				}
			}); //authService.login()
		}).catch(err => console.error("Error" + err));	//authService.tnsOauthLogin(google)	
	}
	
	// INICIO DE SESIÓN CON FACEBOOK (FALTA RUTA PARA OBTENER LOS DATOS)
  Facebook()
	{
		this.authService.tnsOauthLogin('facebook').then((tokenResult) => 
		{
			this.authService.login(tokenResult).subscribe((resp: any) => {
				console.log("resp es", resp);
				this.cliente.email = resp.email;
				this.cliente.nombre = resp.name;

				this.restaurante.email = resp.email;
				console.log("el tipo de usuario es:", resp.typeUser)

				switch (resp.typeUser) 
				{
					case 'USUARIO':

						setTimeout(() => {
							this.routerEx.navigate(['home']), {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							}
						}, 1000)
						break;

					case 'RESTAURANTE':
						setTimeout(() => {
							this.routerEx.navigate(['homeRestaurant']), {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							}
						});
						break;
						
					case null:
						var userID = resp.id;
						var user = resp;
						setTimeout(() => {
							console.log("entre en el timeout");
							this.routerEx.navigate(['/register', user], {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							});
						}, 1000); // 1 Segundo de Timeout al volver antes de irse a la pantalla de registro
						break;
				}
			}); // authService.login()
		}).catch(err => console.error("Error" + err)); // authService.tnsOauthLogin(facebook)
  }
	
	// ESCOGER UNA IMAGEN DE PERFIL EN EL REGISTRO DE USUARIO / RESTAURANTE
	choosePic()
	{
		const ProfilePicAlert: AlertOptions = {
			title: "Escoger foto de perfil",
			message: "Al hacer tap aqui deberia de dar la opcion de ir a la galeria para escoger la foto",
			okButtonText: "OK",
			cancelable: false
		};

		this.isBusy = true;
		console.log("tap!");

		setTimeout(() => {
			alert(ProfilePicAlert).then(() => {
				this.isBusy = false;
			})
			// this.isBusy = false;
		}, 3000);

		// this.isBusy = false;
	}

	processStep3()
	{
		// Aqui llamamos el getCheckboxData()
		this.getCheckboxData()

		setTimeout(() => {
			this.paso = '3';
		}, 5000);
	}

	// METODO DE REGISTRO DEPEDIENDO DEL TYPEUSER REGISTRA AL USUARIO O AL RESTAURANTE
	register()
	{
		if(this.status == 'userReg')
		{
			this.isBusy = true;
			let datos_user = {
				name: this.cliente.nombre,
				email: this.cliente.email,
				password: this.cliente.password,
				typeUser: this.cliente.type
			};

			console.log("los datos_user son:", JSON.stringify(datos_user));

			this.authService.login(datos_user).subscribe((resp: any) => {
				console.log("Respuesta para login user:", resp);

				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación!\nA continuación vas a ser redireccionado al inicio.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(regAlert).then(() => {
					setTimeout(() => {
						this.routerEx.navigate(['/home'], {
							animated: true,
							transition:
							{
								name: 'fade',
								duration: 250,
								curve: 'linear'
							}
						});
					}, 1000);
				});
			});
		}
		else if(this.status == 'restReg')
		{
			this.isBusy = true;
			let datos_user = {
				name: this.restaurante.nombre_comercio,
				email: this.restaurante.email,
				password: this.restaurante.password
			};

			console.log("los datos_user son:", JSON.stringify(datos_user));

			this.authService.login(datos_user).subscribe((resp: any) => {
				console.log("Respuesta para login user:", resp);
				this.restaurante.id = resp.id;
			});

			let datos_rest = {
				name: this.restaurante.nombre_comercio,
				rif: this.restaurante.rif,
				id: this.restaurante.id,
				typeUser: this.restaurante.type
			};

			console.log("los datos_rest son: ", JSON.stringify(datos_rest));

			this.authService.register(datos_rest).subscribe((resp: any) => 
			{
				console.log("La respuesta para registro de restaurante es:", resp);
				
				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación!\nA continuación vas a ser redireccionado al inicio.",
					okButtonText: "OK",
					cancelable: false
				}

				this.isBusy = false;
				alert(regAlert).then(() => {
					setTimeout(() => {
						this.routerEx.navigate(['/homeRestaurant', datos_rest.id], {
							animated: true,
							transition:
							{
								name: 'fade',
								duration: 250,
								curve: 'linear'
							}
						});
					}, 1000);
				});
			});
		}
	}

	checkedChange(event, data, id) 
	{
		console.log("event.value", event.value);
		console.log("data", data);
		console.log("id", id);
	}

	getCheckboxData()
	{
		this.isBusy = true
		this.helper.getCaracteristicas().subscribe((resp: any) => {
			this.checkboxData = resp;
			console.log("la data recogida de la api es: ", JSON.stringify(resp));
			console.log("checkboxData: ", this.checkboxData)
			this.isBusy = false;
		});
	}
		
	//variables del mapa
	latitude =  10.6417;
	longitude = -71.6295;
	zoom = 12;
	minZoom = 0;
	maxZoom = 22;
	bearing = 0;
	tilt = 0;
	padding = [10, 10, 10, 10];
	userDataIndex = 1
	mapView: MapView;
	lastCamera: String;

	public onSubmit(args) 
	{
		let searchBar = <SearchBar>args.object;
		let parametro = searchBar.text+" Maracaibo, Zulia";
		geocoding.getLocationListFromName(parametro, 5).then(locations => {
				console.log('Found ', locations.length);
				if (locations.length > 0) {
						this.location = locations[0];
						this.mapView.removeAllMarkers();
						this.CreateMarker(this.location.latitude, this.location.longitude, parametro);
						this.latitude = this.location.latitude;
						this.longitude = this.location.longitude;
						this.zoom = 18;
}
		}, function (e) {
				console.log('Error: ' + (e.message || e));
		});
	}

	public onSearchBarClear(args) 
	{
			this.location = new geocoding.Location();
	}

	Map()
	{	if((this.confirmedLatitude!=0) &&(this.confirmedLongitude!=0)){
		alert("Ubicación confirmada, Nombre: "+ this.confirmedName + ", Lat: " + this.confirmedLatitude + ", Lon: " + this.confirmedLongitude);
	}else{

		alert("Por favor, antes de continuar escoja una ubicación");
	}
	}

	//Map events
	onMapReady(event) 
	{	this.mapView = event.object;
		this.mapView.settings.mapToolbarEnabled = true;
		this.mapView.settings.myLocationButtonEnabled = true;
		this.mapView.settings.compassEnabled = true;
		this.mapView.settings.zoomControlsEnabled = false;
		
		// alert("Configurando marcador inicial...");

		// Aqui se crea el primer marcador al iniciar el mapa que es maracaibo
		// var marker = new Marker();
		// marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
		// marker.title = "Maracaibo";
		// marker.snippet = "Venezuela";
		// marker.userData = {index: this.userDataIndex};
		// this.mapView.addMarker(marker);
	}

	onCoordinateTapped(args) 
	{
		alert("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude);
	}

	onMarkerEvent(args) {
			console.log("Marker Event: '" + args.eventName
					+ "' triggered on: " + args.marker.title
					+ ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
	}

	onCameraChanged(args) {
			console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
			this.lastCamera = JSON.stringify(args.camera);
	}

	onCameraMove(args) {
			console.log("Camera moving: " + JSON.stringify(args.camera));
	}

	onCoordinateLongPress(args)
	{
		this.mapView.removeAllMarkers();
		this.CreateMarker(args.position.latitude, args.position.longitude, "Nueva Ubicación");
	}

	public CreateMarker(latitud, longitud, restnombre)
	{	this.confirmedLatitude = this.location.latitude;
		this.confirmedLongitude = this.location.longitude;
		this.confirmedName = restnombre;
		var marker = new Marker();
		marker.position = Position.positionFromLatLng(latitud, longitud);
		marker.title = restnombre;
		marker.snippet = latitud + ", " + longitud;
		this.mapView.addMarker(marker);
		this.zoom = 18;
	}
}