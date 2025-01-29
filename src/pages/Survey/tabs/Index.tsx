import { Button } from '@/components/ui/button';
import useAssistantInfoTabStore, {
  AssistantInfoTab,
} from '@/pages/Survey/store/surveyTabStore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CounselAssistantDialogTypes } from '../constants/modal';
import CounselAssistantInfo from '../dialogs/counselSurvey/SaveCounselSurvey';
import { useSelectCounselCard } from '@/pages/Survey/hooks/useCounselAssistantQuery';
import {
  CounselSurveyType,
  useCounselSurveyStore,
} from '@/pages/Survey/store/surveyInfoStore';
import TabTitle from '@/pages/Survey/components/TabTitle';
import TabContent from '@/pages/Survey/components/TabContent';
import { useSelectCounseleedetailInfo } from '@/pages/Counselee/hooks/query/useCounseleeInfoQuery';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';

const Survey = () => {
  // useParams()를 통해 counselSessionId를 가져옴
  const { counselSessionId } = useParams();
  // usecounselSurveyStore에서 counselSurvey, setCounselSurvey 가져옴
  const { setCounselSurvey } = useCounselSurveyStore();
  // 다이얼로그 타입 상태
  const [dialogType, setDialogType] =
    useState<CounselAssistantDialogTypes>(null);
  // 자립생활 역량 탭 열기 상태
  const [openIndependentInfoTab, setOpenIndependentInfoTab] = useState(false);
  // 탭 상태 가져오기
  const { activeTab } = useAssistantInfoTabStore();
  // 상담 세션 상세 정보 조회
  const { detail } = useDetailCounselSessionStore();

  // 내담자 상세 정보 조회
  const { data: counseleeDetailInfo } = useSelectCounseleedetailInfo(
    detail?.counseleeId ?? '',
  );
  // 상담 카드 조회
  const { data: survey, isLoading } = useSelectCounselCard(
    counselSessionId ?? '',
  );
  // 다이얼로그 열기 함수
  const openModal = (type: CounselAssistantDialogTypes) => setDialogType(type);
  const closeModal = () => setDialogType(null);

  // **Zustand 상태가 비어있을 때만 survey 데이터 적용**
  useEffect(() => {
    if (survey?.data?.data && !Object.keys(setCounselSurvey).length) {
      setCounselSurvey((prevState) => ({
        ...prevState, // 기존 상태 유지
        ...survey.data.data, // 상태를 덮어씌우지 않고 병합
      }));
    } else if (survey?.status === 204) {
      setCounselSurvey(() => ({} as CounselSurveyType)); // 상담 카드가 없을 때 초기화
    }
  }, [survey?.data?.data, setCounselSurvey, survey?.status]);

  // **내담자 정보에 따라 "자립생활 역량" 탭 표시 여부 결정**
  useEffect(() => {
    if (counseleeDetailInfo) {
      setOpenIndependentInfoTab(counseleeDetailInfo?.disability ?? false);
    }
  }, [counseleeDetailInfo]);

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
      <div className="flex flex-col items-center justify-start w-full px-8 pt-10 pb-3 mb-2 bg-gray-0">
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
      {!isLoading && (
        <TabContent
          activeTab={activeTab}
          openIndependentInfoTab={openIndependentInfoTab}
        />
      )}

      <CounselAssistantInfo
        isOpen={dialogType !== null}
        dialogType={dialogType}
        onClose={closeModal}
      />
    </div>
  );
};

export default Survey;
