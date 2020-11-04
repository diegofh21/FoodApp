import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import { exit } from 'nativescript-exit';
import { alert, AlertOptions, confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";

// SERVICIOS
import { HelperService } from "../utils/servicios/helper.service";
import { UserService } from '../utils/servicios/user.service';

@Component({
	selector: 'Post',
	templateUrl: './Post.component.html',
	styleUrls: ['./Post.component.css']
})

export class PostComponent implements OnInit {

	constructor(private UserService: UserService, private Helper: HelperService, private route: ActivatedRoute, private routerEx: RouterExtensions) { }
	public status: 'post' | 'editPost' = 'post';
	id;
	post;
	RestPic;
	actualPost;
	Restaurante: boolean;
	public descripcionPost: string = this.UserService.Datos_Post.descripcion;
	public errorCount = 0;

	ngOnInit() {
		this.Restaurante = this.UserService.isRestaurant
		this.id = +this.route.snapshot.params.id;
		console.log("se pedirán los datos");
		console.log(this.UserService.Datos_Restaurante.id)
		this.RestPic = this.UserService.Datos_Restaurante.foto;
		console.log("restpic", this.RestPic);
		this.post = this.UserService.Datos_Post;
	}


	  public addUrl(b){
		const a = "https://novakaelum.com/api/public_html/api/publicaciones/"+ b;
		return a;		
	}

	editPost() {
		const confirmEdit: ConfirmOptions = {
			title: "FindEat",
			message: "¿Estás seguro de aplicar los cambios?",
			okButtonText: "Si",
			cancelButtonText: "No",
			neutralButtonText: "Cancelar",
			cancelable: false
		}

		confirm(confirmEdit).then((result) => {
			if (result) {
				let datosEditados =
				{
					descripcion: this.descripcionPost
				}

				this.Helper.editPost(this.post.id, datosEditados).subscribe((resp: any) => {
					console.log("resp es", resp)
					const alertPost: AlertOptions = {
						title: "FindEat",
						message: "Tu publicación ha sido actualizada satisfactoriamente!",
						okButtonText: "¡Gracias!",
						cancelable: false
					}

					alert(alertPost).then(() => {
						this.routerEx.navigate(['/homeRestaurant', this.UserService.Datos_Restaurante.id], {
							animated: true,
							transition:
							{
								name: 'fade',
								duration: 250,
								curve: 'linear'
							}
						});
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
		});
	}

	deletePost() {
		this.Helper.deletePost(this.post.id).subscribe((resp: any) => {
			const deletePost: AlertOptions = {
				title: "FindEat",
				message: "Publicación eliminada exitosamente.",
				okButtonText: "OK",
				cancelable: false
			};

			alert(deletePost).then(() => {
				this.routerEx.navigate(['/homeRestaurant', this.UserService.Datos_Restaurante.id], {
					animated: true,
					transition:
					{
						name: 'fade',
						duration: 250,
						curve: 'linear'
					}
				});
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

}