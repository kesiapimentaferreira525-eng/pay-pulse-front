// Em dev as chamadas /api são redirecionadas pelo proxy.conf.json para http://localhost:8082 (Spring Boot)
export const environment = {
  production: false,
  apiUrl: '/api/v1'
};
