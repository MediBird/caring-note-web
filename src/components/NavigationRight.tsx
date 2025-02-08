import CloseBlackIcon from '@/assets/icon/24/close.outlined.black.svg?react';
import PencilIcon from '@/components/consult/PencilIcon';
import Recording from '@/components/consult/Recording';
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
      className={`fixed top-0 right-0 h-full z-50 ${
        isOpen ? 'w-96' : 'w-16'
      } bg-white ${
        isOpen ? '' : 'hover:bg-primary-5'
      } transition-width duration-300 shadow-nav-right`}>
      {!isOpen && defaultMenu()}
      {isOpen && (
        <div className="flex justify-start">
          {defaultMenu()}
          <div className="bg-white w-full border-l-2 border-grayscale-10">
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
