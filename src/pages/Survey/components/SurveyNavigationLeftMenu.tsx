import classNames from 'classnames';
import React from 'react';

interface NavigationLeftMenuProps {
  className?: string;
  menuName: string;
  menuIcon?: React.ReactNode;
  activteMenuIcon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const SurveyNavigationLeftMenu: React.FC<NavigationLeftMenuProps> = ({
  className,
  menuName,
  menuIcon,
  activteMenuIcon,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col items-center mx-2 my-3 py-2 cursor-pointer rounded-md border border-grayscale-3 hover:border hover:border-primary-50',
        { 'bg-primary-10': isActive },
        className,
      )}
      onClick={onClick}>
      {isActive ? activteMenuIcon : menuIcon}
      <span
        className={classNames('text-xs font-medium leading-6 text-center ', {
          'text-primary-50': isActive,
          'text-grayscale-90': !isActive,
        })}>
        {menuName}
      </span>
    </div>
  );
};

export default SurveyNavigationLeftMenu;
