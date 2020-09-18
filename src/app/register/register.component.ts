import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
//import { RouterExtensions } from 'nativescript-angular';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
//import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	Person = 
	{
		nom_client: '',
		ci_client: '',
		caracteristicas_client: ''
	};

	Restaurante =
	{
		nom_rest: '',
		rif_rest: '',
		email_rest: '',
		tlf_rest: '',
		caracteristicas_rest: ''
	};

	Estatus: "crear" | "user" | "restaurante" = "crear";
	Activo: 'login' | 'registro' = 'login';

	constructor(private page: Page) { }

	ngOnInit() 
  {
    this.page.actionBarHidden = true;
	}
}