import {
  CounselCardBaseInformationResCardRecordStatusEnum,
  CounseleeControllerApi,
} from '@/api';
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
import {
  useCompleteCounselCard,
  useCounselCardBaseInfoQuery,
  useSaveCounselCardDraft,
} from './hooks/useCounselCardQuery';

const counseleeControllerApi = new CounseleeControllerApi();

const tabItems = [
  { id: 'basicInfo', name: '기본 정보', component: BasicInfo },
  { id: 'healthInfo', name: '건강 정보', component: HealthInfo },
  { id: 'livingInfo', name: '생활 정보', component: LivingInfo },
  {
    id: 'independentLiving',
    name: '자립생활 역량',
    component: IndependentLivingAssessment,
    showOnlyForDisabled: true,
  },
];

export default function Survey() {
  const { counselSessionId } = useParams<{ counselSessionId: string }>();
  const [activeTab, setActiveTab] = useState(tabItems[0].id);
  const [isDisability, setIsDisability] = useState<boolean | null>(null);
  const [filteredTabItems, setFilteredTabItems] = useState(tabItems);
  const { saveDraft } = useSaveCounselCardDraft();
  const { complete } = useCompleteCounselCard();
  const { data: baseInfoData } = useCounselCardBaseInfoQuery(
    counselSessionId ?? '',
  );
  const navigate = useNavigate();
  const location = useLocation();
  const isCompleted =
    baseInfoData?.cardRecordStatus ===
    CounselCardBaseInformationResCardRecordStatusEnum.Completed;

  useEffect(() => {
    const fetchCounseleeInfo = async () => {
      if (baseInfoData?.baseInfo?.counseleeId) {
        try {
          const response =
            await counseleeControllerApi.selectCounseleeBaseInformation(
              counselSessionId ?? '',
            );

          if (response.data.data) {
            setIsDisability(response.data.data.isDisability ?? false);
          }
        } catch (error) {
          console.error('내담자 정보를 불러오는 데 실패했습니다.', error);
          setIsDisability(false);
        }
      }
    };

    fetchCounseleeInfo();
  }, [baseInfoData, counselSessionId]);

  useEffect(() => {
    // 장애 여부에 따라 탭 필터링
    if (isDisability !== null) {
      const newFilteredTabs = tabItems.filter(
        (tab) => !tab.showOnlyForDisabled || isDisability,
      );

      setFilteredTabItems(newFilteredTabs);

      // 현재 활성화된 탭이 필터링된 후에도 존재하는지 확인
      if (activeTab === 'independentLiving' && !isDisability) {
        setActiveTab(newFilteredTabs[0].id);
      }
    }
  }, [isDisability, activeTab]);

  const handleSaveDraft = async () => {
    const success = await saveDraft(counselSessionId ?? '');
    if (success) {
      toast.success('임시 저장되었습니다.');
    }
  };

  const handleComplete = async () => {
    const success = await complete(counselSessionId ?? '');
    if (success) {
      toast.success(
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

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex h-screen w-full flex-col">
      <div className="flex-none">
        <Header
          title={
            <div className="flex w-full items-end justify-between">
              <span>기초 설문 작성</span>
              <div className="flex gap-2 text-body1 font-bold">
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
            {filteredTabItems.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.name}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="mb-100 w-full px-layout pb-10 pt-10 [&>*]:mx-auto [&>*]:max-w-content">
          {filteredTabItems.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <tab.component counselSessionId={counselSessionId ?? ''} />
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
