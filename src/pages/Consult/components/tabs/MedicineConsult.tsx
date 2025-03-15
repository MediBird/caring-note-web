import { useAppSelector } from '@/app/reduxHooks';
import warning from '@/assets/warning.webp';
import HighlightInput from '@/components/consult/HighlightInput';
import Recording from '@/components/consult/Recording';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import RecordingResult from '@/pages/Consult/components/recording/RecordingResult';
import { RecordingStatus } from '@/types/Recording.enum';

const MedicineConsult: React.FC = () => {
  const isRightNavigationOpen = useAppSelector(
    (state) => state.navigation.isOpenRightNavigation,
  );
  const { recordingStatus } = useRecording();

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
        <div className="flex min-h-[600px] min-w-[600px] flex-1 flex-col">
          {isRightNavigationOpen ? (
            <ViewWarningImage />
          ) : (
            <HighlightInput className="h-full" />
          )}
        </div>

        <div className="flex w-full flex-1 justify-center">
          {!isRightNavigationOpen && <Recording className="w-full" />}
          <RecordingResult className="-mt-[54px] w-full min-w-[456px]" />
        </div>
      </div>
    </Card>
  );
};

export default MedicineConsult;
