import { CounselAssistantDialogTypes } from '@/pages/assistant/constants/modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import CloseButton from '@/assets/icon/24/close.outlined.black.svg';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { useCounselAssistantStore } from '@/store/counselAssistantStore';
import {
  usePostCounselAssistant,
  useUpdateCounselAssistant,
} from '@/hooks/useCounselAssistantQuery';
import {
  AddCounselCardReqCardRecordStatusEnum,
  UpdateCounselCardReqCardRecordStatusEnum,
} from '@/api/api';
import { useNavigate, useParams } from 'react-router-dom';

const SaveCounselAssistant = ({
  isOpen,
  dialogType,
  onClose,
}: {
  isOpen: boolean;
  dialogType: CounselAssistantDialogTypes;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  // useParms() 를 통한 URL 파라미터 값 추출
  const { counselSessionId } = useParams();
  // useDetailCounselSessionStore()를 통해 counselSessionStore의 상태값 추출
  const detail = useDetailCounselSessionStore((state) => state.detail);
  // useCounselAssistantStore()를 통해 counselAssistantStore의 상태값 추출
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  // useUpdateCounselAssistant()를 통해 updateCounselAssistant 함수 추출
  const updateCounselAssistant = useUpdateCounselAssistant();
  // usePostCounselAssistant()를 통해 addCounselCard 함수 추출
  const addCounselCard = usePostCounselAssistant();

  // 상담카드 저장 및 임시저장
  const handleSaveCounselAssistant = () => {
    const isTempSave = dialogType === 'TEMP_SAVE' || dialogType === 'EXIT'; // 타입 확인
    const cardRecordStatus = isTempSave // 기록 상태 확인
      ? UpdateCounselCardReqCardRecordStatusEnum.Recording
      : AddCounselCardReqCardRecordStatusEnum.Recorded;

    const requestBody = {
      cardRecordStatus,
      baseInformation: counselAssistant?.baseInformation || undefined,
      healthInformation: counselAssistant?.healthInformation || undefined,
      livingInformation: counselAssistant?.livingInformation || undefined,
      independentLifeInformation:
        counselAssistant?.independentLifeInformation || undefined,
      counselCardId: counselAssistant?.counselCardId || '',
      counselSessionId: counselSessionId || detail?.counselSessionId || '',
    };
    // counselCardId가 있으면 업데이트, 없으면 추가
    if (counselAssistant?.counselCardId) {
      updateCounselAssistant.mutate(requestBody, {
        onSuccess: () => {
          if (isTempSave) {
            setCounselAssistant(requestBody);
            onClose();
          } else {
            navigate('/');
          }
        },
        onError: (error) => {
          window.alert('상담 카드 임시저장에 실패했습니다.' + error);
        },
      });
    } else {
      addCounselCard.mutate(requestBody, {
        onSuccess: () => {
          if (isTempSave) {
            onClose();
          } else {
            navigate('/');
          }
        },
        onError: (error) => {
          window.alert('상담 카드 등록에 실패했습니다.' + error);
        },
      });
    }
  };
  // isOpen이 false일 경우 null 반환
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="w-[400px] h-[190px] flex flex-col justify-between">
        <DialogHeader className="justify-between pt-2">
          <DialogTitle className="flex pt-1 text-xl font-bold text-grayscale-100">
            {dialogType === 'REGISTER' && '기록을 완료하시겠어요?'}
            {dialogType === 'TEMP_SAVE' && '임시 저장하시겠어요?'}
            {dialogType === 'EXIT' && '기초 설문 작성이 완료되지 않았어요.'}
          </DialogTitle>
          <div className="text-center">
            <img
              src={CloseButton}
              className="flex pb-5 cursor-pointer"
              onClick={onClose}
              alt="Close"
            />
          </div>
        </DialogHeader>

        <div className="bg-white rounded-lg">
          <p className="text-base text-grayscale-80">
            {dialogType === 'REGISTER' && '기초 상담 기록이 저장됩니다.'}
            {dialogType === 'TEMP_SAVE' &&
              '지금까지 작성하신 내용이 저장됩니다.'}
            {dialogType === 'EXIT' && (
              <>
                여기서 나가시겠습니까?
                <br />
                나중에 이어서 작성을 완료할 수 있어요.
              </>
            )}
          </p>
        </div>

        <DialogFooter className="flex justify-end">
          <Button
            className="ml-6"
            variant="secondary"
            onClick={
              dialogType === 'EXIT' ? handleSaveCounselAssistant : onClose
            }>
            {dialogType === 'EXIT' ? '임시저장' : '취소'}
          </Button>
          <Button
            className="ml-6"
            variant="primary"
            onClick={() => {
              if (dialogType === 'EXIT') {
                navigate('/assistant');
              } else {
                handleSaveCounselAssistant();
              }
            }}>
            {dialogType === 'EXIT' ? '나가기' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCounselAssistant;
