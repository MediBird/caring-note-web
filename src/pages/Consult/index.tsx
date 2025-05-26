import { SelectCounseleeBaseInformationByCounseleeIdRes } from '@/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

export function Index() {
  const { counselSessionId } = useParams();

  const [isConsultDataLoading, setIsConsultDataLoading] = useState(false);

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
    mutate: saveMedicationRecordList,
    isSuccess: isSuccessSaveMedicationRecordList,
  } = useMedicationRecordSave({ counselSessionId: counselSessionId ?? '' });

  // 중재 기록 저장
  const {
    mutate: saveMedicationCounsel,
    isSuccess: isSuccessSaveMedicationCounsel,
  } = useSaveMedicineConsult();

  useEffect(() => {
    if (
      isSuccessSaveMedicationRecordList &&
      isSuccessWasteMedication &&
      isSuccessSaveMedicationCounsel
    ) {
      toast.info('작성하신 내용을 성공적으로 저장하였습니다.');
    }
  }, [
    isSuccessSaveMedicationRecordList,
    isSuccessWasteMedication,
    isSuccessSaveMedicationCounsel,
  ]);

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

  const saveConsult = useCallback(async () => {
    if (!counselSessionId) return;

    try {
      await Promise.all([
        saveWasteMedication(),
        saveMedicationRecordList(),
        saveMedicationCounsel(),
      ]);

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
        className="flex h-screen w-full flex-col"
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
        />
        {isConsultDataLoading ? (
          <Spinner />
        ) : (
          <TabContents hasPreviousConsult={hasPreviousConsult} />
        )}
      </Tabs>
    </>
  );
}

export default Index;
