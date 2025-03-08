import Consult from '@/pages/Consult';
import CounseleeManagement from '@/pages/Counselee';
import ErrorPage from '@/pages/ErrorPage';
import Home from '@/pages/Home';
import Layout from '@/pages/Layout';
import Schedule from '@/pages/Schedule';
import Survey from '@/pages/Survey/tabs/Index';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

type AppRouteObject = RouteObject & {
  children?: AppRouteObject[];
};

const Routes = () => {
  const noMatchRoutes: AppRouteObject = {
    path: '/*',
    element: <ErrorPage />,
  };

  const mainRoutes: AppRouteObject = {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/counselee-management',
        element: <CounseleeManagement />,
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
  const scheduleRoutes: AppRouteObject = {
    path: '/schedule',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Schedule />,
      },
    ],
  };

  const counseleeManagementRoute: AppRouteObject = {
    path: '/counselee-management',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <CounseleeManagement />,
      },
    ],
  };

  const routes: AppRouteObject[] = [
    noMatchRoutes,
    mainRoutes,
    consultRoutes,
    surveyRoutes,
    scheduleRoutes,
    counseleeManagementRoute,
  ];

  return useRoutes(routes);
};
export default Routes;
