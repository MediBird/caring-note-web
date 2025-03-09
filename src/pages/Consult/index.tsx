import {
  AddAndUpdateMedicationRecordHistReq,
  SelectCounseleeBaseInformationByCounseleeIdRes,
} from '@/api/api';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useRecording } from '@/hooks/useRecording';
import { useGetIsRecordingPopupQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetIsRecordingPopupQuery';
import { useMedicationRecordSave } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordSave';
import { useSaveMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useSaveWasteMedication } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useSaveWasteMedication';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecordingDialog from './components/recording/RecordingDialog';
import ConsultCard from './components/tabs/ConsultCard';
import DiscardMedicine from './components/tabs/DiscardMedicine';
import MedicineConsult from './components/tabs/MedicineConsult';
import MedicineMemo from './components/tabs/MedicineMemo';

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
      <div className="w-[1px] h-[16px] bg-grayscale-10 mr-[6px]" />
    )}
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
  saveConsult,
}: {
  counseleeInfo: SelectCounseleeBaseInformationByCounseleeIdRes;
  consultStatus: string;
  age: string;
  diseases: React.ReactNode;
  saveConsult: () => void;
}) => (
  <div className="sticky top-0 z-10">
    <div className=" bg-white h-fit">
      <div className="pt-12 pb-1 border-b border-grayscale-05">
        <div className="flex justify-between max-w-layout px-layout [&>*]:max-w-content  mx-auto w-full">
          <div>
            <div className="text-h3 font-bold">
              {counseleeInfo?.name}
              <span className="text-subtitle2 font-bold"> 님</span>
            </div>
            <div className="mt-3 pl-[7px] flex items-center text-body1 font-medium text-grayscale-60">
              <InfoItem icon="📍" content={consultStatus} />
              <InfoItem icon="🎂" content={age} />
              <InfoItem icon="💊" content={diseases} showDivider={false} />
            </div>
          </div>
          <HeaderButtons
            onSave={saveConsult}
            onComplete={() => console.log('설문 완료')}
          />
        </div>
      </div>
      <ConsultTabs />
    </div>
  </div>
);

const ConsultTabs = () => (
  <TabsList className="w-full border-b border-grayscale-10">
    <div className="flex gap-5 justify-start max-w-layout px-layout [&>*]:max-w-content mx-auto w-full">
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
  const { resetRecording } = useRecording();
  const { saveMedicationRecordList } = useMedicationRecordSave();
  const { isSuccess: isSuccessGetIsRecordingPopup, data: isPopup } =
    useGetIsRecordingPopupQuery(counselSessionId);

  useEffect(() => {
    resetRecording();
  }, [resetRecording]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
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
  const diseases = formatDiseases(counseleeInfo?.diseases);

  const saveConsult = () => {
    saveWasteMedication();
    saveMedicationCounsel(medicineConsult);
    saveMedicationRecordList({
      counselSessionId: counselSessionId ?? '',
      medicationRecordHistList:
        medicationRecordList as unknown as AddAndUpdateMedicationRecordHistReq[],
    });
  };

  return (
    <>
      <Tabs defaultValue="pastConsult" className="w-full h-full">
        <ConsultHeader
          counseleeInfo={
            counseleeInfo as SelectCounseleeBaseInformationByCounseleeIdRes
          }
          consultStatus={consultStatus}
          age={age}
          diseases={diseases}
          saveConsult={saveConsult}
        />
        <div className="w-full h-full mb-100">
          {/* <TabsContent value="pastConsult">
            <PastConsult />
          </TabsContent> */}
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
