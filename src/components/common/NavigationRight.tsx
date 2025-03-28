import CloseBlackIcon from '@/assets/icon/24/close.outlined.black.svg?react';
import PencilIcon from '@/components/consult/PencilIcon';
import Recording from '@/components/consult/Recording';
import { cn } from '@/lib/utils';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import useRightNavigationStore from '@/store/navigationStore';
import { useEffect } from 'react';
import HighlightInput from '../consult/HighlightInput';

const NavigationRight = () => {
  const isOpen = useRightNavigationStore((state) => state.isOpen);
  const openRightNav = useRightNavigationStore((state) => state.openRightNav);
  const closeRightNav = useRightNavigationStore((state) => state.closeRightNav);
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);

  useEffect(() => {
    return () => {
      sessionStorage.setItem('autoNavigationOpen', 'false');
      closeRightNav();
    };
  }, [closeRightNav]);

  useEffect(() => {
    const autoNavigationOpen = sessionStorage.getItem('autoNavigationOpen');

    if (
      autoNavigationOpen === 'true' &&
      (recordingStatus === RecordingStatus.STTCompleted ||
        recordingStatus === RecordingStatus.AICompleted)
    ) {
      openRightNav();
    }
  }, [recordingStatus, openRightNav]);

  const defaultMenu = () => {
    return (
      <div
        className={`flex h-screen flex-col items-center justify-start ${
          isOpen ? 'w-20' : ''
        } py-8`}
        onClick={openRightNav}>
        <PencilIcon />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'transition-width fixed right-0 top-0 z-50 h-full bg-white shadow-nav-right duration-300',
        isOpen ? 'w-[380px]' : 'w-16 hover:bg-primary-5',
      )}>
      {isOpen ? (
        <div className="flex justify-start">
          <div className="w-full bg-white">
            <div className="flex items-center justify-between border-b-2 border-grayscale-10 p-4 pt-8">
              <span className="text-subtitle2 font-bold text-grayscale-90">
                상담기록
              </span>
              <CloseBlackIcon
                className="cursor-pointer"
                width={24}
                height={24}
                onClick={closeRightNav}
              />
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-4 px-4 py-4">
              <HighlightInput
                className="w-full"
                inputClassName="max-h-[400px] min-h-[240px]"
              />
              <Recording className="w-full" />
            </div>
          </div>
        </div>
      ) : (
        defaultMenu()
      )}
    </div>
  );
};

export default NavigationRight;
