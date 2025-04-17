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

const NavigationLeftMenu: React.FC<NavigationLeftMenuProps> = ({
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
        'mx-2 my-2 flex cursor-pointer items-center rounded-md border border-grayscale-3 p-3 hover:border hover:border-primary-50',
        { 'bg-primary-10': isActive },
        className,
      )}
      onClick={onClick}>
      {isActive ? activteMenuIcon : menuIcon}
      <span
        className={classNames(
          'ml-2 text-center text-body1 font-medium leading-6',
          { 'text-primary-50': isActive, 'text-grayscale-90': !isActive },
        )}>
        {menuName}
      </span>
    </div>
  );
};

export default NavigationLeftMenu;
