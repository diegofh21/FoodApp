import { Injectable } from "@angular/core";

import { Item } from "../../homeRestaurant/item";

@Injectable({
    providedIn: "root"
})
export class homeRestaurantservice {
  //suponiendo que el array items es la respuesta de nuestra consulta a la base de datos 
  // intereses serían por ejemplo (hamburguesas y comida italiana), se devuelve este array
  private items = [
    {
        id: 1,
        name: "BurguerQueen",
        profilePicture: "~/assets/img/hamburguesa.jpg",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
        caracteristicas:["hamburguesas", "Para niños", "Americana"]
        

    },{
        id: 2,
        name: "Pizza Planeta",
        profilePicture: "~/assets/img/pizza.jpg",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
        caracteristicas:["Pizza", "Calzone", "Italiana"],
        

    },{
        id: 3,
        name: "PastaPasta",
        profilePicture: "~/assets/img/pasta.jpg",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea rem labore Lorem ipsum dolor sit amet.",
        caracteristicas:["Pasta", "Italiana"]

    }
];

private users = [{id: 1, name: "francesco virgolini"},
                 {id: 2, name: "pulpo paul"},
                 {id: 3, name: "esteban julio ricardo montolla"}]

private  reviews = [{ restID: 1,
    userID: 3,
    rate: 2,
    reviewText: "meh, cualquier vaina el burguer queen ",
    date: "12/09/2020, 10:00pm",
  },
  { restID: 1,
    userID: 1,
    rate: 5,
    reviewText: "excelente burguer queen 5 estrella papa ",
    date: "12/09/2020, 10:00pm",
  },
  { restID: 2,
    userID: 2,
    rate: 4,
    reviewText: "decente pizza buena atención ",
    date: "12/09/2020, 10:00pm",
  },
  { restID: 2,
    userID: 3,
    rate: 1,
    reviewText: "no me gusto nada ",
    date: "12/09/2020, 10:00pm",
  },
  { restID: 3,
    userID: 1,
    rate: 5,
    reviewText: "MAMMA MIA LA VERA PASTA ",
    date: "12/09/2020, 10:00pm",
  },
  { restID: 3,
    userID: 2,
    rate: 1,
    reviewText: "no venden pasta con mayonesa. ",
    date: "12/09/2020, 10:00pm",
  }];

    getProfiles() {
    return this.items;
}




getProfilebyID(id: number) {
    return this.items.filter((item) => item.id === id)[0];
}

getReviews(id: number) {
    return this.reviews.filter((review) => review.restID === id)[6];
}

}
