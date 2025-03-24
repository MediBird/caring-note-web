import { createContext, useContext } from 'react';

import { CounselorControllerApiFactory, GetCounselorRes } from '@/api';
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
    isLoading: boolean;
  },
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { keycloak } = useKeycloak();

  const [user, setUser] = useState<GetCounselorRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const getUserInfo = async () => {
    setIsLoading(true);
    const user = await CounselorControllerApiFactory().getMyInfo();
    if (user.data) {
      setUser(user.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      if (keycloak.authenticated) {
        try {
          await getUserInfo();
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          setIsLoading(false);
        }
      }
    };

    loadUserInfo();
  }, [keycloak.authenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        initAuthState,
        isLoading,
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
  const { user, initAuthState, isLoading } = useContext(AuthContext);

  return {
    user,
    initAuthState,
    isLoading,
  };
};
