import {
  AddAndUpdateMedicationRecordHistReq,
  SelectCounseleeBaseInformationByCounseleeIdRes,
} from '@/api';
import Spinner from '@/components/common/Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useRecording } from '@/hooks/useRecording';
import PastConsult from '@/pages/Consult/components/tabs/PastConsult';
import { useGetIsRecordingPopupQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetIsRecordingPopupQuery';
import { useMedicationRecordSave } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordSave';
import { useSaveMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useSaveWasteMedication } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useSaveWasteMedication';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import FinishConsultDialog from './components/FinishConsultDialog';
import RecordingDialog from './components/recording/RecordingDialog';
import ConsultCard from './components/tabs/ConsultCard';
import DiscardMedicine from './components/tabs/DiscardMedicine';
import MedicineConsult from './components/tabs/MedicineConsult';
import MedicineMemo from './components/tabs/MedicineMemo';
import TemporarySaveDialog from './components/TemporarySaveDialog';

interface InfoItemProps {
  icon: string;
  content: React.ReactNode;
  showDivider?: boolean;
}

const InfoItem = ({ icon, content, showDivider = true }: InfoItemProps) => (
  <div className="flex items-center gap-[6px]">
    <div className="flex items-center">
      <span className="text-subtitle-2 pr-[0.25rem]">{icon}</span>
      <span className="text-grayscale-70">{content}</span>
    </div>
    {showDivider && (
      <div className="mr-[6px] h-[16px] w-[1px] bg-grayscale-10" />
    )}
  </div>
);

interface HeaderButtonsProps {
  onSave: () => void;
  onComplete: () => void;
  name?: string;
}

const HeaderButtons = ({ onSave, onComplete, name }: HeaderButtonsProps) => (
  <div className="flex gap-3">
    <TemporarySaveDialog onSave={onSave} />
    <FinishConsultDialog name={name} onComplete={onComplete} />
  </div>
);

const ConsultHeader = ({
  counseleeInfo,
  consultStatus,
  age,
  diseases,
  saveConsult,
}: {
  counseleeInfo: SelectCounseleeBaseInformationByCounseleeIdRes;
  consultStatus: string;
  age: string;
  diseases: React.ReactNode;
  saveConsult: () => void;
  recordingStatus: RecordingStatus;
}) => (
  <div className="sticky top-0 z-10">
    <div className="h-fit bg-white">
      <div className="border-grayscale-05 border-b pb-1 pt-12">
        <div className="mx-auto flex w-full max-w-layout justify-between px-layout [&>*]:max-w-content">
          <div>
            <div className="text-h3 font-bold">
              {counseleeInfo?.name}
              <span className="text-subtitle2 font-bold"> 님</span>
            </div>
            <div className="mt-3 flex items-center pl-[7px] text-body1 font-medium text-grayscale-60">
              <InfoItem icon="📍" content={consultStatus} />
              <InfoItem icon="🎂" content={age} />
              <InfoItem icon="💊" content={diseases} showDivider={false} />
            </div>
          </div>
          <HeaderButtons
            onSave={saveConsult}
            onComplete={() => console.log('설문 완료')}
            name={counseleeInfo?.name}
          />
        </div>
      </div>
      <ConsultTabs />
    </div>
  </div>
);

const ConsultTabs = () => (
  <TabsList className="w-full border-b border-grayscale-10">
    <div className="mx-auto flex h-full w-full max-w-layout justify-start gap-5 px-layout [&>*]:max-w-content">
      <TabsTrigger value="pastConsult">이전 상담 내역</TabsTrigger>
      <TabsTrigger value="survey">기초 설문 내역</TabsTrigger>
      <TabsTrigger value="medicine">의약물 기록</TabsTrigger>
      <TabsTrigger value="note">중재 기록 작성</TabsTrigger>
      <TabsTrigger value="wasteMedication">폐의약물 기록</TabsTrigger>
    </div>
  </TabsList>
);

export function Index() {
  const { counselSessionId } = useParams();
  const { data: counseleeInfo, isLoading } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );
  const { saveWasteMedication } = useSaveWasteMedication(
    counselSessionId ?? '',
  );
  const { mutate: saveMedicationCounsel } = useSaveMedicineConsult();
  const { medicineConsult } = useMedicineConsultStore();
  const { medicationRecordList } = useMedicineMemoStore();
  const { recordingStatus, resetRecording } = useRecording();
  const { saveMedicationRecordList } = useMedicationRecordSave();
  const { isSuccess: isSuccessGetIsRecordingPopup, data: isPopup } =
    useGetIsRecordingPopupQuery(counselSessionId);
  const { activeTab, setActiveTab } = useConsultTabStore();

  useEffect(() => {
    resetRecording();
  }, [resetRecording]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
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
  const diseases = formatDiseases(Array.from(counseleeInfo?.diseases || []));

  const saveConsult = () => {
    saveWasteMedication();
    saveMedicationCounsel(medicineConsult);
    saveMedicationRecordList({
      counselSessionId: counselSessionId ?? '',
      medicationRecordHistList:
        medicationRecordList as unknown as AddAndUpdateMedicationRecordHistReq[],
    });
    toast.success('작성하신 내용을 성공적으로 저장하였습니다.');
  };

  return (
    <>
      <Tabs
        className="h-full w-full"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as ConsultTab);
        }}>
        <ConsultHeader
          counseleeInfo={
            counseleeInfo as SelectCounseleeBaseInformationByCounseleeIdRes
          }
          consultStatus={consultStatus}
          age={age}
          diseases={diseases}
          saveConsult={saveConsult}
          recordingStatus={recordingStatus}
        />
        <div className="mb-100 h-full w-full px-layout pb-10 pt-10 [&>*]:mx-auto [&>*]:max-w-content">
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

      {/* 녹음 진행 여부 Dialog */}
      {isSuccessGetIsRecordingPopup && isPopup && <RecordingDialog />}
    </>
  );
}

export default Index;
