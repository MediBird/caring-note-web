import React from "react";
import adminBlack from "@icon/adminBlack.png";
import adminBlue from "@icon/adminBlue.png";
import homeBlack from "@icon/homeBlack.png";
import homeBlue from "@icon/homeBlue.png";
import noteBlack from "@icon/noteBlack.png";
import questionBlack from "@icon/questionBlack.png";
import settingBlack from "@icon/settingBlack.png";
import logoBlack from "../assets/logoBlack.png";
import Button from "../components/Button";
import NavigationLeftMenu from "../components/NavigationLeftMenu";
import { useNavigate } from "react-router-dom";
import noteBlue from "@icon/noteBlue.png";
import paperPlaneBlack from "@icon/paperPlaneBlack.png";
import paperPlaneBlue from "@icon/paperPlaneBlue.png";

interface NavigationLeftProps {}

const NavigationLeft: React.FC<NavigationLeftProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-auto relative py-4 z-1000">
      <div className="flex justify-center items-center">
        <img
          className="hover:cursor-pointer"
          src={logoBlack}
          alt="logo"
          onClick={() => navigate("/consult/home")}
        />
      </div>
      <div className="flex justify-center items-center">
        <Button
          _class="mb-5"
          variant="primary"
          size="xl"
          icon="none"
          onClick={() => {}}
          children={"박진완 약사님"}
        />
      </div>
      <NavigationLeftMenu
        isActive={true}
        imgSrc={homeBlack}
        activeImgSrc={homeBlue}
        menuName="홈"
      />
      <NavigationLeftMenu
        imgSrc={noteBlack}
        activeImgSrc={noteBlue}
        menuName="상담노트"
      />
      <NavigationLeftMenu
        imgSrc={paperPlaneBlack}
        activeImgSrc={paperPlaneBlue}
        menuName="케어링노트"
      />
      <NavigationLeftMenu
        imgSrc={adminBlack}
        activeImgSrc={adminBlue}
        menuName="계정관리"
      />
      <div className="absolute bottom-5 w-full">
        <NavigationLeftMenu
          imgSrc={settingBlack}
          activeImgSrc={homeBlue}
          menuName="설정"
        />
        <NavigationLeftMenu
          imgSrc={questionBlack}
          activeImgSrc={homeBlue}
          menuName="도움말"
        />
      </div>
    </div>
  );
};

export default NavigationLeft;
