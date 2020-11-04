import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import { exit } from 'nativescript-exit';
import { EventData, Page, View } from 'tns-core-modules/ui/page';
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";

// SERVICIOS
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { HelperService } from '../utils/servicios/helper.service'
import { UserService } from '../utils/servicios/user.service';

import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

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

	public status: 'profile' | 'loading' = 'loading';
	public isBusy: boolean = false;
	public BtnDispo: boolean = true;
	public errorCount = 0;


	constructor(private Helper: HelperService, private UserService: UserService,
		private route: ActivatedRoute, private routerEx: RouterExtensions) { }

	ngOnInit() {
		this.id = +this.route.snapshot.params.id;
		console.log("se pedirán los datos")
		this.status = 'loading';
		this.loadData(this.id);
		this.reviews = "";//aqui se pondrá la solicitud de todas las reviews de el restaurante actual
		this.star0 = "~/assets/images/0estrellas.png"
		this.star1 = "~/assets/images/1estrellas.png";
		this.star2 = "~/assets/images/2estrellas.png";
		this.star3 = "~/assets/images/3estrellas.png";
		this.star4 = "~/assets/images/4estrellas.png";
		this.star5 = "~/assets/images/5estrellas.png";
	}




	getStars(rate) {
		if (rate <= 0.49) { return this.star0 }
		if ((rate >= 0.5) && (rate <= 1.49)) { return this.star1 }
		if ((rate >= 1.5) && (rate <= 2.49)) { return this.star2 }
		if ((rate >= 2.5) && (rate <= 3.49)) { return this.star3 }
		if ((rate >= 3.5) && (rate <= 4.49)) { return this.star4 }
		if (rate >= 4.5) { return this.star5 }
	}
	latitude = 10.6417;
	longitude = -71.6295;
	mapDisplay = 0;
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
	statusMap = "~/assets/images/mapsIcon_desactivado.png";

	loadData(id) {
		this.UserService.getUserInfo(id).subscribe((resp: any,) => {
			console.log("se recibieron los datos");
			this.profile = resp;
			console.log(this.profile)
			this.UserService.Datos_Restaurante.name = this.profile.restaurantName;
			this.UserService.Datos_Restaurante.foto = this.addUrl(this.profile.ruta);
			this.UserService.Datos_Restaurante.id = this.profile.id;

			this.latitude = this.profile.latitud;
			this.longitude = this.profile.longitud;
			console.log("se cambió la ubicación a: [" + this.latitude + "," + this.longitude + "]")
			this.zoom = 18;
			this.status = 'profile'
		},
		(error) => {
			console.log("El codigo HTTP obtenido es", error.status)
			console.log("errorCount", this.errorCount);
			switch (error.status) {
				// INTERNAL SERVER ERROR
				case 500:
					this.errorCount++;
					const error500: AlertOptions = {
						title: 'FindEat',
						message: 'Ha ocurrido un error interno del servidor, por favor intente nuevamente',
						okButtonText: 'OK',
						cancelable: false
					};

					if (this.errorCount < 3) {
						alert(error500).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							this.routerEx.back();
						});
					}
					else {
						const error500Persist: AlertOptions = {
							title: 'FindEat',
							message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
							okButtonText: 'OK',
							cancelable: false
						};

						alert(error500Persist).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							exit();
						});
					}
					break;

				// BAD GATEWAY
				case 502:
					this.errorCount++;
					const error502: AlertOptions = {
						title: 'FindEat',
						message: 'Ha ocurrido un error, el servidor encontró un error temporal y no pudo completar su solicitud\nPor favor intente nuevamente.',
						okButtonText: 'OK',
						cancelable: false
					};

					if (this.errorCount < 3) {
						alert(error502).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							this.routerEx.back();
						});
					}
					else {
						const error502Persist: AlertOptions = {
							title: 'FindEat',
							message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
							okButtonText: 'OK',
							cancelable: false
						};

						alert(error502Persist).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							exit();
						});
					}
					break;

				// SERVICE UNAVAILABLE (SERVICIO NO DISPONIBLE)
				case 503:
					this.errorCount++;
					const error503: AlertOptions = {
						title: 'FindEat',
						message: 'Ha ocurrido un error, el servidor no puede responder a la petición del navegador porque está congestionado o está realizando tareas de mantenimiento.\nPor favor intente nuevamente.',
						okButtonText: 'OK',
						cancelable: false
					};

					if (this.errorCount < 3) {
						alert(error503).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							this.routerEx.back();
						});
					}
					else {
						const error503Persist: AlertOptions = {
							title: 'FindEat',
							message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
							okButtonText: 'OK',
							cancelable: false
						};

						alert(error503Persist).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							exit();
						});
					}
					break;

				// GATEWAY TIMEOUT
				case 504:
					this.errorCount++;
					const error504: AlertOptions = {
						title: 'FindEat',
						message: 'Ha ocurrido un error, el servidor no pudo completar su solicitud dentro del período de tiempo establecido.\nPor favor intente nuevamente.',
						okButtonText: 'OK',
						cancelable: false
					};

					if (this.errorCount < 3) {
						alert(error504).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							this.routerEx.back();
						})
					}
					else {
						const error504Persist: AlertOptions = {
							title: 'FindEat',
							message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
							okButtonText: 'OK',
							cancelable: false
						};

						alert(error504Persist).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							exit();
						});
					}
					break;

				case 0:
					this.errorCount++;
					const error0: AlertOptions = {
						title: 'FindEat',
						message: 'Ha ocurrido un error, la aplicación no se ha podido conectar con el servidor.\nPor favor intente nuevamente.',
						okButtonText: 'OK',
						cancelable: false
					};

					if (this.errorCount < 3) {
						alert(error0).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							this.routerEx.back();
						});
					}
					else {
						const error0Persist: AlertOptions = {
							title: 'FindEat',
							message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
							okButtonText: 'OK',
							cancelable: false
						};

						alert(error0Persist).then(() => {
							this.isBusy = false;
							this.BtnDispo = true;
							exit();
						});
					}
					break;
			}
		});
	}

	onMapReady(event) {
		this.mapView = event.object;
		this.mapView.settings.mapToolbarEnabled = true;
		this.mapView.settings.myLocationButtonEnabled = true;
		this.mapView.settings.compassEnabled = true;
		this.mapView.settings.zoomControlsEnabled = false;
	}

	showMap(bool) {
		if (bool === false) {
			const start = Date.now();

			const timer = setInterval(() => {
				const timepassed = Date.now() - start;

				if (timepassed >= 240) {
					clearInterval(timer);
					this.mapDisplay = 240;
					return;
				}

				this.mapDisplay = timepassed;
			}, 17)

			this.statusMap = "~/assets/images/mapsIcon.png";
			this.mapbool = true;
		} else {
			const start = Date.now();

			const timer = setInterval(() => {
				const timepassed = Date.now() - start;

				if (timepassed >= 240) {
					clearInterval(timer);
					this.mapDisplay = 0;
					return;
				}

				this.mapDisplay = this.mapDisplay - timepassed;
			}, 17)
			this.statusMap = "~/assets/images/mapsIcon_desactivado.png";
			this.mapbool = false;
		}
	}

	aber(a) {
		const mensaje: AlertOptions = {
			title: a,
			message: "Aquí pronto podrás realizar una búsqueda con solo tocar un botón",
			okButtonText: "OK",
			cancelable: false
		};

		alert(mensaje);
	}

	openGMaps() {
		var url = "https://www.google.com/maps/dir/?api=1";
		var origin = "&origin=" + this.UserService.UserLocation[0] + "," + this.UserService.UserLocation[1];
		var destination = "&destination=" + this.latitude + "," + this.longitude;
		var newUrl = ""
		if ((this.UserService.UserLocation[0] == 0) && (this.UserService.UserLocation[1] == 0)) {
			newUrl = url + destination;
		} else {
			newUrl = url + origin + destination;
		}
		dialogs.confirm({
			title: "Abrir Google Maps",
			message: "¿Desea ir a google Maps© para ver cómo llegar a este restaurante?",
			okButtonText: "Sí",
			cancelButtonText: "Cancelar"
		}).then(result => {
			// result argument is boolean
			if (result) {
				//aquí se redirecciona al usuario a google maps
				utils.openUrl(newUrl);
			}
			else {
				return
			}
		});
	}
	
	public addUrl(b){
		const a = "https://novakaelum.com/api/public_html/storage/"+ b;
		return a;		
	}

	openPic(id) {
		this.Helper.getPost(id).subscribe((resp: any,) => {
			console.log("se recibieron los datos");
			console.log(resp);
			this.UserService.Datos_Post.id = resp.id;
			this.UserService.Datos_Post.titulo = resp.titulo;
			this.UserService.Datos_Post.ruta = "https://novakaelum.com/api/public_html/storage"+ resp.ruta;
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

	backHome() {
		this.routerEx.navigate(['/home', this.UserService.Datos_Usuario.id], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}

}