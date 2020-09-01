import { TnsOAuthClient, configureTnsOAuth, ITnsOAuthTokenResult } from "nativescript-oauth2";
import { TnsOaProvider, TnsOaProviderOptionsGoogle, TnsOaProviderGoogle } from "nativescript-oauth2/providers";

export function configureOAuthProviders() 
{
  const googleProvider = configureOAuthProviderGoogle();
  configureTnsOAuth([googleProvider]);
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