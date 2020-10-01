import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from "@angular/router";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";


import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import { SearchBar } from 'tns-core-modules/ui/search-bar';
import * as geocoding from 'nativescript-geocoding';

import { AuthService } from '../utils/servicios/auth.service';
import { Cliente, Restaurante } from '../utils/models/user.model';

import { caracteristica } from '../login/mock-caracteristicas';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
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
	socialLogin: boolean;
	id: number;

	constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private routeAct: ActivatedRoute) 
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

	// ESCOGER UNA IMAGEN DE PERFIL EN EL REGISTRO DE USUARIO / RESTAURANTE
	choosePic()
	{
		const ProfilePicAlert: AlertOptions = {
		title: "Escoger foto de perfil",
		message: "Al hacer tap aqui deberia de dar la opcion de ir a la galeria para escoger la foto",
		okButtonText: "OK",
		cancelable: false
		};

		alert(ProfilePicAlert);
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
			let datos = {
				// name: this.cliente.nombre,
				typeUser: this.cliente.type
			};
	
			console.log("los datos guardados: ", JSON.stringify(datos));
	
			this.authService.register(datos).subscribe((resp: any) => 
			{
				console.log("resp es:::::::::", resp);
				
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
			let datos = {
				name: this.restaurante.nombre_comercio,
				rif: this.restaurante.rif,
				id: this.restaurante.id,
				typeUser: this.restaurante.type
			};
	
			console.log("los datos guardados: ", JSON.stringify(datos));
	
			this.authService.register(datos).subscribe((resp: any) => 
			{
				console.log("resp es:::::::::", resp);
				console.log("restaurante id:", resp.userID)
				console.log("restaurante nombre:", resp.name)
	
				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación!\nA continuación vas a ser redireccionado al inicio.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(regAlert).then(() => {
					setTimeout(() => {
						this.routerEx.navigate(['/homeRestaurant', datos.id], {
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

		// this.checkboxs = {
		// 	data: data,
		// 	id: id
		// }	
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