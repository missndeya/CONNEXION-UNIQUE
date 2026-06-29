export const environment = {
  production: false,
  // loginUrl: 'https://dev1.dgf.sn:8444/sysbudgep-authentification/auth/login',
  //private readonly loginUrl = '/proxy/sysbudgep-authentification/auth/login';
  loginUrl: 'http://localhost:8093/auth/login',
  dashboardExecutionUrl: 'http://localhost:62661',
 // dashboardElaborationUrl: 'http://localhost:50317',
  //dashboardElaborationUrl: 'http://localhost:62661',
  dashboardElaborationUrl: 'https://dev1.dgf.sn',
  authUrl: 'http://localhost:4200/login',
  backElaborationUrl: 'http://localhost:8085/api',
  backExecutionUrl: 'http://localhost:8093',
 // baseUrl : 'https://dev1.dgf.sn:8444/sysbudgep-authentification'
  baseUrl : 'http://localhost:8093'
};
