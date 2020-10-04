import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Config } from "../config";

@Injectable()
export class UserService 
{
  constructor(private http: HttpClient) {}

  public login(data)
  {
    return this.http.post(
      Config.apiUrl + '/login', data
    );
  }

  public register(data)
  {
    return this.http.post(
      Config.apiUrl + '/registrar', data
    );
  }

  public getUserInfo(id)
  {
    return this.http.get(
      Config.apiUrl + '/registrar', id
    );
  }

  public storeCaracteristicas(data)
  {
    return this.http.post(
      Config.apiUrl + '/storeCaracteristicas', data
    );
  }
  
}