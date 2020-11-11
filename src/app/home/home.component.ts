import { Component, OnInit } from '@angular/core';
import { NgZone } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import * as Geolocation from "nativescript-geolocation";
import { exit } from 'nativescript-exit';
import { alert, AlertOptions, confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { Accuracy } from "tns-core-modules/ui/enums";
import { SearchBar } from 'tns-core-modules/ui/search-bar';

// SERVICIOS
import { AuthService } from '../utils/servicios/auth.service';
import { HelperService } from '../utils/servicios/helper.service'
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { UserService } from "../utils/servicios/user.service";

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	public id: number;
	public status: 'home' | 'search' | 'profile' | 'editCaracteristicas' | 'loading' | 'vacio' = 'home';
	public isBusy: boolean = false;
	public BtnDispo: boolean = true;
	public CheckCount: number = 0;
	public CheckLimit: boolean = true;
	public loading_search: string = "desactivado"
	public dataFeed;
	public errorCount = 0;
	public interesesLenght = 0;
	public searchString = '';
	public latitude: number;
	public longitude: number;
	private watchId: number;
	public id_user = 1;
	feedList: [];

	searchType = "nombre";
	public dataUser = {
		name: '',
		email: '',
		profilePic: '',
		caracteristicas: undefined
	};
	public userPicture = "";
	Loupe;
	Tag;

	//iconos a mostrar
	home_actual = "~/assets/images/home_filled.png";
	search_actual = "~/assets/images/loupe_empty.png";
	account_actual = "~/assets/images/usuario_empty.png";

	//iconos activados
	home_empty = "~/assets/images/home_empty.png";
	search_empty = "~/assets/images/loupe_empty.png";
	account_empty = "~/assets/images/usuario_empty.png";
	loupe_empty = "~/assets/images/loupe_empty.png";
	tag_empty = "~/assets/images/label_empty.png";

	//iconos desactivados
	home_filled = "~/assets/images/home_filled.png";
	search_filled = "~/assets/images/loupe_filled.png";
	account_filled = "~/assets/images/usuario_filled.png";
	loupe_filled = "~/assets/images/loupe_filled.png";
	tag_filled = "~/assets/images/label_filled.png";

	checkboxData: any = [];
	selectedData = [];

	constructor(private RestaurantService: homeRestaurantService, private helper: HelperService, private routerEx: RouterExtensions, private authService: AuthService, private zone: NgZone, private routeAct: ActivatedRoute, private userService: UserService) {
		this.latitude = 0;
		this.longitude = 0;
	}


	ngOnInit() {
		if (typeof (this.routeAct.snapshot.params.id) !== 'undefined') {
			this.id = +this.routeAct.snapshot.params.id;
		}
		console.log("el id recogido ess", this.id);
		this.updateLocation();
		// this.getFeedList();
		this.getUserInfo(this.id);
		this.Loupe = this.loupe_filled;
		this.dataUser = {
			name: this.userService.Datos_Usuario.name,
			email: this.userService.Datos_Usuario.email,
			profilePic: this.userService.Datos_Usuario.foto,
			caracteristicas: this.userService.Datos_Usuario.caracteristicas
		}
		this.Tag = this.tag_empty;
		this.getCheckboxData();

	}

	Logout() {
		const logoutAlert: ConfirmOptions = {
			title: "FindEat",
			message: "❌¿Estás seguro de cerrar sesión?❌",
			okButtonText: "Si",
			cancelButtonText: "No",
			cancelable: false
		};

		confirm(logoutAlert).then((result) => {
			if (result == true) {
				console.log("logout es", result);
				this.authService.tnsOauthLogout().then(() => {
					this.routerEx.back();
				}).catch(err => console.log("Error: " + err));
			}
		});
	}

	getFeedList() {
		this.RestaurantService.getProfiles().subscribe((resp: any) => {
			this.feedList = resp;
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

	getUserInfo(id) {
		this.userService.getUserInfo(id).subscribe((resp: any) => {

			// Se guarda la data en el servicio
			this.userService.Datos_Usuario.id = this.id;
			this.userService.Datos_Usuario.name = this.dataUser.name = resp.nombre;
			this.userService.Datos_Usuario.email = this.dataUser.email = resp.email;
			this.userService.Datos_Usuario.foto = this.userPicture = resp.avatar
			this.userService.Datos_Usuario.caracteristicas = this.dataUser.caracteristicas = resp.caracteristicas;
			this.newFeedList();
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

	switchView(tab) {
		switch (tab) {
			case "home": {
				this.home_actual = this.home_filled;
				this.search_actual = this.search_empty;
				this.account_actual = this.account_empty;
				this.status = 'loading';
				console.log(this.feedList.length)
				if (this.feedList.length == 0) {
					setTimeout(() => {
						this.status = 'vacio';
					}, 1000);
				}
				else {
					setTimeout(() => {
						this.status = 'home';
					}, 1000);
				}
				break;
			}

			case "search": {
				this.home_actual = this.home_empty;
				this.search_actual = this.search_filled;
				this.account_actual = this.account_empty;
				this.status = 'loading';
				setTimeout(() => {
					this.status = 'search';
				}, 1000);
				break;
			}

			case "account": {
				this.home_actual = this.home_empty;
				this.search_actual = this.search_empty;
				this.account_actual = this.account_filled;
				// Se llama en caso de que se actualicen algunos datos, igual cuando se vaya a modificar algo se tiene que llamar este metodo obligatoriamente para poder actualizar los datos mostrados en pantalla
				this.status = 'loading';
				this.getUserInfo(this.id);
				setTimeout(() => {
					this.status = 'profile';
				}, 1000);
				break;
			}
		}
	}

	UserReviews(id) {
		this.routerEx.navigate(['UserReviews/', id], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}

	public onSubmit(args) {
		let searchBar = <SearchBar>args.object;
		let parametro = searchBar.text;
		this.loading_search = "activado";
		//aqui se pasa el id del usuario + la respuesta del servidor 
		this.helper.searchByName(parametro).subscribe((resp: any,) => {
			this.loading_search = "desactivado";

			console.log(resp);
			let resultado = resp
			this.helper.ResultadoBusqueda = resultado;
			this.routerEx.navigate(['searchResult'], {
				animated: true,
				transition:
				{
					name: 'fade',
					duration: 250,
					curve: 'linear'
				}
			});

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
			});
	}

	switchSearch(type) {
		if (type == "nombre") {
			this.searchType = "tag"
			this.Tag = this.tag_filled;
			this.Loupe = this.loupe_empty;
		} else if (type == "tag") {
			this.searchType = "nombre"
			this.Tag = this.tag_empty;
			this.Loupe = this.loupe_filled
		}
	}

	goToProfile(id) {
		this.userService.isRestaurant = false;
		this.routerEx.navigate(['profileRestaurant/', id], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}


	getCheckboxData() {
		this.isBusy = true
		this.helper.getCaracteristicas().subscribe((resp: any) => {
			// let ordenar = resp.sort(this.compare);
			this.checkboxData = resp;
			this.checkboxData.forEach(e => e.select = false);
			this.isBusy = false;
		});
	}

	compare(a, b) {
		// Use toUpperCase() to ignore character casing
		const first = a.name.toUpperCase();
		const second = b.name.toUpperCase();

		let comparison = 0;
		if (first > second) {
			comparison = 1;
		} else if (first < second) {
			comparison = -1;
		}
		return comparison;
	}

	checkedChange(event, data, id) {
		console.log("id-1", this.checkboxData[id - 1])
		console.log("---------------------------------")

		if (this.CheckCount < 5) {
			this.CheckCount++;
			console.log("checkcount", this.CheckCount);
			if (event.value == true) {
				this.checkboxData[id - 1].select = true
				console.log("checkboxdata completo", this.checkboxData[id - 1]);
			}
			if (this.CheckCount == 5) {
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

	cancelUpdate() {
		this.status = 'loading';
		const cancelAlert: ConfirmOptions = {
			title: "FindEat",
			message: "¿Deseas cancelar el proceso?",
			okButtonText: "Si",
			cancelButtonText: "No",
			cancelable: false
		};

		confirm(cancelAlert).then((result) => {
			if (result == true) {
				this.status = 'profile';
				this.CheckCount = 0;
				this.CheckLimit = true;
			}
		});
	}

	updateCaracteristicas() {
		this.isBusy = true;
		this.BtnDispo = false;
		this.CheckLimit = true;
		this.CheckCount = 0;

		const updateAlert: AlertOptions = {
			title: 'FindEat',
			message: 'Actualizando tus intereses, espera un momento por favor⏳.',
			okButtonText: 'Entendido',
			cancelable: false
		}

		alert(updateAlert).then(() => {
			this.status = 'loading';
			var Caracteristicas = this.checkboxData.filter(e => e.select === true);

			let caracteristicasUsuario = {
				userID: this.id,
				caracteristicasID: Caracteristicas
			};

			console.log("caracteristicas", caracteristicasUsuario);

			this.userService.storeCaracteristicas(caracteristicasUsuario).subscribe((resp: any) => {
				console.log("caracteristicas de usuario registradas bajo el id:", caracteristicasUsuario.userID);

				if (caracteristicasUsuario.userID != null || undefined) {
					// Guardamos las caracteristicas en el servicio (caché)
					this.userService.Datos_Usuario.caracteristicas = Caracteristicas;
					const updateAlert: AlertOptions =
					{
						title: "FindEat",
						message: "¡Intereses actualizados!\nA continuación vas a ser redireccionado a tu perfil.",
						okButtonText: "¡Gracias!",
						cancelable: false
					}

					alert(updateAlert).then(() => {
						this.isBusy = false;
						this.BtnDispo = true;
						this.getUserInfo(this.id);
						console.log("caracteristicas", caracteristicasUsuario);
						this.status = 'profile';
					})
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
				});
		});
	}

	private getDeviceLocation(): Promise<any> {
		return new Promise((resolve, reject) => {
			Geolocation.enableLocationRequest().then(() => {
				Geolocation.getCurrentLocation({ timeout: 10000 }).then(location => {
					resolve(location);
				}).catch(error => {
					reject(error);
				});
			});
		});
	}

	public pushData(item) {
		if ((this.selectedData.indexOf(item) == -1) && this.selectedData.length <= 4) {
			this.selectedData.push(item);
		}
		else {
			console.log("ya está agregado");
		}
	}

	public spliceItem(index) {
		this.selectedData.splice(index, 1);
		console.log(index);
	}

	public searchTag() {
		let idarrayobj = [];
		if (this.selectedData.length == 0) {
			alert("Por favor selecciona al menos una característica");
			return
		}
		else {
			for (const i of this.selectedData) {
				let testobj = { id: i.id };
				idarrayobj.push(testobj);
			}
			console.log(idarrayobj);
			this.helper.searchByTags(idarrayobj).subscribe((resp: any,) => {
				let resultado = resp
				this.helper.ResultadoBusqueda = resultado;

				this.routerEx.navigate(['searchResult'], {
					animated: true,
					transition:
					{
						name: 'fade',
						duration: 250,
						curve: 'linear'
					}
				});
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
				});
		}
	}


	public updateLocation() {
		this.getDeviceLocation().then(result => {
			this.latitude = result.latitude;
			this.userService.UserLocation[0] = result.latitude;
			this.longitude = result.longitude;
			this.userService.UserLocation[1] = result.longitude;
			const ProfilePicAlert: AlertOptions = {
				title: "Tu ubicación",
				message: "tu latitud es " + result.latitude + " y su longitud " + result.longitude + ".",
				okButtonText: "OK",
				cancelable: false
			};

			alert(ProfilePicAlert);
		}, error => {
			console.error(error);
		});
	}

	public startWatchingLocation() {
		this.watchId = Geolocation.watchLocation(location => {
			if (location) {
				this.zone.run(() => {
					this.latitude = location.latitude;
					this.longitude = location.longitude;
				});
			}
		}, error => {
			console.error(error);
		}, { updateDistance: 1, minimumUpdateTime: 1000 });
	}

	public stopWatchingLocation() {
		if (this.watchId) {
			Geolocation.clearWatch(this.watchId);
			this.watchId = null;
		}
	}

	public deleteProfile() {
		const firstConfirm: ConfirmOptions = {
			title: 'FindEat',
			message: '¿Estás seguro de querer eliminar tu cuenta?',
			okButtonText: 'Si, quiero eliminar mi cuenta.',
			cancelButtonText: 'No, quiero quedarme',
			cancelable: false
		};

		confirm(firstConfirm).then((result) => {
			if (result) {
				const secondConfirm: ConfirmOptions = {
					title: 'FindEat',
					message: 'Esta acción no podrá ser revertida.\n¿Estás seguro de querer continuar?',
					okButtonText: 'Eliminar cuenta.',
					cancelButtonText: 'He cambiado de pensar.',
					cancelable: false
				};

				confirm(secondConfirm).then((result) => {
					if (result) {
						const goodByeAlert: AlertOptions = {
							title: 'FindEat',
							message: '¡Muchas gracias por usar FindEat!\n¡Te vamos a extrañar!',
							okButtonText: 'OK',
							cancelable: false
						};

						alert(goodByeAlert).then(() => {
							this.status = 'loading';
							this.userService.deleteUser(this.id).subscribe((resp: any) => {
								console.log("resp es ", resp);
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
								});
							setTimeout(() => {
								exit();
							}, 4000);
						});
					}
				});
			}
		});
	}

	public newFeedList() {
		let idarrayobj = [];

		for (let i = 0; i < this.userService.Datos_Usuario.caracteristicas.length; i++) {
			let testobj = { id: this.userService.Datos_Usuario.caracteristicas[i].id };
			idarrayobj.push(testobj);
		}
		console.log(idarrayobj);
		this.helper.searchByTags(idarrayobj).subscribe((resp: any,) => {
			let resultado = resp
			this.feedList = resultado;
			if (this.feedList.length == 0) {
				this.status = 'vacio';
			}
		},
			(error) => {
				console.log("El codigo HTTP obtenido esss", error.status)
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
			});
	}
}