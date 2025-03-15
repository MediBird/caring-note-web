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
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

type AppRouteObject = RouteObject & {
  children?: AppRouteObject[];
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
        element: <Consult />,
      },
    ],
  };

  const surveyRoutes: AppRouteObject = {
    path: '/survey',
    element: <Layout />,
    children: [
      { path: ':counselSessionId', element: <Survey /> },
      {
        path: ':counselSessionId',
        element: <Survey />,
      },
    ],
  };

  const consentRoutes: AppRouteObject = {
    path: '/survey/:counselSessionId/consent',
    element: <ConsentPage />,
  };

  const AdminRoutes: AppRouteObject = {
    path: '/admin',
    element: <Layout />,
    children: [
      { path: '/admin/session', element: <SessionManagement /> },
      { path: '/admin/counselee', element: <CounseleeManagement /> },
      { path: '/admin/account', element: <AccountManagement /> },
    ],
  };

  const routes: AppRouteObject[] = [
    noMatchRoutes,
    mainRoutes,
    forbiddenRoutes,
    consultRoutes,
    surveyRoutes,
    consentRoutes, // 새 라우트 추가
    AdminRoutes,
  ];

  return useRoutes(routes);
};
export default Routes;
