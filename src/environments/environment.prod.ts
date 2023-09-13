export const environment = {
  production: true,
    // url1:"http://localhost:8080",
    // url:"http://localhost:8080",


  url:"https://vendorvm2.centralindia.cloudapp.azure.com/api",
  url1:"https://vendorvm2.centralindia.cloudapp.azure.com/api",

  // url:"#{BACKEND_URL}#",
  // url1:"#{BACKEND_URL}#",

  // workSpaceId : 'c71a3a5c-4709-455f-ab17-2045543e1df1',
  // reportId : 'c1970ceb-573a-49dd-8b80-91a2cea60387',
  // tenant_id : '5ed5dd64-380b-42e4-bbaf-7418a594b0ff',
  // clientId : '3eb07106-7b5c-4347-bfd9-96b202f740bc',
  // clientSecret : 'uWLSOHYyxVtCOiXcBdNC/tOY0BqVYS3SS1yvSmq6rXo=',
  // powerbiScope: 'https://anemoisoftware.com.au/1d2b5f7a-41c0-49ae-b416-836c9a6dd498/user_impersonation',
  // username: 'akshay.shinde@anemoisoftware.com.au',
  // resource: 'https://analysis.windows.net/powerbi/api',
  // password: 'Akki@2023',
  // grant_type: 'password'


  workSpaceId : '#{workSpaceId}#',
  reportId : '#{reportId}#',
  tenant_id : '#{tenant_id}#',
  clientId : '#{clientId}#',
  clientSecret : '#{clientSecret}#',
  powerbiScope: '#{powerbiScope}#',
  username: '#{username}#',
  resource: '#{resource}#',
  password: '#{password}#',
  grant_type: '#{grant_type}#'
};
