import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CardSection from '@/components/ui/cardSection';
import { useConsultCard } from '../../hooks/query/useConsultCard';
import {
  HistoryPopover,
  HistoryPopoverContent,
  HistoryPopoverTrigger,
} from '@/components/ui/historyPopover';
import ClockBlackIcon from '@/assets/icon/24/clock.outlined.black.svg?react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const ConsultCard: React.FC = () => {
  const { counselSessionId } = useParams();
  const navigate = useNavigate();
  const { consultCardData: consultCardData } = useConsultCard(counselSessionId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>기초 상담 내역</CardTitle>
          <Button
            variant="secondary"
            onClick={() => navigate(`/survey/${counselSessionId}`)}>
            수정하기
          </Button>
        </div>
      </CardHeader>

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
                value: consultCardData?.baseInformation?.baseInfo?.birthDate,
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
                  : consultCardData?.baseInformation?.counselPurposeAndNote
                      ?.counselPurpose,
              },
            ]}
          />
          <CardSection
            title="특이사항"
            items={[
              {
                label: '특이사항',
                value:
                  consultCardData?.baseInformation?.counselPurposeAndNote
                    ?.SignificantNote || '',
              },
            ]}
          />
          <CardSection
            title="의약품"
            items={[
              {
                label: '의약품',
                value:
                  consultCardData?.baseInformation?.counselPurposeAndNote
                    ?.MedicationNote || '',
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
                value: consultCardData?.livingInformation?.smoking?.isSmoking
                  ? '흡연'
                  : '비흡연',
              },
              {
                label: '총 흡연기간',
                value:
                  consultCardData?.livingInformation?.smoking
                    ?.smokingPeriodNote || '',
              },
              {
                label: '하루 평균 흡연량',
                value:
                  consultCardData?.livingInformation?.smoking?.smokingAmount ||
                  '',
              },
            ]}
          />

          <CardSection
            title="음주"
            items={[
              {
                label: '음주 여부',
                value: consultCardData?.livingInformation?.drinking?.isDrinking
                  ? '음주'
                  : '비음주',
              },
              {
                label: '음주 횟수',
                value:
                  consultCardData?.livingInformation?.drinking
                    ?.drinkingAmount || '',
              },
            ]}
          />

          <CardSection
            title="영양상태"
            items={[
              {
                label: '하루 식사 패턴',
                value:
                  consultCardData?.livingInformation?.nutrition?.mealPattern ||
                  '',
              },
              {
                label: '식생활 특이사항',
                value:
                  consultCardData?.livingInformation?.nutrition
                    ?.nutritionNote || '',
              },
            ]}
          />

          <CardSection
            title="운동"
            items={[
              {
                label: '주간 운동 패턴',
                value:
                  consultCardData?.livingInformation?.exercise
                    ?.exercisePattern || '',
              },
              {
                label: '운동 종류',
                value:
                  consultCardData?.livingInformation?.exercise?.exerciseNote ||
                  '',
              },
            ]}
          />

          <CardSection
            title="약 복용 관리"
            items={[
              {
                label: '독거 여부',
                value: consultCardData?.livingInformation?.medicationManagement
                  ?.isAlone
                  ? '혼자'
                  : '동거',
              },
              {
                label: '동거인 구성원',
                value:
                  consultCardData?.livingInformation?.medicationManagement
                    ?.houseMateNote || '',
              },
              {
                label: '복용자 및 투약 보조자',
                value:
                  consultCardData?.livingInformation?.medicationManagement?.medicationAssistants?.join(
                    ', ',
                  ) || '',
              },
            ]}
          />
        </div>
        <div className="w-1/2 space-y-2">
          <CardSection
            title="앓고 있는 질병"
            variant="primary"
            items={[
              {
                label: '질병',
                value:
                  consultCardData?.healthInformation?.diseaseInfo?.diseases?.join(
                    ' · ',
                  ) || '',
              },
              {
                label: '질병 및 수술 이력',
                value:
                  consultCardData?.healthInformation?.diseaseInfo
                    ?.historyNote || '',
              },
              {
                label: '주요 불편 증상',
                value:
                  consultCardData?.healthInformation?.diseaseInfo
                    ?.mainInconvenienceNote || '',
              },
            ]}
          />

          <CardSection
            title="알레르기"
            items={[
              {
                label: '알레르기 여부',
                value: consultCardData?.healthInformation?.allergy?.isAllergy
                  ? '알레르기 있음'
                  : '없음',
              },
              {
                label: '의심 식품/약물',
                value:
                  consultCardData?.healthInformation?.allergy?.allergyNote ||
                  '',
              },
            ]}
          />
          <CardSection
            title="약물 부작용"
            items={[
              {
                label: '약물 부작용 여부',
                value: consultCardData?.healthInformation?.medicationSideEffect
                  ?.isSideEffect
                  ? '약물 부작용 있음'
                  : '없음',
              },
              {
                label: '부작용 의심 약물',
                value:
                  consultCardData?.healthInformation?.medicationSideEffect
                    ?.suspectedMedicationNote || '',
              },
              {
                label: '부작용 증상',
                value:
                  consultCardData?.healthInformation?.medicationSideEffect
                    ?.symptomsNote || '',
              },
            ]}
          />

          {consultCardData?.independentLifeInformation && (
            <>
              <CardSection
                title="보행"
                variant="error"
                items={[
                  {
                    label: '보행 여부',
                    value:
                      consultCardData?.independentLifeInformation?.walking?.walkingMethods?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                  {
                    label: '이동 장비',
                    value:
                      consultCardData?.independentLifeInformation?.walking?.walkingEquipments?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                  {
                    label: '기타',
                    value:
                      consultCardData?.independentLifeInformation?.walking
                        ?.etcNote || '정보 없음',
                  },
                ]}
              />

              <CardSection
                title="배변 처리"
                items={[
                  {
                    label: '배변 처리 방식',
                    value:
                      consultCardData?.independentLifeInformation?.evacuation?.evacuationMethods?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                  {
                    label: '기타',
                    value:
                      consultCardData?.independentLifeInformation?.evacuation
                        ?.etcNote || '정보 없음',
                  },
                ]}
              />

              <CardSection
                title="의사소통 정도"
                items={[
                  {
                    label: '시력',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.sights?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                  {
                    label: '청력',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.hearings?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                  {
                    label: '언어 소통',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.communications?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                  {
                    label: '한글 사용',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.usingKoreans?.join(
                        ', ',
                      ) || '정보 없음',
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ConsultCard;
