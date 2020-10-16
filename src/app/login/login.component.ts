import { Component, OnInit } from "@angular/core";
import { isUserInteractionEnabledProperty, Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";
import { exit } from 'nativescript-exit';

// Servicios
import { AuthService } from '../utils/servicios/auth.service';
import { UserService } from '../utils/servicios/user.service';

// Utils
import { Cliente, Restaurante } from '../utils/models/user.model';
import { registerLocaleData } from "@angular/common";

@Component({
	selector: "ns-login",
	templateUrl: "./login.component.html",
	moduleId: module.id,
	styleUrls: ["./login.component.css", "../../assets/css/margin-padding.css"]
})

export class LoginComponent implements OnInit {
	cliente: Cliente;
	restaurante: Restaurante;

	status: string = 'login';
	errorCount: number = 0;

	isBusy: boolean = false;
	BtnDispo: boolean = true;

	constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private userService: UserService) {
		this.cliente = new Cliente();
		this.restaurante = new Restaurante();
	}

	ngOnInit() {
		this.page.actionBarHidden = true;
		console.log("La aplicación inicio y estas sincronizado.");
	}

	login() {
		this.routerEx.navigate(['/home', 17], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}

	loginrestaurante() {
		this.routerEx.navigate(['/homeRestaurant', 15], {
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
	google() {
		this.isBusy = true;
		this.BtnDispo = false;
		this.authService.tnsOauthLogin('google').then((tokenResult) => {
			this.userService.login(tokenResult).subscribe((resp: any) => {

				console.log("id:", resp.id);
				console.log("nombre", resp.name)
				console.log("typeUser:", resp.typeUser);

				var userID = resp.id;

				switch (resp.typeUser) {
					case 'USUARIO':
						this.isBusy = false;
						this.BtnDispo = true;
						setTimeout(() => {
							this.routerEx.navigate(['home', userID]), {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							}
						}, 1000);
						break;

					case 'RESTAURANTE':
						this.isBusy = false;
						this.BtnDispo = true;
						setTimeout(() => {
							this.routerEx.navigate(['homeRestaurant', userID]), {
								animated: true,
								transition:
								{
									name: 'fade',
									duration: 250,
									curve: 'linear'
								}
							}
						}, 1000);
						break;

					case null:
						// NULL ES IGUAL A QUE NO ESTA REGISTRADO
						this.isBusy = false;
						this.BtnDispo = true;
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
			}); //authService.login()
		}).catch(err => {
			this.isBusy = true;
			this.BtnDispo = false;
			alert("Error" + err)
		});	//authService.tnsOauthLogin(google)	
	}

	// INICIO DE SESIÓN CON FACEBOOK (FALTA RUTA PARA OBTENER LOS DATOS)
	Facebook() {
		this.authService.tnsOauthLogin('facebook').then((tokenResult) => {
			this.userService.login(tokenResult).subscribe((resp: any) => {
				console.log("resp es", resp);
				this.cliente.email = resp.email;
				this.cliente.nombre = resp.name;

				this.restaurante.email = resp.email;
				console.log("el tipo de usuario es:", resp.typeUser)

				switch (resp.typeUser) {
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
}