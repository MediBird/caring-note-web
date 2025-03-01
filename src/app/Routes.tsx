import CounseleeManagement from '@/pages/Counselee';
import Survey from '@/pages/Survey/tabs/Index';
import Consult from '@/pages/Consult';
import ErrorPage from '@/pages/ErrorPage';
import Home from '@/pages/Home';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import SurveyList from '@/pages/Survey/Index';
import Layout from '@/pages/Layout';

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

  const counseleeManagementRoute: AppRouteObject = {
    path: '/counselee-management',
    element: <CounseleeManagementLayout />,
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
  ];

  return useRoutes(routes);
};
export default Routes;
