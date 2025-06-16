import { SelectCounseleeBaseInformationByCounseleeIdRes } from '@/api';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Spinner from '@/components/common/Spinner';
import { Tabs } from '@/components/ui/tabs';
import { useSelectCounseleeInfo, useCounselSessionQueryById } from '@/hooks';
import useUpdateCounselSessionStatus from '@/hooks/useUpdateCounselSessionStatus';
import TabContents from '@/pages/Consult/components/TabContents';
import {
  useMedicationRecordSave,
  useSaveWasteMedication,
  usePrevCounselSessionList,
  useSaveMedicineConsult,
} from '@/pages/Consult/hooks/query';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useInitializeIntervention } from './hooks/useInitializeIntervention';
import { useInitializeMedicationRecord } from './hooks/useInitializeMedicationRecord';
import { useInitializeWasteMedication } from './hooks/useInitializeWasteMedication';
import ConsultHeader from '@/pages/Consult/components/ConsultHeader';
import RecordingDialog from '@/pages/Consult/components/recording/RecordingDialog';
import {
  useRecordingStore,
  recordingSelectors,
} from '@/pages/Consult/hooks/store/useRecordingStore';
import { useAISummaryStatus } from '@/pages/Consult/hooks/query/useAISummaryQuery';
import { RecordingControllerRef } from '@/pages/Consult/components/recording/RecordingController';
import { usePageLeaveGuard } from './hooks/usePageLeaveGuard';
import LeavePageDialog from './components/dialog/LeavePageDialog';

export function Index() {
  const { counselSessionId } = useParams();

  const [isConsultDataLoading, setIsConsultDataLoading] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);

  // 페이지 첫 진입 여부를 추적하는 ref
  const hasShownDialogRef = useRef(false);

  // 녹음 상태 가져오기 (선택자 패턴 사용)
  const session = useRecordingStore(recordingSelectors.session);
  const file = useRecordingStore(recordingSelectors.file);
  const timer = useRecordingStore(recordingSelectors.timer);

  // AI 요약 상태 조회 (로딩 상태 확인용)
  const { data: aiSummaryStatusData, isLoading: isAISummaryStatusLoading } =
    useAISummaryStatus(counselSessionId ?? '');

  // recording store의 완료 함수
  const completeRecording = useRecordingStore(
    (state) => state.completeRecording,
  );

  // RecordingController의 함수들을 참조하기 위한 ref
  const recordingControlRef = useRef<RecordingControllerRef | null>(null);

  const { isLoading: isInitializeInterventionLoading } =
    useInitializeIntervention(counselSessionId ?? '');
  const { isLoading: isInitializeMedicationRecordLoading } =
    useInitializeMedicationRecord(counselSessionId ?? '');
  const { isLoading: isInitializeWasteMedicationLoading } =
    useInitializeWasteMedication(counselSessionId ?? '');

  // 내담자 정보 조회
  const { data: counseleeInfo, isLoading } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );

  // 상담 세션 정보 조회
  const { data: counselSessionInfo } = useCounselSessionQueryById(
    counselSessionId ?? '',
  );

  // 이전 상담 내역 조회
  const { prevCounselSessionList } = usePrevCounselSessionList(
    counselSessionId ?? '',
  );

  // 폐의약품 처리 저장
  const { saveWasteMedication, isSuccessWasteMedication } =
    useSaveWasteMedication(counselSessionId ?? '');

  // 약물 기록 저장
  const {
    mutateAsync: saveMedicationRecordList,
    isSuccess: isSuccessSaveMedicationRecordList,
  } = useMedicationRecordSave({ counselSessionId: counselSessionId ?? '' });

  // 중재 기록 저장
  const {
    mutateAsync: saveMedicationCounsel,
    isSuccess: isSuccessSaveMedicationCounsel,
  } = useSaveMedicineConsult();

  const isSuccessSaveConsult = useMemo(() => {
    return (
      isSuccessSaveMedicationRecordList &&
      isSuccessWasteMedication &&
      isSuccessSaveMedicationCounsel
    );
  }, [
    isSuccessSaveMedicationRecordList,
    isSuccessWasteMedication,
    isSuccessSaveMedicationCounsel,
  ]);

  useEffect(() => {
    if (isSuccessSaveConsult) {
      toast.info('작성하신 내용을 성공적으로 저장하였습니다.');
    }
  }, [isSuccessSaveConsult]);

  const { activeTab, setActiveTab } = useConsultTabStore();

  const { mutate: updateCounselSessionStatus } = useUpdateCounselSessionStatus({
    counselSessionId: counselSessionId ?? '',
  });

  const hasPreviousConsult = useMemo(() => {
    return prevCounselSessionList?.length > 0;
  }, [prevCounselSessionList]);

  useEffect(() => {
    if (!hasPreviousConsult) {
      setActiveTab(ConsultTab.consultCard);
    } else {
      setActiveTab(ConsultTab.pastConsult);
    }
  }, [hasPreviousConsult, setActiveTab]);

  useEffect(() => {
    if (
      isInitializeInterventionLoading ||
      isInitializeMedicationRecordLoading ||
      isInitializeWasteMedicationLoading
    ) {
      setIsConsultDataLoading(true);
    } else {
      setIsConsultDataLoading(false);
    }
  }, [
    isInitializeInterventionLoading,
    isInitializeMedicationRecordLoading,
    isInitializeWasteMedicationLoading,
  ]);

  // AI 요약이 이미 완료된 상태라면 recording 상태를 완료로 설정
  useEffect(() => {
    if (
      !isAISummaryStatusLoading &&
      aiSummaryStatusData?.aiCounselSummaryStatus?.toString() ===
        'GPT_COMPLETE' &&
      session.status !== 'completed'
    ) {
      completeRecording();
    }
  }, [
    isAISummaryStatusLoading,
    aiSummaryStatusData,
    session.status,
    completeRecording,
  ]);

  // 페이지 첫 진입시에만 녹음 다이얼로그 표시
  useEffect(() => {
    // 상담 데이터 로딩이 완료되고, AI 요약 상태 로딩이 완료되고,
    // 세션 로딩이 완료되고, 아직 다이얼로그를 보여준 적이 없으며,
    // 녹음이 시작되지 않은 상태이고, AI 요약이 없는 상태에서만 다이얼로그 표시
    const shouldShowDialog =
      !isConsultDataLoading &&
      !isAISummaryStatusLoading &&
      !session.isLoading && // 세션 로딩 완료 확인
      !hasShownDialogRef.current &&
      session.status === 'idle' &&
      !file.blob &&
      timer.totalDuration === 0 &&
      !session.aiSummaryStatus; // AI 요약이 없는 경우에만 다이얼로그 표시

    if (shouldShowDialog) {
      setIsRecordingDialogOpen(true);
      hasShownDialogRef.current = true;
    }
  }, [
    isConsultDataLoading,
    isAISummaryStatusLoading,
    session.isLoading, // 세션 로딩 상태 추가
    session.status,
    file.blob,
    timer.totalDuration,
    session.aiSummaryStatus,
  ]);

  const saveConsult = useCallback(async () => {
    if (!counselSessionId) return;

    try {
      await Promise.all([
        saveWasteMedication(),
        saveMedicationRecordList(),
        saveMedicationCounsel(),
      ]);

      //window.editorWindows 존재 여부 확인
      if (
        window.editorWindows &&
        window.editorWindows[counselSessionId] &&
        !window.editorWindows[counselSessionId].closed
      ) {
        window.editorWindows[counselSessionId].postMessage(
          { type: `MAIN_WINDOW_SAVED_${counselSessionId}` },
          '*',
        );

        setTimeout(() => {
          if (
            window.editorWindows &&
            window.editorWindows[counselSessionId] &&
            !window.editorWindows[counselSessionId].closed
          ) {
            window.editorWindows[counselSessionId].close();
            delete window.editorWindows[counselSessionId];
          }
        }, 300);
      }
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  }, [
    counselSessionId,
    saveWasteMedication,
    saveMedicationRecordList,
    saveMedicationCounsel,
  ]);

  const completeConsult = async () => {
    await saveConsult();

    if (counselSessionInfo?.status !== 'COMPLETED') {
      updateCounselSessionStatus('COMPLETED');
    }
  };

  // 녹음 시작 함수 - ConsultRecordingControl의 로직을 사용
  const handleStartRecording = useCallback(async () => {
    if (recordingControlRef.current?.startRecording) {
      try {
        await recordingControlRef.current.startRecording();
      } catch (error) {
        console.error('녹음 시작 실패:', error);
        toast.error('녹음 시작에 실패했습니다.');
      }
    } else {
      console.warn('recordingControlRef가 준비되지 않았습니다.');
      toast.error('녹음 준비 중입니다. 잠시 후 다시 시도해주세요.');
    }
  }, []);

  // 페이지 이탈 감지 및 처리
  const {
    isLeaveDialogOpen,
    handleLeaveConfirm,
    handleLeaveCancel,
    isRecording,
    hasUnsavedChanges,
  } = usePageLeaveGuard({
    hasUnsavedChanges: !isSuccessSaveConsult, // 저장되지 않은 변경사항이 있는지 확인
    sessionStatus: counselSessionInfo?.status, // 상담 세션 상태 전달
    onBeforeLeave: async () => {
      // 페이지 이탈 전 필요한 처리 (예: 임시 저장)
      console.log('페이지를 떠나기 전 처리 중...');
    },
    onLeaveConfirmed: () => {
      // 페이지 이탈 확인 후 처리
      console.log('페이지 이탈이 확인되었습니다.');
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const consultStatus = hasPreviousConsult ? '재상담' : '초기 상담';

  return (
    <>
      <Tabs
        className="flex w-full flex-col"
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
          saveConsult={saveConsult}
          completeConsult={completeConsult}
          hasPreviousConsult={hasPreviousConsult}
          isSuccessSaveConsult={isSuccessSaveConsult}
          recordingControlRef={recordingControlRef}
          // onRecordingControlReady={() => setIsRecordingControlReady(true)}
        />
        {isConsultDataLoading ? (
          <Spinner />
        ) : (
          <TabContents hasPreviousConsult={hasPreviousConsult} />
        )}
      </Tabs>

      {/* 녹음 시작 다이얼로그 */}
      <RecordingDialog
        open={isRecordingDialogOpen}
        onClose={() => setIsRecordingDialogOpen(false)}
        onStartRecording={handleStartRecording}
      />

      {/* 페이지 이탈 확인 다이얼로그 */}
      <LeavePageDialog
        open={isLeaveDialogOpen}
        onClose={handleLeaveCancel}
        onConfirm={handleLeaveConfirm}
        isRecording={isRecording}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </>
  );
}

export default Index;
