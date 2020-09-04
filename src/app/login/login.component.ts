import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router';

// Servicios
import { AuthService } from '../utils/servicios/auth.service';
import { User } from '../utils/models/user.model';
import { ITnsOAuthTokenResult } from "nativescript-oauth2";

@Component({
  selector: "ns-login",
  templateUrl: "./login.component.html",
  moduleId: module.id,
  styleUrls: ["./login.component.css", "../../assets/css/margin-padding.css"]
})

export class LoginComponent implements OnInit
{
	user: User;
	
	status: 'login' | 'regUser' | 'regRest' = 'login';
	paso: string = '1';

  constructor(private page: Page, private routerEx: RouterExtensions, private authService: AuthService) 
  { 
    this.user = new User();
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
  
  signUpUser() 
  {
		status = 'regUser';
  }
  
  signUpRest() 
  {
    status = 'regRest';
	}
	
	google()
	{
		this.authService.tnsOauthLogin('google').then((tokenResult: ITnsOAuthTokenResult) => 
		{
			this.routerEx.navigate(['home']).then(() => console.log("navigated to /home"))
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
}