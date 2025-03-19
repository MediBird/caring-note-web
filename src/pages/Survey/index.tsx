import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/ui/Header';
import BasicInfo from './components/tabs/BasicInfo';
import HealthInfo from './components/tabs/HealthInfo';
import IndependentLivingAssessment from './components/tabs/IndependentLivingAssessment';
import LivingInfo from './components/tabs/LivingInfo';
import {
  useCompleteCounselCard,
  useSaveCounselCardDraft,
} from './hooks/useCounselCardQuery';
import { InfoToast } from '@/components/ui/costom-toast';

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
  const { saveDraft } = useSaveCounselCardDraft();
  const { complete } = useCompleteCounselCard();
  const navigate = useNavigate();
  const handleSaveDraft = async () => {
    const success = await saveDraft(counselSessionId ?? '');
    if (success) {
      InfoToast({ message: '임시 저장되었습니다.' });
    }
  };

  const handleComplete = async () => {
    const success = await complete(counselSessionId ?? '');
    if (success) {
      InfoToast({ message: '설문이 완료되었습니다.' });
    }
    navigate('/');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <Header
        title={
          <div className="flex w-full items-end justify-between">
            <span>기초 설문 작성</span>
            <div className="flex gap-2 text-body1 font-bold">
              <Button
                variant="tertiary"
                size="xl"
                onClick={() => handleSaveDraft()}>
                임시 저장
              </Button>
              <Button
                variant="primary"
                size="xl"
                onClick={() => handleComplete()}>
                설문 완료
              </Button>
            </div>
          </div>
        }
        description=""
      />
      <TabsList className="w-full border-b border-grayscale-10">
        <div className="mx-auto flex h-full w-full max-w-layout justify-start gap-5 px-layout [&>*]:max-w-content">
          {tabItems.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.name}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
      <div className="mb-100 h-full w-full px-layout pb-10 pt-10 [&>*]:mx-auto [&>*]:max-w-content">
        {tabItems.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <tab.component counselSessionId={counselSessionId ?? ''} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
