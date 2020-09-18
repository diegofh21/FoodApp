import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { homeRestaurantComponent } from "./homeRestaurant/homeRestaurant.component";
import { reviewListComponent } from "./homeRestaurant/reviewList.component";

// Login
import { LoginComponent } from "./login/login.component";

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
			path: "register",
			component: RegisterComponent
		},
		{
			path: "home",
			component: HomeComponent
		},
    { 
			path: "homeRestaurant/:id", 
			component: homeRestaurantComponent 
		},
    { 
			path: "reviewList/:id", 
			component: reviewListComponent 
		}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
