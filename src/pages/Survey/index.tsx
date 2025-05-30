import { CounselCardBaseInformationResCardRecordStatusEnum } from '@/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/ui/Header';
import BasicInfo from './components/tabs/BasicInfo';
import HealthInfo from './components/tabs/HealthInfo';
import IndependentLivingAssessment from './components/tabs/IndependentLivingAssessment';
import LivingInfo from './components/tabs/LivingInfo';
import { useCounselCardStore } from './hooks/counselCardStore';
import {
  useCompleteCounselCard,
  useCounselCardBaseInfoQuery,
  useCounselCardHealthInfoQuery,
  useCounselCardIndependentLifeInfoQuery,
  useCounselCardLivingInfoQuery,
  useSaveCounselCardDraft,
} from './hooks/useCounselCardQuery';

const tabItems = [
  { id: 'basicInfo', name: '기본 정보', component: BasicInfo },
  { id: 'healthInfo', name: '건강 정보', component: HealthInfo },
  { id: 'livingInfo', name: '생활 정보', component: LivingInfo },
  {
    id: 'independentLiving',
    name: '자립생활 역량',
    component: IndependentLivingAssessment,
  },
];

export default function Survey() {
  const { counselSessionId } = useParams<{ counselSessionId: string }>();
  const [activeTab, setActiveTab] = useState(tabItems[0].id);
  const [isLoading, setIsLoading] = useState(true);
  const { saveDraft } = useSaveCounselCardDraft();
  const { complete } = useCompleteCounselCard();
  const navigate = useNavigate();
  const location = useLocation();
  const { setCounselSessionId } = useCounselCardStore();

  // 페이지 진입 시에만 데이터를 fetch
  const { data: baseInfoData, isLoading: isBaseInfoLoading } =
    useCounselCardBaseInfoQuery(
      counselSessionId ?? '',
      true, // fetchOnMount를 true로 설정
    );

  // 중복 호출 제거하고 각 데이터의 로딩 상태 가져오기
  const { isLoading: isHealthInfoLoading } = useCounselCardHealthInfoQuery(
    counselSessionId ?? '',
    true,
  );
  const { isLoading: isLivingInfoLoading } = useCounselCardLivingInfoQuery(
    counselSessionId ?? '',
    true,
  );
  const { isLoading: isIndependentLifeInfoLoading } =
    useCounselCardIndependentLifeInfoQuery(counselSessionId ?? '', true);

  // 모든 데이터의 로딩 상태 통합 관리
  useEffect(() => {
    setIsLoading(
      isBaseInfoLoading ||
        isHealthInfoLoading ||
        isLivingInfoLoading ||
        isIndependentLifeInfoLoading,
    );
  }, [
    isBaseInfoLoading,
    isHealthInfoLoading,
    isLivingInfoLoading,
    isIndependentLifeInfoLoading,
  ]);

  const isCompleted =
    baseInfoData?.cardRecordStatus ===
    CounselCardBaseInformationResCardRecordStatusEnum.Completed;

  useEffect(() => {
    if (counselSessionId) {
      setCounselSessionId(counselSessionId);
    }
  }, [counselSessionId, setCounselSessionId]);

  const handleSaveDraft = async () => {
    const success = await saveDraft(counselSessionId ?? '');
    if (success) {
      toast.info('임시 저장되었습니다.');
    }
  };

  const handleComplete = async () => {
    const success = await complete(counselSessionId ?? '');
    if (success) {
      toast.info(
        isCompleted ? '수정이 완료되었습니다.' : '설문이 완료되었습니다.',
      );

      // location.state를 통해 이전 페이지가 ConsultCard인지 확인
      const fromConsult = location.state?.fromConsult === true;

      if (fromConsult) {
        navigate(`/consult/${counselSessionId}`);
      } else {
        navigate('/');
      }
    }
  };

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex w-full flex-col">
      <div className="sticky top-0 z-10 flex-none">
        <Header
          title={
            <div className="flex w-full items-end justify-between">
              <span>기초 설문 작성</span>
              <div className="flex gap-2 text-body1 font-semibold">
                {!isCompleted && (
                  <Button
                    variant="tertiary"
                    size="xl"
                    onClick={() => handleSaveDraft()}>
                    임시 저장
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="xl"
                  onClick={() => handleComplete()}>
                  {isCompleted ? '수정 완료' : '설문 완료'}
                </Button>
              </div>
            </div>
          }
          description=""
        />
        <TabsList className="sticky top-0 z-10 w-full border-b border-grayscale-10 bg-white">
          <div className="mx-auto flex h-full w-full max-w-layout justify-start gap-5 px-layout [&>*]:max-w-content">
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.name}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="mb-100 w-full px-layout pb-10 pt-10 [&>*]:mx-auto [&>*]:max-w-content">
          {tabItems.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <tab.component />
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
