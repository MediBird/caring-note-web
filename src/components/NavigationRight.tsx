import Badge from "@/components/common/Badge";
import CloseBlackIcon from "@icon/24/close.outlined.black.svg?react";
import PencilBlackIcon from "@icon/24/create.filled.black.svg?react";
import MicBlackIcon from "@icon/24/mic.filled.black.svg?react";
import React from "react";
import { useAppDispatch, useAppSelector } from "../app/reduxHooks";
import { toggleRightNavigation } from "../reducers/navigationReducer";
import HighlightInput from "./consult/HighlightInput";

interface NavigationRightProps {}

const NavigationRight: React.FC<NavigationRightProps> = ({}) => {
  const isOpen = useAppSelector(
    (state) => state.navigation.isOpenRightNavigation,
  );
  const dispatch = useAppDispatch();

  const toggleMenu = () => {
    dispatch(toggleRightNavigation());
  };

  const defaultMenu = () => {
    return (
      <div
        className={`flex flex-col items-center justify-start h-screen ${
          isOpen ? "w-20" : ""
        } py-4`}
        onClick={toggleMenu}>
        <Badge
          className="mb-1"
          variant="outline"
          size="small"
          customIcon={<></>}>
          녹음중
        </Badge>
        <MicBlackIcon width={24} height={24} />
        <div className="h-0.5 w-8 bg-grayscale-10 my-4" />
        <PencilBlackIcon width={24} height={24} />
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full ${
        isOpen ? "w-96" : "w-16"
      } bg-white ${
        isOpen ? "" : "hover:bg-primary-5"
      } transition-width duration-300`}
      style={{
        boxShadow: "-4px 0 8px rgba(0,0,0,0.2)",
      }}>
      {!isOpen && defaultMenu()}
      {isOpen && (
        <div className="flex justify-start">
          {defaultMenu()}
          <div className="bg-white w-full border-l-2 border-grayscale-10">
            <div className="flex items-center justify-between border-b-2 border-grayscale-10 p-4 pt-8">
              <span className="text-subtitle2 font-bold text-grayscale-90">
                상담기록
              </span>
              <CloseBlackIcon width={24} height={24} onClick={toggleMenu} />
            </div>
            <div className="bg-red-000 pt-4 px-2">
              <HighlightInput />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationRight;
