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

//resultado de busqueda
import { SearchResultComponent } from "./SearchResult/SearchResult.component";

// Reviews
import { newReviewComponent } from "./profileRestaurant/newReview.component";
import { reviewListComponent } from "./homeRestaurant/reviewList.component";
import { profileReviewList } from "./profileReviewList/profileReviewList.component";
import { UserReviewsListComponent } from "./UserReviewsList/UserReviewsList.component";
import { EditReviewComponent } from "./editReview/editReview.component";

//Post
import { PostComponent } from "./Post/Post.component";

// Tutorial
import { TutorialComponent } from "./tutorial/tutorial.component";


const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register/:id", component: RegisterComponent },
    { path: "home/:id", component: HomeComponent },
    { path: "homeRestaurant/:id", component: homeRestaurantComponent },
    { path: "reviewList/:id", component: reviewListComponent },
    { path: "profileRestaurant/:id", component: ProfileRestaurantComponent },
    { path: "newReview/:id", component: newReviewComponent },
    { path: "profileReviewList/:id", component: profileReviewList },
    { path: "Post/:id", component: PostComponent },
    { path: "searchResult", component: SearchResultComponent },
    { path: "UserReviews/:id", component: UserReviewsListComponent },
    { path: "editReview/:id", component: EditReviewComponent },
    { path: "tutorial/:id", component: TutorialComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
