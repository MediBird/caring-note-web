import CloseBlackIcon from '@/assets/icon/24/close.outlined.black.svg?react';
import PencilIcon from '@/components/consult/PencilIcon';
import Recording from '@/components/consult/Recording';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { toggleRightNavigation } from '../reducers/navigationReducer';
import HighlightInput from './consult/HighlightInput';

const NavigationRight = () => {
  const isOpen = useAppSelector(
    (state) => state.navigation.isOpenRightNavigation,
  );
  const dispatch = useAppDispatch();

  const toggleMenu = () => {
    dispatch(toggleRightNavigation());
  };

  const defaultMenu = () => {
    return (
      <div
        className={`flex flex-col items-center justify-start h-screen ${
          isOpen ? 'w-20' : ''
        } py-8`}
        onClick={toggleMenu}>
        <PencilIcon />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full z-50 bg-white transition-width duration-300 shadow-nav-right',
        isOpen ? 'w-[380px]' : 'w-16 hover:bg-primary-5',
      )}>
      {!isOpen && defaultMenu()}
      {isOpen && (
        <div className="flex justify-start">
          <button className="absolute left-[-1.2rem] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-nav-right z-[-1]">
            {isOpen && (
              <ChevronRight size={24} className="pr-2" onClick={toggleMenu} />
            )}
          </button>
          <div className="bg-white w-full">
            <div className="flex items-center justify-between border-b-2 border-grayscale-10 p-4 pt-8">
              <span className="text-subtitle2 font-bold text-grayscale-90">
                상담기록
              </span>
              <CloseBlackIcon width={24} height={24} onClick={toggleMenu} />
            </div>
            <div className="flex flex-col items-center justify-between w-full gap-4 px-2 py-4">
              <HighlightInput className="w-full" />
              <Recording className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationRight;
