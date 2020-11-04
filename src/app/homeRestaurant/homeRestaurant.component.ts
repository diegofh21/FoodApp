import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute } from "@angular/router";
import { alert, AlertOptions, confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import * as email from "nativescript-email";
import * as imagepicker from "nativescript-imagepicker";
import * as bghttp from "nativescript-background-http";
import * as fs from "tns-core-modules/file-system";
import { ImageSource } from 'tns-core-modules/image-source';
import { exit } from 'nativescript-exit';

import { Config } from '../utils/config';
import { HttpClient } from '@angular/common/http';

// SERVICIOS
import { AuthService } from '../utils/servicios/auth.service';
import { homeRestaurantService } from "../utils/servicios/homeRestaurant.service";
import { UserService } from "../utils/servicios/user.service";
import { HelperService } from "../utils/servicios/helper.service";

@Component({
  selector: "ns-items",
  templateUrl: "./homeRestaurant.component.html",
  styleUrls: ["./homeRestaurant.component.css", "../../assets/css/margin-padding.css"]
})
export class homeRestaurantComponent implements OnInit {
  composeOptions: email.ComposeOptions;

  public id: number;
  public status: 'profile' | 'post' | 'review' | 'editCaracteristicas' | 'loading' = 'profile';
  public profile = {
    name: '',
    email: '',
    rif: '',
    descripcion: '',
    latitud: 0,
    longitud: 0,
    foto: '',
    posts: [],
    caracteristicas: undefined,
    rating: 0
  };
  public isBusy: boolean = false;
  public BtnDispo: boolean = true;
  public CheckCount: number = 0;
  public CheckLimit: boolean = true;
  public checkboxData: any = [];

  public errorCount: number = 0;

  // VARIABLES PARA LAS FOTOS
  public bstring = "";
  public saveImage = "";
  public userImage = "";
  public picHeight = 0;
  public imagen = null;
  public finalPath = null;
  public respCode = 0
  public descripcionPost: string = '';
  public postID

  reviews;
  rate;
  star0;
  star1;
  star2;
  star3;
  star4;
  star5;


  //imagen del post a subir
  actualPostSrc = "~/assets/images/prePostImage.png";

  //icono seleccionado actualmente
  home_actual = "~/assets/images/homerest_filled.png";
  review_actual = "~/assets/images/reviewIcon_empty.png";
  photo_actual = "~/assets/images/add_photo_empty.png";
  account_actual = "~/assets/images/user_config_empty.png";

  //iconos activados
  home_empty = "~/assets/images/homerest_empty.png";
  review_empty = "~/assets/images/reviewIcon_empty.png";
  photo_empty = "~/assets/images/add_photo_empty.png";
  account_empty = "~/assets/images/user_config_empty.png";
  //iconos desactivados
  home_filled = "~/assets/images/homerest_filled.png";
  review_filled = "~/assets/images/reviewIcon.png";
  photo_filled = "~/assets/images/add_photo_filled.png";
  account_filled = "~/assets/images/user_config_filled.png";


  constructor(private routerEx: RouterExtensions, private authService: AuthService, private itemService: homeRestaurantService, private route: ActivatedRoute, private userService: UserService, private helper: HelperService) {
    // this.fechaPost = this.datePipe.transform(this.fechaPost, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    console.log("el id recogido para homeRestaurant es", this.id)
    this.getUserInfo(this.id);
    this.getCheckboxData();
    this.reviews = this.itemService.getReviews(this.id);

    this.star0 = "~/assets/images/0estrellas.png";
    this.star1 = "~/assets/images/1estrellas.png";
    this.star2 = "~/assets/images/2estrellas.png";
    this.star3 = "~/assets/images/3estrellas.png";
    this.star4 = "~/assets/images/4estrellas.png";
    this.star5 = "~/assets/images/5estrellas.png";
    this.rate = 0;
    // console.log(this.actualPostSrc);
  }

  getUserInfo(id) {
    this.userService.getUserInfo(id).subscribe((resp: any) => {

      console.log("------------------------------------------")
      console.log("resp esssssssssss", JSON.stringify(resp));
      console.log("------------------------------------------")
      // Se guarda la data en el servicio
      this.userService.Datos_Restaurante.id = this.id;
      this.userService.Datos_Restaurante.name = this.profile.name = resp.restaurantName;
      this.userService.Datos_Restaurante.rif = this.profile.rif = resp.rif;
      this.userService.Datos_Restaurante.email = this.profile.email = resp.email;
      this.userService.Datos_Restaurante.descripcion = this.profile.descripcion = resp.descripcion;
      this.userService.Datos_Restaurante.latitud = this.profile.latitud = resp.latitud;
      this.userService.Datos_Restaurante.longitud = this.profile.longitud = resp.longitud;
      this.userService.Datos_Restaurante.foto = this.profile.foto = resp.ruta;
      this.userService.Datos_Restaurante.posts = this.profile.posts = resp.fotos;
      this.userService.Datos_Restaurante.caracteristicas = this.profile.caracteristicas = resp.caracteristicas
      this.userService.Datos_Restaurante.rating = this.profile.rating = resp.rating

      console.log("------------------------------------------")
      console.log("fotos", this.userService.Datos_Restaurante.posts)
    },
      (error) => {
        console.log("error", error)
        console.log("error status", error.status)
      });
  }

  switchView(tab) {
    switch (tab) {
      case "home": {
        this.home_actual = this.home_filled;
        this.review_actual = this.review_empty;
        this.photo_actual = this.photo_empty;
        this.account_actual = this.account_empty;
        this.getUserInfo(this.id);
        this.status = 'loading';
        setTimeout(() => {
          this.status = 'profile';
        }, 1000);
        break;
      }

      case "review": {
        this.home_actual = this.home_empty;
        this.review_actual = this.review_filled;
        this.photo_actual = this.photo_empty;
        this.account_actual = this.account_empty;
        this.status = 'loading';
        if (this.finalPath != null) {
          this.saveImage = "";
        }
        setTimeout(() => {
          this.status = 'review';
        }, 1000);
        break;
      }

      case "photo": {
        this.home_actual = this.home_empty;
        this.review_actual = this.review_empty;
        this.photo_actual = this.photo_filled;
        this.account_actual = this.account_empty;
        this.status = 'loading';
        setTimeout(() => {
          this.status = 'post'
        }, 1000);
        break;
      }

      case "account": {
        this.home_actual = this.home_empty;
        this.review_actual = this.review_empty;
        this.photo_actual = this.photo_empty;
        this.account_actual = this.account_filled;
        break;
      }
    }
  }

  reportReview(id) {
    var reviewData = this.itemService.getReview(id);
    var restaurante = this.itemService.getProfilebyID(reviewData.restID);
    var ActualUser = this.itemService.getUsers(reviewData.userID);

    const reportReview: ConfirmOptions = {
      title: "Reportar reseña",
      message: "¿Desea reportar la reseña de " + ActualUser.name + "?",
      okButtonText: "Reportar",
      cancelButtonText: "Cancelar"
    }

    confirm(reportReview).then((result) => {
      if (result) {
        const mensaje: AlertOptions = {
          title: "La reseña fue reportada.",
          message: "Inspeccionaremos el contenido de la reseña. ¡Muchas gracias!",
          okButtonText: "OK",
          cancelable: false
        };

        alert(mensaje);
      }
    })

    /* this.composeOptions={
       to: ['ajperezm99@gmail.com'],
       subject: 'Reporte de una review a restaurante: '+ restaurante.name +'.',
       body: 'la review del usuario '+ ActualUser.name + ' id='+ ActualUser.id +' fue reportada. el contenido de la review es: '+ reviewData.reviewText + '.'
     }

     email.available().then(available=>{
       if (available){
         email.compose(this.composeOptions).then(result=>{console.log(result)}).catch(error=>{console.log(error)}
         )
     }}).catch(error=>{console.log(error)})
*/
  }

  Logout() {
    const logoutAlert: ConfirmOptions = {
      title: "FindEat",
      message: "❌¿Estás seguro de cerrar sesión?❌",
      okButtonText: "Si",
      cancelButtonText: "No",
      cancelable: false
    };

    confirm(logoutAlert).then((result) => {
      if (result == true) {
        console.log("logout es", result);
        this.authService.tnsOauthLogout().then(() => {
          this.routerEx.back();
        }).catch(err => console.log("Error: " + err));
      }
    });
  }

  getStars(rate) {
    if (rate === 0) { return this.star0 }
    if (rate === 1) { return this.star1 }
    if (rate === 2) { return this.star2 }
    if (rate === 3) { return this.star3 }
    if (rate === 4) { return this.star4 }
    if (rate === 5) { return this.star5 }
  }
  getProfilepicURL(id) {
    var ActualUser = this.itemService.getUsers(id);
    return ActualUser.profilePic;
  }

  getNameUser(id) {
    var ActualUser = this.itemService.getUsers(id);
    return ActualUser.name;
  }

  public addUrl(b) {
    const a = "https://novakaelum.com/api/public_html/storage/" + b;
    return a;
  }

  getCheckboxData() {
    this.isBusy = true
    this.helper.getCaracteristicas().subscribe((resp: any) => {
      this.checkboxData = resp;
      this.checkboxData.forEach(e => e.select = false);
      this.isBusy = false;
    },
      (error) => {
        console.log("error", error)
        console.log("error status", error.status)
      });
  }

  checkedChange(event, data, id) {
    console.log("id-1", this.checkboxData[id - 1])
    console.log("---------------------------------")

    if (this.CheckCount < 5) {
      this.CheckCount++;
      console.log("checkcount", this.CheckCount);
      if (event.value == true) {
        this.checkboxData[id - 1].select = true
        console.log("checkboxdata completo", this.checkboxData[id - 1]);
      }
      if (this.CheckCount == 5) {
        const checkAlert: AlertOptions = {
          title: "FindEat",
          message: "Solo puedes escoger un máximo de 5 caracteristicas!",
          okButtonText: "Entendido",
          cancelable: false
        }

        alert(checkAlert).then(() => {
          this.CheckLimit = false;
        });
      }
    }
  }

  cancelUpdate() {
    this.status = 'loading';
    const cancelAlert: ConfirmOptions = {
      title: "FindEat",
      message: "¿Deseas cancelar el proceso?",
      okButtonText: "Si",
      cancelButtonText: "No",
      cancelable: false
    };

    confirm(cancelAlert).then((result) => {
      if (result == true) {
        this.status = 'profile';
        this.CheckCount = 0;
      }
    });
  }

  updateCaracteristicas() {
    this.isBusy = true;
    this.BtnDispo = false;
    this.CheckLimit = true;
    this.CheckCount = 0;

    const updateAlert: AlertOptions = {
      title: 'FindEat',
      message: 'Actualizando tus intereses, espera un momento por favor⏳.',
      okButtonText: 'Entendido',
      cancelable: false
    }

    alert(updateAlert).then(() => {
      this.status = 'loading';
      var Caracteristicas = this.checkboxData.filter(e => e.select === true);

      let caracteristicasUsuario = {
        userID: this.id,
        caracteristicasID: Caracteristicas
      };

      console.log("caracteristicas", caracteristicasUsuario);

      this.userService.storeCaracteristicas(caracteristicasUsuario).subscribe((resp: any) => {
        console.log("caracteristicas de restaurante actualizadas bajo el id:", caracteristicasUsuario.userID);

        if (caracteristicasUsuario.userID != null || undefined) {
          // Guardamos las caracteristicas en el servicio (caché)
          this.userService.Datos_Usuario.caracteristicas = Caracteristicas;
          const updateAlert: AlertOptions =
          {
            title: "FindEat",
            message: "¡Intereses actualizados!\nA continuación vas a ser redireccionado a tu perfil.",
            okButtonText: "¡Gracias!",
            cancelable: false
          }

          alert(updateAlert).then(() => {
            this.isBusy = false;
            this.BtnDispo = true;
            this.getUserInfo(this.id);
            this.status = 'profile';
          })
        }
      },
        (error) => {
          console.log("El codigo HTTP obtenido es", error.status)
          console.log("errorCount", this.errorCount);
          switch (error.status) {
            // INTERNAL SERVER ERROR
            case 500:
              this.errorCount++;
              const error500: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error interno del servidor, por favor intente nuevamente',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error500).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error500Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error500Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            // BAD GATEWAY
            case 502:
              this.errorCount++;
              const error502: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, el servidor encontró un error temporal y no pudo completar su solicitud\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error502).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error502Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error502Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            // SERVICE UNAVAILABLE (SERVICIO NO DISPONIBLE)
            case 503:
              this.errorCount++;
              const error503: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, el servidor no puede responder a la petición del navegador porque está congestionado o está realizando tareas de mantenimiento.\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error503).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error503Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error503Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            // GATEWAY TIMEOUT
            case 504:
              this.errorCount++;
              const error504: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, el servidor no pudo completar su solicitud dentro del período de tiempo establecido.\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error504).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                })
              }
              else {
                const error504Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error504Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            case 0:
              this.errorCount++;
              const error0: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, la aplicación no se ha podido conectar con el servidor.\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error0).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error0Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error0Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;
          }
        });
    });
  }

  // METODO PARA AGREGAR UNA PUBLICACIÓN
  choosePic() {
    this.isBusy = true;
    var milliseconds = (new Date).getTime();
    var that = this;
    let context = imagepicker.create({
      mode: "single"
    });
    context
      .authorize()
      .then(function () {
        return context.present();
      }).then(function (selection) {
        selection.forEach(function (selected) {
          const imgPhoto = new ImageSource();
          imgPhoto.fromAsset(selected).then((imgSrc) => {
            if (imgSrc) {
              that.bstring = imgSrc.toBase64String("jpg");
              const mil = new Date().getTime();
              const folder = fs.knownFolders.documents();
              const path = fs.path.join(folder.path, `SaveImage${mil}.png`);
              that.imagen = imgPhoto.saveToFile(path, "png");
              console.log(that.imagen);
              that.saveImage = path;
              that.picHeight = imgSrc.height;
              that.finalPath = folder;
            }
            else {
              alert("El directorio de la imagen esta mal.");
            }
          });
        });
      }).catch(function (e) {
        console.log(e);
      });
    this.isBusy = false;
  }

  savePicture(e) {
    console.log("entre a savepicture")
    const imageString = e;

    const data =
    {
      foto: imageString,
      Description: "ff",
    };

    var session = bghttp.session("file-upload");
    var request = {
      url: Config.apiUrl + '/fotoPublicacion',
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "File-Name": "photo.png"
      },
      description: "{ 'uploading': " + "photo.png" + " }"
    };
    let params = [
      { name: "id", value: this.userService.Datos_Post.id },
      { name: "foto", mimeType: "image/jpeg", filename: this.saveImage }
    ];
    console.log(params)
    // Se guarda la imagen en el servicio (caché para probar si sirve posteriormente)
    // this.userService.Datos_Restaurante.posts;
    var task = session.multipartUpload(params, request);
    task.on("progress", logEvent);
    task.on("error", logEvent);
    task.on("complete", logEvent);
    task.on("responded", logEvent);
    task.on("cancelled", logEvent);
    function logEvent(e) {
      // console.log(e);
      console.log("----------------");
      console.log('Status: ' + e.eventName);
      if (e.totalBytes !== undefined) {
        console.log('current bytes transfered: ' + e.currentBytes);
        console.log('Total bytes to transfer: ' + e.totalBytes);
      }
      console.log("EL RESPONSE CODE ES: ", e.responseCode);
      this.respCode = e.responseCode;
    }
  }

  uploadPost() {
    let postData = {
      id: this.id,
      titulo: this.profile.name,
      descripcion: this.descripcionPost
    }

    if (this.finalPath != null) {
      this.helper.uploadPost(postData).subscribe((resp: any) => {
        console.log("resp es", resp);
        this.userService.Datos_Post.id = resp
        this.savePicture(this.finalPath);

        if(this.userService.Datos_Post.id != null || undefined)
        {
          const postAlert: AlertOptions = {
            title: 'FindEat',
            message: 'Publicación subida exitosamente🤩📸.',
            okButtonText: '¡Gracias!',
            cancelable: false
          };

          alert(postAlert).then(() => {
            this.status = 'loading';
            setTimeout(() => {
              this.descripcionPost = '';
              this.saveImage = '';
              this.status = 'post';
            }, 1000);
          });
        }
      },
        (error) => {
          console.log("El codigo HTTP obtenido es", error.status)
          console.log("errorCount", this.errorCount);
          switch (error.status) {
            // INTERNAL SERVER ERROR
            case 500:
              this.errorCount++;
              const error500: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error interno del servidor, por favor intente nuevamente',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error500).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error500Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error500Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            // BAD GATEWAY
            case 502:
              this.errorCount++;
              const error502: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, el servidor encontró un error temporal y no pudo completar su solicitud\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error502).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error502Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error502Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            // SERVICE UNAVAILABLE (SERVICIO NO DISPONIBLE)
            case 503:
              this.errorCount++;
              const error503: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, el servidor no puede responder a la petición del navegador porque está congestionado o está realizando tareas de mantenimiento.\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error503).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error503Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error503Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            // GATEWAY TIMEOUT
            case 504:
              this.errorCount++;
              const error504: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, el servidor no pudo completar su solicitud dentro del período de tiempo establecido.\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error504).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                })
              }
              else {
                const error504Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error504Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;

            case 0:
              this.errorCount++;
              const error0: AlertOptions = {
                title: 'FindEat',
                message: 'Ha ocurrido un error, la aplicación no se ha podido conectar con el servidor.\nPor favor intente nuevamente.',
                okButtonText: 'OK',
                cancelable: false
              };

              if (this.errorCount < 3) {
                alert(error0).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                });
              }
              else {
                const error0Persist: AlertOptions = {
                  title: 'FindEat',
                  message: 'La aplicación ha superado el número máximo de intentos de conexión, por favor comuniquese con los administradores de la aplicación para notificar este error.\nLa aplicación se cerrará automaticamente por su seguridad.',
                  okButtonText: 'OK',
                  cancelable: false
                };

                alert(error0Persist).then(() => {
                  this.isBusy = false;
                  this.BtnDispo = true;
                  exit();
                });
              }
              break;
          }
        });
    }
    else {
      const postAlert: AlertOptions = {
        title: 'FindEat',
        message: 'Por favor escoge una foto para publicar.',
        okButtonText: 'OK',
        cancelable: false
      }

      alert(postAlert);
    }
  }

  cancelPost() {
    const cancelAlert: ConfirmOptions = {
      title: 'FindEat',
      message: '¿Está seguro de salir? Los cambios serán descartados',
      okButtonText: 'Si',
      cancelButtonText: 'Cancelar',
      cancelable: false
    };

    confirm(cancelAlert).then((result) => {
      this.status = 'loading';
      setTimeout(() => {
        this.status = 'profile';
      }, 1000);
    }).catch((result) => {
      console.log("cancelado")
    });
  }
}
