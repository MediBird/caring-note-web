import error404 from '@/assets/illusts/404.webp';
import React from 'react';
import ErrorCommon from './ErrorCommon';

const NotFoundErrorPage: React.FC = () => {
  return (
    <ErrorCommon
      image={error404}
      title="요청하신 페이지를 찾을 수 없어요"
      description="입력한 주소가 잘못되었거나, 더이상 존재하지 않는 페이지에요.
              입력한 주소를 다시 확인해주세요!"
    />
  );
};

export default NotFoundErrorPage;
