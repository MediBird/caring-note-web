import { SelectCounseleeBaseInformationByCounseleeIdRes } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useParams } from 'react-router-dom';
import MedicineMemo from './components/tabs/MedicineMemo';
import MedicineConsult from './components/tabs/MedicineConsult';
import ConsultCard from './components/tabs/ConsultCard';
import PastConsult from './components/tabs/PastConsult';
import DiscardMedicine from './components/tabs/DiscardMedicine';
interface InfoItemProps {
  icon: string;
  content: React.ReactNode;
  showBorder?: boolean;
}

const InfoItem = ({ icon, content, showBorder = true }: InfoItemProps) => (
  <div
    className={`flex items-center px-[0.375rem] text-grayscale-70 ${
      showBorder ? 'border-r border-grayscale-10' : ''
    }`}>
    <span className="text-subtitle-2 pr-[0.25rem]">{icon}</span>
    <span>{content}</span>
  </div>
);

interface HeaderButtonsProps {
  onSave: () => void;
  onComplete: () => void;
}

const HeaderButtons = ({ onSave, onComplete }: HeaderButtonsProps) => (
  <div className="flex gap-3">
    <Button variant="tertiary" size="xl" onClick={onSave}>
      임시 저장
    </Button>
    <Button variant="primary" size="xl" onClick={onComplete}>
      설문 완료
    </Button>
  </div>
);

const ConsultHeader = ({
  counseleeInfo,
  consultStatus,
  age,
  diseases,
}: {
  counseleeInfo: SelectCounseleeBaseInformationByCounseleeIdRes;
  consultStatus: string;
  age: string;
  diseases: React.ReactNode;
}) => (
  <div>
    <div className=" bg-white h-[167px]">
      <div className="pl-[5.75rem] pr-[9.5rem] pt-12 pb-1 border-b border-grayscale-05 flex justify-between">
        <div>
          <div className="text-h3 font-bold">
            {counseleeInfo?.name}
            <span className="text-subtitle2 font-bold"> 님</span>
          </div>
          <div className="mt-2 flex items-center text-body1 font-medium text-grayscale-60">
            <InfoItem icon="📍" content={consultStatus} />
            <InfoItem icon="🎂" content={age} />
            <InfoItem icon="💊" content={diseases} showBorder={false} />
          </div>
        </div>
        <HeaderButtons
          onSave={() => console.log('임시 저장')}
          onComplete={() => console.log('설문 완료')}
        />
      </div>
      <ConsultTabs />
    </div>
  </div>
);

const ConsultTabs = () => (
  <TabsList className="w-full flex justify-start pl-[5.75rem] gap-5 border-b border-grayscale-10">
    <TabsTrigger value="pastConsult">이전 상담 내역</TabsTrigger>
    <TabsTrigger value="survey">기초 설문 내역</TabsTrigger>
    <TabsTrigger value="medicine">의약물 기록</TabsTrigger>
    <TabsTrigger value="note">중재 기록 작성</TabsTrigger>
    <TabsTrigger value="wasteMedication">폐의약물 기록</TabsTrigger>
  </TabsList>
);

export function Index() {
  const { counselSessionId } = useParams();
  const { data: counseleeInfo, isLoading } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const formatDiseases = (diseases: string[] | undefined) => {
    if (!diseases?.length) return '';

    if (diseases.length <= 3) {
      return diseases.join(' · ');
    }

    return (
      <>
        {diseases.slice(0, 3).join(' · ')}
        <span className="text-grayscale-30">
          {` 외 ${diseases.length - 3}개의 질병`}
        </span>
      </>
    );
  };

  const consultStatus =
    counseleeInfo?.counselCount === 0 ? '초기 상담' : '재상담';
  const age = `만 ${counseleeInfo?.age}세`;
  const diseases = formatDiseases(counseleeInfo?.diseases);

  return (
    <Tabs defaultValue="pastConsult" className="w-full h-full">
      <div className="sticky top-0 z-1">
        <ConsultHeader
          counseleeInfo={
            counseleeInfo as SelectCounseleeBaseInformationByCounseleeIdRes
          }
          consultStatus={consultStatus}
          age={age}
          diseases={diseases}
        />
      </div>
      <div className="w-full h-full overflow-y-auto mb-100">
        <TabsContent value="pastConsult">
          <PastConsult />
        </TabsContent>
        <TabsContent value="survey">
          <ConsultCard />
        </TabsContent>
        <TabsContent value="medicine">
          <MedicineMemo />
        </TabsContent>
        <TabsContent value="note">
          <MedicineConsult />
        </TabsContent>
        <TabsContent value="wasteMedication">
          <DiscardMedicine />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Index;
