import { AuthContextProvider } from '@/context/AuthContext';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Toaster } from 'sonner';
import keycloak, { initOptions, onKeycloakEvent } from './keycloak';
import Router from './Router';
import Spinner from '@/components/common/Spinner';

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Spinner />
  </div>
);

const App = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onKeycloakEvent}
      LoadingComponent={<LoadingScreen />}>
      <AuthContextProvider>
        <Router />
        <Toaster richColors position="bottom-right" />
      </AuthContextProvider>
    </ReactKeycloakProvider>
  );
};

export default App;
