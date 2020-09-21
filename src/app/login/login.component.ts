import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
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

	caracteristicas = caracteristica;

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService) 
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
				console.log("email devuelto es", resp.email);
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
				}, 2000); // 2 Segundos de Timeout al volver antes de irse a la pantalla de registro
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
		// if(typeUser == 'CLIENTE')
		// {
			// EJECUTAR CODIGO PARA REGISTRAR AL CLIENTE
		// }
		// else if(typeUser == 'RESTAURANTE')
		// {
			// EJECUTAR CODIGO PARA REGISTRAR AL RESTAURANTE

			let datos = {
				name: this.restaurante.nombre_comercio,
				rif: this.restaurante.rif,
				typeUser: this.restaurante.type
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
}