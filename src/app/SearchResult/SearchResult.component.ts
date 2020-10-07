import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import * as Geolocation from "nativescript-geolocation";
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
	constructor(private routerEx: RouterExtensions, private route: ActivatedRoute) { 
		this.latitude = 0;
		this.longitude = 0;
	}

	ngOnInit() {
        const id = +this.route.snapshot.params.idUser
        this.result = +this.route.snapshot.params.Resultado
	 }

	 private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({timeout: 10000}).then(location => {
                    resolve(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
	}
	
	
    public updateLocation() {
        this.getDeviceLocation().then(result => {
            this.latitude = result.latitude;
            this.longitude = result.longitude;
            const ProfilePicAlert: AlertOptions = {
                title: "Tu ubicación",
                message: "tu latitud es "+ result.latitude +" y su longitud "+ result.longitude +".",
                okButtonText: "OK",
                cancelable: false
            };
    
            alert(ProfilePicAlert);
        }, error => {
            console.error(error);
        });
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
}