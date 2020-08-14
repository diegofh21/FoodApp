import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
//import { RouterExtensions } from 'nativescript-angular';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
//import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
	animations: [
		trigger('ShowSection', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('100ms', style({ opacity: 1 })),
			]),
			transition(':leave', [
				animate('100ms', style({ opacity: 0 }))
			])
		]),
	]
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