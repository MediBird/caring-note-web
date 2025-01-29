import React from 'react';
import { Outlet } from 'react-router-dom';

const SurveyLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default SurveyLayout;
