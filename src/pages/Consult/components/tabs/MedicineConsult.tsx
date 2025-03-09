import { useAppSelector } from '@/app/reduxHooks';
import warning from '@/assets/warning.webp';
import HighlightInput from '@/components/consult/HighlightInput';
import Recording from '@/components/consult/Recording';
import { CardHeader, CardTitle } from '@/components/ui/card';
import RecordingResult from '@/pages/Consult/components/recording/RecordingResult';

const MedicineConsult: React.FC = () => {
  const isRightNavigationOpen = useAppSelector(
    (state) => state.navigation.isOpenRightNavigation,
  );

  const ViewWarningImage = () => {
    return (
      <div className="flex items-center justify-center bg-grayscale-3 rounded-lg">
        <div className="min-h-[600px] flex flex-col items-center justify-center space-y-1">
          <img className="w-28 h-28 mb-4" src={warning} alt="warning" />
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
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle>상담 기록</CardTitle>
      </CardHeader>

      <div className="flex flex-row w-full space-x-5">
        <div className="flex flex-col min-w-[600px] min-h-[600px] flex-1">
          {isRightNavigationOpen ? (
            <ViewWarningImage />
          ) : (
            <HighlightInput className="h-full" />
          )}
        </div>

        <div className="flex flex-1 w-full justify-center">
          {!isRightNavigationOpen && <Recording className="w-full" />}
          <RecordingResult className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default MedicineConsult;
