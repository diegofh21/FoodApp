import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from "@angular/router";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";

import { AuthService } from '../utils/servicios/auth.service';
import { Cliente, Restaurante } from '../utils/models/user.model';

import { caracteristica } from '../login/mock-caracteristicas';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	cliente: Cliente;
	restaurante: Restaurante;
	caracteristicas = caracteristica;

	status: 'selectReg' | 'restReg' | 'userReg' = 'selectReg';
	socialLogin: boolean;
	id: number;

	constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService, private routeAct: ActivatedRoute) 
	{ 
		this.cliente = new Cliente();
		this.restaurante = new Restaurante();
	}

	ngOnInit() 
  {
		this.page.actionBarHidden = true;
		
		if(typeof (this.routeAct.snapshot.params.id) !== 'undefined') 
		{
			this.id = +this.routeAct.snapshot.params.id;
			console.log("el id es:", this.id);
		}
		this.restaurante.id = this.id;
		this.cliente.id = this.id;
		console.log("restaurante.id:", this.restaurante.id);

		console.log("los datos que tiene restaurante para esta estancia son:", this.restaurante);
		console.log("los datos que tiene cliente para esta estancia son: ", this.cliente);
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

	login()
	{
		this.routerEx.navigate(['/login'], {
			animated: true,
			transition:
			{
				name: 'fade',
				duration: 250,
				curve: 'linear'
			}
		});
	}

// METODO DE REGISTRO DEPEDIENDO DEL TYPEUSER REGISTRA AL USUARIO O AL RESTAURANTE
	register()
	{
		if(this.status == 'userReg')
		{
			let datos = {
				// name: this.cliente.nombre,
				typeUser: this.cliente.type
			};
	
			console.log("los datos guardados: ", JSON.stringify(datos));
	
			this.authService.register(datos).subscribe((resp: any) => 
			{
				console.log("resp es:::::::::", resp);
				
				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación! \n A continuación vas a ser redireccionado al inicio.",
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
					}, 2000);
				});
				
			});
		}
		else if(this.status == 'restReg')
		{
			let datos = {
				name: this.restaurante.nombre_comercio,
				rif: this.restaurante.rif,
				id: this.restaurante.id,
				typeUser: this.restaurante.type
			};
	
			console.log("los datos guardados: ", JSON.stringify(datos));
	
			this.authService.register(datos).subscribe((resp: any) => 
			{
				console.log("resp es:::::::::", resp);
	
				const regAlert: AlertOptions = {
					title: "FindEat",
					message: "¡Gracias por registrarte en nuestra aplicación! \nA continuación vas a ser redireccionado al inicio.",
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
					}, 2000);
				});
			});
		}
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