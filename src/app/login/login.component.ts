import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ITnsOAuthTokenResult } from "nativescript-oauth2";

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
	
	status: 'login' | 'regUser' | 'regRest' = 'login';
	paso: string = '1';
	pasoMapa: 'showBtn' | 'showMap' = 'showBtn';

	caracteristicas = caracteristica;

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService) 
  { 
		this.user = new User();
		this.restaurante = new Restaurante();
  }

  ngOnInit() 
  {
		this.page.actionBarHidden = true;
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
		// const loginAlert: AlertOptions = {
		// 	title: "Inicio de Sesión",
		// 	message: "Iniciando sesión",
		// 	okButtonText: "OK",
		// 	cancelable: false
		// };

		// alert(loginAlert).then(() => {
		// });
  }
	
	google()
	{
		this.authService.tnsOauthLogin('google').then((tokenResult: ITnsOAuthTokenResult) => 
		{
			this.routerEx.navigate(['/home']).then(() => console.log("navigated to /home"))
			.catch(err => console.log("error navigating to /home: " + err));

		}).catch(err => console.error("Error" + err));
  }
  
  Facebook()
	{
		const registroAlert: AlertOptions =
		{
			title: "Inicio con Facebook",
			message: "Con esta parte se iniciaría sesión o se registraría con Facebook",
			okButtonText: "Entendido",
			cancelable: false
		};

    alert(registroAlert);
	}
	
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

	register()
	{
		const registerAlert: AlertOptions = {
			title: "Registro",
			message: "Has acabado tu registro, ahora vas a ir a home.component",
			okButtonText: "OK",
			cancelable: false
		};

		alert(registerAlert).then(() => {
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
	}

	checkedChange(event) 
	{
		if(event.value)
		{
			console.log("acabo de ser checkeadoo", event.text);
		}
		else
		{
			console.log("acabo de ser descheckeado");
		}
  }
}