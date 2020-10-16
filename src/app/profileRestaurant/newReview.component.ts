import { Component, OnInit } from "@angular/core";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ActivatedRoute } from "@angular/router";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from 'nativescript-angular';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { UserService } from '../utils/servicios/user.service';
import { HelperService } from '../utils/servicios/helper.service'

@Component({
    selector: "ns-details",
    templateUrl: "./newReview.component.html",
    styleUrls: ['./profileRestaurant.component.css']
})
export class newReviewComponent implements OnInit {
    foto;
    nombre;
    user_id;
    id;
    rate;
    status="normal";
    reviewText;
    starURL1;
    starURL2;
    starURL3;
    starURL4;
    starURL5;
    starEmpty = "~/assets/images/star-empty.png";
    starFilled = "~/assets/images/star-filled.png";
    constructor(private UserService: UserService,
        private Helper: HelperService,
        private route: ActivatedRoute,
        private routerEx: RouterExtensions,
    ) { }

    ngOnInit(): void {
        this.foto = this.UserService.Datos_Restaurante.foto;
        this.nombre = this.UserService.Datos_Restaurante.name;
        this.id = this.UserService.Datos_Restaurante.id;
        this.user_id = this.UserService.Datos_Usuario.id;
        this.starURL1 = this.starEmpty;
        this.starURL2 = this.starEmpty;
        this.starURL3 = this.starEmpty;
        this.starURL4 = this.starEmpty;
        this.starURL5 = this.starEmpty;
        this.rate = 0;
        this.reviewText = "";
    }

    starRate(n) {
        switch (n) {
            case 1: {
                this.starURL1 = this.starFilled;
                this.starURL2 = this.starEmpty;
                this.starURL3 = this.starEmpty;
                this.starURL4 = this.starEmpty;
                this.starURL5 = this.starEmpty;
                this.rate = 1;
                break;
            }
            case 2: {
                this.starURL1 = this.starFilled
                this.starURL2 = this.starFilled;
                this.starURL3 = this.starEmpty;
                this.starURL4 = this.starEmpty;
                this.starURL5 = this.starEmpty;
                this.rate = 2;
                break;
            }
            case 3: {
                this.starURL1 = this.starFilled
                this.starURL2 = this.starFilled;
                this.starURL3 = this.starFilled;
                this.starURL4 = this.starEmpty;
                this.starURL5 = this.starEmpty;
                this.rate = 3;
                break;
            }
            case 4: {
                this.starURL1 = this.starFilled
                this.starURL2 = this.starFilled;
                this.starURL3 = this.starFilled;
                this.starURL4 = this.starFilled;
                this.starURL5 = this.starEmpty;
                this.rate = 4;
                break;
            }
            case 5: {
                this.starURL1 = this.starFilled
                this.starURL2 = this.starFilled;
                this.starURL3 = this.starFilled;
                this.starURL4 = this.starFilled;
                this.starURL5 = this.starFilled;
                this.rate = 5;
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
    }

    postear() {
        if (this.reviewText == "") {
            alert("Por favor, escribe algo en la reseña.");
        } else if (this.rate == 0) {
            alert("Por favor, toca las estrellas para establecer tu puntuación del 1 al 5");
        } else {
            //aquí se envían los datos de la reseña a la api
            let data = {
                restID: this.id,
                userID: this.user_id,
                contenido: this.reviewText,
                rating: this.rate
            }
            dialogs.confirm({
                title: "Nueva Reseña",
                message: "Calificación de " + this.rate + " estrellas a " + this.nombre + ": ''" + this.reviewText + "'' en la reseña.",
                okButtonText: "Publicar",
                cancelButtonText: "Cancelar"
            }).then(result => {
                // result argument is boolean
                if (result) {
                    //aquí debería insertar los datos de la reseña en la tabla de reportes
                    this.status ="loading"
                    this.Helper.NewReview(data).subscribe((resp: any) => {
                        this.status ="normal";
                        alert("La reseña fue publicada!")
                        this.routerEx.navigate(['profileRestaurant/', this.id], {
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
                else {
                    return
                }
            });

        }
    }
}
