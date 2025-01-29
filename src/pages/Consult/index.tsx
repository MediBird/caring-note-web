import { SelectCounseleeBaseInformationByCounseleeIdRes } from '@/api/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useNavigate, useParams } from 'react-router-dom';
import { useConsultCard } from './hooks/query/useConsultCard';
import CardSection from '../../components/ui/cardSection';
import {
  HistoryPopover,
  HistoryPopoverContent,
  HistoryPopoverTrigger,
} from '@/components/ui/historyPopover';
import ClockBlackIcon from '@/assets/icon/24/clock.outlined.black.svg?react';
interface InfoItemProps {
  icon: string;
  content: React.ReactNode;
  showBorder?: boolean;
}

const InfoItem = ({ icon, content, showBorder = true }: InfoItemProps) => (
  <div
    className={`flex items-center px-[0.375rem] text-grayscale-70 ${
      showBorder ? 'border-r border-grayscale-10' : ''
    }`}>
    <span className="text-subtitle-2 pr-[0.25rem]">{icon}</span>
    <span>{content}</span>
  </div>
);

interface HeaderButtonsProps {
  onSave: () => void;
  onComplete: () => void;
}

const HeaderButtons = ({ onSave, onComplete }: HeaderButtonsProps) => (
  <div className="flex gap-3">
    <Button variant="tertiary" size="xl" onClick={onSave}>
      임시 저장
    </Button>
    <Button variant="primary" size="xl" onClick={onComplete}>
      설문 완료
    </Button>
  </div>
);

const ConsultHeader = ({
  counseleeInfo,
  consultStatus,
  age,
  diseases,
}: {
  counseleeInfo: SelectCounseleeBaseInformationByCounseleeIdRes;
  consultStatus: string;
  age: string;
  diseases: React.ReactNode;
}) => (
  <div className="sticky top-0 bg-white h-[167px]">
    <div className="pl-[5.75rem] pr-[9.5rem] pt-12 pb-1 border-b border-grayscale-05 flex justify-between">
      <div>
        <div className="text-h3 font-bold">
          {counseleeInfo?.name}
          <span className="text-subtitle2 font-bold"> 님</span>
        </div>
        <div className="mt-2 flex items-center text-body1 font-medium text-grayscale-60">
          <InfoItem icon="📍" content={consultStatus} />
          <InfoItem icon="🎂" content={age} />
          <InfoItem icon="💊" content={diseases} showBorder={false} />
        </div>
      </div>
      <HeaderButtons
        onSave={() => console.log('임시 저장')}
        onComplete={() => console.log('설문 완료')}
      />
    </div>
    <ConsultTabs />
  </div>
);

const ConsultTabs = () => (
  <TabsList className="w-full flex justify-start pl-[5.75rem] gap-5 border-b border-grayscale-10">
    <TabsTrigger value="pastConsult">이전 상담 내역</TabsTrigger>
    <TabsTrigger value="survey">기초 설문 내역</TabsTrigger>
    <TabsTrigger value="medicine">의약물 기록</TabsTrigger>
    <TabsTrigger value="note">중재 기록 작성</TabsTrigger>
    <TabsTrigger value="wasteMedication">폐의약물 기록</TabsTrigger>
  </TabsList>
);

export function Index() {
  const navigate = useNavigate();
  const { counselSessionId } = useParams();
  const { data: counseleeInfo, isLoading } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );
  const { consultCardData } = useConsultCard(counselSessionId);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const formatDiseases = (diseases: string[] | undefined) => {
    if (!diseases?.length) return '';

    if (diseases.length <= 3) {
      return diseases.join(' · ');
    }

    return (
      <>
        {diseases.slice(0, 3).join(' · ')}
        <span className="text-grayscale-30">
          {` 외 ${diseases.length - 3}개의 질병`}
        </span>
      </>
    );
  };

  const consultStatus =
    counseleeInfo?.counselCount === 0 ? '초기 상담' : '재상담';
  const age = `만 ${counseleeInfo?.age}세`;
  const diseases = formatDiseases(counseleeInfo?.diseases);

  return (
    <Tabs defaultValue="pastConsult" className="w-full h-full">
      <ConsultHeader
        counseleeInfo={
          counseleeInfo as SelectCounseleeBaseInformationByCounseleeIdRes
        }
        consultStatus={consultStatus}
        age={age}
        diseases={diseases}
      />
      <TabsContent value="pastConsult">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>기초 상담 내역</CardTitle>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate(`/assistant/${counselSessionId}`)}>
                수정하기
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-6">
              <div className="w-1/2 space-y-2">
                <CardSection
                  title="기본 정보"
                  variant="grayscale"
                  items={[
                    {
                      label: '성명',
                      value: consultCardData?.baseInformation?.baseInfo?.name,
                    },
                    {
                      label: '생년월일',
                      value:
                        consultCardData?.baseInformation?.baseInfo?.birthDate,
                    },
                    {
                      label: '의료보장형태',
                      value:
                        consultCardData?.baseInformation?.baseInfo
                          ?.counselSessionOrder,
                    },
                  ]}
                />

                <CardSection
                  title="상담 목적 및 특이사항"
                  items={[
                    {
                      label: '상담 목적',
                      value: Array.isArray(
                        consultCardData?.baseInformation?.counselPurposeAndNote
                          ?.counselPurpose,
                      )
                        ? consultCardData?.baseInformation?.counselPurposeAndNote.counselPurpose.join(
                            ', ',
                          )
                        : consultCardData?.baseInformation
                            ?.counselPurposeAndNote?.counselPurpose,
                    },
                    {
                      label: '특이사항',
                      value:
                        consultCardData?.baseInformation?.counselPurposeAndNote
                          ?.SignificantNote,
                    },
                    {
                      label: '의약품',
                      value:
                        consultCardData?.baseInformation?.counselPurposeAndNote
                          ?.MedicationNote,
                    },
                  ]}
                />
                <CardSection
                  title={
                    <div className="flex items-center gap-2">
                      흡연
                      <HistoryPopover>
                        <HistoryPopoverTrigger>
                          <ClockBlackIcon />
                        </HistoryPopoverTrigger>
                        <HistoryPopoverContent
                          historyGroups={[
                            {
                              date: '2024-11-05',
                              items: [
                                '고혈압 · 고지혈증 · 뇌혈관질환 · 척추 관절염/신경통 · 호흡기질환 · 당뇨병 · 수면장애',
                                '3년전 뇌출혈 수술',
                                '잦은 두통 및 복통 호소',
                              ],
                            },
                            {
                              date: '2024-11-05',
                              items: [
                                '고혈압 · 고지혈증 · 뇌혈관질환 · 척추 관절염/신경통 · 호흡기질환 · 당뇨병 · 수면장애',
                                '3년전 뇌출혈 수술',
                                '잦은 두통 및 복통 호소',
                              ],
                            },
                            {
                              date: '2024-11-05',
                              items: ['당뇨병 · 수면장애', '3년전 뇌출혈 수술'],
                            },
                            {
                              date: '2024-11-05',
                              items: ['당뇨병 · 수면장애', '3년전 뇌출혈 수술'],
                            },
                            {
                              date: '2024-11-05',
                              items: ['당뇨병 · 수면장애', '3년전 뇌출혈 수술'],
                            },
                          ]}
                        />
                      </HistoryPopover>
                    </div>
                  }
                  variant="secondary"
                  items={[
                    {
                      label: '흡연 여부',
                      value: consultCardData?.livingInformation?.smoking
                        ?.isSmoking
                        ? '흡연'
                        : '비흡연',
                    },
                    {
                      label: '총 흡연기간',
                      value:
                        consultCardData?.livingInformation?.smoking
                          ?.smokingPeriodNote,
                    },
                    {
                      label: '하루 평균 흡연량',
                      value:
                        consultCardData?.livingInformation?.smoking
                          ?.smokingAmount,
                    },
                  ]}
                />
              </div>
              <div className="w-1/2">
                <CardSection
                  title="앓고 있는 질병"
                  variant="primary"
                  items={[{ label: '질병', value: '질병' }]}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="survey">
        <Card>
          <CardHeader>
            <CardTitle>기초 설문 내역</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="medicine">
        <Card>
          <CardHeader>
            <CardTitle>의약물 기록</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="note">
        <Card>
          <CardHeader>
            <CardTitle>중재 기록 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Index;
