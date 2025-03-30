import {
  BaseInfoDTOHealthInsuranceTypeEnum,
  CounselCardBaseInformationRes,
  CounselCardHealthInformationRes,
  CounselCardIndependentLifeInformationRes,
  CounselCardLivingInformationRes,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
  SmokingDTOSmokingAmountEnum,
} from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { useCounselCardStore } from '@/pages/Survey/hooks/counselCardStore';
import {
  useCounselCardBaseInfoQuery,
  useCounselCardHealthInfoQuery,
  useCounselCardIndependentLifeInfoQuery,
  useCounselCardLivingInfoQuery,
} from '@/pages/Survey/hooks/useCounselCardQuery';
import {
  COMMUNICATIONS_MAP,
  COUNSEL_PURPOSE_MAP,
  DISEASE_MAP,
  DRINKING_FREQUENCY_MAP,
  EVACUATIONS_MAP,
  EXERCISE_PATTERN_MAP,
  HEALTH_INSURANCE_TYPE_MAP,
  HEARINGS_MAP,
  MEAL_PATTERN_MAP,
  MEDICATION_ASSISTANTS_MAP,
  SIGHTS_MAP,
  SMOKING_AMOUNT_MAP,
  USING_KOREANS_MAP,
  WALKING_EQUIPMENTS_MAP,
  WALKING_METHODS_MAP,
} from '@/utils/constants';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ConsultCardData {
  baseInformation: CounselCardBaseInformationRes | null | undefined;
  healthInformation: CounselCardHealthInformationRes | null | undefined;
  independentLifeInformation:
    | CounselCardIndependentLifeInformationRes
    | null
    | undefined;
  livingInformation: CounselCardLivingInformationRes | null | undefined;
}

const ConsultCard: React.FC = () => {
  const { counselSessionId } = useParams();
  const navigate = useNavigate();
  const { setShouldFetch } = useCounselCardStore();

  // 컴포넌트 마운트시 데이터 새로고침 트리거
  useEffect(() => {
    if (counselSessionId) {
      setShouldFetch('base', true);
      setShouldFetch('health', true);
      setShouldFetch('independentLife', true);
      setShouldFetch('living', true);
    }
  }, [counselSessionId, setShouldFetch]);

  const { data: baseInfoData } = useCounselCardBaseInfoQuery(
    counselSessionId || '',
  );
  const { data: healthInfoData } = useCounselCardHealthInfoQuery(
    counselSessionId || '',
  );
  const { data: independentLifeInfoData } =
    useCounselCardIndependentLifeInfoQuery(counselSessionId || '');
  const { data: livingInfoData } = useCounselCardLivingInfoQuery(
    counselSessionId || '',
  );

  const consultCardData: ConsultCardData = {
    baseInformation: baseInfoData as
      | CounselCardBaseInformationRes
      | null
      | undefined,
    healthInformation: healthInfoData as
      | CounselCardHealthInformationRes
      | null
      | undefined,
    independentLifeInformation: independentLifeInfoData as
      | CounselCardIndependentLifeInformationRes
      | null
      | undefined,
    livingInformation: livingInfoData as
      | CounselCardLivingInformationRes
      | null
      | undefined,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>기초 설문</CardTitle>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/survey/${counselSessionId}`, {
                state: { fromConsult: true },
              })
            }>
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
                value: baseInfoData?.baseInfo?.counseleeName,
              },
              {
                label: '생년월일',
                value: baseInfoData?.baseInfo?.birthDate,
              },
              {
                label: '의료보장형태',
                value: baseInfoData?.baseInfo?.healthInsuranceType
                  ? HEALTH_INSURANCE_TYPE_MAP[
                      baseInfoData.baseInfo
                        .healthInsuranceType as BaseInfoDTOHealthInsuranceTypeEnum
                    ]
                  : '',
              },
            ]}
          />

          <CardSection
            title="상담 목적 및 특이사항"
            items={[
              {
                label: '상담 목적',
                value: Array.isArray(
                  baseInfoData?.counselPurposeAndNote?.counselPurpose,
                )
                  ? baseInfoData?.counselPurposeAndNote.counselPurpose
                      .map(
                        (purpose: CounselPurposeAndNoteDTOCounselPurposeEnum) =>
                          COUNSEL_PURPOSE_MAP[
                            purpose as CounselPurposeAndNoteDTOCounselPurposeEnum
                          ],
                      )
                      .join(', ')
                  : '',
              },
              {
                label: '특이사항',
                value:
                  baseInfoData?.counselPurposeAndNote?.significantNote || '',
              },
              {
                label: '의약품',
                value:
                  baseInfoData?.counselPurposeAndNote?.medicationNote || '',
              },
            ]}
          />
          <CardSection
            title={
              <div className="flex items-center gap-2">
                흡연
                {/* <HistoryPopover>
                  <HistoryPopoverTrigger>
                    <ClockIcon className="h-4 w-4" />
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
                </HistoryPopover> */}
              </div>
            }
            variant="secondary"
            items={[
              {
                label: '흡연 여부',
                value:
                  consultCardData?.livingInformation?.smoking?.smokingAmount !==
                  SmokingDTOSmokingAmountEnum.None
                    ? '흡연'
                    : '비흡연',
              },
              ...(consultCardData?.livingInformation?.smoking?.smokingAmount !==
              SmokingDTOSmokingAmountEnum.None
                ? [
                    {
                      label: '총 흡연기간',
                      value:
                        consultCardData?.livingInformation?.smoking
                          ?.smokingPeriodNote || '-',
                    },
                    {
                      label: '하루 평균 흡연량',
                      value: consultCardData?.livingInformation?.smoking
                        ?.smokingAmount
                        ? SMOKING_AMOUNT_MAP[
                            consultCardData.livingInformation.smoking
                              .smokingAmount
                          ]
                        : '-',
                    },
                  ]
                : []),
            ]}
          />

          <CardSection
            title="음주"
            items={[
              {
                label: '음주 여부',
                value:
                  consultCardData?.livingInformation?.drinking
                    ?.drinkingAmount !== 'NONE'
                    ? '음주'
                    : '비음주',
              },
              ...(consultCardData?.livingInformation?.drinking
                ?.drinkingAmount !== 'NONE'
                ? [
                    {
                      label: '음주 횟수',
                      value: consultCardData?.livingInformation?.drinking
                        ?.drinkingAmount
                        ? DRINKING_FREQUENCY_MAP[
                            consultCardData.livingInformation.drinking
                              .drinkingAmount
                          ]
                        : '-',
                    },
                  ]
                : []),
            ]}
          />

          <CardSection
            title="영양상태"
            items={[
              {
                label: '하루 식사 패턴',
                value: consultCardData?.livingInformation?.nutrition
                  ?.mealPattern
                  ? MEAL_PATTERN_MAP[
                      consultCardData.livingInformation.nutrition.mealPattern
                    ]
                  : '',
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
                value: consultCardData?.livingInformation?.exercise
                  ?.exercisePattern
                  ? EXERCISE_PATTERN_MAP[
                      consultCardData.livingInformation.exercise.exercisePattern
                    ]
                  : '',
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
                  consultCardData?.livingInformation?.medicationManagement?.medicationAssistants
                    ?.map((assistant) => MEDICATION_ASSISTANTS_MAP[assistant])
                    .join(', ') || '',
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
                  consultCardData?.healthInformation?.diseaseInfo?.diseases
                    ?.map((disease) => DISEASE_MAP[disease])
                    .join(' · ') || '',
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
                value: consultCardData?.healthInformation?.allergy?.isAllergic
                  ? '알레르기 있음'
                  : '없음',
              },
              ...(consultCardData?.healthInformation?.allergy?.isAllergic
                ? [
                    {
                      label: '의심 식품/약물',
                      value:
                        consultCardData?.healthInformation?.allergy
                          ?.allergyNote || '',
                    },
                  ]
                : []),
            ]}
          />
          <CardSection
            title="약물 부작용"
            items={[
              {
                label: '약물 부작용 여부',
                value: consultCardData?.healthInformation?.medicationSideEffect
                  ?.isMedicationSideEffect
                  ? '약물 부작용 있음'
                  : '없음',
              },
              ...(consultCardData?.healthInformation?.medicationSideEffect
                ?.isMedicationSideEffect
                ? [
                    {
                      label: '부작용 증상',
                      value:
                        consultCardData?.healthInformation?.medicationSideEffect
                          ?.symptomsNote || '',
                    },
                    {
                      label: '부작용 의심 약물',
                      value:
                        consultCardData?.healthInformation?.medicationSideEffect
                          ?.suspectedMedicationNote || '',
                    },
                  ]
                : []),
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
                      consultCardData?.independentLifeInformation?.walking?.walkingMethods
                        ?.map((method) => WALKING_METHODS_MAP[method])
                        .join(', ') || '정보 없음',
                  },
                  {
                    label: '이동 장비',
                    value:
                      consultCardData?.independentLifeInformation?.walking?.walkingEquipments
                        ?.map((equipment) => WALKING_EQUIPMENTS_MAP[equipment])
                        .join(', ') || '정보 없음',
                  },
                  {
                    label: '기타',
                    value:
                      consultCardData?.independentLifeInformation?.walking
                        ?.walkingNote || '정보 없음',
                  },
                ]}
              />

              <CardSection
                title="배변 처리"
                items={[
                  {
                    label: '배변 처리 방식',
                    value:
                      consultCardData?.independentLifeInformation?.evacuation?.evacuations
                        ?.map((evacuation) => EVACUATIONS_MAP[evacuation])
                        .join(', ') || '정보 없음',
                  },
                  {
                    label: '기타',
                    value:
                      consultCardData?.independentLifeInformation?.evacuation
                        ?.evacuationNote || '정보 없음',
                  },
                ]}
              />

              <CardSection
                title="의사소통 정도"
                items={[
                  {
                    label: '시력',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.sights
                        ?.map((sight) => SIGHTS_MAP[sight])
                        .join(', ') || '정보 없음',
                  },
                  {
                    label: '청력',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.hearings
                        ?.map((hearing) => HEARINGS_MAP[hearing])
                        .join(', ') || '정보 없음',
                  },
                  {
                    label: '언어 소통',
                    value: consultCardData?.independentLifeInformation
                      ?.communication?.communications
                      ? COMMUNICATIONS_MAP[
                          consultCardData.independentLifeInformation
                            .communication.communications
                        ]
                      : '정보 없음',
                  },
                  {
                    label: '한글 사용',
                    value:
                      consultCardData?.independentLifeInformation?.communication?.usingKoreans
                        ?.map((korean) => USING_KOREANS_MAP[korean])
                        .join(', ') || '정보 없음',
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
