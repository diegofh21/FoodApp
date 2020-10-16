import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { ActivatedRoute } from "@angular/router";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import * as email from "nativescript-email";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { GestureEventData } from "tns-core-modules/ui/gestures";
import { UserService } from '../utils/servicios/user.service';
import { HelperService } from "../utils/servicios/helper.service";
@Component({
    selector: "ns-items",
    templateUrl: "./profileReviewList.component.html",
    styleUrls: ["../homeRestaurant/homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})
export class profileReviewList implements OnInit {
  composeOptions: email.ComposeOptions;
 foto;
   nombre;
   id;
   status="normal"
   cantidad=null;
    reviews;
    rate;
    star0;
    star1;
    star2;
    star3;
    star4;
    star5;

    constructor(private UserService: UserService,private itemService: homeRestaurantService,
        private route: ActivatedRoute, private Helper: HelperService) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.LoadData(id);
        this.foto = this.UserService.Datos_Restaurante.foto;
        this.nombre = this.UserService.Datos_Restaurante.name;
        this.id = this.UserService.Datos_Restaurante.id;
	      this.star0 = "~/assets/images/0star.png"
        this.star1 = "~/assets/images/1star.png";
        this.star2 = "~/assets/images/2star.png";
        this.star3 = "~/assets/images/3star.png"; 
        this.star4 = "~/assets/images/4star.png";
        this.star5 = "~/assets/images/5star.png";
        this.rate = 0;
    }


    reportReview(id, name){

      dialogs.confirm({
          title: "Reportar reseña",
          message: "¿Desea reportar la reseña de "+ name +"?",
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

    LoadData(id){
      this.status="loading"
     this.Helper.getReviews(id).subscribe((resp: any) => {
        console.log("se recibieron los datos");
        this.status="normal"
        this.reviews = resp;
        for (const i in this.reviews) {
          this.cantidad=i;
        }
        if(this.cantidad==null){
          this.cantidad=-1;
        }

      });
    }

	 getStars(rate){
		if (rate<=0.49){return this.star0} 
		if ((rate>=0.5)&&(rate<=1.49)){return this.star1}
		if ((rate>=1.5) && (rate <= 2.49)){return this.star2}
		if ((rate>=2.5) && (rate <= 3.49)){return this.star3}
		if ((rate>=3.5) && (rate <= 4.49)){return this.star4}
		if (rate>=4.5){return this.star5}
	  }
}