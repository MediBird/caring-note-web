import { createContext, useContext } from 'react';

import { CounselorControllerApiFactory, GetCounselorRes } from '@/api/api';
import { useState } from 'react';

import { useKeycloak } from '@react-keycloak/web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import { useEffect } from 'react';

const AuthContext = createContext(
  {} as {
    user: GetCounselorRes | null;
    initAuthState: () => void;
  },
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { keycloak } = useKeycloak();
  const [user, setUser] = useState<GetCounselorRes | null>(null);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof AxiosError) {
                if (
                  error.response?.status === 401 ||
                  error.response?.status === 403
                ) {
                  return false;
                }
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  const initAuthState = () => {
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      if (keycloak.authenticated) {
        const user = await CounselorControllerApiFactory().getMyInfo();
        setUser(user.data);
      }
    })();
  }, [keycloak.authenticated]);

  if (!keycloak.authenticated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        initAuthState,
      }}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const { user, initAuthState } = useContext(AuthContext);

  return {
    user,
    initAuthState,
  };
};
