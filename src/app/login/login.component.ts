import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { Router } from "@angular/router";
import { User } from '../utils/models/user.model';
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';
// import * as dialogs from 'tns-core-modules/ui/dialogs';
import { UserService } from "../utils/servicios/user.service";

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
  isLoggingIn = true;

  constructor(private page: Page, private router: Router, private routerEx: RouterExtensions, private userService: UserService) 
  { 
    this.user = new User();
  }

  ngOnInit() 
  {
    this.page.actionBarHidden = true;
  }

  // submit() 
  // {
  //   if (this.isLoggingIn) 
  //   {
  //     this.login();
  //   }
  //   else 
  //   {
  //     this.signUp();
  //   }
	// }
	
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
            duration: 500,
            curve: 'linear'
          }
        })

		});
  }
  
  restar()
  {
    console.log("restar boton presionado!!!");
  }

  // signUp() 
  // {
	// 	const registroAlert: AlertOptions =
	// 	{
	// 		title: "Registro",
	// 		message: "Aqui se comprueba el registro de personas o restaurantes",
	// 		okButtonText: "Entendido",
	// 		cancelable: false
	// 	};

	// 	alert(registroAlert).then(() => {
  //     this.routerEx.navigate(['/register'], {
  //       transition:
  //       {
  //         name: 'fade',
  //         duration: 250,
  //         curve: 'linear'
  //       }
  //     });
	// 	});
	// }
	
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

  toggleLogin() 
  {
    this.isLoggingIn = true
  }

  toggleRegister()
  {
    this.isLoggingIn = false;
  }
}