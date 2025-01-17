import Assistant from '@/pages/assistant/Assistant';
import AssistantInfo from '@/pages/assistant/AssistantInfo';
import AssistantLayout from '@/pages/assistant/layout/AssistantLayout';
import Consult from '@/pages/Consult';
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

  const assistantRoutes: RouteObject = {
    path: '/assistant',
    element: <AssistantLayout />,
    children: [
      {
        path: '',
        element: <Assistant />,
      },
      {
        path: ':counselSessionId/info',
        element: <AssistantInfo />,
      },
    ],
  };

  const routes: AppRouteObject[] = [
    noMatchRoutes,
    mainRoutes,
    consultRoutes,
    assistantRoutes,
  ];

  return useRoutes(routes);
};
export default Routes;
