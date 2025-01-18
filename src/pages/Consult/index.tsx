import { CounseleeControllerApi, CounselSessionControllerApi } from '@/api/api';
import Button from '@/components/Button';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';
import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSaveMedicineConsultWithState } from '@/hooks/useSaveMedicineConsultWithState';
import { useSaveWasteMedication } from '@/hooks/useSaveWasteMedication';

const PastConsult = lazy(
  () => import('@/pages/Consult/components/tabs/PastConsult'),
);
const ConsultCard = lazy(
  () => import('@/pages/Consult/components/tabs/ConsultCard'),
);
const MedicineMemo = lazy(
  () => import('@/pages/Consult/components/tabs/MedicineMemo'),
);
const MedicineConsult = lazy(
  () => import('@/pages/Consult/components/tabs/MedicineConsult'),
);
const DiscardMedicine = lazy(
  () => import('@/pages/Consult/components/tabs/DiscardMedicine'),
);

const TabTitle = ({
  text,
  goPage,
  isHidden,
}: {
  text: string;
  goPage: ConsultTab;
  isHidden?: boolean;
}) => {
  const { activeTab, setActiveTab } = useConsultTabStore();

  return (
    <p
      className={`${
        activeTab === goPage
          ? 'text-body2 font-bold text-primary-50 border-b-2 border-primary-50'
          : 'text-body2 font-medium text-grayscale-50'
      } ${
        isHidden ? 'hidden' : ''
      } mr-10 py-3 h-full flex items-center hover:text-primary-50 hover:border-b-2 border-primary-50 cursor-pointer`}
      onClick={() => {
        setActiveTab(goPage);
      }}>
      {text}
    </p>
  );
};

function Index() {
  const { activeTab, setActiveTab } = useConsultTabStore();
  const { counselSessionId } = useParams();

  const [hidePastConsultTab, setHidePastConsultTab] = useState(true);
  const diseasesLengthRef = useRef(0);
  const SHOW_DISEASE_COUNT = 5;

  const counselSessionControllerApi = new CounselSessionControllerApi();
  const counseleeControllerApi = new CounseleeControllerApi();

  const selectPreviousCounselSessionList = async () => {
    if (!counselSessionId) return;
    const response =
      await counselSessionControllerApi.selectPreviousCounselSessionList(
        counselSessionId,
      );

    return response;
  };

  const selectCounseleeBaseInformation = async () => {
    if (!counselSessionId) return;
    const response =
      await counseleeControllerApi.selectCounseleeBaseInformation(
        counselSessionId,
      );

    return response.data.data;
  };

  const previousCounselQuery = useQuery({
    queryKey: ['previousCounsel'],
    queryFn: selectPreviousCounselSessionList,
    enabled: !!counselSessionId,
  });

  const counseleeBaseInfoQuery = useQuery({
    queryKey: ['counseleeBaseInfo', counselSessionId],
    queryFn: selectCounseleeBaseInformation,
  });

  const { handleSaveMedicineConsult } = useSaveMedicineConsultWithState();
  const { handleSaveWasteMedication } = useSaveWasteMedication(
    counselSessionId as string,
  );

  useEffect(() => {
    if (previousCounselQuery.data?.status !== 204) {
      setHidePastConsultTab(false);
    } else {
      setHidePastConsultTab(true);
      setActiveTab(ConsultTab.consultCard);
    }
  }, [previousCounselQuery.data, setActiveTab]);

  useEffect(() => {
    diseasesLengthRef.current =
      counseleeBaseInfoQuery.data?.diseases?.length || 0;
  }, [counseleeBaseInfoQuery.data]);

  return (
    <div>
      <div className="flex flex-col items-center justify-start w-full h-fit px-8 py-10">
        <div className="flex flex-row items-center justify-start w-full h-8 mt-4 pl-6">
          <p className="text-h2 font-bold text-grayscale-100">
            {counseleeBaseInfoQuery.data?.name}
          </p>
          <Button
            _class="ml-6"
            variant="secondary"
            onClick={() => {
              handleSaveMedicineConsult();
              handleSaveWasteMedication();
            }}>
            임시저장
          </Button>
          <Button _class="ml-2" variant="primary" onClick={() => {}}>
            기록완료
          </Button>
        </div>
        <div className="flex flex-row items-center justify-start w-full h-8 mt-4 pl-6">
          <p className="text-body1 font-medium text-grayscale-70">
            만 {counseleeBaseInfoQuery.data?.age}세
          </p>
          <div className="w-0.5 h-6 bg-grayscale-10 mx-2" />
          <p className="text-body1 font-medium text-grayscale-70">
            {counseleeBaseInfoQuery.data?.diseases
              ?.slice(0, SHOW_DISEASE_COUNT)
              .join(' · ')}
          </p>
          {diseasesLengthRef.current > SHOW_DISEASE_COUNT ? (
            <p className="text-body1 font-medium text-grayscale-30 px-2">
              외 {diseasesLengthRef.current - SHOW_DISEASE_COUNT}개의 질병
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row items-center justify-start w-full h-auto pl-14 my-0 border-t-2 border-b-2 border-grayscale-5 ">
        {hidePastConsultTab ? null : (
          <TabTitle text="이전 상담 내역" goPage={ConsultTab.pastConsult} />
        )}
        <TabTitle text="상담카드" goPage={ConsultTab.consultCard} />
        <TabTitle text="의약물 기록" goPage={ConsultTab.medicineMemo} />
        <TabTitle text="복약 상담" goPage={ConsultTab.medicineConsult} />
        <TabTitle text="폐의약품 처리" goPage={ConsultTab.discardMedicine} />
      </div>
      {/* @TODO: skeleton 추가 or loading 인디케이터 추가  */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full min-h-[800px]">
            <div
              className="animate-spin rounded-full border-2 border-solid border-primary-50"
              style={{
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        }>
        <TabContent
          activeTab={activeTab}
          hidePastConsultTab={hidePastConsultTab}
        />
      </Suspense>
    </div>
  );
}

export default Index;

function TabContent({
  activeTab,
  hidePastConsultTab,
}: {
  activeTab: ConsultTab;
  hidePastConsultTab: boolean;
}) {
  const defaultTab = hidePastConsultTab ? <ConsultCard /> : <PastConsult />;

  switch (activeTab) {
    case ConsultTab.pastConsult:
      return <PastConsult />;
    case ConsultTab.consultCard:
      return <ConsultCard />;
    case ConsultTab.medicineMemo:
      return <MedicineMemo />;
    case ConsultTab.medicineConsult:
      return <MedicineConsult />;
    case ConsultTab.discardMedicine:
      return <DiscardMedicine />;
    default:
      return defaultTab;
  }
}
