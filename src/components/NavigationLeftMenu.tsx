import React, { useState } from "react";

interface NavigationLeftMenuProps {
  menuName: string;
  menuIcon?: React.ReactNode;
  activteMenuIcon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const NavigationLeftMenu: React.FC<NavigationLeftMenuProps> = ({
  menuName,
  menuIcon,
  activteMenuIcon,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center mx-2 p-4 cursor-pointer rounded-md border-2 border-grayscale-3 hover:border-2 hover:border-primary-50
        ${isActive ? "bg-primary-10" : ""}`}
      onClick={onClick}>
      {isActive ? activteMenuIcon : menuIcon}
      <span
        className={`text-body1 font-medium leading-6 text-center ml-2 ${
          isActive ? "text-primary-50" : "text-grayscale-90"
        }`}>
        {menuName}
      </span>
    </div>
  );
};

export default NavigationLeftMenu;
