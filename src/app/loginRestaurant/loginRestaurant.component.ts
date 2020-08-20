import { Component, OnInit } from '@angular/core';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
//import { ActivatedRoute } from '@angular/router';

import { Page } from "tns-core-modules/ui/page";
import { Router } from "@angular/router";
import { User } from '../utils/models/user.model';
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
// import * as dialogs from 'tns-core-modules/ui/dialogs';
import { UserService } from "../utils/servicios/user.service";

@Component({
	selector: 'ng-loginRestaurant',
	templateUrl: './loginRestaurant.component.html',
	styleUrls: ['./loginRestaurant.component.css', "../../assets/css/margin-padding.css"],
	moduleId: module.id,
	providers: [UserService]
})

export class LoginRestaurantComponent implements OnInit {

	
	user: User;

	constructor(private page: Page, private router: Router, private routerEx: RouterExtensions, private userService: UserService) 
	{ 
	  this.user = new User();
	}
  
	ngOnInit() 
	{
	  this.page.actionBarHidden = true;
	}
	  
	  login()
	  {
		  const loginAlert: AlertOptions = {
			  title: "Inicio de Sesión",
			  message: "Iniciando sesión",
			  okButtonText: "OK",
			  cancelable: false
		  };
  
		  alert(loginAlert).then(() => {
		  this.routerEx.navigate(['/home'], {
			animated: true,
			transition:
			{
			  name: 'fade',
			  duration: 250,
			  curve: 'linear'
			}
		  })
  
		  });
	}
  

	changeToUser(){
		const loginAlert: AlertOptions = {
			title: "Cambio de login",
			message: "Mostrando Login para usuario",
			okButtonText: "OK",
			cancelable: false
		};

		alert(loginAlert).then(() => {
		this.routerEx.navigate(['/login'], {
		  animated: true,
		  transition:
		  {
			name: 'fade',
			duration: 250,
			curve: 'linear'
		  }
		})

		});
	}

	signUp() 
	{
		  const registroAlert: AlertOptions =
		  {
			  title: "Registro",
			  message: "Aqui se hace el registro de personas",
			  okButtonText: "Entendido",
			  cancelable: false
		  };
  
		  alert(registroAlert).then(() => {
		this.routerEx.navigate(['/register'], {
		  transition:
		  {
			name: 'fade',
			duration: 250,
			curve: 'linear'
		  }
		});
		  });
	  }
	  
	  google()
	  {
		  const registroAlert: AlertOptions =
		  {
			  title: "Inicio con Google",
			  message: "Con esta parte se iniciaría sesión o se registraría con google",
			  okButtonText: "Entendido",
			  cancelable: false
		  };
  
	  alert(registroAlert);
	  
	//  this.userService.login().subscribe((resp: any) => {
	  //  console.log(resp)
	  //});
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
	  
	//  this.userService.login().subscribe((resp: any) => {
	  //  console.log(resp)
	  //});
	  }
  }