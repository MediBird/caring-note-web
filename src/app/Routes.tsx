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
import { ROLE_ACCESS } from '@/utils/constants';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

type AppRouteObject = RouteObject & {
  children?: AppRouteObject[];
};

const ProtectedLayout = ({
  allowedRoles,
}: {
  allowedRoles: Array<GetCounselorResRoleTypeEnum>;
}) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return null;
  }

  if (!user || !user.roleType || !allowedRoles.includes(user.roleType)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Layout />;
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
    element: <ProtectedLayout allowedRoles={ROLE_ACCESS.ADMIN_USER} />,
    children: [
      {
        //block route when counselSessionId is not provided
        path: '',
        element: <Navigate to="/" />,
      },
      {
        path: ':counselSessionId',
        element: <Consult />,
      },
    ],
  };

  const surveyRoutes: AppRouteObject = {
    path: '/survey',
    element: <ProtectedLayout allowedRoles={ROLE_ACCESS.ALL_ROLES} />,
    children: [
      {
        path: ':counselSessionId',
        element: <Survey />,
      },
    ],
  };

  const consentRoutes: AppRouteObject = {
    path: '/survey/:counselSessionId/consent',
    element: <ProtectedLayout allowedRoles={ROLE_ACCESS.ALL_ROLES} />,
    children: [
      {
        path: '',
        element: <ConsentPage />,
      },
    ],
  };

  const AdminRoutes: AppRouteObject = {
    path: '/admin',
    element: <ProtectedLayout allowedRoles={ROLE_ACCESS.ADMIN_ONLY} />,
    children: [
      {
        path: 'session',
        element: <SessionManagement />,
      },
      {
        path: 'counselee',
        element: <CounseleeManagement />,
      },
      {
        path: 'account',
        element: <AccountManagement />,
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
