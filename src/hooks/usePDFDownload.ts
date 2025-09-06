import { useState } from 'react';
import {
  CounselCardControllerApi,
  MedicationRecordHistControllerApi,
  AICounselSummaryControllerApi,
  MedicationCounselControllerApi,
  SelectCounselSessionRes,
} from '@/api';
import { generateCounselSessionPDFFromHTML } from '@/utils/htmlToPdfGenerator';
import { toast } from 'sonner';

const counselCardControllerApi = new CounselCardControllerApi();
const medicationRecordHistControllerApi =
  new MedicationRecordHistControllerApi();
const aiSummaryControllerApi = new AICounselSummaryControllerApi();
const medicationCounselControllerApi = new MedicationCounselControllerApi();

export const usePDFDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadSessionPDF = async (session: SelectCounselSessionRes) => {
    if (!session.counselSessionId || !session.counseleeName) {
      toast.error('상담 세션 정보가 부족합니다.');
      return;
    }

    setIsGenerating(true);

    try {
      // 병렬로 모든 데이터 가져오기
      const [
        baseInfoResponse,
        healthInfoResponse,
        livingInfoResponse,
        independentLifeInfoResponse,
        medicationRecordResponse,
        aiSummaryResponse,
        interventionRecordResponse,
      ] = await Promise.allSettled([
        // 기본 정보
        counselCardControllerApi.selectMainCounselBaseInformation(
          session.counselSessionId,
        ),
        // 건강 정보
        counselCardControllerApi.selectMainCounselHealthInformation(
          session.counselSessionId,
        ),
        // 생활 정보
        counselCardControllerApi.selectMainCounselLivingInformation(
          session.counselSessionId,
        ),
        // 자립 생활 정보
        counselCardControllerApi.selectMainCounselIndependentLifeInformation(
          session.counselSessionId,
        ),
        // 약물 기록
        medicationRecordHistControllerApi.selectMedicationRecordListBySessionId1(
          session.counselSessionId,
        ),
        // AI 요약
        aiSummaryControllerApi.selectAnalysedText(session.counselSessionId),
        // 중재 기록
        medicationCounselControllerApi.selectMedicationCounsel(
          session.counselSessionId,
        ),
      ]);

      // 데이터 추출
      const baseInfo =
        baseInfoResponse.status === 'fulfilled'
          ? baseInfoResponse.value.data.data
          : undefined;
      const healthInfo =
        healthInfoResponse.status === 'fulfilled'
          ? healthInfoResponse.value.data.data
          : undefined;
      const livingInfo =
        livingInfoResponse.status === 'fulfilled'
          ? livingInfoResponse.value.data.data
          : undefined;
      const independentLifeInfo =
        independentLifeInfoResponse.status === 'fulfilled'
          ? independentLifeInfoResponse.value.data.data
          : undefined;

      const medicationRecords =
        medicationRecordResponse.status === 'fulfilled'
          ? medicationRecordResponse.value.data.data || []
          : [];
      const prescriptionMedications = medicationRecords.filter(
        (med) => med.divisionCode === 'PRESCRIPTION',
      );
      const otcMedications = medicationRecords.filter(
        (med) => med.divisionCode === 'OTC',
      );

      const aiSummary =
        aiSummaryResponse.status === 'fulfilled'
          ? aiSummaryResponse.value.data.data?.analysedText
          : undefined;
      const interventionRecord =
        interventionRecordResponse.status === 'fulfilled'
          ? interventionRecordResponse.value.data.data?.counselRecord
          : undefined;

      // PDF 생성
      await generateCounselSessionPDFFromHTML({
        session,
        interventionRecord,
        aiSummary,
        baseInfo,
        healthInfo,
        livingInfo,
        independentLifeInfo,
        prescriptionMedications,
        otcMedications,
      });

      toast.success('PDF 다운로드가 완료되었습니다.');
    } catch (error) {
      console.error('PDF 생성 중 오류가 발생했습니다:', error);
      toast.error('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    downloadSessionPDF,
    isGenerating,
  };
};
