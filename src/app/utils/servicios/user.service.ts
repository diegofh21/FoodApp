import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Config } from "../config";

@Injectable()
export class UserService 
{
  constructor(private http: HttpClient) {}

  // Datos del USUARIO
  public Datos_Usuario = {
    id: 0,
    name: '',
    email: '',
    foto: '',
    caracteristicas: undefined
  }

  //ubicación del post a mostrar
  public Datos_Post = {
    id:0,
    titulo:"",
    descripcion:"",
    like:0,
    restauranteID:0,
    fecha:"",
    ruta:"",
    created_at:"",
    updated_at:""
  };

  //ubicación del usuario
  public UserLocation=[0,0];

  // Datos del RESTAURANTE
  public Datos_Restaurante = {
    id: 0,
    name: '',
    email: '',
    rif: '',
    descripcion: '',
    latitud: 0,
    longitud: 0,
    foto: '',
    caracteristicas: undefined
  }

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
      Config.apiUrl + '/registrar/' + id
    );
  }

  public storeCaracteristicas(data)
  {
    return this.http.post(
      Config.apiUrl + '/storeCaracteristicas', data
    );
  }
  
}