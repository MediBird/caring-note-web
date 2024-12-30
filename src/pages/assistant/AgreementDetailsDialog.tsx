import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@components/components/ui/dialog";
import arrowForwardIcon from "@icon/24/arrowback.outlined.black.svg";

type AgreementDetailDialogTypes = {
  isDetailOpen: boolean;
  mainOpen: () => void;
  onClose: () => void;
};

const AgreementDetailsDialog = ({
  isDetailOpen,
  mainOpen,
  onClose,
}: AgreementDetailDialogTypes) => {
  return (
    <Dialog open={isDetailOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="z-50 w-[520px] h-auto flex flex-col justify-between">
        <DialogHeader>
          <img
            src={arrowForwardIcon}
            className="cursor-pointer"
            onClick={() => {
              mainOpen();
              onClose();
            }}
          />
          <DialogTitle>개인정보 수집 · 이용 내역 동의</DialogTitle>
        </DialogHeader>
        <div className="p-4 mx-auto mt-2 mb-4 rounded-lg shadow-md bg-grayscale-3">
          <h2 className="mb-4 text-lg font-bold">수집 항목</h2>
          <div className="mb-4 text-sm text-grayscale-50">
            <ul className="pl-5 list-disc">
              <li>개인정보 (필수): 성명, 생년월일, 주소, 연락처</li>
              <li>
                민감정보 (필수): 건강정보, 복용약물 및 기타 건강상태에 대한 사항
              </li>
            </ul>
          </div>

          <h2 className="mb-4 text-lg font-bold">수집 목적</h2>
          <div className="mb-4 text-sm text-grayscale-50 ">
            <ul className="pl-5 list-disc">
              <li>찾아가는 복약상담소 사업 안내 및 개별 상담에 활용</li>
              <li>찾아가는 복약상담소 사업 종료 후 결과보고자료 분석에 활용</li>
              <li>
                그 밖에 찾아가는 복약상담소 사업 운영 및 서비스 고도화에 필요한
                자료로 활용
              </li>
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
            거부하는 경우에는 사업 참여가 불가함을 알려 드립니다. 『개인정보
            보호법』에 따라 개인정보처리자가 준수해야 할 개인정보보호 규정을
            준수하고, 관련 법령에 따라 대상자의 권익보호에 최선을 다하고 있으며
            허가된 이용 목적 외에는 사용하지 않을 것을 약속드립니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AgreementDetailsDialog;
