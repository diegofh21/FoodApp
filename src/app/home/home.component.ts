import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { AuthService } from '../utils/servicios/auth.service';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
//import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	constructor(private routerEx: RouterExtensions, private authService: AuthService) { }

	ngOnInit() { }

	Logout()
	{
		this.authService.tnsOauthLogout().then(() => {
			this.routerEx.back();
		}).catch(err => console.log("Error: " + err));
	}
}