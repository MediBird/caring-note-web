import generalForbidden from '@/assets/illusts/general-error.webp';
import React from 'react';
import ErrorCommon from './ErrorCommon';

const ForbiddenErrorPage: React.FC = () => {
  return (
    <ErrorCommon
      image={generalForbidden}
      title="페이지 접근이 거부되었어요"
      description="요청하신 페이지에 접근할 권한이 없어요. 페이지 주소를 확인하거나
              접근 가능한 계정으로 다시 시도해주세요."
    />
  );
};

export default ForbiddenErrorPage;
