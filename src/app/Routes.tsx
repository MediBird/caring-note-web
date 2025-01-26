import ClientManagement from '@/pages/Counselee';
import CounseleeManagementLayout from '@/pages/Counselee/layout/CounseleeManagementLayout';
import AssistantLayout from '@/pages/assistant/layout/AssistantLayout';
import Survey from '@/pages/assistant/Survey';
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

  const assistantRoutes: AppRouteObject = {
    path: '/assistant',
    element: <AssistantLayout />,
    children: [
      {
        path: '',
        element: <Assistant />,
      },
    ],
  };

  const surveyRoutes: AppRouteObject = {
    path: '/survey',
    element: <AssistantLayout />,
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
        element: <ClientManagement />,
      },
    ],
  };

  const routes: AppRouteObject[] = [
    noMatchRoutes,
    mainRoutes,
    consultRoutes,
    assistantRoutes,
    surveyRoutes,
    counseleeManagementRoute,
  ];

  return useRoutes(routes);
};
export default Routes;
