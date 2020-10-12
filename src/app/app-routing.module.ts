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
import { ProfileRestaurantComponent } from "./profileRestaurant/profileRestaurant.component";

//resultado de bpusqueda
import { SearchResultComponent } from "./SearchResult/SearchResult.component";

// Reviews
import { newReviewComponent } from "./profileRestaurant/newReview.component";
import { reviewListComponent } from "./homeRestaurant/reviewList.component";
import { profileReviewList } from "./profileReviewList/profileReviewList.component";


const routes: Routes = [
    {path: "", redirectTo: "/login", pathMatch: "full"},
	{path: "login", component: LoginComponent},
	{path: "register/:id", component: RegisterComponent},
	{path: "home", component: HomeComponent},
    {path: "homeRestaurant/:id", component: homeRestaurantComponent},
    {path: "reviewList/:id", component: reviewListComponent },
	{path: "profileRestaurant/:id", component: ProfileRestaurantComponent },
    {path: "newReview/:id", component: newReviewComponent},
<<<<<<< Updated upstream
    {path: "profileReviewList/:id", component: profileReviewList},
    {path: "fotoPrueba", component: FotoComponent},
    {path: "searchResult/:idUser/:Resultado", component: SearchResultComponent}
=======
    {path: "profileReviewList/:id", component: profileReviewList}
>>>>>>> Stashed changes
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
