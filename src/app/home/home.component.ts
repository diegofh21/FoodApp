import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { AuthService } from '../utils/servicios/auth.service';
import { HelperService } from '../utils/servicios/helper.service'
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import * as Geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { NgZone } from "@angular/core";
import { homeRestaurantservice } from "../utils/servicios/homeRestaurant.service";
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
    feedList;

    searchType="nombre";
   Loupe;
   Tag;
    //iconos a mostrar
    home_actual = "~/assets/images/home_filled.png";
    search_actual="~/assets/images/loupe_empty.png";
    account_actual="~/assets/images/usuario_empty.png";

    //iconos activados
    home_empty = "~/assets/images/home_empty.png";
    search_empty="~/assets/images/loupe_empty.png";
    account_empty="~/assets/images/usuario_empty.png";
    loupe_empty ="~/assets/images/loupe_empty.png";
    tag_empty ="~/assets/images/label_empty.png";
    //iconos desactivados
    home_filled = "~/assets/images/home_filled.png";
    search_filled="~/assets/images/loupe_filled.png";
    account_filled="~/assets/images/usuario_filled.png";
    loupe_filled = "~/assets/images/loupe_filled.png";
    tag_filled ="~/assets/images/label_filled.png";
    checkboxData: any = []
	constructor(private itemService: homeRestaurantservice, private helper: HelperService, private routerEx: RouterExtensions, private authService: AuthService,private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
     }

	ngOnInit() { 
        this.feedList = this.itemService.getProfiles();
        this.Loupe = this.loupe_filled;
        this.Tag = this.tag_empty;
        this.getCheckboxData();
    }

	Logout()
	{
		this.authService.tnsOauthLogout().then(() => {
			this.routerEx.back();
		}).catch(err => console.log("Error: " + err));
    }

    switchView(tab){
        switch(tab){
            case "home":{
                this.home_actual=this.home_filled;
                this.search_actual=this.search_empty;
                this.account_actual = this.account_empty;
                break;
            }

            case "search":{
                this.home_actual = this.home_empty;
                this.search_actual = this.search_filled;
                this.account_actual = this.account_empty;
                break;
            }

            case "account":{
                this.home_actual = this.home_empty;
                this.search_actual = this.search_empty;
                this.account_actual = this.account_filled;
                break;
            }
        }
    }

    switchSearch(type){
        if (type=="nombre"){
            this.searchType="tag"
            this.Tag = this.tag_filled;
            this.Loupe = this.loupe_empty;
        } else if (type == "tag") {
            this.searchType="nombre"
            this.Tag = this.tag_empty;
            this.Loupe = this.loupe_filled
        }
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
    
    
    	getCheckboxData() {

		this.helper.getCaracteristicas().subscribe((resp: any) => {
			this.checkboxData = resp;
			console.log("la data recogida de la api es: ", JSON.stringify(resp));
			console.log("checkboxData: ", this.checkboxData)
	
		});
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