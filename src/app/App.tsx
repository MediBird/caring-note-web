import { AuthContextProvider } from '@/context/AuthContext';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Toaster } from 'sonner';
import keycloak, { initOptions, onKeycloakEvent } from './keycloak';
import Router from './Router';

const App = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onKeycloakEvent}>
      <AuthContextProvider>
        <Router />
        <Toaster richColors position="bottom-right" />
      </AuthContextProvider>
    </ReactKeycloakProvider>
  );
};

export default App;
