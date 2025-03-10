import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

interface ErrorCommonProps {
  image: string;
  title: string;
  description: string;
}

const ErrorCommon: React.FC<ErrorCommonProps> = ({
  image,
  title,
  description,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center w-[24.5rem] gap-[2rem]">
        <div className="flex flex-col items-center justify-center gap-[1.5rem]">
          <img src={image} alt={title} className="w-[15rem] h-[15rem]" />
          <div>
            <p className="text-h3 font-bold text-grayscale-100 mb-[0.625rem]">
              {title}
            </p>
            <span className="text-grayscale-80 test-body1 font-medium">
              {description}
            </span>
          </div>
        </div>
        <div className="mt-8 space-x-4">
          <Button onClick={handleGoHome} size="lg" variant="secondary">
            홈으로 이동하기
          </Button>
          <Button onClick={handleGoBack} size="lg" variant="primary">
            이전으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorCommon;
