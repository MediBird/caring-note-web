import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import arrowForwardIcon from '@/assets/icon/24/arrowback.outlined.black.svg';
import { InformationThirdSections } from '../../constants/modal';

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
      <DialogContent className="h-[810px] w-[480px]">
        <DialogHeader className="justify-normal">
          <img
            src={arrowForwardIcon}
            className="pt-2 cursor-pointer"
            onClick={() => {
              mainOpen();
              onClose();
            }}
          />
          <DialogTitle>개인정보의 제 3자 제공 동의</DialogTitle>
        </DialogHeader>

        <div className='text-body1 font-medium mt-[0.75rem] mb-[1.75rem] mx-[1.25rem] text-grayscale-80">'>
          <div className="p-5 shadow-md mx-autorounded-lg bg-grayscale-3">
            {InformationThirdSections.map((section) => (
              <div key={section.id} className="mb-6">
                <h2 className="mb-3 text-base font-bold">
                  {section.details.title}
                </h2>
                <div className="mb-3 text-sm text-grayscale-50">
                  <ul className="pl-5 list-disc">
                    {section.details.content.map((content, index) => (
                      <li key={index}>{content}</li>
                    ))}
                  </ul>
                </div>
                <h2 className="mb-3 text-base font-bold">
                  {section.items.title}
                </h2>
                <div className="mb-3 text-sm text-grayscale-50">
                  <ul className="pl-5 list-disc">
                    {section.items.content.map((content, index) => (
                      <li key={index}>{content}</li>
                    ))}
                  </ul>
                </div>
                <h2 className="mb-3 text-base font-bold">
                  {section.purpose.title}
                </h2>
                <div className="mb-3 text-sm text-grayscale-50">
                  <ul className="pl-5 list-disc">
                    {section.purpose.content.map((content, index) => (
                      <li key={index}>{content}</li>
                    ))}
                  </ul>
                </div>
                <h2 className="mb-3 text-base font-bold">
                  {section.duration.title}
                </h2>
                <div className="mb-3 text-sm text-grayscale-50">
                  <ul className="pb-3 pl-5 list-disc border-b-2">
                    {section.duration.content.map((content, index) => (
                      <li key={index}>{content}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <p className="mt-6 text-sm text-grayscale-50">
              ※ 위와 같이 개인정보 제공 동의를 거부할 권리가 있으나, 동의를
              거부하는 경우에는 일부 사업 참여가 불가함을 알려 드립니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InformationThirdParties;
