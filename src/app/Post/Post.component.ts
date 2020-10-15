import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
//import { TextField } from 'ui/text-field';
//import { EventData } from 'data/observable';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from "../utils/servicios/helper.service";
import { UserService } from '../utils/servicios/user.service';
@Component({
	selector: 'Post',
	templateUrl: './Post.component.html',
	styleUrls: ['./Post.component.css']
})

export class PostComponent implements OnInit {

	constructor(private UserService: UserService, private Helper: HelperService,private route: ActivatedRoute) { }
id;
post;
RestPic;
actualPost;
	ngOnInit() {
		this.id = +this.route.snapshot.params.id;
		console.log("se pedirán los datos");
		this.RestPic = this.UserService.Datos_Restaurante.foto;
		this.post = this.UserService.Datos_Post;
	 }


	  public addUrl(b){
		const a = "https://www.arpicstudios.com/api/publicaciones/"+ b;
		return a;		
	}
	
}