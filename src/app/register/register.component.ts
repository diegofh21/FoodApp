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
	status: 'selectReg' | 'restReg' | 'userReg' = 'selectReg';
	paso: string = '1';
	pasoMapa: 'showBtn' | 'showMap' = 'showBtn';
	id: number;

	isBusy: boolean = false;
	BtnDispo: boolean = true;

	CheckCount: number = 0
	CheckLimit: boolean = true
	CheckboxChecked: boolean = false;
	checkboxFinal: any = [];
	checkboxData: any = []

	public bstring ="";
	public saveImage = "";
	public userImage = "";
	public picHeight = 0; 
	public imagen = null;
	public finalPath = null;
	public respCode = 0

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
		}
		this.cliente.id = this.id;
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
			this.isBusy = true;
			this.BtnDispo = false;

			let datosUsuario = {
				id: this.cliente.id,
				typeUser: this.cliente.type
			}

			var Caracteristicas = this.checkboxData.filter(e => e.select === true);

			this.userService.register(datosUsuario).subscribe((resp: any) => {
				console.log("La respuesta para el registro de usuarios es", resp)
			});
			
			const regAlert: AlertOptions = 
			{
				title: "FindEat",
				message: "Estamos registrandolo en la aplicación, espere un momento por favor😋⌚.",
				okButtonText: "OK",
				cancelable: false
			}

			alert(regAlert).then(() => {
				setTimeout(() => {
					let caracteristicasUsuario = {
						userID: this.cliente.id,
						caracteristicasID: Caracteristicas
					};

					this.userService.storeCaracteristicas(caracteristicasUsuario).subscribe((resp: any) => 
					{
						console.log("caracteristicas de usuario registradas bajo el id:", caracteristicasUsuario.userID);
						if(caracteristicasUsuario.userID != null || undefined)
						{
							// Guardamos las caracteristicas en el servicio (caché)
							this.userService.Datos_Usuario.caracteristicas = Caracteristicas;
							const regAlert: AlertOptions = 
							{
								title: "FindEat",
								message: "¡Gracias por registrarte en nuestra aplicación!🤩🍔🥤\nA continuación vas a ser redireccionado al inicio.",
								okButtonText: "¡Gracias!",
								cancelable: false
							}
							alert(regAlert).then(() => 
							{
								setTimeout(() => {
									this.routerEx.navigate(['/home', this.cliente.id], {
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
							this.isBusy = false;
							this.BtnDispo = true;
						}
					});
				}, 5000);
			});
		}
		else if(this.status == 'restReg')
		{
			this.isBusy = true;
			this.BtnDispo = false;

			if(this.finalPath != null || undefined)
			{
				var Caracteristicas = this.checkboxData.filter(e => e.select === true);

				let datosRestaurante = {
					typeUser: this.restaurante.type,
					name: this.restaurante.nombre_comercio,
					rif: this.restaurante.rif,
					descripcion: this.restaurante.descripcion,
					id: this.cliente.id,
					longitud: this.confirmedLongitude,
					latitud: this.confirmedLatitude,
				};
	
				console.log("los datos_rest son: ", JSON.stringify(datosRestaurante));
	
				this.userService.register(datosRestaurante).subscribe((resp: any) => 
				{
					console.log("La respuesta para registro de restaurante es:", resp);
					this.restaurante.id = resp
					console.log("restaurante.id", this.restaurante.id)
	
					if(this.restaurante.id != null || undefined)
					{
						console.log("entre a savePicture");
						this.savePicture(this.finalPath);

						const regAlert: AlertOptions = 
						{
							title: "FindEat",
							message: "Estamos registrandolo en la aplicación, espere un momento por favor😋⌚.",
							okButtonText: "OK",
							cancelable: false
						}
						alert(regAlert).then(() => {
							setTimeout(() => {
								let caracteristicasRestaurante = {
									userID: this.cliente.id,
									caracteristicasID: Caracteristicas
								};
	
								this.userService.storeCaracteristicas(caracteristicasRestaurante).subscribe((resp: any) => 
								{
									console.log("caracteristicas registradas bajoo el id:", caracteristicasRestaurante.userID);
									if(caracteristicasRestaurante.userID != null || undefined)
									{
										// Guardamos las caracteristicas en el servicio (caché)
										this.userService.Datos_Restaurante.caracteristicas = Caracteristicas;
										const regAlert: AlertOptions = 
										{
											title: "FindEat",
											message: "¡Gracias por registrarte en nuestra aplicación!🤩🍔🥤\nA continuación vas a ser redireccionado al inicio.",
											okButtonText: "¡Gracias!",
											cancelable: false
										}
										alert(regAlert).then(() => 
										{
											setTimeout(() => {
												this.routerEx.navigate(['/homeRestaurant', this.restaurante.id], {
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
										this.isBusy = false;
										this.BtnDispo = true;
									}
								});
							}, 10000);
						});
					}
					else
					{
						console.log("ha ocurrido un error");
						this.isBusy = false;
						this.BtnDispo = true;
					}
				});
			}
			else
			{
				const regAlert: AlertOptions = 
				{
					title: "FindEat",
					message: "Por favor escoge una imagen📸",
					okButtonText: "Entendido",
					cancelable: false
				}
				alert(regAlert).then(() => {
					setTimeout(() => {
						this.isBusy = false;
						this.BtnDispo = true;
					}, 2000);
				});
			}
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
												that.finalPath = folder;
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
		url: Config.apiUrl + '/fotoRestaurante',
		method: "POST",
		headers: {
				"Content-Type": "application/octet-stream",
				"File-Name": "photo.png"
		},
		description: "{ 'uploading': " + "photo.png" + " }"
				};
		let params = [
			{ name: "id", value: this.restaurante.id },
			{ name: "foto", mimeType: "image/jpeg", filename: this.saveImage }
		];
		// Se guarda la imagen en el servicio (caché para probar si sirve posteriormente)
		this.userService.Datos_Restaurante.foto = this.saveImage;
		var task = session.multipartUpload(params, request);
		task.on("progress", logEvent);
		task.on("error", logEvent);
		task.on("complete", logEvent);
		task.on("responded", logEvent);
		task.on("cancelled", logEvent);
		function logEvent(e) 
		{
				// console.log(e);
				console.log("----------------");
				console.log('Status: ' + e.eventName);
				if (e.totalBytes !== undefined) 
				{
						console.log('current bytes transfered: ' + e.currentBytes);
						console.log('Total bytes to transfer: ' + e.totalBytes);
				}
				console.log("EL RESPONSE CODE ES: ", e.responseCode);
				this.respCode = e.responseCode;
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
					okButtonText: "Entendido",
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
					okButtonText: "Entendido",
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
					message: "Ubicación procesada y guardada!",
					okButtonText: "Entendido",
					cancelable: false
				}

				alert(Step2Alert).then(() => {
					setTimeout(() => {
						this.isBusy = false;
						this.paso = '3';
					}, 2000);
				});	
			}
		}
	} //ProcessStep2()

	// metodos del checkbox
	checkedChange(event, data, id) 
	{
		console.log("id-1", this.checkboxData[id-1])
		console.log("---------------------------------")

		if(this.CheckCount < 5)
		{
			if(event.value == true)
			{
				this.CheckCount++;
				console.log("checkcount", this.CheckCount);
				this.checkboxData[id-1].select = true
				console.log("checkboxdata completo", this.checkboxData[id-1]);
			}
			if(this.CheckCount == 5)
			{
				const checkAlert: AlertOptions = { 
					title: "FindEat",
					message: "Solo puedes escoger un máximo de 5 caracteristicas!",
					okButtonText: "Entendido",
					cancelable: false
				}
	
				alert(checkAlert).then(() => {
					this.CheckLimit = false;
				});
			}
		}
	}

	getCheckboxData()
	{
		if(this.status == 'userReg')
		{
			this.isBusy = true
			this.userService.getUserInfo(this.cliente.id).subscribe((resp: any) => {

				// Guardamos los datos del usuario en el servicio (caché)
				this.userService.Datos_Usuario.foto = resp.avatar;

				// Guardamos la ruta del avatar para su posterior uso en esta instancia
				this.userImage = resp.avatar
			});
			this.helper.getCaracteristicas().subscribe((resp: any) => {
				this.checkboxData = resp;
				this.checkboxData.forEach(e => e.select = false);
				this.isBusy = false;
			});
		}
		else if(this.status == 'restReg')
		{
			this.isBusy = true
			this.helper.getCaracteristicas().subscribe((resp: any) => {
				this.checkboxData = resp;
				this.checkboxData.forEach(e => e.select = false);
				this.isBusy = false;
			});
		}
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
	{	this.confirmedLatitude = latitud;
		this.confirmedLongitude = longitud;
		this.confirmedName = nombre_restaurante;
		var marker = new Marker();
		marker.position = Position.positionFromLatLng(latitud, longitud);
		marker.title = nombre_restaurante;
		marker.snippet = latitud + ", " + longitud;
		this.mapView.addMarker(marker);
		this.zoom = 14;
	}

}