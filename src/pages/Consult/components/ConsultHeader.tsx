import {
  SelectCounseleeBaseInformationByCounseleeIdRes,
  UpdateStatusInCounselSessionReqStatusEnum,
} from '@/api';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditConsultDialog from '@/pages/Consult/components/dialog/EditConsultDialog';
import FinishConsultDialog from '@/pages/Consult/components/dialog/FinishConsultDialog';
import TemporarySaveDialog from '@/pages/Consult/components/dialog/TemporarySaveDialog';
import { Button } from '@/components/ui/button';
import PencilBlueIcon from '@/assets/icon/24/create.filled.blue.svg?react';
import { useParams } from 'react-router-dom';
interface InfoItemProps {
  content: React.ReactNode;
  showDivider?: boolean;
}

const InfoItem = ({ content, showDivider = true }: InfoItemProps) => (
  <div className="flex items-center gap-[6px]">
    <div className="flex items-center">
      <span className="body1 text-grayscale-70">{content}</span>
    </div>
    {showDivider && (
      <div className="mr-[6px] h-[16px] w-[1px] bg-grayscale-10" />
    )}
  </div>
);

interface HeaderButtonsProps {
  onSave: () => void;
  onComplete: () => void;
  name?: string;
  sessionStatus: UpdateStatusInCounselSessionReqStatusEnum | undefined;
  isSuccessSaveConsult: boolean;
}

const HeaderButtons = ({
  onSave,
  onComplete,
  name,
  sessionStatus,
  isSuccessSaveConsult,
}: HeaderButtonsProps) => (
  <div className="flex gap-3">
    {sessionStatus !== 'COMPLETED' && <TemporarySaveDialog onSave={onSave} />}
    {sessionStatus === 'COMPLETED' ? (
      <EditConsultDialog onEdit={onComplete} />
    ) : (
      <FinishConsultDialog
        name={name}
        onComplete={onComplete}
        isSuccessSaveConsult={isSuccessSaveConsult}
      />
    )}
  </div>
);

const ConsultTabs = ({
  hasPreviousConsult,
  counselSessionId,
}: {
  hasPreviousConsult: boolean;
  counselSessionId: string | undefined;
}) => (
  <TabsList className="w-full border-b border-grayscale-10">
    <div className="mx-auto flex h-full w-full max-w-layout items-center justify-start gap-5 px-layout pb-1 [&>*]:max-w-content">
      <Button
        variant="tertiary"
        size="md"
        className="text-sm font-bold"
        onClick={() => openInterventionEditor(counselSessionId ?? '')}>
        <PencilBlueIcon width={16} height={16} />
        중재 기록
      </Button>
      <div className="h-4 w-[1px] bg-grayscale-10" />
      {hasPreviousConsult && (
        <TabsTrigger value="pastConsult">상담 히스토리</TabsTrigger>
      )}
      <TabsTrigger value="survey">기초 설문 내역</TabsTrigger>
      <TabsTrigger value="medicine">약물 기록</TabsTrigger>
      <TabsTrigger value="wasteMedication">폐의약품 처리</TabsTrigger>
      <TabsTrigger value="note">녹음 및 AI 요약</TabsTrigger>
    </div>
  </TabsList>
);

const ConsultHeader = ({
  counseleeInfo,
  sessionStatus,
  consultStatus,
  saveConsult,
  completeConsult,
  hasPreviousConsult,
  isSuccessSaveConsult,
}: {
  counseleeInfo: SelectCounseleeBaseInformationByCounseleeIdRes;
  consultStatus: string;
  sessionStatus: UpdateStatusInCounselSessionReqStatusEnum | undefined;
  saveConsult: () => void;
  completeConsult: () => void;
  hasPreviousConsult: boolean;
  isSuccessSaveConsult: boolean;
}) => {
  const { counselSessionId } = useParams();

  return (
    <div className="flex-none">
      <div className="z-10 w-full bg-white">
        <div className="h-fit bg-white">
          <div className="pt-12">
            <div className="mx-auto flex w-full max-w-layout justify-between px-layout [&>*]:max-w-content">
              <div className="flex flex-row flex-wrap items-end gap-5 pb-5">
                <div className="break-keep text-h3 font-bold">
                  {counseleeInfo?.name}
                  <span className="text-subtitle2 font-bold"> 님</span>
                </div>
                <div className="flex items-center text-body1 font-medium text-grayscale-60">
                  <InfoItem content={consultStatus} />
                  <InfoItem content={`만 ${counseleeInfo?.age}세`} />
                  <InfoItem
                    content={
                      counseleeInfo?.isDisability ? '장애인' : '비장애인'
                    }
                    showDivider={false}
                  />
                </div>
              </div>
              <HeaderButtons
                onSave={saveConsult}
                onComplete={completeConsult}
                name={counseleeInfo?.name}
                sessionStatus={sessionStatus}
                isSuccessSaveConsult={isSuccessSaveConsult}
              />
            </div>
          </div>
          <ConsultTabs
            hasPreviousConsult={hasPreviousConsult}
            counselSessionId={counselSessionId}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultHeader;

const openInterventionEditor = (counselSessionId: string) => {
  if (!window.editorWindows) {
    window.editorWindows = {};
  }

  if (
    window.editorWindows[counselSessionId] &&
    !window.editorWindows[counselSessionId].closed
  ) {
    window.editorWindows[counselSessionId].focus();
    return;
  }

  const editorWindow = window.open(
    `/intervention-editor/${counselSessionId}`,
    `editor_${counselSessionId}`,
    'width=1200,height=1020,resizable=yes,scrollbars=yes', // 기존 크기와 특성으로 변경
  );

  window.editorWindows[counselSessionId] = editorWindow;
};
