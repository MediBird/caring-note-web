import CounseleeManagement from '@/pages/Counselee';
import CounseleeManagementLayout from '@/pages/Counselee/layout/CounseleeManagementLayout';
import SurveyLayout from '@/pages/Survey/layout/SurveyLayout';
import Survey from '@/pages/Survey/tabs/Index';
import Consult from '@/pages/Consult';
import CounsultLayout from '@/pages/Consult/layout/CounsultLayout';
import ErrorPage from '@/pages/ErrorPage';
import Home from '@/pages/Home';
import Layout from '@/pages/Layout';
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
    ],
  };

  const consultRoutes: AppRouteObject = {
    path: '/consult',
    element: <CounsultLayout />,
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
    element: <SurveyLayout />,
    children: [
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
    counseleeManagementRoute,
  ];

  return useRoutes(routes);
};
export default Routes;
