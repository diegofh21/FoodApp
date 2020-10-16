import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Config } from "../config";

@Injectable({
    providedIn: "root"
})
export class homeRestaurantService {
  //suponiendo que el array items es la respuesta de nuestra consulta a la base de datos 
  // intereses serían por ejemplo (hamburguesas y comida italiana), se devuelve este array

  constructor(private http: HttpClient) {}

  private items = [
    {
        id: 1,
        name: "Burguer Landia",
        profilePicture: "~/assets/images/hamburguesa.jpg",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
        caracteristicas:["hamburguesas", "Para niños", "Americana"],
        rate: 4.51,
        location: [10.5591979,-71.6215107]
        

    },{
        id: 2,
        name: "Pizzería La Romana",
        profilePicture: "~/assets/images/pizza.jpg",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
        caracteristicas:["Pizza", "Calzone", "Italiana"],
        rate: 5,
        location: [10.6764301,-71.6165829]
        

    },{
        id: 3,
        name: "Pasta Parmesano",
        profilePicture: "~/assets/images/pasta.jpg",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
        caracteristicas:["Pasta", "Italiana"],
        rate: 2,
        location: [10.6711271,-71.622708]

    }
];

private users = [
  {id: 1, name: "Antonio Gonzáles", profilePic: "~/assets/images/profile1.jpg" },
  {id: 2, name: "Juan Hernández", profilePic: "~/assets/images/profile2.jpg" },
  {id: 3, name: "Carmen Delgado", profilePic: "~/assets/images/profile3.jpg" }
]

private  reviews = [
  { id: 1,
    restID: 1,
    userID: 3,
    rate: 3,
    reviewText: "Fue muy buena la comida, las hamburguesas deliciosas, pero la atención no fue muy buena..",
    date: "12/09/2020, 10:00pm",
  },
  { id: 2,
    restID: 1,
    userID: 1,
    rate: 5,
    reviewText: "Espectacular, 100% recomendado",
    date: "12/09/2020, 10:00pm",
  },
  { id: 3,
    restID: 2,
    userID: 2,
    rate: 4,
    reviewText: "decente pizza buena atención.",
    date: "12/09/2020, 10:00pm",
  },
  { 
    id: 4,
    restID: 2,
    userID: 3,
    rate: 1,
    reviewText: "Tardaron mucho al servir la comida, estaba fría y nos cobraron de más.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 5,
    restID: 3,
    userID: 1,
    rate: 5,
    reviewText: "MAMMA MIA LA VERA PASTA  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 6,
    restID: 3,
    userID: 2,
    rate: 1,
    reviewText: "no venden pasta con mayonesa. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 7,
    restID: 1,
    userID: 3,
    rate: 2,
    reviewText: "meh, cualquier vaina el burguer queen Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 1,
    userID: 1,
    rate: 5,
    reviewText: "excelente burguer queen 5 estrella papa Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. ",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 2,
    userID: 2,
    rate: 4,
    reviewText: "decente pizza buena atención  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 2,
    userID: 3,
    rate: 1,
    reviewText: "no me gusto nada  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 3,
    userID: 1,
    rate: 5,
    reviewText: "MAMMA MIA LA VERA PASTA  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 3,
    userID: 2,
    rate: 1,
    reviewText: "no venden pasta con mayonesa. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 1,
    userID: 3,
    rate: 2,
    reviewText: "meh, cualquier vaina el burguer queen Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 1,
    userID: 1,
    rate: 5,
    reviewText: "excelente burguer queen 5 estrella papa Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. ",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 2,
    userID: 2,
    rate: 4,
    reviewText: "decente pizza buena atención  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 2,
    userID: 3,
    rate: 1,
    reviewText: "no me gusto nada  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 3,
    userID: 1,
    rate: 5,
    reviewText: "MAMMA MIA LA VERA PASTA  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 3,
    userID: 2,
    rate: 1,
    reviewText: "no venden pasta con mayonesa. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 1,
    userID: 3,
    rate: 2,
    reviewText: "meh, cualquier vaina el burguer queen Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 1,
    userID: 1,
    rate: 5,
    reviewText: "excelente burguer queen 5 estrella papa Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. ",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 2,
    userID: 2,
    rate: 4,
    reviewText: "decente pizza buena atención  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 2,
    userID: 3,
    rate: 1,
    reviewText: "no me gusto nada  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  {id: 1,
     restID: 3,
    userID: 1,
    rate: 5,
    reviewText: "MAMMA MIA LA VERA PASTA  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  },
  { id: 1,
    restID: 3,
    userID: 2,
    rate: 1,
    reviewText: "no venden pasta con mayonesa. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
    date: "12/09/2020, 10:00pm",
  }];

  
getProfiles() 
{
  return this.http.get(
    Config.apiUrl + '/registrar'
  );
}

getUsers(userID){

  return this.users.filter((user) => user.id === userID)[0];
}

getProfilebyID(id: number) {
    return this.items.filter((item) => item.id === id)[0];
}

getReviews(id: number) {
    return this.reviews.filter((review) => review.restID === id);
}

getReview(id: number) {
  return this.reviews.filter((review) => review.id === id)[0];
}

}
