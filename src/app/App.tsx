import { ReactKeycloakProvider } from '@react-keycloak/web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import keycloak, { initOptions, onKeycloakEvent } from './keycloak';
import Router from './Router';
import store from './store';
// Tanstack : QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const App = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onKeycloakEvent}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Router />
        </QueryClientProvider>
      </Provider>
    </ReactKeycloakProvider>
  );
};
export default App;
