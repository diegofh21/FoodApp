import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import { getBoolean, setBoolean, getString, setString, remove, clear } from 'tns-core-modules/application-settings';

// Servicios
import { AuthService } from '../utils/servicios/auth.service';
import { User } from '../utils/models/user.model';
import { Restaurante } from '../utils/models/restaurante.model';
import { Caracteristicas } from './caracteristicas';
import { caracteristica } from './mock-caracteristicas';

@Component({
  selector: "ns-login",
  templateUrl: "./login.component.html",
  moduleId: module.id,
  styleUrls: ["./login.component.css", "../../assets/css/margin-padding.css"]
})

export class LoginComponent implements OnInit
{
	user: User;
	restaurante: Restaurante;
	
	status: string = 'login';
	paso: string = '1';
	pasoMapa: 'showBtn' | 'showMap' = 'showBtn';
	googleLogin: boolean = false;

	caracteristicas = caracteristica;

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService) 
  { 
		this.user = new User();
		this.restaurante = new Restaurante();
  }

  ngOnInit() 
  {
		this.page.actionBarHidden = true;
		console.log("la aplicacion inicio");
  }
	
	login()
	{
		const alerta: AlertOptions = 
		{
			title: 'cambio de variable',
			message: 'get variable googleLogin',
			okButtonText: 'OK',
			cancelable: false
		};

		alert(alerta).then(() => {
			this.googleLogin = getBoolean("googleLogin");
			this.status = getString("status");

			alert("la variable seteada googleLogin es: " + this.googleLogin)
			alert("la variable seteada status es : " + this.status)
		});
		
		// this.routerEx.navigate(['/home'], {
		// 	animated: true,
		// 	transition:
		// 	{
		// 		name: 'fade',
		// 		duration: 250,
		// 		curve: 'linear'
		// 	}
		// });
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
		setBoolean("googleLogin", true);
		setString("status", "selectReg");
		this.authService.tnsOauthLogin('google').then((tokenResult) => 
		{
			
			// console.log("login exitoso tokenResult es:" + JSON.stringify(tokenResult));
			this.authService.login(tokenResult).subscribe((resp: any) => {
				console.log("resp es", resp.email);
				this.restaurante.email = resp.email;
				
				setTimeout(() => {
					console.log("entre en el timeout");
					const googleReg: AlertOptions = {
						title: "cambio de registro",
						message: 'vas a ir a la pantalla de seleccion de registro',
						okButtonText: 'OK',
						cancelable: false
					};

					alert(googleReg).then(() => {
						getBoolean("googleLogin");
						getString("status");
						console.log("valores de googleLogin y status:.", this.googleLogin, this.status);
					});
				}, 3000); //Timeout
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
			});
			this.routerEx.navigate(['../home'], {
				animated: true,
				transition:
				{
					name: 'fade',
					duration: 250,
					curve: 'linear'
				}
			});
		}).catch(err => console.error("Error" + err));
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
		// if(typeUser == 'CLIENTE')
		// {
			// EJECUTAR CODIGO PARA REGISTRAR AL CLIENTE
		// }
		// else if(typeUser == 'RESTAURANTE')
		// {
			// EJECUTAR CODIGO PARA REGISTRAR AL RESTAURANTE

			let datos = {
				name: this.restaurante.nombre_comercio,
				rif: this.restaurante.rif
			};

			console.log("los datos guardados: ", JSON.stringify(datos));

			this.authService.register(datos).subscribe((resp: any) => 
			{
				console.log("resp es:::::::::", resp);
	
				this.routerEx.navigate(['/home'], {
					animated: true,
					transition:
					{
						name: 'fade',
						duration: 250,
						curve: 'linear'
					}
				});
			});
		// }
	}

	checkedChange(event) 
	{
		// for (let i = 0; i < this.caracteristicas.length; i++) {
		// 	const element = this.caracteristicas[i];
			// console.log(element.name);
			if(event.value)
			{
				console.log("acabo de ser checkeadoo");
			}
			else
			{
				console.log("acabo de ser descheckeado");
			}
		// }
		
	}


	// LOGIN SCREEN STATES
	setStatus(state: string)
	{
		switch (state) {
			case 'login':
				setString("status", "login");
				break;
			case 'userReg':
				setString("status", "userReg");
				break;
			case 'restReg':
				setString("status", "restReg");
				break;
			case 'selectReg':
				setString("status", "selectReg");
				break;
		}
	}
}