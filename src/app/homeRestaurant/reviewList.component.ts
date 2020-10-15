import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";
import { Item } from "./item";
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";


@Component({
    selector: "ns-details",
    templateUrl: "./reviewList.component.html",
    styleUrls: ["./homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})
export class reviewListComponent implements OnInit {
    profile;
    reviews;
    rate;
    starURL1;
    starURL2;
    starURL3;
    starURL4;
    starURL5;


    constructor(
        private itemService: homeRestaurantService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.profile = this.itemService.getProfilebyID(id);
        this.reviews = this.itemService.getReviews(id);
        this.starURL1 = "~/assets/images/star-empty.png";
        this.starURL2 = "~/assets/images/star-empty.png";
        this.starURL3 = "~/assets/images/star-empty.png";
        this.starURL4 = "~/assets/images/star-empty.png";
        this.starURL5 = "~/assets/images/star-empty.png";
        this.rate = 0;
    }

    starRate(n){
        switch(n) { 
            case 1: { 
               this.starURL1 = "~/assets/images/star-filled.png"
               this.starURL2 = "~/assets/images/star-empty.png";
               this.starURL3 = "~/assets/images/star-empty.png";
               this.starURL4 = "~/assets/images/star-empty.png";
               this.starURL5 = "~/assets/images/star-empty.png";
               this.rate = 1;
               break; 
            } 
            case 2: { 
                this.starURL1 = "~/assets/images/star-filled.png"
                this.starURL2 = "~/assets/images/star-filled.png";
                this.starURL3 = "~/assets/images/star-empty.png";
                this.starURL4 = "~/assets/images/star-empty.png";
                this.starURL5 = "~/assets/images/star-empty.png";
                this.rate = 2;
               break; 
            } 
            case 3: { 
                this.starURL1 = "~/assets/images/star-filled.png"
                this.starURL2 = "~/assets/images/star-filled.png";
                this.starURL3 = "~/assets/images/star-filled.png";
                this.starURL4 = "~/assets/images/star-empty.png";
                this.starURL5 = "~/assets/images/star-empty.png";
                this.rate = 3;
                break; 
             } 
             case 4: { 
                this.starURL1 = "~/assets/images/star-filled.png"
                this.starURL2 = "~/assets/images/star-filled.png";
                this.starURL3 = "~/assets/images/star-filled.png";
                this.starURL4 = "~/assets/images/star-filled.png";
                this.starURL5 = "~/assets/images/star-empty.png"; 
                this.rate = 4;
                break; 
             } 
             case 5: { 
                this.starURL1 = "~/assets/images/star-filled.png"
                this.starURL2 = "~/assets/images/star-filled.png";
                this.starURL3 = "~/assets/images/star-filled.png";
                this.starURL4 = "~/assets/images/star-filled.png";
                this.starURL5 = "~/assets/images/star-filled.png";
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
