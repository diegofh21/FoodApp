import { Component, OnInit } from '@angular/core';
import { NgZone } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import { exit } from 'nativescript-exit';
import { alert, AlertOptions, confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";

// SERVICIOS
import { AuthService } from '../utils/servicios/auth.service';
import { HelperService } from '../utils/servicios/helper.service'
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { UserService } from "../utils/servicios/user.service";

@Component({
	selector: 'tutorial',
	templateUrl: './tutorial.component.html',
	styleUrls: ['./tutorial.component.css']
})

export class TutorialComponent implements OnInit {

	public id: number;
	public isBusy: boolean = false;
	public BtnDispo: boolean = true;
	public errorCount = 0;
	public isUser: boolean;
	public name: string;

	public userPicture = "";
	public profile = {
    name: '',
    email: '',
    rif: '',
    foto: '',
    caracteristicas: undefined
  };

	constructor(private routerEx: RouterExtensions, private routeAct: ActivatedRoute, private userService: UserService) { }

	ngOnInit() { 
		if (typeof (this.routeAct.snapshot.params.id) !== 'undefined') {
			this.id = +this.routeAct.snapshot.params.id;
		}
		console.log("el id recogido ess", this.id);
		this.getUserInfo(this.id);
	}

	goHome()
	{
		if(this.isUser == true)
		{
			this.routerEx.navigate(['/home', this.id], {
				animated: true,
				transition:
				{
					name: 'fade',
					duration: 250,
					curve: 'linear'
				}
			});
		}
		else if(this.isUser == false)
		{
			this.routerEx.navigate(['/homeRestaurant', this.id], {
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

	getUserInfo(id) {
		this.userService.getUserInfo(id).subscribe((resp: any) => {

			if(resp.typeUser == "USUARIO")
			{
				console.log("Es un usuario")
				// Se guarda la data en el servicio
				this.userService.Datos_Usuario.id = this.id;
				this.userService.Datos_Usuario.name = this.profile.name = resp.nombre;
				this.userService.Datos_Usuario.email = this.profile.email = resp.email;
				this.userService.Datos_Usuario.foto = this.userPicture = resp.avatar
				this.userService.Datos_Usuario.caracteristicas = this.profile.caracteristicas = resp.caracteristicas;
				this.isUser = true;
			}
			else if(resp.typeUser == 'RESTAURANTE')
			{
				console.log("Es un restaurante")
				this.userService.Datos_Restaurante.id = this.id;
				this.userService.Datos_Restaurante.name = this.profile.name = resp.restaurantName;
				this.name = this.profile.name
				console.log(this.profile.name, this.name)
				this.isUser = false;
			}
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
}