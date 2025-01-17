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
import {
  useSelectCounselCard,
  useUpdateCounselAssistant,
} from '@/hooks/useCounselAssistantQuery';
import CloseButton from '@/assets/icon/24/close.outlined.black.svg';
type RegistSucessDialogTypes = {
  isOpen: boolean;
  handleOpen: () => void;
};

const TemporaySave = ({ isOpen, handleOpen }: RegistSucessDialogTypes) => {
  // 내담자 정보 조회
  const detail = useDetailCounselSessionStore((state) => state.detail);
  // 내담자 기초 설문 정보 조회
  const { counselAssistant } = useCounselAssistantStore();
  // 상담카드 수정
  const updateCounselAssistant = useUpdateCounselAssistant();
  // 상담카드 조회
  const selectCounselCard = useSelectCounselCard(
    detail?.counselSessionId || '',
  );

  const handleTemporarySave = () => {
    if (selectCounselCard.data?.counselCardId) {
      const requestBody = {
        counselCardId: detail?.counselSessionId || '',
        cardRecordStatus: detail?.cardRecordStatus,
        baseInformation: counselAssistant.baseInformation || undefined,
        healthInformation: counselAssistant.healthInformation || undefined,
        livingInformation: counselAssistant.livingInformation || undefined,
        independentLifeInformation:
          counselAssistant.independentLifeInformation || undefined,
      };
      updateCounselAssistant.mutate(requestBody, {
        onSuccess: () => {
          handleOpen();
        },
        onError: () => {
          window.alert('상담 카드 임시 저장에 실패했습니다.');
        },
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogOverlay />
      <DialogContent className="w-[400px] h-[190px] flex flex-col justify-between">
        <DialogHeader className="justify-between pt-2">
          <DialogTitle className="flex text-2xl font-bold text-grayscale-100">
            임시 저장하시겠어요?
          </DialogTitle>
          <img
            src={CloseButton}
            className="flex pb-5 cursor-pointer"
            onClick={handleOpen}
          />
        </DialogHeader>

        <div className="bg-white rounded-lg ">
          <p className="text-sm text-grayscale-50">
            지금까지 작성하신 내용이 저장됩니다.
          </p>
        </div>

        <DialogFooter className="flex justify-end">
          <Button className="ml-6" variant="secondary" onClick={handleOpen}>
            취소
          </Button>
          <Button
            className="ml-6"
            variant="primary"
            onClick={handleTemporarySave}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TemporaySave;
