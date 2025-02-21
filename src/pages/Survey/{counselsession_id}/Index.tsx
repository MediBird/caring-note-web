import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CounselAssistantDialogTypes } from './constants/modal';
import {
  CounselSurveyType,
  useCounselSurveyStore,
} from '@/pages/Survey/{counselsession_id}/store/surveyInfoStore';
import { useSelectCounseleedetailInfo } from '@/pages/Counselee/hooks/query/useCounseleeInfoQuery';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HealthInfo from './tabs/HealthInfo';
import BaseInfo from './tabs/BaseInfo';
import IndependentInfo from './tabs/IndependentInfo';
import LivingInfo from './tabs/LivingInfo';
import { useSelectCounselCard } from './hooks/useCounselAssistantQuery';


const SurveyHeader = ({
  counseleeInfo,
  isFirstConsult,
  onTempSave,
  onComplete,
}: {
  counseleeInfo: any;
  isFirstConsult: boolean;
  onTempSave: () => void;
  onComplete: () => void;
}) => (
  <div className="bg-white h-fit">
    <div className="pl-[5.75rem] pr-[9.5rem] pt-12 pb-1 border-b border-grayscale-05 flex justify-between">
      <div>
        <div className="text-h3 font-bold">
          {counseleeInfo?.name}
          <span className="text-subtitle2 font-bold"> 님</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="tertiary" size="xl" onClick={onTempSave}>
          임시 저장
        </Button>
        <Button variant="primary" size="xl" onClick={onComplete}>
          기록 완료
        </Button>
      </div>
    </div>
  </div>
);

const Survey = () => {
  const { counselSessionId } = useParams();
  const { setCounselSurvey } = useCounselSurveyStore();
  const [dialogType, setDialogType] =
    useState<CounselAssistantDialogTypes>(null);
  // 자립생활 역량 탭 열기 상태
  const [openIndependentInfoTab, setOpenIndependentInfoTab] = useState(false);
  // 내담자 기본 정보 조회
  const { data: counseleeBasicInfo } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );
  // 내담자 상세 정보 조회
  const { data: counseleeDetailInfo } = useSelectCounseleedetailInfo(
    counseleeBasicInfo?.counseleeId ?? '',
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
      setCounselSurvey((prevState: CounselSurveyType) => ({
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

  const isFirstConsult = counseleeBasicInfo?.counselCount === 0;
  const age = `만 ${counseleeBasicInfo?.age}세`;

  return (
    <Tabs defaultValue="baseInfo" className="w-full h-full">
      <div className="sticky top-0 z-10">
        <SurveyHeader
          counseleeInfo={counseleeBasicInfo}
          isFirstConsult={isFirstConsult}
          onTempSave={() => openModal('TEMP_SAVE')}
          onComplete={() => openModal('REGISTER')}
        />
      </div>

       <div className="w-full h-full overflow-y-auto mb-100">
          <TabsContent value="baseInfo">
            <BaseInfo />
          </TabsContent>
          <TabsContent value="healthInfo">
            <HealthInfo />
          </TabsContent>
          <TabsContent value="independentInfo">
            <IndependentInfo />
          </TabsContent>
          <TabsContent value="livingInfo">
            <LivingInfo />
          </TabsContent>
        </div>
      </Tabs>
  );
};

export default Survey;
