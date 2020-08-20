import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";

// Logins
import { LoginComponent } from "./login/login.component";
import { LoginRestaurantComponent } from './loginRestaurant/loginRestaurant.component';

// Registro
import { RegisterComponent } from "./register/register.component";

// Inicio
import { HomeComponent } from "./home/home.component";


const routes: Routes = [
    { 
			path: "", 
			redirectTo: "/login", 
			pathMatch: "full" 
		},
		{
			path: "login",
			component: LoginComponent
		},
		{
			path: 'loginRestaurant',
			component: LoginRestaurantComponent
		},
		{
			path: "register",
			component: RegisterComponent
		},
		{
			path: "home",
			component: HomeComponent
		},
    { 
			path: "items", 
			component: ItemsComponent 
		},
    { 
			path: "item/:id", 
			component: ItemDetailComponent 
		}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
