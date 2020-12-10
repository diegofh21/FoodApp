import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from 'nativescript-angular';
import { exit } from 'nativescript-exit';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { EventData, fromObject } from "tns-core-modules/data/observable";

// SERVICIOS
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { UserService } from '../utils/servicios/user.service';
import { HelperService } from '../utils/servicios/helper.service'

@Component({
	selector: 'editReview',
	templateUrl: '../editReview/editReview.component.html',
	styleUrls: ['../profileRestaurant/profileRestaurant.component.css']
})

export class EditReviewComponent implements OnInit {
	foto;
	nombre;
	user_id;
	id;
	rate;
	status = "normal";
	reviewText;
	starURL1;
	starURL2;
	starURL3;
	starURL4;
	starURL5;
	starEmpty = "~/assets/images/estrella-vacia2.png";
	starFilled = "~/assets/images/estrella-llena.png";
	idreview;

	public errorCount = 0;

	constructor(private UserService: UserService,
		private Helper: HelperService,
		private route: ActivatedRoute,
		private routerEx: RouterExtensions,
	) { }

	ngOnInit(): void {
		this.idreview = this.id = +this.route.snapshot.params.id;
		this.nombre = this.UserService.Datos_Restaurante.name;
		this.user_id = this.UserService.Datos_Usuario.id;
		this.starURL1 = this.starEmpty;
		this.starURL2 = this.starEmpty;
		this.starURL3 = this.starEmpty;
		this.starURL4 = this.starEmpty;
		this.starURL5 = this.starEmpty;
		this.rate = this.UserService.editReviewData.rating;
		this.reviewText = this.UserService.editReviewData.contenido;
		this.starRate(this.rate)
	}

	starRate(n) {
		switch (n) {
			case 1: {
				this.starURL1 = this.starFilled;
				this.starURL2 = this.starEmpty;
				this.starURL3 = this.starEmpty;
				this.starURL4 = this.starEmpty;
				this.starURL5 = this.starEmpty;
				this.rate = 1;
				break;
			}
			case 2: {
				this.starURL1 = this.starFilled
				this.starURL2 = this.starFilled;
				this.starURL3 = this.starEmpty;
				this.starURL4 = this.starEmpty;
				this.starURL5 = this.starEmpty;
				this.rate = 2;
				break;
			}
			case 3: {
				this.starURL1 = this.starFilled
				this.starURL2 = this.starFilled;
				this.starURL3 = this.starFilled;
				this.starURL4 = this.starEmpty;
				this.starURL5 = this.starEmpty;
				this.rate = 3;
				break;
			}
			case 4: {
				this.starURL1 = this.starFilled
				this.starURL2 = this.starFilled;
				this.starURL3 = this.starFilled;
				this.starURL4 = this.starFilled;
				this.starURL5 = this.starEmpty;
				this.rate = 4;
				break;
			}
			case 5: {
				this.starURL1 = this.starFilled
				this.starURL2 = this.starFilled;
				this.starURL3 = this.starFilled;
				this.starURL4 = this.starFilled;
				this.starURL5 = this.starFilled;
				this.rate = 5;
				break;
			}
			default: {
				//statements; 
				break;
			}
		}
	}

	postear() {
		if (this.reviewText == "") {
			alert("Por favor, escribe algo en la reseña.");
		} else if (this.rate == 0) {
			alert("Por favor, toca las estrellas para establecer tu puntuación del 1 al 5");
		} else {
			//aquí se envían los datos de la reseña a la api
			let data = {
				rating: this.rate,
				contenido: this.reviewText
			}
			dialogs.confirm({
				title: "Editar la Reseña",
				message: "Calificación de " + this.rate + " estrellas a " + this.nombre + ": ''" + this.reviewText + "'' en la reseña.",
				okButtonText: "Editar",
				cancelButtonText: "Cancelar"
			}).then(result => {
				// result argument is boolean
				if (result) {
					this.status = "loading"
					this.Helper.editReview(this.idreview,data).subscribe((resp: any) => {
						this.status = "normal";
						alert(resp.message);
						this.routerEx.navigate(['UserReviews/', this.user_id], {
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
											exit();
										});
									}
									break;
							}
						});

				}
				else {
					return
				}
			});

		}
	}
}