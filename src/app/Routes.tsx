import { GetCounselorResRoleTypeEnum } from '@/api/models/get-counselor-res';
import { useAuthContext } from '@/context/AuthContext';
import AccountManagement from '@/pages/Account';
import Consult from '@/pages/Consult';
import CounseleeManagement from '@/pages/Counselee';
import ForbiddenErrorPage from '@/pages/Errors/Forbidden';
import NotFoundErrorPage from '@/pages/Errors/NotFound';
import Home from '@/pages/Home';
import Layout from '@/pages/Layout';
import SessionManagement from '@/pages/Session';
import Survey from '@/pages/Survey';
import ConsentPage from '@/pages/Survey/consent';
import { ReactNode } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

type AppRouteObject = RouteObject & {
  children?: AppRouteObject[];
};

// 보호된 라우트를 위한 컴포넌트
const ProtectedRoute = ({
  element,
  allowedRoles,
}: {
  element: ReactNode;
  allowedRoles: Array<GetCounselorResRoleTypeEnum>;
}) => {
  const { user } = useAuthContext();

  // 사용자가 인증되지 않았거나, 필요한 역할이 없는 경우 리다이렉트
  if (!user || !user.roleType || !allowedRoles.includes(user.roleType)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{element}</>;
};

const Routes = () => {
  const noMatchRoutes: AppRouteObject = {
    path: '/*',
    element: <NotFoundErrorPage />,
  };

  const forbiddenRoutes: AppRouteObject = {
    path: '/forbidden',
    element: <ForbiddenErrorPage />,
  };

  const mainRoutes: AppRouteObject = {
    path: '/',
    element: <Layout />,
    errorElement: <ForbiddenErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  };

  const consultRoutes: AppRouteObject = {
    path: '/consult',
    element: <Layout />,
    children: [
      {
        //block route when counselSessionId is not provided
        path: '',
        element: <Navigate to="/" />,
      },
      {
        path: ':counselSessionId',
        element: (
          <ProtectedRoute
            element={<Consult />}
            allowedRoles={[
              GetCounselorResRoleTypeEnum.Admin,
              GetCounselorResRoleTypeEnum.User,
            ]}
          />
        ),
      },
    ],
  };

  const surveyRoutes: AppRouteObject = {
    path: '/survey',
    element: <Layout />,
    children: [
      {
        path: ':counselSessionId',
        element: (
          <ProtectedRoute
            element={<Survey />}
            allowedRoles={[
              GetCounselorResRoleTypeEnum.Admin,
              GetCounselorResRoleTypeEnum.User,
              GetCounselorResRoleTypeEnum.Assistant,
            ]}
          />
        ),
      },
    ],
  };

  const consentRoutes: AppRouteObject = {
    path: '/survey/:counselSessionId/consent',
    element: (
      <ProtectedRoute
        element={<ConsentPage />}
        allowedRoles={[
          GetCounselorResRoleTypeEnum.Admin,
          GetCounselorResRoleTypeEnum.User,
          GetCounselorResRoleTypeEnum.Assistant,
        ]}
      />
    ),
  };

  const AdminRoutes: AppRouteObject = {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        path: '/admin/session',
        element: (
          <ProtectedRoute
            element={<SessionManagement />}
            allowedRoles={[
              GetCounselorResRoleTypeEnum.Admin,
              GetCounselorResRoleTypeEnum.User,
            ]}
          />
        ),
      },
      {
        path: '/admin/counselee',
        element: (
          <ProtectedRoute
            element={<CounseleeManagement />}
            allowedRoles={[GetCounselorResRoleTypeEnum.Admin]}
          />
        ),
      },
      {
        path: '/admin/account',
        element: (
          <ProtectedRoute
            element={<AccountManagement />}
            allowedRoles={[GetCounselorResRoleTypeEnum.Admin]}
          />
        ),
      },
    ],
  };

  const routes: AppRouteObject[] = [
    noMatchRoutes,
    mainRoutes,
    forbiddenRoutes,
    consultRoutes,
    surveyRoutes,
    consentRoutes,
    AdminRoutes,
  ];

  return useRoutes(routes);
};
export default Routes;
