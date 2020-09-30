import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";

import { homeRestaurantservice } from "../utils/servicios/homeRestaurant.service";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";


@Component({
    selector: "ns-details",
    templateUrl: "./newReview.component.html",
	styleUrls: ['./profileRestaurant.component.css']
})
export class newReviewComponent implements OnInit {
    profile;
    rate;
    starURL1;
    starURL2;
    starURL3;
    starURL4;
    starURL5;
    starEmpty = "~/assets/images/star-empty.png";
    starFilled ="~/assets/images/star-filled.png";
    constructor(
        private itemService: homeRestaurantservice,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.profile = this.itemService.getProfilebyID(id);
        this.starURL1 = this.starEmpty;
        this.starURL2 = this.starEmpty;
        this.starURL3 = this.starEmpty;
        this.starURL4 = this.starEmpty;
        this.starURL5 = this.starEmpty;
        this.rate = 0;
    }

    starRate(n){
        switch(n) { 
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

    postear()
	{
		const postearAlert: AlertOptions =
		{
			title: "Nueva Reseña",
			message: "Le diste "+ this.rate +" estrellas a "+ this.profile.name +".",
			okButtonText: "OK",
			cancelable: false
		};

    alert(postearAlert);
  }
}
