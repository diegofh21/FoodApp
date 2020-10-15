import { Component, OnInit } from "@angular/core";
import { isUserInteractionEnabledProperty, Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";

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

export class LoginComponent implements OnInit
{	
	cliente: Cliente;
	restaurante: Restaurante;
	
	status: string = 'login';

	isBusy: boolean = false;
	BtnDispo: boolean = true;

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private userService: UserService) 
  { 
		this.cliente = new Cliente();
		this.restaurante = new Restaurante();
	}

	ngOnInit() {
		this.page.actionBarHidden = true;
		console.log("La aplicación inicio y estas sincronizado.");	
	}
	
	login()
	{
		this.routerEx.navigate(['/home', 15], {
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
		this.routerEx.navigate(['/homeRestaurant', 16], {
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
		this.isBusy = true;
		this.BtnDispo = false;
		this.authService.tnsOauthLogin('google').then((tokenResult) => 
		{
			this.userService.login(tokenResult).subscribe((resp: any) => {
				
				console.log("id:", resp.id);
				console.log("nombre", resp.name)
				console.log("typeUser:", resp.typeUser);

				var userID = resp.id;

				switch (resp.typeUser) 
				{
					case 'USUARIO':

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
						this.isBusy = true;
						this.BtnDispo = false;
						break;

					case 'RESTAURANTE':
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
						this.isBusy = true;
						this.BtnDispo = false;
						break;

					case null:
						// NULL ES IGUAL A QUE NO ESTA REGISTRADO
						
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
						this.isBusy = true;
						this.BtnDispo = false;
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
  Facebook()
	{
		this.authService.tnsOauthLogin('facebook').then((tokenResult) => 
		{
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