import { CounselAssistantDialogTypes } from '@/pages/Survey/constants/modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CloseButton from '@/assets/icon/24/close.outlined.black.svg';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { useCounselSurveyStore } from '@/pages/Survey/store/surveyInfoStore';
import {
  useUpdateCounselSurvey,
  usePostCounselSurvey,
} from '@/pages/Survey/hooks/useCounselAssistantQuery';
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
  const { counselSurvey } = useCounselSurveyStore();
  const updateCounselSurvey = useUpdateCounselSurvey();
  const addCounselSurvey = usePostCounselSurvey();

  const handleSaveCounselAssistant = () => {
    const isTempSave = dialogType === 'TEMP_SAVE' || dialogType === 'EXIT';
    const cardRecordStatus = isTempSave
      ? UpdateCounselCardReqCardRecordStatusEnum.Recording
      : AddCounselCardReqCardRecordStatusEnum.Recorded;

    const requestBody = {
      cardRecordStatus,
      baseInformation: counselSurvey?.baseInformation || undefined,
      healthInformation: counselSurvey?.healthInformation || undefined,
      livingInformation: counselSurvey?.livingInformation || undefined,
      independentLifeInformation:
        counselSurvey?.independentLifeInformation || undefined,
      counselCardId: counselSurvey?.counselCardId || '',
      counselSessionId: counselSessionId || detail?.counselSessionId || '',
    };
    if (counselSurvey?.counselCardId) {
      updateCounselSurvey.mutate(requestBody, {
        onSuccess: () => {
          if (isTempSave) {
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
      addCounselSurvey.mutate(requestBody, {
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
        <div className="text-body1 font-medium mt-[0.75rem] mb-[1.75rem] mx-[1.25rem] text-grayscale-80">
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
                navigate('/');
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
