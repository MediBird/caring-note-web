import { useAppSelector } from '@/app/reduxHooks';
import logoBlack from '@/assets/logoBlack.png';
import HighlightInput from '@/components/consult/HighlightInput';
import Recording from '@/components/consult/Recording';
import { CardHeader, CardTitle } from '@/components/ui/card';
import GrayContainer from '@/pages/Consult/components/GrayContainer';
import RecordingResult from '@/pages/Consult/components/recording/RecordingResult';

const MedicineConsult: React.FC = () => {
  const isRightNavigationOpen = useAppSelector(
    (state) => state.navigation.isOpenRightNavigation,
  );

  const ViewWarningImage = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="min-h-72 flex flex-col items-center justify-center space-y-1">
          <img className="w-28 h-28 mb-4" src={logoBlack} alt="logo" />
          <p className="text-body1 font-bold text-grayscale-60">
            우측 창이 열려있는 상태에서 동시에 사용할 수 없어요
          </p>
          <p className="text-caption1 text-grayscale-60">
            이 곳을 이용하고 싶으시다면 우측 창을 닫아주세요!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row">
      <div className="w-full">
        <CardHeader>
          <CardTitle>중재 기록 작성</CardTitle>
        </CardHeader>

        <GrayContainer
          title="상담 기록"
          subTitle="하이라이트 시, 다음 지속 상담에 해당 내용을 가장 먼저 확인할 수 있어요">
          {isRightNavigationOpen ? <ViewWarningImage /> : <HighlightInput />}
        </GrayContainer>

        <div className="flex items-center justify-center mt-8">
          {isRightNavigationOpen ? <></> : <Recording />}
        </div>
      </div>

      {/* 우측 [AI요약, 전체녹음] 탭 */}
      <RecordingResult className="w-full" />
    </div>
  );
};

export default MedicineConsult;
