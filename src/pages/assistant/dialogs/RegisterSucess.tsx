import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { useCounselAssistantStore } from '@/store/counselAssistantStore';
import { usePostCounselAssistant } from '@/hooks/useCounselAssistantQuery';
import { AddCounselCardReqCardRecordStatusEnum } from '@/api/api';
import CloseButton from '@/assets/icon/24/close.outlined.black.svg';
import { useNavigate } from 'react-router-dom';
type RegistSucessDialogTypes = {
  isOpen: boolean;
  handleOpen: () => void;
};

const RegistSucess = ({ isOpen, handleOpen }: RegistSucessDialogTypes) => {
  const navigate = useNavigate();
  // 내담자 정보 조회
  const detail = useDetailCounselSessionStore((state) => state.detail);
  // 내담자 기초 설문 정보 조회
  const { counselAssistant } = useCounselAssistantStore();
  // 상담카드 등록
  const addCounselCard = usePostCounselAssistant();

  const handleRegister = () => {
    if (detail && counselAssistant) {
      const requestBody = {
        counselSessionId: detail.counselSessionId || '',
        cardRecordStatus:
          detail.cardRecordStatus ||
          AddCounselCardReqCardRecordStatusEnum.Recorded,
        baseInformation: counselAssistant.baseInformation || undefined,
        healthInformation: counselAssistant.healthInformation || undefined,
        livingInformation: counselAssistant.livingInformation || undefined,
        independentLifeInformation:
          counselAssistant.independentLifeInformation || undefined,
      };
      // addCounselCard.mutate로 요청 실행
      if (counselAssistant !== null) {
        addCounselCard.mutate(requestBody, {
          onSuccess: () => {
            navigate('/');
          },
          onError: () => {
            window.alert('상담 카드 등록에 실패했습니다.');
          },
        });
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogOverlay />
      <DialogContent className="w-[400px] h-[190px] flex flex-col justify-between">
        <DialogHeader className="justify-between pt-2">
          <DialogTitle className="flex text-2xl font-bold text-grayscale-100">
            기록을 완료하시겠어요?
          </DialogTitle>
          <img
            src={CloseButton}
            className="flex pb-5 cursor-pointer"
            onClick={handleOpen}
          />
        </DialogHeader>

        <div className="bg-white rounded-lg ">
          <p className="text-sm text-grayscale-50">
            기초 상담 기록이 저장됩니다.
          </p>
        </div>

        <DialogFooter className="flex justify-end">
          <Button className="ml-6" variant="secondary" onClick={handleOpen}>
            취소
          </Button>
          <Button className="ml-6" variant="primary" onClick={handleRegister}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default RegistSucess;
