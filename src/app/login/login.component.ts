import { Component, OnInit } from "@angular/core";
import { isUserInteractionEnabledProperty, Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from "@angular/router";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";

// Servicios
import { AuthService } from '../utils/servicios/auth.service';
import { Cliente, Restaurante } from '../utils/models/user.model';

import { caracteristica } from './mock-caracteristicas';

@Component({
  selector: "ns-login",
  templateUrl: "./login.component.html",
  moduleId: module.id,
  styleUrls: ["./login.component.css", "../../assets/css/margin-padding.css"]
})

export class LoginComponent implements OnInit
{
	cliente: Cliente;
	restaurante: Restaurante;
	
	status: 'login' | 'restReg' | 'userReg' = 'login';
	paso: string = '1';
	pasoMapa: 'showBtn' | 'showMap' = 'showBtn';
	socialLogin: boolean;

	checkboxs = {
		data: "",
		id: 0
	}

	array = new Array();

	caracteristicas = caracteristica;

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private route: ActivatedRoute) 
  { 
		this.cliente = new Cliente();
		this.restaurante = new Restaurante();
  }

  ngOnInit() 
  {
		this.page.actionBarHidden = true;
		console.log("La aplicación inicio y estas sincronizado.");
  }
	
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
				}, 2000); // 2 Segundos de Timeout al volver antes de irse a la pantalla de registro
			}); //authService.login()
		}).catch(err => console.error("Error" + err));	//authService.tnsOauthLogin(google)	
	}
	
	// INICIO DE SESIÓN CON FACEBOOK (FALTA RUTA PARA OBTENER LOS DATOS)
  Facebook()
	{
		this.authService.tnsOauthLogin('facebook').then((tokenResult) => 
		{
			// console.log("Login de Facebook Exitoso, el tokenResult es el siguiente" + resp);
			this.authService.login(tokenResult).subscribe((resp: any) => {
				console.log("resp es", resp);
				this.cliente.email = resp.email;
				this.cliente.nombre = resp.name;

				this.restaurante.email = resp.email;

				setTimeout(() => {
					console.log("entre en el timeout");
					this.routerEx.navigate(['/register'], {
						animated: true,
						transition:
						{
							name: 'fade',
							duration: 250,
							curve: 'linear'
						}
					});
				}, 1000); // 1 Segundos de Timeout al volver antes de irse a la pantalla de registro
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

		alert(ProfilePicAlert);
	}

	// METODO DE REGISTRO DEPEDIENDO DEL TYPEUSER REGISTRA AL USUARIO O AL RESTAURANTE
	register()
	{
		if(this.status == 'userReg')
		{
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
					message: "¡Gracias por registrarte en nuestra aplicación! \nA continuación vas a ser redireccionado al inicio.",
					okButtonText: "OK",
					cancelable: false
				}

				alert(regAlert).then(() => {
					setTimeout(() => {
						this.routerEx.navigate(['/homeRestaurant'], {
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

	itemTap(e)
	{
		console.log(e);
	}
}