import React from 'react';
import {
  AddCounselCardReqCardRecordStatusEnum,
  CounselCardRes,
} from '../../api/api';
import {
  useCounselCardQuery,
  useCreateCounselCardMutation,
  useUpdateCounselCardMutation,
} from '../../pages/Survey/hooks/useCounselCardQuery';
import { useCounselCardStore } from '../../store/counselCardStore';

interface CounselCardManagerProps {
  counselSessionId: string;
}

const CounselCardManager: React.FC<CounselCardManagerProps> = ({
  counselSessionId,
}) => {
  const { counselCardData, isLoading, error } = useCounselCardStore();
  const { data } = useCounselCardQuery(counselSessionId);

  const createCounselCard = useCreateCounselCardMutation();
  const updateCounselCard = useUpdateCounselCardMutation();

  const handleCreateCard = () => {
    const newCardData: Partial<CounselCardRes> = {
      cardRecordStatus: AddCounselCardReqCardRecordStatusEnum.InProgress,
      counselPurposeAndNote: {
        counselPurpose: new Set(['MEDICATION_REVIEW']),
        significantNote: '중요 메모',
        medicationNote: '약물 메모',
      },
      allergy: {
        allergyNote: '알레르기 정보',
      },
      // 필요한 다른 정보들을 여기에 추가할 수 있습니다.
    };

    createCounselCard.mutate(
      {
        counselSessionId,
        counselCardData: newCardData,
      },
      {
        onSuccess: (data) => {
          console.log('상담 카드 생성 성공:', data);
          // 성공 후 추가 동작 수행
        },
      },
    );
  };

  const handleUpdateCard = () => {
    if (!counselCardData) return;

    const updatedData: Partial<CounselCardRes> = {
      ...counselCardData,
      cardRecordStatus: AddCounselCardReqCardRecordStatusEnum.Completed,
      counselPurposeAndNote: {
        ...counselCardData.counselPurposeAndNote,
        significantNote: '업데이트된 중요 메모',
      },
    };

    updateCounselCard.mutate(
      {
        counselSessionId,
        counselCardData: updatedData,
      },
      {
        onSuccess: (data) => {
          console.log('상담 카드 업데이트 성공:', data);
          // 성공 후 추가 동작 수행
        },
      },
    );
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  return (
    <div>
      <h2>상담 카드 관리</h2>

      {!data && <button onClick={handleCreateCard}>새 상담 카드 생성</button>}

      {data && (
        <div>
          <h3>상담 카드 정보</h3>
          <p>상태: {counselCardData?.cardRecordStatus}</p>
          <p>메모: {counselCardData?.counselPurposeAndNote?.significantNote}</p>

          <button onClick={handleUpdateCard}>상담 카드 업데이트</button>
        </div>
      )}
    </div>
  );
};

export default CounselCardManager;
