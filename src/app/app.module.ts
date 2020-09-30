import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { homeRestaurantComponent } from "./homeRestaurant/homeRestaurant.component";
import { reviewListComponent } from "./homeRestaurant/reviewList.component";
import { homeRestaurantservice } from './utils/servicios/homeRestaurant.service';

// Login
import { LoginComponent } from "./login/login.component";

// Registro
import { RegisterComponent } from "./register/register.component";

// Inicio
import { HomeComponent } from "./home/home.component";

// Servicios
import { AuthService } from './utils/servicios/auth.service';

import {ProfileRestaurantComponent} from './profileRestaurant/profileRestaurant.component';
import { newReviewComponent } from "./profileRestaurant/newReview.component";
import { profileReviewList } from "./profileReviewList/profileReviewList.component";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        AppRoutingModule,
        TNSCheckBoxModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        homeRestaurantComponent,
        reviewListComponent,
        ProfileRestaurantComponent,
        newReviewComponent,
        profileReviewList
    ],
    providers: [AuthService, homeRestaurantservice],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
