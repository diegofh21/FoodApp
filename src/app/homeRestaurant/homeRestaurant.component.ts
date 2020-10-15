import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular';
import { Item } from "./item";
import { AuthService } from '../utils/servicios/auth.service';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { ActivatedRoute } from "@angular/router";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import * as email from "nativescript-email";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { GestureEventData } from "tns-core-modules/ui/gestures";
@Component({
  selector: "ns-items",
  templateUrl: "./homeRestaurant.component.html",
  styleUrls: ["./homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})
export class homeRestaurantComponent implements OnInit {
  composeOptions: email.ComposeOptions;
  profile;
  reviews;
  rate;
  star1;
  star2;
  star3;
  star4;
  star5;
  

  //imagen del post a subir
  actualPostSrc ="~/assets/images/prePostImage.png";

  //icono seleccionado actualmente
  home_actual = "~/assets/images/homerest_filled.png";
  review_actual = "~/assets/images/reviewIcon_empty.png";
  photo_actual = "~/assets/images/add_photo_empty.png";
  account_actual = "~/assets/images/user_config_empty.png";

  //iconos activados
  home_empty = "~/assets/images/homerest_empty.png";
  review_empty = "~/assets/images/reviewIcon_empty.png";
  photo_empty = "~/assets/images/add_photo_empty.png";
  account_empty = "~/assets/images/user_config_empty.png";
  //iconos desactivados
  home_filled = "~/assets/images/homerest_filled.png";
  review_filled = "~/assets/images/reviewIcon.png";
  photo_filled = "~/assets/images/add_photo_filled.png";
  account_filled = "~/assets/images/user_config_filled.png";


  constructor(private routerEx: RouterExtensions, private authService: AuthService, private itemService: homeRestaurantService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    this.profile = this.itemService.getProfilebyID(id);
    this.reviews = this.itemService.getReviews(id);


    this.star1 = "~/assets/images/1star.png";
    this.star2 = "~/assets/images/2star.png";
    this.star3 = "~/assets/images/3star.png";
    this.star4 = "~/assets/images/4star.png";
    this.star5 = "~/assets/images/5star.png";
    this.rate = 0;
    console.log(this.actualPostSrc);
  }



  switchView(tab) {
    switch (tab) {
      case "home": {
        this.home_actual = this.home_filled;
        this.review_actual = this.review_empty;
        this.photo_actual = this.photo_empty;
        this.account_actual = this.account_empty;
        break;
      }

      case "review": {
        this.home_actual = this.home_empty;
        this.review_actual = this.review_filled;
        this.photo_actual = this.photo_empty;
        this.account_actual = this.account_empty;
        break;
      }

      case "photo": {
        this.home_actual = this.home_empty;
        this.review_actual = this.review_empty;
        this.photo_actual = this.photo_filled;
        this.account_actual = this.account_empty;
        break;
      }


      case "account": {
        this.home_actual = this.home_empty;
        this.review_actual = this.review_empty;
        this.photo_actual = this.photo_empty;
        this.account_actual = this.account_filled;
        break;
      }
    }
  }

  reportReview(id) {
    var reviewData = this.itemService.getReview(id);
    var restaurante = this.itemService.getProfilebyID(reviewData.restID);
    var ActualUser = this.itemService.getUsers(reviewData.userID);


    dialogs.confirm({
      title: "Reportar reseña",
      message: "¿Desea reportar la reseña de " + ActualUser.name + "?",
      okButtonText: "Reportar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      // result argument is boolean
      if (result) {
        //aquí debería insertar los datos de la reseña en la tabla de reportes
        const mensaje: AlertOptions = {
          title: "La reseña fue reportada.",
          message: "Inspeccionaremos el contenido de la reseña. ¡Muchas gracias!",
          okButtonText: "OK",
          cancelable: false
        };

        alert(mensaje);
      }
      else {
        return
      }
      console.log("Dialog result: " + result);
    });

    /* this.composeOptions={
       to: ['ajperezm99@gmail.com'],
       subject: 'Reporte de una review a restaurante: '+ restaurante.name +'.',
       body: 'la review del usuario '+ ActualUser.name + ' id='+ ActualUser.id +' fue reportada. el contenido de la review es: '+ reviewData.reviewText + '.'
     }

     email.available().then(available=>{
       if (available){
         email.compose(this.composeOptions).then(result=>{console.log(result)}).catch(error=>{console.log(error)}
         )
     }}).catch(error=>{console.log(error)})
*/
  }

  Logout()
	{
		this.authService.tnsOauthLogout().then(() => {
			this.routerEx.back();
		}).catch(err => console.log("Error: " + err));
    }

  getStars(rate) {
    if (rate === 1) { return this.star1 }
    if (rate === 2) { return this.star2 }
    if (rate === 3) { return this.star3 }
    if (rate === 4) { return this.star4 }
    if (rate === 5) { return this.star5 }
  }
  getProfilepicURL(id) {
    var ActualUser = this.itemService.getUsers(id);
    return ActualUser.profilePic;
  }

  getNameUser(id) {
    var ActualUser = this.itemService.getUsers(id);
    return ActualUser.name;
  }


}
