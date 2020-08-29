import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';

import { UserService } from "../utils/servicios/user.service";
import { User } from '../utils/models/user.model';

@Component({
  selector: "ns-login",
  templateUrl: "./login.component.html",
  moduleId: module.id,
  styleUrls: ["./login.component.css", "../../assets/css/margin-padding.css"],
  providers: [UserService]
})

export class LoginComponent implements OnInit
{
  user: User;
  status: 'login' | 'regUser' | 'regRest' = 'login';
  register: string;

  constructor(private page: Page, private routerEx: RouterExtensions, private userService: UserService) 
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
  
  signUpUser() 
  {
		const registroAlert: AlertOptions =
		{
			title: "Registro",
			message: "REGISTRO DE USUARIOS",
			okButtonText: "Entendido",
			cancelable: false
		};

		alert(registroAlert).then(() => {
			status = 'regUser';
			this.page.actionBarHidden = false;
		});
  }
  
  signUpRest() 
  {
		const registroAlert: AlertOptions =
		{
			title: "Registro",
			message: "REGISTRO DE RESTAURANTES",
			okButtonText: "Entendido",
			cancelable: false
		};

		alert(registroAlert).then(() => {
      status = 'regRest';
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
    
		this.userService.login().subscribe((resp: any) => {
			console.log(resp)
		});
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