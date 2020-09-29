import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

// Login
import { LoginComponent } from "./login/login.component";

// Registro
import { RegisterComponent } from "./register/register.component";

// Inicios
import { HomeComponent } from "./home/home.component";
import { homeRestaurantComponent } from "./homeRestaurant/homeRestaurant.component";

// Reviews
import { reviewListComponent } from "./homeRestaurant/reviewList.component";

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
			path: "register/:id",
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
