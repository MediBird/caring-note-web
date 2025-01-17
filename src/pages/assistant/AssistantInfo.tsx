import arrowHeadLeftGray from '@/assets/icon/arrowHeadLeftGray.png';
import Button from '@/components/Button';
import useAssistantInfoTabStore, {
  AssistantInfoTab,
} from '@/store/assistantTabStore';
import BasicInfo from '@/pages/assistant/tabs/BasicInfo';
import HealthInfo from '@/pages/assistant/tabs/HealthInfo';
import LifeInfo from '@/pages/assistant/tabs/LifeInfo';
import IndependentInfo from '@/pages/assistant/tabs/IndependentInfo';
import { useEffect, useState } from 'react';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useNavigate, useParams } from 'react-router-dom';
import { usePutCounselAgree } from '@/hooks/useCounselAgreeQuery';
import { useCounselAgreeSessionStore } from '@/store/counselAgreeStore';
import RegistSucess from '@/pages/assistant/dialogs/RegisterSucess';
import TemporaySave from './dialogs/TemporaySave';

const TabTitle = ({
  text,
  goPage,
  isHidden,
}: {
  text: string;
  goPage: AssistantInfoTab;
  isHidden?: boolean;
}) => {
  const { activeTab, setActiveTab } = useAssistantInfoTabStore();

  return (
    <p
      className={`${
        activeTab === goPage
          ? 'text-body2 font-bold text-primary-50 border-b-2 border-primary-50'
          : 'text-body2 font-medium text-grayscale-50'
      } ${
        isHidden ? 'hidden' : ''
      } mr-10 py-3 h-full flex items-center hover:text-primary-50 hover:border-b-2 border-primary-50 cursor-pointer`}
      onClick={() => {
        setActiveTab(goPage);
      }}>
      {text}
    </p>
  );
};

const TabContent = ({
  activeTab,
  openIndependentInfoTab,
}: {
  activeTab: AssistantInfoTab;
  openIndependentInfoTab: boolean;
}) => {
  const defaultTab = openIndependentInfoTab ? (
    <BasicInfo />
  ) : (
    <IndependentInfo />
  );

  switch (activeTab) {
    case AssistantInfoTab.basicInfo:
      return <BasicInfo />;
    case AssistantInfoTab.healthInfo:
      return <HealthInfo />;
    case AssistantInfoTab.lifeInfo:
      return <LifeInfo />;
    case AssistantInfoTab.independentInfo:
      return <IndependentInfo />;
    default:
      return defaultTab;
  }
};

const AssistantInfo = () => {
  const { activeTab } = useAssistantInfoTabStore();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [isTemporaySaveOpen, setIsTemporaySaveOpen] = useState(false);
  const detail = useDetailCounselSessionStore((state) => state?.detail);
  //useParams()를 통해 counselSessionId를 가져옴
  const { counselSessionId } = useParams();
  const { data } = useSelectCounseleeInfo(
    counselSessionId ? detail?.counselSessionId ?? '' : '',
  );

  const counseleeConsent = useCounselAgreeSessionStore(
    (state) => state.counseleeConsent || '',
  );

  const { setUpdatedCounseleeConsentId } = useCounselAgreeSessionStore();
  // 내담자 개인정보 수집 동의 여부 수정 API 연결
  const putCounselAgree = usePutCounselAgree();

  const [openIndependentInfoTab, setOpenIndependentInfoTab] = useState(false);
  const navigate = useNavigate();
  const resetDetail = useDetailCounselSessionStore(
    (state) => state.resetDetail,
  );

  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
    resetDetail(); // detail 초기화
  };

  useEffect(() => {
    if (data?.isDisability === true) {
      setOpenIndependentInfoTab(true);
    } else {
      setOpenIndependentInfoTab(false);
    }
  }, [data, detail, counselSessionId]);

  const goBackandPut = () => {
    if (counseleeConsent) {
      const requestBody = {
        counseleeConsentId: counseleeConsent.counseleeConsentId,
        consent: false,
      };
      // addCounselAgree.mutate로 요청 실행
      putCounselAgree.mutate(requestBody, {
        onSuccess: (data) => {
          navigate(-1); // 이전 페이지로 이동
          resetDetail(); // detail 초기화
          if (data.updatedCounseleeConsentId) {
            setUpdatedCounseleeConsentId(data.updatedCounseleeConsentId);
          }
        }, // 성공 시 이동
      });
    }
  };

  const handleRegisterOpen = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };
  const handleTemporaySaveOpen = () => {
    console.log('handleTemporaySaveOpen');

    setIsTemporaySaveOpen(!isTemporaySaveOpen);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-start w-full px-8 py-4 h-fit bg-gray-0">
        <div className="flex flex-row items-center justify-start w-full h-8 pl-6 mt-4">
          <div className="flex flex-row items-center justify-start w-full h-8 pl-6 mt-4">
            <img
              src={arrowHeadLeftGray}
              onClick={goBack}
              alt="arrowHeadLeftGray"
              className="w-6 h-6 cursor-pointer"
            />
            <Button _class="ml-6" variant="primary" onClick={goBackandPut}>
              동의 여부 수정
            </Button>
            <p className="text-4xl font-black text-black">상담 카드 작성</p>
          </div>
          <div className="flex flex-row items-center justify-end w-full h-8 pl-6 mt-4">
            <Button
              _class="ml-6"
              variant="secondary"
              onClick={handleTemporaySaveOpen}>
              임시저장
            </Button>
            <Button
              _class="ml-4"
              variant="primary"
              onClick={handleRegisterOpen}>
              기록완료
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start w-full h-8 pl-6 mt-4"></div>
      </div>
      <div className="flex flex-row items-center justify-start w-full my-0 border-t-2 border-b-2 border-gray-200 h-14 pl-14 border-b-gray-300">
        <TabTitle text="기본 정보" goPage={AssistantInfoTab.basicInfo} />
        <TabTitle text="건강 정보" goPage={AssistantInfoTab.healthInfo} />
        <TabTitle text="생활 정보" goPage={AssistantInfoTab.lifeInfo} />
        <TabTitle
          text="자립생활 역량"
          goPage={AssistantInfoTab.independentInfo}
          isHidden={!openIndependentInfoTab}
        />
      </div>
      <TabContent
        activeTab={activeTab}
        openIndependentInfoTab={openIndependentInfoTab}
      />

      <TemporaySave
        isOpen={isTemporaySaveOpen}
        handleOpen={handleTemporaySaveOpen}
      />
      <RegistSucess isOpen={isRegisterOpen} handleOpen={handleRegisterOpen} />
    </div>
  );
};

export default AssistantInfo;
