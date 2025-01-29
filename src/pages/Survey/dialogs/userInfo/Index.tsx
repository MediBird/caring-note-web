import arrowForwardIcon from '@/assets/icon/24/arrowback.outlined.black.svg';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import InformationUse from '@/pages/Survey/dialogs/userInfo/InformationUse';
import InformationThirdParties from '@/pages/Survey/dialogs/userInfo/InformationThirdParties';
import ExpiredMedications from '@/pages/Survey/dialogs/userInfo/ExpiredMedications';
import {
  useCounseleeConsentQueryId,
  usePostCounselAgree,
  usePutCounselAgree,
} from '@/pages/Survey/hooks/useCounselAgreeQuery';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { useCounselAgreeSessionStore } from '@/store/counselAgreeStore';

type MainDialogTypes = {
  isOpen: boolean;
  handleOpen: () => void;
};

const Index = ({ isOpen, handleOpen }: MainDialogTypes) => {
  const navigate = useNavigate();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDetails2DialogOpen, setIsDetails2DialogOpen] = useState(false);
  const [isDetails3DialogOpen, setIsDetails3DialogOpen] = useState(false);
  const detail = useDetailCounselSessionStore((state) => state.detail);
  const putCounselAgree = usePutCounselAgree();
  const counseleeConsent = useCounselAgreeSessionStore(
    (state) => state.counseleeConsent || '',
  );
  // 내담자 개인정보 수집 동의 여부 조회
  const { data } = useCounseleeConsentQueryId(
    detail?.counselSessionId || undefined,
    detail?.counseleeId || undefined,
    !!detail,
  );

  // 내담자 개인정보 수집 동의 여부 등록 API 연결
  const addCounselAgree = usePostCounselAgree();

  // 전부 동의하고 시작하기 버튼 클릭 시
  const handleAllAgree = () => {
    // data.status가 204일 경우
    if (data?.status === 204) {
      const requestBody = {
        counselSessionId: detail?.counselSessionId || '',
        counseleeId: detail?.counseleeId || '',
        consent: true,
      };
      // addCounselAgree.mutate로 요청 실행
      addCounselAgree.mutate(requestBody, {
        onSuccess: () => {
          navigate(`/survey/${detail?.counselSessionId}`);
        }, // 성공 시 이동
      });
    } else {
      // data.status가 200일 경우
      const requestBody = {
        counseleeConsentId: counseleeConsent.counseleeConsentId,
        consent: true,
      };
      // putCounselAgree.mutate로 요청 실행
      putCounselAgree.mutate(requestBody, {
        onSuccess: () => {
          navigate(`/survey/${detail?.counselSessionId}`);
        }, // 성공 시 이동
      });
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogContent className="w-[480px] h-[375px] pt-10 pl-5 pr-5 ">
          <DialogHeader className="mx-0 leading-10 mb-9 text-grayscale-100 ">
            <DialogTitle className="flex pl-3 pr-3 text-[1.75rem] font-bold leading-9">
              개인정보 수집 동의서를
              <br />
              작성해주세요.
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 p-5 mx-auto mb-5 rounded-lg mt-9 bg-grayscale-3">
            <div
              className="flex items-center justify-between cursor-pointer "
              onClick={() => {
                setIsDetailsDialogOpen(true);
                handleOpen();
              }}>
              <h2 className="ml-2 text-grayscale-90">
                개인정보 수집 · 이용 내역 동의
              </h2>
              <img
                src={arrowForwardIcon}
                className="rotate-180 cursor-pointer"
              />
            </div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                setIsDetails2DialogOpen(true);
                handleOpen();
              }}>
              <h2 className="ml-2 text-grayscale-90">
                개인정보의 제 3자 제공 동의
              </h2>

              <img
                src={arrowForwardIcon}
                className="rotate-180 cursor-pointer"
              />
            </div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                setIsDetails3DialogOpen(true);
                handleOpen();
              }}>
              <h2 className="ml-2 text-grayscale-90">
                폐의약품 수거에 관한 동의
              </h2>
              <img
                src={arrowForwardIcon}
                className="rotate-180 cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-center h-[48px] m-0">
            <Button
              className={'w-full bg-primary-50 text-white h-12 px-0'}
              onClick={() => handleAllAgree()}>
              전부 동의하고 시작하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <InformationUse
        isDetailOpen={isDetailsDialogOpen}
        mainOpen={handleOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
      <InformationThirdParties
        isDetailOpen={isDetails2DialogOpen}
        mainOpen={handleOpen}
        onClose={() => setIsDetails2DialogOpen(false)}
      />
      <ExpiredMedications
        isDetailOpen={isDetails3DialogOpen}
        mainOpen={handleOpen}
        onClose={() => setIsDetails3DialogOpen(false)}
      />
    </>
  );
};
export default Index;
