import React from 'react';
import { Outlet } from 'react-router-dom';

const SurveyLayout: React.FC = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default SurveyLayout;
