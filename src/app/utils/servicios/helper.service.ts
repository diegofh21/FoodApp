import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { Config } from '../config';

@Injectable()
export class HelperService 
{

  constructor(private http: HttpClient)
  {

  }

  public getCaracteristicas() 
  {
    return this.http.get(
      Config.apiUrl + '/indexCaracteristicas'
    );
  } 

  public getUserInfo(id){
    return this.http.get(Config.apiUrl + '/registrar/', id);
  }
}

