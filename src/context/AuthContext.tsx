import { createContext, useContext } from 'react';

import { CounselorControllerApiFactory, GetCounselorRes } from '@/api/api';
import { useState } from 'react';

import { useKeycloak } from '@react-keycloak/web';
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

  const initAuthState = () => {
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      const user = await CounselorControllerApiFactory().getMyInfo();

      setUser(user.data);
    })();
  }, [keycloak.authenticated, keycloak.token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        initAuthState,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const { user, initAuthState } = useContext(AuthContext);

  return {
    user,
    initAuthState,
  };
};
