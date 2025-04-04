import warning from '@/assets/warning.webp';
import HighlightInput from '@/components/consult/HighlightInput';
import Recording from '@/components/consult/Recording';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import RecordingResult from '@/pages/Consult/components/recording/RecordingResult';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import useRightNavigationStore from '@/store/navigationStore';

const MedicineConsult: React.FC = () => {
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
  const isRightNavOpen = useRightNavigationStore((state) => state.isOpen);

  const ViewWarningImage = () => {
    const heightClass =
      recordingStatus === RecordingStatus.AICompleted
        ? 'h-[800px]'
        : 'h-[600px]';

    return (
      <div className="flex items-center justify-center rounded-lg bg-grayscale-3">
        <div
          className={cn(
            'flex flex-col items-center justify-center space-y-1',
            heightClass,
          )}>
          <img className="mb-4 h-28 w-28" src={warning} alt="warning" />
          <p className="text-body1 font-bold text-grayscale-50">
            우측 창이 열려있는 상태에서 동시에 사용할 수 없어요
          </p>
          <p className="text-caption1 text-grayscale-50">
            이 곳을 이용하고 싶으시다면 우측 창을 닫아주세요!
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>상담 기록</CardTitle>
      </CardHeader>

      <div className="flex w-full flex-row space-x-5">
        <div className="flex min-h-[600px] w-full min-w-[600px] flex-col">
          {isRightNavOpen ? (
            <ViewWarningImage />
          ) : (
            <HighlightInput className="h-full w-full" />
          )}
        </div>

        <div className="flex justify-center">
          {!isRightNavOpen &&
            recordingStatus !== RecordingStatus.AICompleted && (
              <Recording className="w-[348px]" />
            )}
          <RecordingResult className="-mt-[54px] w-full min-w-[456px]" />
        </div>
      </div>
    </Card>
  );
};

export default MedicineConsult;
