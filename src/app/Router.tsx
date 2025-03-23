import { RouteTracker } from '@/components/RouteTracker';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
const Router = () => {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}>
      <RouteTracker />
      <Routes />
    </BrowserRouter>
  );
};
export default Router;
