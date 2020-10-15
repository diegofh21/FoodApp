import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { Config } from '../config';

@Injectable()
export class HelperService {

  constructor(private http: HttpClient) {

  }
  public ID_User = 3;
  public ResultadoBusqueda;


  public getCaracteristicas() {
    return this.http.get(
      Config.apiUrl + '/indexCaracteristicas'
    );
  }


  public searchByTags(tagList) {
    let obj: object = {
      "caracteristicas": tagList
    };
    return this.http.post(Config.apiUrl + '/indexRestaurantes', obj);
  }

  public searchByName(name) {
    let obj: object = { "query": name };
    return this.http.post(Config.apiUrl + '/indexRestaurantes', obj);
  }


  public getUserInfo(id) {
    return this.http.get(Config.apiUrl + '/registrar/', id);
  }

  public getPost(id) {
    return this.http.get(Config.apiUrl + '/publicaciones/'+ id);
  }
}
