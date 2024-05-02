// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // url1: 'http://localhost:8044',
  // url: 'http://localhost:8044',


  // url:"http://vendorvm2.centralindia.cloudapp.azure.com/api",
  // url1:"http://vendorvm2.centralindia.cloudapp.azure.com/api"


  url1:"http://localhost:8080",
   url: "http://localhost:8080",


//pwc url


  // url1:"https://dev.vendorandproductevaluationtool.pwc.in/api",
  // url:"https://dev.vendorandproductevaluationtool.pwc.in/api",

  
  // url1:"https://uat.vendorandproductevaluationtool.pwc.in/api",
  // url:"https://uat.vendorandproductevaluationtool.pwc.in/api",



  login_url:"https://login-stg.pwc.com/openam/oauth2/authorize",
  reponse_type:'code',
  client_id:'urn:ipzjlvwvaswv001.pwcglb.com',
  // redirect_url:'https://uat.vendorandproductevaluationtool.pwc.in',
  redirect_url:'http://localhost:4200',
  scope:'openid',
  grant_type:'authorization_code',
  secret:'MEq6SgAGzRknnq5QLKWZ',
  access_token:'https://login-stg.pwc.com/openam/oauth2/access_token',
  user_info:'https://login-stg.pwc.com/openam/oauth2/userinfo'
   
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
