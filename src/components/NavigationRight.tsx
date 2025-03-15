import CloseBlackIcon from '@/assets/icon/24/close.outlined.black.svg?react';
import PencilIcon from '@/components/consult/PencilIcon';
import Recording from '@/components/consult/Recording';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import HighlightInput from './consult/HighlightInput';
import useRightNavigationStore from '@/store/navigationStore';

const NavigationRight = () => {
  const { isRightNavOpen, toggleRightNav } = useRightNavigationStore();

  const defaultMenu = () => {
    return (
      <div
        className={`flex h-screen flex-col items-center justify-start ${
          isRightNavOpen ? 'w-20' : ''
        } py-8`}
        onClick={toggleRightNav}>
        <PencilIcon />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'transition-width fixed right-0 top-0 z-50 h-full bg-white shadow-nav-right duration-300',
        isRightNavOpen ? 'w-[380px]' : 'w-16 hover:bg-primary-5',
      )}>
      {!isRightNavOpen && defaultMenu()}
      {isRightNavOpen && (
        <div className="flex justify-start">
          <button
            className="absolute left-[-1.2rem] top-1/2 z-[-1] -translate-y-1/2 transform rounded-full bg-white p-2 shadow-nav-right"
            onClick={toggleRightNav}>
            {isRightNavOpen && <ChevronRight size={24} className="pr-2" />}
          </button>
          <div className="w-full bg-white">
            <div className="flex items-center justify-between border-b-2 border-grayscale-10 p-4 pt-8">
              <span className="text-subtitle2 font-bold text-grayscale-90">
                상담기록
              </span>
              <CloseBlackIcon width={24} height={24} onClick={toggleRightNav} />
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-4 px-4 py-4">
              <HighlightInput className="h-[450px] w-full" />
              <Recording className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationRight;
