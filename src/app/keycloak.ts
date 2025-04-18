// src/keycloak.js

import { AuthClientEvent } from '@react-keycloak/core';
import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'https://caringnote.co.kr/keycloak',
  realm: 'caringnote',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
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
  switch (event) {
    case 'onAuthLogout':
      keycloak.logout();
      break;
    case 'onAuthSuccess':
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
