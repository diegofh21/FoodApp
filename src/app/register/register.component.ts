import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from "@angular/router";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import * as imagepicker from "nativescript-imagepicker";
import * as bghttp from "nativescript-background-http";
import * as fs from "tns-core-modules/file-system";
import { ImageSource } from 'tns-core-modules/image-source';

import { Config } from '../utils/config';
import { HttpClient } from '@angular/common/http';

import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import { SearchBar } from 'tns-core-modules/ui/search-bar';
import * as geocoding from 'nativescript-geocoding';

import { AuthService } from '../utils/servicios/auth.service';
import { UserService } from '../utils/servicios/user.service';
import { HelperService } from '../utils/servicios/helper.service'

import { Cliente, Restaurante } from '../utils/models/user.model';

import { caracteristica } from '../login/mock-caracteristicas';

registerElement('MapView', () => MapView);
@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit 
{
	public searchString = '';
  public location = new geocoding.Location();
	confirmedLatitude = 0;
	confirmedLongitude = 0;
	confirmedName = '';

	cliente: Cliente;
	restaurante: Restaurante;
	caracteristicas = caracteristica;

	status: 'selectReg' | 'restReg' | 'userReg' = 'selectReg';
	paso: string = '1';
	pasoMapa: 'showBtn' | 'showMap' = 'showBtn';
	id: number;

	isBusy: boolean = false;
	BtnDispo: boolean = true;

	checkboxFinal: any = [];
	private checkboxData: any = []

	public bstring ="";
	public saveImage = "";
	public picHeight = 0; 
	public imagen = null;

	constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private routeAct: ActivatedRoute, private helper: HelperService, private userService: UserService, private http: HttpClient) 
	{ 
		this.cliente = new Cliente();
		this.restaurante = new Restaurante();
	}

	ngOnInit() 
  {
		this.page.actionBarHidden = true;
		
		if(typeof (this.routeAct.snapshot.params.id) !== 'undefined') 
		{
			this.id = +this.routeAct.snapshot.params.id;
			console.log("el id es:", this.id);
		}
		this.restaurante.id = this.id;
		this.cliente.id = this.id;
		console.log("restaurante.id:", this.restaurante.id);

		console.log("los datos que tiene restaurante para esta estancia son:", this.restaurante);
		console.log("los datos que tiene cliente para esta estancia son: ", this.cliente);
	}

	login()
	{
		this.routerEx.navigate(['/login'], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}

	// METODO DE REGISTRO DEPEDIENDO DEL TYPEUSER REGISTRA AL USUARIO O AL RESTAURANTE
	register()
	{
		if(this.status == 'userReg')
		{
			this.checkboxFinal = this.checkboxData.filter(e => e.select === true);

			this.isBusy = true;
			this.BtnDispo = false;

			let datos_user = {
				name: this.cliente.nombre,
				email: this.cliente.email,
				password: this.cliente.password,
				typeUser: this.cliente.type
			};

			console.log("los datos_user son:", JSON.stringify(datos_user));

			this.userService.login(datos_user).subscribe((resp: any) => {
				console.log("Respuesta para login user:", resp);

				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación!\nA continuación vas a ser redireccionado al inicio.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(regAlert).then(() => {
					this.isBusy = false;
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
				this.BtnDispo = true;
			});
		}
		else if(this.status == 'restReg')
		{
			var Caracteristicas = this.checkboxData.filter(e => e.select === true);

			this.isBusy = true;
			this.BtnDispo = false;

			// let datos_user = {
			// 	name: this.restaurante.nombre_comercio,
			// 	email: this.restaurante.email,
			// };

			// console.log("los datos_user son:", JSON.stringify(datos_user));

			// this.authService.login(datos_user).subscribe((resp: any) => {
			// 	console.log("Respuesta para login user:", resp);
			// 	this.restaurante.id = resp.id;
			// });

			let datosRestaurante = {
				id: this.restaurante.id,
				typeUser: this.restaurante.type,
				name: this.restaurante.nombre_comercio,
				rif: this.restaurante.rif,
				descripcion: this.restaurante.descripcion,
				latitud: this.confirmedLatitude,
				longitud: this.confirmedLongitude
			};

			console.log("los datos_rest son: ", JSON.stringify(datosRestaurante));

			this.userService.register(datosRestaurante).subscribe((resp: any) => 
			{
				console.log("La respuesta para registro de restaurante es:", resp);

				let caracteriscticasRestaurante = {
					userID: resp.id,
					caracteristicasID: Caracteristicas
				}

				console.log("los datos de caracteristicas son:", JSON.stringify(caracteriscticasRestaurante));

				this.userService.storeCaracteristicas(caracteriscticasRestaurante).subscribe((resp: any) => 
				{
					console.log("caracteristicas registradas bajo el id:", caracteriscticasRestaurante.userID);
				});
				
				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación!\nA continuación vas a ser redireccionado al inicio.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(regAlert).then(() => {
					this.isBusy = false;
					setTimeout(() => {
						this.routerEx.navigate(['/homeRestaurant', datosRestaurante.id], {
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
				this.BtnDispo = true;
			});
		}
	}

	choosePic()
	{
		this.isBusy = true;
		var milliseconds = (new Date).getTime();
		var that = this;
		let context = imagepicker.create({
				mode:"single"
		});
		context
		.authorize()
		.then(function() 
		{
				return context.present();
		}).then(function(selection) 
						{
							selection.forEach(function(selected) 
							{
								const imgPhoto = new ImageSource();
								imgPhoto.fromAsset(selected).then((imgSrc) => 
								{
										if(imgSrc) 
										{
												that.bstring  = imgSrc.toBase64String("jpg");
												const mil = new Date().getTime();
												const folder = fs.knownFolders.documents();
												const path = fs.path.join(folder.path, `SaveImage${mil}.png`);
												that.imagen = imgPhoto.saveToFile(path, "png");
												console.log(that.imagen);
												that.saveImage = path;
												that.picHeight = imgSrc.height;  
												that.savePicture(folder)
										} 
										else 
										{
												alert("El directorio de la imagen esta mal.");
										}				
								});
							});
						}).catch(function (e) 
						{
							console.log(e);
						});
		this.isBusy = false;
	}

	savePicture(e)
  {
    this.isBusy = true;
    const imageString =  e;
    
		const data = 
		{
      foto: imageString,
      Description: "ff",
    };

		var session = bghttp.session("file-upload");
		var request = {
		url: Config.apiUrl + '/registrar',
		method: "POST",
		headers: {
				"Content-Type": "application/octet-stream",
				"File-Name": "photo.png"
		},
		description: "{ 'uploading': " + "photo.png" + " }"
				};
		let params = [{
				name: "foto", mimeType: "image/jpeg", filename: this.saveImage
		}, {
				name: "dd", value: "Aqui esta la data"
		},
		];
		var task = session.multipartUpload(params, request);
		task.on("progress", logEvent);
		task.on("error", logEvent);
		task.on("complete", logEvent);
		task.on("responded", logEvent);
		task.on("cancelled", logEvent);
		function logEvent(e) 
		{
				console.log(e);
				console.log("----------------");
				console.log('Status: ' + e.eventName);
				if (e.totalBytes !== undefined) 
				{
						console.log('current bytes transfered: ' + e.currentBytes);
						console.log('Total bytes to transfer: ' + e.totalBytes);
				}
				this.isBusy = false;
		}
	} 

	// Procesar paso 1 con validacion de que si los campos se llenaron o no
	processStep1()
	{
		if(this.status == 'restReg')
		{
			if(this.restaurante.nombre_comercio != '' && this.restaurante.rif != null && this.restaurante.descripcion != '')
			{
				this.paso = '2'
			}
			else
			{
				const Step1Alert: AlertOptions = {
					title: "FindEat",
					message: "Por favor completa los datos requeridos antes de continuar con el registro.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(Step1Alert);
			}
		}
	} //ProcessStep1 para restaurantes

	// Procesar paso 2 con validacion de que si se seteo una ubicación o no
	processStep2()
	{
		this.isBusy = true;
		if(this.status == 'restReg')
		{
			// Se checkea si se confirmo la ubicacion
			if(this.confirmedLatitude == 0 && this.confirmedLongitude == 0 && this.confirmedName == '')
			{
				const Step2Alert: AlertOptions = {
					title: "FindEat",
					message: "Por favor agrega una ubicación para continuar con el registro.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(Step2Alert).then(() => {
					this.isBusy = false;
				});				
			}
			else
			{
				this.getCheckboxData();

				const Step2Alert: AlertOptions = {
					title: "FindEat",
					message: "Ubicación procesada y guardada!.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(Step2Alert).then(() => {
					setTimeout(() => {
						this.isBusy = false;
						this.paso = '3';
					}, 5000);
				});	
			}
		}
	} //ProcessStep2()

	// metodos del checkbox
	checkedChange(event, data, id) 
	{
		this.checkboxData[event].select = true
	}

	getCheckboxData()
	{
		this.isBusy = true
		this.helper.getCaracteristicas().subscribe((resp: any) => {
			this.checkboxData = resp;
			this.checkboxData.forEach(e => e.select = false);
			console.log("la data recogida de la api es: ", JSON.stringify(resp));
			console.log("checkboxData sin stringify: ", this.checkboxData)
			console.log("checkBoxData con stringify (por si acaso):", JSON.stringify(this.checkboxData));
			this.isBusy = false;
		});
	}
	
	//variables del mapa y metodos del mapa
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
	{	
		if((this.confirmedLatitude!=0) &&(this.confirmedLongitude!=0))
		{
			alert("Ubicación confirmada, Nombre: "+ this.confirmedName + ", Lat: " + this.confirmedLatitude + ", Lon: " + this.confirmedLongitude);
		}
		else
		{
			alert("Por favor, antes de continuar escoja una ubicación");
		}
	}

	//Map events
	onMapReady(event) 
	{	
		this.mapView = event.object;
		this.mapView.settings.mapToolbarEnabled = true;
		this.mapView.settings.myLocationButtonEnabled = true;
		this.mapView.settings.compassEnabled = true;
		this.mapView.settings.zoomControlsEnabled = false;
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
		this.CreateMarker(args.position.latitude, args.position.longitude, this.restaurante.nombre_comercio);
	}

	public CreateMarker(latitud, longitud, nombre_restaurante)
	{	this.confirmedLatitude = this.location.latitude;
		this.confirmedLongitude = this.location.longitude;
		this.confirmedName = nombre_restaurante;
		var marker = new Marker();
		marker.position = Position.positionFromLatLng(latitud, longitud);
		marker.title = nombre_restaurante;
		marker.snippet = latitud + ", " + longitud;
		this.mapView.addMarker(marker);
		this.zoom = 18;
	}
}