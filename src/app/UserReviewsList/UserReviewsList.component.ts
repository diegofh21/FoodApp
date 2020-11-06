import { Component, OnInit } from '@angular/core';
//import { RouterExtensions } from 'nativescript-angular';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
import { RouterExtensions } from 'nativescript-angular';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ActivatedRoute } from '@angular/router';
import { alert, AlertOptions, confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { UserService } from "../utils/servicios/user.service";
//import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'UserReviewsList',
	templateUrl: './UserReviewsList.component.html',
	styleUrls: ["../homeRestaurant/homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})

export class UserReviewsListComponent implements OnInit {

	constructor(private routerEx: RouterExtensions, private routeAct: ActivatedRoute, private userService: UserService) { }
id;
foto;
nombre;
reviews;
cantidad;
    rate;
    star0;
    star1;
    star2;
    star3;
    star4;
	star5;
	  status="normal"
	ngOnInit() {
		this.star0 = "~/assets/images/0estrellas.png"
        this.star1 = "~/assets/images/1estrellas.png";
        this.star2 = "~/assets/images/2estrellas.png";
        this.star3 = "~/assets/images/3estrellas.png"; 
        this.star4 = "~/assets/images/4estrellas.png";
        this.star5 = "~/assets/images/5estrellas.png";
		this.rate = 0;
		this.foto=this.userService.Datos_Usuario.foto;
		this.nombre=this.userService.Datos_Usuario.name;
		this.id = +this.routeAct.snapshot.params.id;
this.status="loading"
		this.userService.getUserReviews(this.id).subscribe((resp: any) => {
			console.log(resp);
			this.reviews = resp;
			this.status="normal"
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
	
	options(review){
		dialogs.action({
			message: "Opciones de la reseña",
			cancelButtonText: "Cancelar",
			actions: ["Editar", "Eliminar"]
		}).then(result => {
			console.log("Dialog result: " + result);
			if(result == "Editar"){
				alert("aquí te mando a editar tu basura")
				this.userService.editReviewData.contenido = review.contenido;
				this.userService.editReviewData.rating = review.rating;
				this.userService.Datos_Restaurante.name = review.nameRestaurante;
				this.routerEx.navigate(['editReview/', review.id], {
					animated: true,
					transition:
					{	name: 'fade',
						duration: 250,
						curve: 'linear'
					}
				});
			}else if(result == "Eliminar"){
				dialogs.confirm({
					title: "¿Eliminar reseña?",
					message: ""+ review.rating +" estrellas a "+ review.nameRestaurante +" y escribió: " + review.contenido + ".",
					okButtonText: "Eliminar",
					cancelButtonText: "Cancelar"
				}).then(result => {
					// result argument is boolean
					if(result){
					  //aquí se elimina la reseña
					  this.userService.deleteRevew(review.id).subscribe((resp: any) => {
						  alert("La reseña fue eliminada")
						  this.routerEx.navigate(['UserReviews/', review.userID], {
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
					else{
					  return
					}
				});
			}
		});
    
}

	
}
