import {
  WasteMedicationDisposalDrugRemainActionTypeEnum,
  WasteMedicationDisposalReqUnusedReasonTypesEnum,
} from '@/api/api';
import { useWasteMedicationDisposalQuery } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationDisposalQuery';
import {
  initialWasteMedicationDisposalState,
  useWasteMedicationDisposalStore,
} from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { AddAndUpdateWasteMedicationDisposalDTO } from '@/types/WasteMedicationDTO';
import Badge from '@/components/common/Badge';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import WasteMedicationTable from '@/pages/Consult/components/table/WasteMedicationTable';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import WasteMedicationSurvey from '@/pages/Consult/components/WaseMedicationSurvey';

const DiscardMedicine = () => {
  const { counselSessionId } = useParams();

  //폐의약품 설문 조회
  const {
    data: wasteMedicationDisposalData,
    isSuccess: isSuccessWasteMedicationDisposal,
  } = useWasteMedicationDisposalQuery(counselSessionId as string);

  //폐의약품 설문 store
  const { wasteMedicationDisposal, setWasteMedicationDisposal } =
    useWasteMedicationDisposalStore();

  const handleUnusedReasonTypesChange = (
    type: WasteMedicationDisposalReqUnusedReasonTypesEnum,
    checked: CheckedState,
  ) => {
    if (checked) {
      setWasteMedicationDisposal({
        ...wasteMedicationDisposal,
        unusedReasonTypes: [
          ...(wasteMedicationDisposal.unusedReasonTypes ?? []),
          type,
        ],
      });
    } else {
      setWasteMedicationDisposal({
        ...wasteMedicationDisposal,
        unusedReasonTypes: (
          wasteMedicationDisposal.unusedReasonTypes ?? []
        ).filter((reason) => reason !== type),
      });
    }
  };

  const showTable = useMemo(
    () => !!wasteMedicationDisposal.drugRemainActionType,
    [wasteMedicationDisposal.drugRemainActionType],
  );
  const isNone = useMemo(
    () =>
      wasteMedicationDisposal.drugRemainActionType ===
      WasteMedicationDisposalDrugRemainActionTypeEnum.None,
    [wasteMedicationDisposal.drugRemainActionType],
  );

  // 초기 로딩시 폐의약품 설문 저장
  useEffect(() => {
    if (isSuccessWasteMedicationDisposal && wasteMedicationDisposalData) {
      setWasteMedicationDisposal(
        wasteMedicationDisposalData
          ? ({
              unusedReasonTypes: wasteMedicationDisposalData.unusedReasons?.map(
                (reason) =>
                  reason as WasteMedicationDisposalReqUnusedReasonTypesEnum,
              ),
              unusedReasonDetail:
                wasteMedicationDisposalData.unusedReasonDetail ?? '',
              drugRemainActionType:
                wasteMedicationDisposalData.drugRemainActionType ?? undefined,
              drugRemainActionDetail:
                wasteMedicationDisposalData.drugRemainActionDetail ?? '',
              recoveryAgreementType:
                wasteMedicationDisposalData.recoveryAgreementType ?? undefined,
              wasteMedicationGram:
                wasteMedicationDisposalData.wasteMedicationGram ?? 0,
            } as AddAndUpdateWasteMedicationDisposalDTO)
          : initialWasteMedicationDisposalState,
      );
    }
  }, [
    isSuccessWasteMedicationDisposal,
    wasteMedicationDisposalData,
    setWasteMedicationDisposal,
    counselSessionId,
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>폐의약품의 처리</CardTitle>
        </div>
      </CardHeader>

      <WasteMedicationSurvey
        wasteMedicationDisposal={wasteMedicationDisposal}
        setWasteMedicationDisposal={setWasteMedicationDisposal}
        handleUnusedReasonTypesChange={handleUnusedReasonTypesChange}
      />

      <div className="mt-10">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            {showTable && !isNone && (
              <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle>폐의약품 목록</CardTitle>
              </CardHeader>
            )}

            {showTable && isNone && (
              <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle className="!text-grayscale-40">
                  폐의약품 목록
                </CardTitle>
                <span className="text-grayscale-40 !mt-0">(해당 없음)</span>
              </CardHeader>
            )}

            {!showTable && (
              <CardHeader className="flex items-center justify-center gap-3 flex-row">
                <CardTitle className="!text-grayscale-40 leading-1">
                  폐의약품 목록
                </CardTitle>
                <Badge
                  className="!mt-0 px-[6px] py-[6px] gap-[2px]"
                  variant="tint"
                  customIcon={<InfoIcon width={20} height={20} />}>
                  상단 선택지를 먼저 골라주세요
                </Badge>
              </CardHeader>
            )}
          </div>
        </div>
        <WasteMedicationTable
          counselSessionId={counselSessionId as string}
          showTable={showTable}
          isNone={isNone}
        />
      </div>
    </Card>
  );
};

export default DiscardMedicine;
