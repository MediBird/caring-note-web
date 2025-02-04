import React from 'react';
import { Outlet } from 'react-router-dom';
import SurveyNavigationLeft from '@/pages/Survey/components/SurveyNavigationLeft';

const SurveyLayout: React.FC = () => {
  return (
    <div className="flex w-full h-screen">
      <SurveyNavigationLeft />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SurveyLayout;
