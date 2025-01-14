import AdminBlackIcon from '@/assets/icon/24/accountcircle.fiiled.black.svg?react';
import AdminBlueIcon from '@/assets/icon/24/accountcircle.fiiled.blue.svg?react';
import QuestionBlackIcon from '@/assets/icon/24/help.fiiled.black.svg?react';
import HomeBlackIcon from '@/assets/icon/24/home.filled.black.svg?react';
import HomeBlueIcon from '@/assets/icon/24/home.filled.blue.svg?react';
import LogoutBlackIcon from '@/assets/icon/24/logout.outline.black.svg?react';
import NoteBlackIcon from '@/assets/icon/24/note.fiiled.black.svg?react';
import NoteBlueIcon from '@/assets/icon/24/note.fiiled.blue.svg?react';
import PaperPlainBlackIcon from '@/assets/icon/24/paperplane.black.svg?react';
import PaperPlainBlueIcon from '@/assets/icon/24/paperplane.blue.svg?react';
import PatientBlackIcon from '@/assets/icon/24/patient.fiiled.black.svg?react';
import PatientBlueIcon from '@/assets/icon/24/patient.fiiled.blue.svg?react';
import logoBlack from '@/assets/logoBlack.png';
import NavigationLeftMenu from '@/components/NavigationLeftMenu';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';

const NavigationLeft = () => {
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  return (
    <div className="w-52 h-auto bg-grayscale-3 relative py-0 z-1000 shadow-nav-left">
      <div className="flex justify-start items-end p-5">
        <span className="text-subtitle2 font-bold mr-3">
          {keycloak.tokenParsed?.family_name ?? ''}
          {keycloak.tokenParsed?.given_name ?? ''}
        </span>
        <span className="text-body1 font-medium">{`${'약사'}님`}</span>
      </div>
      <hr className="border-t border-grayscale-10" />
      <NavigationLeftMenu
        className="mt-4"
        isActive={true}
        menuIcon={<HomeBlackIcon width={24} height={24} />}
        activteMenuIcon={<HomeBlueIcon width={24} height={24} />}
        menuName="홈"
      />
      <NavigationLeftMenu
        menuIcon={<NoteBlackIcon width={24} height={24} />}
        activteMenuIcon={<NoteBlueIcon width={24} height={24} />}
        menuName="상담노트"
      />
      <NavigationLeftMenu
        menuIcon={<PaperPlainBlackIcon width={24} height={24} />}
        activteMenuIcon={<PaperPlainBlueIcon width={24} height={24} />}
        menuName="케어링노트"
      />
      <NavigationLeftMenu
        menuIcon={<PatientBlackIcon width={24} height={24} />}
        activteMenuIcon={<PatientBlueIcon width={24} height={24} />}
        menuName="내담자관리"
      />
      <NavigationLeftMenu
        menuIcon={<AdminBlackIcon width={24} height={24} />}
        activteMenuIcon={<AdminBlueIcon width={24} height={24} />}
        menuName="계정관리"
      />
      <hr className="border-t border-grayscale-10" />
      <NavigationLeftMenu
        menuIcon={<QuestionBlackIcon width={24} height={24} />}
        activteMenuIcon={<QuestionBlackIcon width={24} height={24} />}
        menuName="도움말"
      />
      <NavigationLeftMenu
        menuIcon={<LogoutBlackIcon width={24} height={24} />}
        menuName="로그아웃"
        onClick={() => {
          keycloak.logout();
        }}
      />
      <div className="flex justify-center items-center absolute bottom-5 w-full">
        <img
          className="hover:cursor-pointer"
          src={logoBlack}
          alt="logo"
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default NavigationLeft;
