import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular';
import { homeRestaurantservice } from "../utils/servicios/homeRestaurant.service";
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
    templateUrl: "./profileReviewList.component.html",
    styleUrls: ["../homeRestaurant/homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})
export class profileReviewList implements OnInit {
  composeOptions: email.ComposeOptions;
    profile;
     reviews;
    rate;
    star1;
    star2;
    star3;
    star4;
    star5;

    constructor(private itemService: homeRestaurantservice,
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
    }


    reportReview(id){
      var reviewData = this.itemService.getReview(id);
      var restaurante = this.itemService.getProfilebyID(reviewData.restID);
      var ActualUser =  this.itemService.getUsers(reviewData.userID);

      
      dialogs.confirm({
          title: "Reportar reseña",
          message: "¿Desea reportar la reseña de "+ ActualUser.name +"?",
          okButtonText: "Reportar",
          cancelButtonText: "Cancelar"
      }).then(result => {
          // result argument is boolean
          if(result){
            //aquí debería insertar los datos de la reseña en la tabla de reportes
            const mensaje: AlertOptions = {
              title: "La reseña fue reportada.",
              message: "Inspeccionaremos el contenido de la reseña. ¡Muchas gracias!",
              okButtonText: "OK",
              cancelable: false
            };

            alert(mensaje);
          }
          else{
            return
          }
          console.log("Dialog result: " + result);
      });
    }

    getStars(rate){
      if (rate===1){return this.star1}
      if (rate===2){return this.star2}
      if (rate===3){return this.star3}
      if (rate===4){return this.star4}
      if (rate===5){return this.star5}
    }
    
  getProfilepicURL(id){
    var ActualUser =  this.itemService.getUsers(id);
    return ActualUser.profilePic;
  }

  getNameUser(id){
    var ActualUser =  this.itemService.getUsers(id);
    return ActualUser.name;
  }


}