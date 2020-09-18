import { Component, OnInit } from "@angular/core";
import { getViewById } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular';
import { Item } from "./item";
import { homeRestaurantservice } from "../utils/servicios/homeRestaurant.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "ns-items",
    templateUrl: "./homeRestaurant.component.html",
    styleUrls: ["./homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})
export class homeRestaurantComponent implements OnInit {
    profile;
    


    constructor(private itemService: homeRestaurantservice,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.profile = this.itemService.getProfilebyID(id);
    }


}
