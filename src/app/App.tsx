import { ReactKeycloakProvider } from '@react-keycloak/web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import keycloak, { initOptions, onKeycloakEvent } from './keycloak';
import Router from './Router';
import store from './store';
import { AuthContextProvider } from '@/context/AuthContext';
// Tanstack : QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initOptions}
        onEvent={onKeycloakEvent}>
        <AuthContextProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Router />
          </QueryClientProvider>
        </AuthContextProvider>
      </ReactKeycloakProvider>
    </Provider>
  );
};
export default App;
