import AdminBlackIcon from "@icon/24/accountcircle.fiiled.black.svg?react";
import AdminBlueIcon from "@icon/24/accountcircle.fiiled.blue.svg?react";
import HomeBlackIcon from "@icon/24/home.filled.black.svg?react";
import HomeBlueIcon from "@icon/24/home.filled.blue.svg?react";
import NoteBlackIcon from "@icon/24/note.fiiled.black.svg?react";
import NoteBlueIcon from "@icon/24/note.fiiled.blue.svg?react";
import PaperPlainBlackIcon from "@icon/24/paperplane.black.svg?react";
import PaperPlainBlueIcon from "@icon/24/paperplane.blue.svg?react";
import SettingBlackIcon from "@icon/24/settings.fiiled.black.svg?react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logoBlack from "../assets/logoBlack.png";
import Button from "../components/Button";
import NavigationLeftMenu from "../components/NavigationLeftMenu";
// import SettingBlueIcon from "@icon/24/setting.filled.blue.svg?react";
import QuestionBlackIcon from "@icon/24/help.fiiled.black.svg?react";
// import QuestionBlueIcon from "@icon/24/question.filled.blue.svg?react";

interface NavigationLeftProps {}

const NavigationLeft: React.FC<NavigationLeftProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-auto bg-grayscale-3 relative py-4 z-1000">
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
        menuIcon={<HomeBlackIcon width={24} height={24} />}
        activteMenuIcon={<HomeBlueIcon width={24} height={24} />}
        menuName="홈"
      />
      <NavigationLeftMenu
        menuIcon={<PaperPlainBlackIcon width={24} height={24} />}
        activteMenuIcon={<PaperPlainBlueIcon width={24} height={24} />}
        menuName="상담노트"
      />
      <NavigationLeftMenu
        menuIcon={<NoteBlackIcon width={24} height={24} />}
        activteMenuIcon={<NoteBlueIcon width={24} height={24} />}
        menuName="케어링노트"
      />
      <NavigationLeftMenu
        menuIcon={<AdminBlackIcon width={24} height={24} />}
        activteMenuIcon={<AdminBlueIcon width={24} height={24} />}
        menuName="계정관리"
      />
      <div className="absolute bottom-5 w-full">
        <NavigationLeftMenu
          menuIcon={<SettingBlackIcon width={24} height={24} />}
          activteMenuIcon={<SettingBlackIcon width={24} height={24} />}
          menuName="설정"
        />
        <NavigationLeftMenu
          menuIcon={<QuestionBlackIcon width={24} height={24} />}
          activteMenuIcon={<QuestionBlackIcon width={24} height={24} />}
          menuName="도움말"
        />
      </div>
    </div>
  );
};

export default NavigationLeft;
