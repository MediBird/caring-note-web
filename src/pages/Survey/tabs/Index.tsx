import { Button } from '@/components/ui/button';
import useAssistantInfoTabStore, {
  AssistantInfoTab,
} from '@/pages/Survey/store/surveyTabStore';
import { useEffect, useState } from 'react';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useParams } from 'react-router-dom';
import { CounselAssistantDialogTypes } from '../constants/modal';
import CounselAssistantInfo from '../dialogs/counselSurvey/SaveCounselSurvey';
import { useSelectCounselCard } from '@/pages/Survey/hooks/useCounselAssistantQuery';
import { useCounselAssistantStore } from '@/pages/Survey/store/surveyInfoStore';
import TabTitle from '@/pages/Survey/components/TabTitle';
import TabContent from '@/pages/Survey/components/TabContent';

const Survey = () => {
  const { counselSessionId } = useParams();
  const { setCounselAssistant } = useCounselAssistantStore();
  const [dialogType, setDialogType] =
    useState<CounselAssistantDialogTypes>(null);
  const [openIndependentInfoTab, setOpenIndependentInfoTab] = useState(false);

  const { activeTab } = useAssistantInfoTabStore();
  const detail = useDetailCounselSessionStore((state) => state?.detail);

  // 내담자 기본 정보 조회
  const { data } = useSelectCounseleeInfo(counselSessionId ?? '');
  // 상담 카드 조회
  const { data: selectCounselCardAssistantInfo } = useSelectCounselCard(
    counselSessionId ?? '',
  );
  const openModal = (type: CounselAssistantDialogTypes) => setDialogType(type);
  const closeModal = () => setDialogType(null);

  useEffect(() => {
    if (data?.isDisability === true) {
      setOpenIndependentInfoTab(true);
    } else {
      setOpenIndependentInfoTab(false);
    }
  }, [data, detail, counselSessionId]);

  useEffect(() => {
    if (selectCounselCardAssistantInfo?.status === 200) {
      if (selectCounselCardAssistantInfo?.data?.data) {
        setCounselAssistant(selectCounselCardAssistantInfo.data.data);
      }
    }
  }, [
    selectCounselCardAssistantInfo?.data.data,
    counselSessionId,
    setCounselAssistant,
    selectCounselCardAssistantInfo?.status,
  ]);

  // 뒤로가기 버튼 클릭 시 모달 열기
  useEffect(() => {
    const handlePopState = () => {
      openModal('EXIT');

      // 다시 히스토리 상태를 추가해 뒤로가기 버튼이 계속 작동하도록 설정
      window.history.pushState({ isModalOpen: true }, '', window.location.href);
    };

    // 초기 히스토리 상태 추가
    window.history.pushState({ isModalOpen: true }, '', window.location.href);

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-start w-full px-8 pt-10 pb-3 bg-gray-0">
        <div className="flex flex-row items-center justify-start w-full h-auto pl-6">
          <div className="flex flex-row items-center justify-start w-full h-8 ">
            <p className="text-4xl font-black text-black">기초 설문 작성</p>
          </div>
          <div className="flex flex-row items-center justify-end w-full h-8 gap-3 pl-6">
            <Button
              variant="primary"
              className="h-12 p-5 bg-primary-10 text-primary-50"
              onClick={() => openModal('TEMP_SAVE')}>
              임시저장
            </Button>
            <Button
              variant="primary"
              className="h-12 p-5"
              onClick={() => openModal('REGISTER')}>
              기록완료
            </Button>
          </div>
        </div>
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
      <CounselAssistantInfo
        isOpen={dialogType !== null}
        dialogType={dialogType}
        onClose={closeModal}
      />
    </div>
  );
};

export default Survey;
