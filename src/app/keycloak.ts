// src/keycloak.js
import { AuthClientEvent } from '@react-keycloak/core';
import Keycloak from 'keycloak-js';

// Keycloak 설정. 여기서 url, realm, clientId는 위에서 만든 값으로 교체
export const keycloak = new Keycloak({
  url: 'https://caringnote.co.kr/keycloak',
  realm: 'caringnote',
  clientId: 'caringnote',
});

export const initOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256',
};

// keycloak Event 를 보기 위한 함수 정의
// keycloak provider 의 onEvent 에 넣어준다.
export const onKeycloakEvent = (
  event: AuthClientEvent,
  // error?: AuthClientError,
) => {
  console.log('keycloak', keycloak);
  console.log('keycloak.token:', keycloak.token);
  switch (event) {
    case 'onAuthLogout':
      keycloak.logout();
      break;
    case 'onAuthSuccess':
      console.log('onAuthSuccess');
      break;
    case 'onAuthRefreshError':
      keycloak.login();
      break;
    case 'onTokenExpired':
      keycloak.updateToken(30);
      break;
  }
};

export default keycloak;
