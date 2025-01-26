import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import arrowForwardIcon from '@/assets/icon/24/arrowback.outlined.black.svg';

type AgreementDetailDialogTypes = {
  isDetailOpen: boolean;
  mainOpen: () => void;
  onClose: () => void;
};

const InformationThirdParties = ({
  isDetailOpen,
  mainOpen,
  onClose,
}: AgreementDetailDialogTypes) => {
  return (
    <Dialog open={isDetailOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <img
            src={arrowForwardIcon}
            className="cursor-pointer"
            onClick={() => {
              mainOpen();
              onClose();
            }}
          />
          <DialogTitle>개인정보의 제 3자 제공 동의</DialogTitle>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription>
          <div className="p-4 mx-auto mt-2 mb-4 rounded-lg shadow-md bg-grayscale-3">
            <h2 className="mb-4 text-lg font-bold">제공 받는 자</h2>
            <div className="mb-4 text-sm text-grayscale-50">
              <ul className="pl-5 list-disc">
                <li>
                  사회 복지 기관 (신림종합사회복지관, 강감찬종합사회복지관)
                </li>
                <li>정다운우리의원</li>
              </ul>
            </div>

            <h2 className="mb-4 text-lg font-bold">제공 항목</h2>
            <div className="mb-4 text-sm text-grayscale-50 ">
              <ul className="pl-5 list-disc">
                <li>
                  성명, 생년월일, 주소, 연락처, 건강정보, 복용약물 및 기타
                  건강상태에 대한 사항
                </li>
              </ul>
            </div>

            <h2 className="mb-4 text-lg font-bold">제공 목적</h2>
            <div className="mb-4 text-sm text-grayscale-50 ">
              <ul className="pl-5 list-disc">
                <li>사회 복지 서비스 연계 </li>
                <li>진료 의뢰 </li>
              </ul>
            </div>

            <h2 className="mb-4 text-lg font-bold">보유 및 이용기간</h2>
            <ul className="pl-5 text-sm list-disc border-b-2 ">
              <li className="mb-4 text-grayscale-50 ">
                해당 사업 제공기간 및 사업 종료일로부터 3년
              </li>
            </ul>

            <p className="mt-6 mb-6 text-sm text-grayscale-50">
              ※ 위와 같이 개인정보 제공 동의를 거부할 권리가 있으나, 동의를
              거부하는 경우에는 일부 사업 참여가 불가함을 알려 드립니다.
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default InformationThirdParties;
