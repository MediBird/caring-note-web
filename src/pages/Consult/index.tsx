import {
  AddAndUpdateMedicationRecordHistReq,
  SelectCounseleeBaseInformationByCounseleeIdRes,
  SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum,
  UpdateStatusInCounselSessionReqStatusEnum,
} from '@/api';
import Spinner from '@/components/common/Spinner';
import { InfoToast } from '@/components/ui/costom-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import useCounselSessionQueryById from '@/hooks/useCounselSessionQueryById';
import { updateRecordingStatus, useRecording } from '@/hooks/useRecording';
import { useRouteStore } from '@/hooks/useRouteStore';
import useUpdateCounselSessionStatus from '@/hooks/useUpdateCounselSessionStatus';
import EditConsultDialog from '@/pages/Consult/components/EditConsultDialog';
import PastConsult from '@/pages/Consult/components/tabs/PastConsult';
import { useGetIsRecordingPopupQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetIsRecordingPopupQuery';
import { useGetRecordingStatusQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetRecordingStatusQuery';
import { useMedicationRecordSave } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordSave';
import { useSaveMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useSaveWasteMedication } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useSaveWasteMedication';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { DISEASE_MAP } from '@/utils/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CheckLeaveOutDialog from './components/CheckLeaveOutDialog';
import FinishConsultDialog from './components/FinishConsultDialog';
import RecordingDialog from './components/recording/RecordingDialog';
import ConsultCard from './components/tabs/ConsultCard';
import DiscardMedicine from './components/tabs/DiscardMedicine';
import MedicineConsult from './components/tabs/MedicineConsult';
import MedicineMemo from './components/tabs/MedicineMemo';
import TemporarySaveDialog from './components/TemporarySaveDialog';
import { useLeaveOutDialogStore } from './hooks/store/useLeaveOutDialogStore';

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
  sessionStatus: UpdateStatusInCounselSessionReqStatusEnum | undefined;
}

const HeaderButtons = ({
  onSave,
  onComplete,
  name,
  sessionStatus,
}: HeaderButtonsProps) => (
  <div className="flex gap-3">
    {sessionStatus !== 'COMPLETED' && <TemporarySaveDialog onSave={onSave} />}
    {sessionStatus === 'COMPLETED' ? (
      <EditConsultDialog onEdit={onComplete} />
    ) : (
      <FinishConsultDialog name={name} onComplete={onComplete} />
    )}
  </div>
);

const ConsultHeader = ({
  counseleeInfo,
  sessionStatus,
  consultStatus,
  age,
  diseases,
  saveConsult,
  completeConsult,
  hasPreviousConsult,
}: {
  counseleeInfo: SelectCounseleeBaseInformationByCounseleeIdRes;
  consultStatus: string;
  sessionStatus: UpdateStatusInCounselSessionReqStatusEnum | undefined;
  age: string;
  diseases: React.ReactNode;
  saveConsult: () => void;
  recordingStatus: RecordingStatus;
  completeConsult: () => void;
  hasPreviousConsult: boolean;
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
            onComplete={completeConsult}
            name={counseleeInfo?.name}
            sessionStatus={sessionStatus}
          />
        </div>
      </div>
      <ConsultTabs hasPreviousConsult={hasPreviousConsult} />
    </div>
  </div>
);

const ConsultTabs = ({
  hasPreviousConsult,
}: {
  hasPreviousConsult: boolean;
}) => (
  <TabsList className="w-full border-b border-grayscale-10">
    <div className="mx-auto flex h-full w-full max-w-layout justify-start gap-5 px-layout [&>*]:max-w-content">
      {hasPreviousConsult && (
        <TabsTrigger value="pastConsult">상담 히스토리</TabsTrigger>
      )}
      <TabsTrigger value="survey">기초 설문 내역</TabsTrigger>
      <TabsTrigger value="medicine">의약물 기록</TabsTrigger>
      <TabsTrigger value="note">중재 기록 작성</TabsTrigger>
      <TabsTrigger value="wasteMedication">폐의약품 처리</TabsTrigger>
    </div>
  </TabsList>
);

export function Index() {
  const { counselSessionId } = useParams();
  const { data: counseleeInfo, isLoading } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );

  const { data: counselSessionInfo } = useCounselSessionQueryById(
    counselSessionId ?? '',
  );

  const { medicineConsult } = useMedicineConsultStore();
  const { medicationRecordList } = useMedicineMemoStore();

  const { previousPath, setPreviousPath } = useRouteStore();
  const { recordingStatus, resetRecording } = useRecording();
  const {
    isOpen: isLeaveOutDialogOpen,
    closeDialog,
    onConfirm,
  } = useLeaveOutDialogStore();

  const { saveWasteMedication, isSuccessWasteMedication } =
    useSaveWasteMedication(counselSessionId ?? '');

  const {
    mutate: saveMedicationCounsel,
    isSuccess: isSuccessSaveMedicationCounsel,
  } = useSaveMedicineConsult();
  const {
    mutate: saveMedicationRecordList,
    isSuccess: isSuccessSaveMedicationRecordList,
  } = useMedicationRecordSave();

  useEffect(() => {
    if (
      isSuccessSaveMedicationCounsel &&
      isSuccessSaveMedicationRecordList &&
      isSuccessWasteMedication
    ) {
      InfoToast({ message: '작성하신 내용을 성공적으로 저장하였습니다.' });
    }
  }, [
    isSuccessSaveMedicationCounsel,
    isSuccessSaveMedicationRecordList,
    isSuccessWasteMedication,
  ]);

  const { isSuccess: isSuccessGetIsRecordingPopup, data: isPopup } =
    useGetIsRecordingPopupQuery(counselSessionId);
  const {
    data: getRecordingStatusData,
    isSuccess: isSuccessGetRecordingStatus,
  } = useGetRecordingStatusQuery(counselSessionId ?? '', recordingStatus);
  const { activeTab, setActiveTab } = useConsultTabStore();

  const { mutate: updateCounselSessionStatus } = useUpdateCounselSessionStatus({
    counselSessionId: counselSessionId ?? '',
  });

  const hasPreviousConsult = useMemo(() => {
    if (!counseleeInfo) return false;

    if (
      counseleeInfo?.counselCount === undefined ||
      counseleeInfo?.counselCount === 0
    )
      return false;

    return counseleeInfo.counselCount > 0;
  }, [counseleeInfo]);

  useEffect(() => {
    if (!hasPreviousConsult) {
      setActiveTab(ConsultTab.consultCard);
    }
  }, [hasPreviousConsult, setActiveTab]);

  useEffect(() => {
    if (!isSuccessGetRecordingStatus) {
      return;
    }

    if (!getRecordingStatusData?.aiCounselSummaryStatus) {
      return;
    }

    const statusMapping: { [key: string]: RecordingStatus } = {
      STT_COMPLETE: RecordingStatus.STTCompleted,
      STT_FAILED: RecordingStatus.Error,
      GPT_COMPLETE: RecordingStatus.AICompleted,
      GPT_FAILED: RecordingStatus.Error,
    };

    const status = statusMapping[getRecordingStatusData.aiCounselSummaryStatus];

    if (status) {
      if (previousPath?.startsWith('/survey')) {
        setPreviousPath('');
      } else {
        updateRecordingStatus(status);
      }
    }
  }, [
    getRecordingStatusData,
    isSuccessGetRecordingStatus,
    resetRecording,
    previousPath,
    setPreviousPath,
  ]);

  const saveConsult = useCallback(async () => {
    try {
      await Promise.all([
        saveWasteMedication(),
        saveMedicationCounsel(medicineConsult),
        saveMedicationRecordList({
          counselSessionId: counselSessionId ?? '',
          medicationRecordHistList:
            medicationRecordList as unknown as AddAndUpdateMedicationRecordHistReq[],
        }),
      ]);
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
    }
  }, [
    saveWasteMedication,
    saveMedicationCounsel,
    medicineConsult,
    saveMedicationRecordList,
    counselSessionId,
    medicationRecordList,
  ]);

  const handleConfirmLeave = () => {
    onConfirm();
    resetRecording();
    closeDialog();
  };

  const completeConsult = async () => {
    await saveConsult();

    if (counselSessionInfo?.status !== 'COMPLETED') {
      updateCounselSessionStatus('COMPLETED');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const formatDiseases = (
    diseases:
      | SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum[]
      | Set<SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum>
      | undefined,
  ) => {
    if (!diseases) return '';

    const diseaseArray = Array.isArray(diseases)
      ? diseases
      : Array.from(diseases);
    if (!diseaseArray.length) return '';

    const mappedDiseases = diseaseArray.map((disease) => DISEASE_MAP[disease]);

    if (mappedDiseases.length <= 3) {
      return mappedDiseases.join(' · ');
    }

    return (
      <>
        {mappedDiseases.slice(0, 3).join(' · ')}
        <span className="text-grayscale-30">
          {` 외 ${mappedDiseases.length - 3}개의 질병`}
        </span>
      </>
    );
  };

  const consultStatus = hasPreviousConsult ? '재상담' : '초기 상담';
  const age = `만 ${counseleeInfo?.age}세`;
  const diseases = formatDiseases(counseleeInfo?.diseases);
  const isRecordingDialogClosed =
    sessionStorage.getItem('isRecordingDialogClosed') === 'true';

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
          sessionStatus={counselSessionInfo?.status}
          consultStatus={consultStatus}
          age={age}
          diseases={diseases}
          saveConsult={saveConsult}
          recordingStatus={recordingStatus}
          completeConsult={completeConsult}
          hasPreviousConsult={hasPreviousConsult}
        />
        <div className="mb-100 h-full w-full px-layout pb-10 pt-6 [&>*]:mx-auto [&>*]:max-w-content">
          {hasPreviousConsult && (
            <TabsContent value="pastConsult">
              <PastConsult />
            </TabsContent>
          )}
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
      {!isLeaveOutDialogOpen &&
        !isRecordingDialogClosed &&
        isSuccessGetIsRecordingPopup &&
        isPopup && <RecordingDialog />}

      {/* 페이지 이탈 Dialog */}
      {isLeaveOutDialogOpen && (
        <CheckLeaveOutDialog onConfirm={handleConfirmLeave} />
      )}
    </>
  );
}

export default Index;
