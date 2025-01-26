import { CounselAssistantDialogTypes } from '@/pages/assistant/constants/modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
  const { counselSessionId } = useParams();
  const detail = useDetailCounselSessionStore((state) => state.detail);
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  const updateCounselAssistant = useUpdateCounselAssistant();
  const addCounselCard = usePostCounselAssistant();

  const handleSaveCounselAssistant = () => {
    const isTempSave = dialogType === 'TEMP_SAVE' || dialogType === 'EXIT';
    const cardRecordStatus = isTempSave
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
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
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
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription>
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
        </DialogDescription>

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
