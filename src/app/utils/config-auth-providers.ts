import { TnsOAuthClient, configureTnsOAuth, ITnsOAuthTokenResult } from "nativescript-oauth2";
import { TnsOaProvider, TnsOaProviderOptionsGoogle, TnsOaProviderGoogle, TnsOaProviderFacebook, TnsOaProviderOptionsFacebook } from "nativescript-oauth2/providers";

export function configureOAuthProviders() 
{
  const googleProvider = configureOAuthProviderGoogle();
  const facebookProvider = configureOAuthProviderFacebook();
  configureTnsOAuth([googleProvider, facebookProvider]);
}

export function configureOAuthProviderGoogle(): TnsOaProvider {
  const googleProviderOptions: TnsOaProviderOptionsGoogle = {
      openIdSupport: "oid-full",
      clientId:
          "450446377021-2i2c90hspc6es2qa60aklnrsa9ekjflq.apps.googleusercontent.com",
      redirectUri:
          "com.googleusercontent.apps.450446377021-2i2c90hspc6es2qa60aklnrsa9ekjflq:/auth",
      urlScheme:
          "com.googleusercontent.apps.450446377021-2i2c90hspc6es2qa60aklnrsa9ekjflq",
      scopes: ["email", "profile", "openid"]
  };
  const googleProvider = new TnsOaProviderGoogle(googleProviderOptions);
  return googleProvider;
}

export function configureOAuthProviderFacebook(): TnsOaProvider {
  const facebookProviderOptions: TnsOaProviderOptionsFacebook = {
    openIdSupport: "oid-none",
    clientId: "326079631832863",
    clientSecret: "b02bbd1764565ac3e53a9143b5339f2f",
    redirectUri: "https://www.facebook.com/connect/login_success.html",
    scopes: ["email"]
  };
  const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
  return facebookProvider;
}