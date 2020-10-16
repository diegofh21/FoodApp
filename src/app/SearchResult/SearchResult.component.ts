import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import * as Geolocation from "nativescript-geolocation";
import { HelperService } from '../utils/servicios/helper.service'
import { UserService } from '../utils/servicios/user.service';
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';

import { ActivatedRoute } from '@angular/router';

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
	ngOnInit() {

		this.result=[];
		this.result = this.helper.ResultadoBusqueda;
		for (const i in this.result) {
			this.datos=i;
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

    public addUrl(b){
		const a = "https://www.arpicstudios.com/storage/"+ b;
		return a;		
	}

	alert(){
		alert("No se entontró ningún restaurante con las características o el nombre que buscaste.")
	}
}