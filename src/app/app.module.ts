import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// Login
import { LoginComponent } from "./login/login.component";

// Registro
import { RegisterComponent } from "./register/register.component";

// USUARIO
import { HomeComponent } from "./home/home.component";

// RESTAURANTES
import { homeRestaurantComponent } from "./homeRestaurant/homeRestaurant.component";
import { ProfileRestaurantComponent } from './profileRestaurant/profileRestaurant.component';

// REVIEWS
import { reviewListComponent } from "./homeRestaurant/reviewList.component";
import { newReviewComponent } from "./profileRestaurant/newReview.component";
import { profileReviewList } from "./profileReviewList/profileReviewList.component";

//resultado de búsqueda
import { SearchResultComponent } from "./SearchResult/SearchResult.component";

// Servicios
import { AuthService } from './utils/servicios/auth.service';
import { UserService } from './utils/servicios/user.service';
import { HelperService } from './utils/servicios/helper.service';
import { homeRestaurantservice } from './utils/servicios/homeRestaurant.service';

import { FotoComponent } from './pruebaFoto/foto.component';

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
        profileReviewList,
        FotoComponent,
        SearchResultComponent
    ],
    providers: [AuthService, UserService, homeRestaurantservice, HelperService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
