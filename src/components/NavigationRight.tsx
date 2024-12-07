import React, { ReactEventHandler, useRef, useState } from "react";
import cancelBlack from "../assets/icon/cancelBlack.png";
import micBlack from "../assets/icon/micBlack.png";
import pencilBlack from "../assets/icon/pencilBlack.png";
import Badge from "./Badge";
import HighlightInput from "./consult/HighlightInput";
import { on } from "events";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleRightNavigation } from "../reducers/navigationReducer";

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
        <Badge variant="primary" size="sm" type="outline" text="녹음중" />
        <img src={micBlack} alt="micBlack" className="w-8 h-8" />
        <div className="h-0.5 w-8 bg-gray-300 my-4" />
        <img src={pencilBlack} alt="pencilBlack" className="w-8 h-8" />
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full ${
        isOpen ? "w-96" : "w-16"
      } bg-gray-100 ${
        isOpen ? "" : "hover:bg-blue-100"
      } transition-width duration-300`}
      style={{
        boxShadow: "-4px 0 8px rgba(0,0,0,0.2)",
      }}>
      {!isOpen && defaultMenu()}
      {isOpen && (
        <div className="flex justify-start">
          {defaultMenu()}
          <div className="bg-white w-full border-l-2 border-gray-300">
            <div className="flex justify-between border-b-2 border-gray-100">
              <span className="mt-8 mb-4 mx-8 text-lg text-black font-bold">
                상담기록
              </span>
              <img
                src={cancelBlack}
                alt="cancelBlack"
                className="mt-8 mb-4 mx-6 w-8 h-8 cursor-pointer"
                onClick={toggleMenu}
              />
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
