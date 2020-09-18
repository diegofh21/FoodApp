import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { TnsOAuthClient, ITnsOAuthTokenResult } from "nativescript-oauth2";

import { Config } from '../config';

@Injectable()
export class AuthService {
  private client: TnsOAuthClient = null;

  constructor(private http: HttpClient) { }

  public tnsOauthLogin(providerType): Promise<ITnsOAuthTokenResult> 
  {
    this.client = new TnsOAuthClient(providerType);

    return new Promise<ITnsOAuthTokenResult>((resolve, reject) => {
      this.client.loginWithCompletion(
        (tokenResult: ITnsOAuthTokenResult, error) => {
          if (error) {
            console.error("back to main page with error: ");
            console.error(error);
            reject(error);
          } else {
            console.log("back to main page with access token: ");
            console.log(tokenResult);
            resolve(tokenResult);
          }
        }
      );
    });
  }

  public tnsOauthLogout(): Promise<any> 
  {
    return new Promise<any>((resolve, reject) => {
      if (this.client) {
        this.client.logoutWithCompletion(
          (error) => {
            if (error) {
              console.error("back to main page with error: ");
              console.error(error);
              reject(error);
            } else {
              console.log("back to main page with success");
              resolve();
            }
          }
        );
      }
      else {
        console.log("back to main page with success");
        resolve();
      }
    });
  }

  public login(data)
  {
    return this.http.post(
      Config.apiUrl + '/login',data
    );
  }
}

