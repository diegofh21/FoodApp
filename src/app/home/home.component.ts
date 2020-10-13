import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../utils/servicios/auth.service';
import { HelperService } from '../utils/servicios/helper.service'
import { alert, AlertOptions, confirm } from "tns-core-modules/ui/dialogs";
import * as Geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { NgZone } from "@angular/core";
import { SearchBar } from 'tns-core-modules/ui/search-bar';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { UserService } from "../utils/servicios/user.service";
import { timer } from 'rxjs';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';


@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
	
	public id: number;
	public status: 'profile' | 'editCaracteristicas' | '' = '';
	public isBusy: boolean = false;
	public CheckCount: number;
	public CheckLimit: boolean;

	public searchString = '';
	public latitude: number;
	public longitude: number;
	private watchId: number;
	public id_user = 1;
	feedList: [];

	searchType = "nombre";
	public dataUser = {
		name: '',
		email: '',
		profilePic: '',
		caracteristicas: undefined
	};
	public userPicture = "";
	Loupe;
	Tag;

	//iconos a mostrar
	home_actual = "~/assets/images/home_filled.png";
	search_actual = "~/assets/images/loupe_empty.png";
	account_actual = "~/assets/images/usuario_empty.png";

	//iconos activados
	home_empty = "~/assets/images/home_empty.png";
	search_empty = "~/assets/images/loupe_empty.png";
	account_empty = "~/assets/images/usuario_empty.png";
	loupe_empty = "~/assets/images/loupe_empty.png";
	tag_empty = "~/assets/images/label_empty.png";

	//iconos desactivados
	home_filled = "~/assets/images/home_filled.png";
	search_filled = "~/assets/images/loupe_filled.png";
	account_filled = "~/assets/images/usuario_filled.png";
	loupe_filled = "~/assets/images/loupe_filled.png";
	tag_filled = "~/assets/images/label_filled.png";

	checkboxData: any = [];
	selectedData = [];

	constructor(private RestaurantService: homeRestaurantService, private helper: HelperService, private routerEx: RouterExtensions, private authService: AuthService, private zone: NgZone, private routeAct: ActivatedRoute, private userService: UserService) {
		this.latitude = 0;
		this.longitude = 0;
	}

	ngOnInit() {
		if (typeof (this.routeAct.snapshot.params.id) !== 'undefined') {
			this.id = +this.routeAct.snapshot.params.id;
		}
		console.log("el id recogido es", this.id);

		this.getUserInfo(this.id);
		this.getFeedList();
		// this.feedList = this.RestaurantService.getProfiles();
		this.Loupe = this.loupe_filled;
		this.dataUser = {
			name: this.userService.Datos_Usuario.name,
			email: this.userService.Datos_Usuario.email,
			profilePic: this.userService.Datos_Usuario.foto,
			caracteristicas: this.userService.Datos_Usuario.caracteristicas
		}
		this.Tag = this.tag_empty;
		this.getCheckboxData();
	}

	editProfile()
	{
		alert("editar perfil")
	}

	Logout() 
	{
		let logoutAlert = {
			title: "FindEat",
			message: "¿Estás seguro de cerrar sesión?❌",
			okButtonText: "Yes",
			cancelButtonText: "No",
			neutralButtonText: "Cancel"
		};
	
		confirm(logoutAlert).then(() => 
		{
			this.authService.tnsOauthLogout().then(() => {
				this.routerEx.back();
			}).catch(err => console.log("Error: " + err));
		});
	}

	getFeedList()
	{
		this.RestaurantService.getProfiles().subscribe((resp: any) => {
			console.log("resp para getProfiles es:", resp)
			this.feedList = resp;
		});
	}
	getUserInfo(id) {
		this.userService.getUserInfo(id).subscribe((resp: any) => {

			console.log("resp esssssssss", JSON.stringify(resp));

			// Se guarda la data en el servicio
			this.userService.Datos_Usuario.id = this.id;
			this.userService.Datos_Usuario.name = this.dataUser.name = resp.nombre;
			this.userService.Datos_Usuario.email = this.dataUser.email = resp.email;
			this.userService.Datos_Usuario.foto = this.userPicture = resp.avatar
			this.userService.Datos_Usuario.caracteristicas = this.dataUser.caracteristicas = resp.caracteristicas;
		});
	}

	switchView(tab) {
		switch (tab) {
			case "home": {
				this.home_actual = this.home_filled;
				this.search_actual = this.search_empty;
				this.account_actual = this.account_empty;
				this.status = '';
				break;
			}

			case "search": {
				this.home_actual = this.home_empty;
				this.search_actual = this.search_filled;
				this.account_actual = this.account_empty;
				this.status = '';
				break;
			}

			case "account": {
				this.home_actual = this.home_empty;
				this.search_actual = this.search_empty;
				this.account_actual = this.account_filled;
				this.status = 'profile';
				break;
			}
		}
	}

	public onSubmit(args) 
	{
		let searchBar = <SearchBar>args.object;
		let parametro = searchBar.text;
		//aqui se pasa el id del usuario + la respuesta del servidor 
		this.helper.searchByName(parametro).subscribe((resp: any,) => {

			console.log(resp);
			this.helper.ResultadoBusqueda = resp;
			this.routerEx.navigate(['searchResult'], {
				animated: true,
				transition:
				{
					name: 'fade',
					duration: 250,
					curve: 'linear'
				}
			});

		});
	}

	switchSearch(type) {
		if (type == "nombre") {
			this.searchType = "tag"
			this.Tag = this.tag_filled;
			this.Loupe = this.loupe_empty;
		} else if (type == "tag") {
			this.searchType = "nombre"
			this.Tag = this.tag_empty;
			this.Loupe = this.loupe_filled
		}
	}

	goToProfile(id) {
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
		this.isBusy = true
		this.helper.getCaracteristicas().subscribe((resp: any) => {
			this.checkboxData = resp;
			this.checkboxData.forEach(e => e.select = false);
			this.isBusy = false;
		});
	}

	checkedChange(event, data, id) 
	{
		console.log("id-1", this.checkboxData[id-1])
		console.log("---------------------------------")

		if(this.CheckCount < 5)
		{
			this.CheckCount++;
			console.log("checkcount", this.CheckCount);
			if(event.value == true)
			{
				this.checkboxData[id-1].select = true
				console.log("checkboxdata completo", this.checkboxData[id-1]);
			}
			if(this.CheckCount == 5)
			{
				const checkAlert: AlertOptions = { 
					title: "FindEat",
					message: "Solo puedes escoger un máximo de 5 caracteristicas!",
					okButtonText: "Entendido",
					cancelable: false
				}
	
				alert(checkAlert).then(() => {
					this.CheckLimit = false;
				});
			}
		}
	}

	private getDeviceLocation(): Promise<any> {
		return new Promise((resolve, reject) => {
			Geolocation.enableLocationRequest().then(() => {
				Geolocation.getCurrentLocation({ timeout: 10000 }).then(location => {
					resolve(location);
				}).catch(error => {
					reject(error);
				});
			});
		});
	}

	public pushData(item) 
	{
		if((this.selectedData.indexOf(item) == -1) && this.selectedData.length <= 4) 
		{
			this.selectedData.push(item);
		}
		else 
		{
			console.log("ya está agregado");
		}
	}

	public spliceItem(index) 
	{
		this.selectedData.splice(index, 1);
		console.log(index);
	}

	public searchTag() 
	{
		let idarrayobj = [];
		if (this.selectedData.length == 0) 
		{
			alert("Por favor selecciona al menos una característica");
			return
		} 
		else 
		{
			for (const i of this.selectedData) 
			{
				let testobj = { id: i.id };
				idarrayobj.push(testobj);
			}
			console.log(idarrayobj);
			this.helper.searchByTags(idarrayobj).subscribe((resp: any,) => 
			{
				this.helper.ResultadoBusqueda = resp;

				this.routerEx.navigate(['searchResult'], {
					animated: true,
					transition:
					{
						name: 'fade',
						duration: 250,
						curve: 'linear'
					}
				});
			});
		}
	}


	public updateLocation() 
	{
		this.getDeviceLocation().then(result => {
			this.latitude = result.latitude;
			this.longitude = result.longitude;
			const ProfilePicAlert: AlertOptions = {
				title: "Tu ubicación",
				message: "tu latitud es " + result.latitude + " y su longitud " + result.longitude + ".",
				okButtonText: "OK",
				cancelable: false
			};

			alert(ProfilePicAlert);
		}, error => {
			console.error(error);
		});
	}

	public startWatchingLocation() 
	{
		this.watchId = Geolocation.watchLocation(location => {
			if (location) {
				this.zone.run(() => {
					this.latitude = location.latitude;
					this.longitude = location.longitude;
				});
			}
		}, error => {
			console.error(error);
		}, { updateDistance: 1, minimumUpdateTime: 1000 });
	}

	public stopWatchingLocation() 
	{
		if (this.watchId) {
			Geolocation.clearWatch(this.watchId);
			this.watchId = null;
		}
	}
}