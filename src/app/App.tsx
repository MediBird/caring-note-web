import { AuthContextProvider } from '@/context/AuthContext';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import keycloak, { initOptions, onKeycloakEvent } from './keycloak';
import Router from './Router';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initOptions}
        onEvent={onKeycloakEvent}>
        <AuthContextProvider>
          <Router />
          <Toaster richColors position="bottom-right" />
        </AuthContextProvider>
      </ReactKeycloakProvider>
    </Provider>
  );
};

export default App;
