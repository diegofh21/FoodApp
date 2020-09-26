import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { AuthService } from '../utils/servicios/auth.service';
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import * as Geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { NgZone } from "@angular/core";
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
//import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    public latitude: number;
    public longitude: number;
    private watchId: number;
	
	constructor(private routerEx: RouterExtensions, private authService: AuthService,private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
     }

	ngOnInit() { }

	Logout()
	{
		this.authService.tnsOauthLogout().then(() => {
			this.routerEx.back();
		}).catch(err => console.log("Error: " + err));
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

    public startWatchingLocation() {
        this.watchId = Geolocation.watchLocation(location => {
            if(location) {
                this.zone.run(() => {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                });
            }
        }, error => {
            console.error(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000 });
    }

    public stopWatchingLocation() {
        if(this.watchId) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}