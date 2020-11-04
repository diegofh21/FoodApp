import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import * as Geolocation from "nativescript-geolocation";

import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";

// SERVICIOS
import { HelperService } from '../utils/servicios/helper.service'
import { UserService } from '../utils/servicios/user.service';

@Component({
	selector: 'SearchResult',
	templateUrl: './SearchResult.component.html',
	styleUrls: ['./SearchResult.component.css']
})

export class SearchResultComponent implements OnInit {
	public latitude: number;
	public longitude: number;
	public result;
	constructor(private userService: UserService, private routerEx: RouterExtensions, private helper: HelperService, private route: ActivatedRoute) {
		this.latitude = this.userService.UserLocation[0];
		this.longitude = this.userService.UserLocation[1];
	}
datos=null;
status="normal"
location= this.userService.UserLocation;

	ngOnInit() {
		alert("ubicación"+ this.latitude +" y "+this.longitude + ". aber pq nojoda")
		this.result=[];
		this.result = this.helper.ResultadoBusqueda;
		for (const i in this.result) {
			this.datos = i;
		}
		if(this.datos==null){this.alert()}
 }



	goToProfile(id){
        this.routerEx.navigate(['profileRestaurant/', id], {
            animated: true,
            transition:
            {
                name: 'fade',
                duration: 250,
                curve: 'linear'
            }
        });
	}
	//esta función debería ordenar los restaurantes, pero es raro que me dice que no puede leer latitude de undefined
public compare(a, b) {
		const rest1 = Math.abs(((a.latitud -  this.latitude )+(a.longitud - this.longitude)))
		const rest2 = Math.abs(((b.latitud -  this.latitude )+(b.longitud - this.longitude)))
		let comparison = 0;
		if (rest1 > rest2) {
		  comparison = 1;
		} else if (rest1 < rest2) {
		  comparison = -1;
		}
		return comparison;
	  }

    public addUrl(b){
		const a = "https://novakaelum.com/api/public_html/storage/"+ b;
		return a;		
	}

	alert() {
		alert("No se entontró ningún restaurante con las características o el nombre que buscaste.")
	}
}