import {
  BaseInfoDTOHealthInsuranceTypeEnum,
  CommunicationDTOCommunicationsEnum,
  CommunicationDTOHearingsEnum,
  CommunicationDTOSightsEnum,
  CommunicationDTOUsingKoreansEnum,
  CounselorListItemRoleTypeEnum,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
  DrinkingDTODrinkingAmountEnum,
  EvacuationDTOEvacuationsEnum,
  ExerciseDTOExercisePatternEnum,
  GetCounselorResRoleTypeEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
  NutritionDTOMealPatternEnum,
  SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum,
  SmokingDTOSmokingAmountEnum,
  WalkingDTOWalkingEquipmentsEnum,
  WalkingDTOWalkingMethodsEnum,
} from '@/api';
import { ButtonGroupOption } from '@/components/ui/button-group';

export const HEALTH_INSURANCE_TYPE_MAP: Record<
  BaseInfoDTOHealthInsuranceTypeEnum,
  string
> = {
  [BaseInfoDTOHealthInsuranceTypeEnum.HealthInsurance]: '건강보험',
  [BaseInfoDTOHealthInsuranceTypeEnum.MedicalAid]: '의료급여',
  [BaseInfoDTOHealthInsuranceTypeEnum.VeteransBenefits]: '보훈',
  [BaseInfoDTOHealthInsuranceTypeEnum.NonCovered]: '없음',
} as const;

export const COUNSEL_PURPOSE_OPTIONS: ButtonGroupOption[] = [
  {
    label: '약물 부작용 상담',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.MedicationSideEffect,
  },
  {
    label: '생활습관 관리',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.LifestyleManagement,
  },
  {
    label: '증상/질병 이해',
    value:
      CounselPurposeAndNoteDTOCounselPurposeEnum.SymptomDiseaseUnderstanding,
  },
  {
    label: '복용약물 검토',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.MedicationReview,
  },
  {
    label: '기타',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.Other,
  },
] as const;

export const COUNSEL_PURPOSE_MAP: Record<
  CounselPurposeAndNoteDTOCounselPurposeEnum,
  string
> = COUNSEL_PURPOSE_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<CounselPurposeAndNoteDTOCounselPurposeEnum, string>,
);

export const DISEASE_OPTIONS: ButtonGroupOption[] = [
  {
    label: '고혈압',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.Hypertension,
  },
  {
    label: '고지혈증',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.Hyperlipidemia,
  },
  {
    label: '뇌혈관질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.CerebrovascularDisease,
  },
  {
    label: '심장질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.HeartDisease,
  },
  {
    label: '당뇨병',
    value: SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.Diabetes,
  },
  {
    label: '갑상선질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.ThyroidDisease,
  },
  {
    label: '위장관질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.GastrointestinalDisease,
  },
  {
    label: '파킨슨병',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.ParkinsonsDisease,
  },
  {
    label: '치매, 인지장애',
    value: SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.Dementia,
  },
  {
    label: '수면장애',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.SleepDisorder,
  },
  {
    label: '우울/불안장애',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.DepressionAnxiety,
  },
  {
    label: '신장질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.KidneyDisease,
  },
  {
    label: '간질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.LiverDisease,
  },
  {
    label: '비뇨·생식기질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.UrogenitalDisease,
  },
  {
    label: '암질환',
    value: SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.Cancer,
  },
  {
    label: '뇌경색',
    value: SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.Stroke,
  },
  {
    label: '척추·관절염/신경통·근육통',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.SpineJointNeuropathy,
  },
  {
    label: '호흡기질환(천식, COPD 등)',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.RespiratoryDisease,
  },
  {
    label: '안과질환(백내장, 녹내장, 안구건조증 등)',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.EyeDisease,
  },
  {
    label: '이비인후과질환',
    value:
      SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum.EntDisease,
  },
] as const;

export const DISEASE_MAP: Record<
  SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum,
  string
> = DISEASE_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<
    SelectCounseleeBaseInformationByCounseleeIdResDiseasesEnum,
    string
  >,
);

export const MEAL_PATTERN_OPTIONS: ButtonGroupOption[] = [
  {
    label: '하루 1회 규칙적',
    value: NutritionDTOMealPatternEnum.OneRegularMeal,
  },
  {
    label: '하루 2회 규칙적',
    value: NutritionDTOMealPatternEnum.TwoRegularMeals,
  },
  {
    label: '하루 3회 규칙적',
    value: NutritionDTOMealPatternEnum.ThreeRegularMeals,
  },
  {
    label: '불규칙적',
    value: NutritionDTOMealPatternEnum.IrregularMeals,
  },
] as const;

export const MEAL_PATTERN_MAP: Record<NutritionDTOMealPatternEnum, string> =
  MEAL_PATTERN_OPTIONS.reduce(
    (acc, { value, label }) => ({
      ...acc,
      [value]: label,
    }),
    {} as Record<NutritionDTOMealPatternEnum, string>,
  );

export const EXERCISE_PATTERN_OPTIONS: ButtonGroupOption[] = [
  {
    label: '주 1회',
    value: ExerciseDTOExercisePatternEnum.OnceAWeek,
  },
  {
    label: '주 2회',
    value: ExerciseDTOExercisePatternEnum.TwiceAWeek,
  },
  {
    label: '주 3회',
    value: ExerciseDTOExercisePatternEnum.ThreeTimesAWeek,
  },
  {
    label: '주 4회',
    value: ExerciseDTOExercisePatternEnum.FourTimesAWeek,
  },
  {
    label: '주 5회 이상',
    value: ExerciseDTOExercisePatternEnum.FiveOrMoreTimesAWeek,
  },
  {
    label: '운동 안함',
    value: ExerciseDTOExercisePatternEnum.NoExercise,
  },
] as const;

export const EXERCISE_PATTERN_MAP: Record<
  ExerciseDTOExercisePatternEnum,
  string
> = EXERCISE_PATTERN_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<ExerciseDTOExercisePatternEnum, string>,
);

export const MEDICATION_ASSISTANTS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '본인',
    value: MedicationManagementDTOMedicationAssistantsEnum.Self,
  },
  {
    label: '배우자',
    value: MedicationManagementDTOMedicationAssistantsEnum.Spouse,
  },
  {
    label: '자녀',
    value: MedicationManagementDTOMedicationAssistantsEnum.Children,
  },
  {
    label: '친척',
    value: MedicationManagementDTOMedicationAssistantsEnum.Relatives,
  },
  {
    label: '친구',
    value: MedicationManagementDTOMedicationAssistantsEnum.Friend,
  },
  {
    label: '요양보호사 또는 돌봄종사자',
    value: MedicationManagementDTOMedicationAssistantsEnum.Caregiver,
  },
  {
    label: '기타',
    value: MedicationManagementDTOMedicationAssistantsEnum.Other,
  },
] as const;

export const MEDICATION_ASSISTANTS_MAP: Record<
  MedicationManagementDTOMedicationAssistantsEnum,
  string
> = MEDICATION_ASSISTANTS_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<MedicationManagementDTOMedicationAssistantsEnum, string>,
);

export const WALKING_METHODS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '와상 및 보행불가',
    value: WalkingDTOWalkingMethodsEnum.Bedridden,
  },
  {
    label: '자립보행 가능',
    value: WalkingDTOWalkingMethodsEnum.IndependentWalk,
  },
  {
    label: '보조기구 필요',
    value: WalkingDTOWalkingMethodsEnum.NeedsMobilityAid,
  },
] as const;

export const WALKING_METHODS_MAP: Record<WalkingDTOWalkingMethodsEnum, string> =
  WALKING_METHODS_OPTIONS.reduce(
    (acc, { value, label }) => ({
      ...acc,
      [value]: label,
    }),
    {} as Record<WalkingDTOWalkingMethodsEnum, string>,
  );

export const WALKING_EQUIPMENTS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '지팡이',
    value: WalkingDTOWalkingEquipmentsEnum.Cane,
  },
  {
    label: '워커',
    value: WalkingDTOWalkingEquipmentsEnum.Walker,
  },
  {
    label: '휠체어',
    value: WalkingDTOWalkingEquipmentsEnum.Wheelchair,
  },
  {
    label: '기타',
    value: WalkingDTOWalkingEquipmentsEnum.Other,
  },
] as const;

export const WALKING_EQUIPMENTS_MAP: Record<
  WalkingDTOWalkingEquipmentsEnum,
  string
> = WALKING_EQUIPMENTS_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<WalkingDTOWalkingEquipmentsEnum, string>,
);

export const EVACUATIONS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '자립 화장실 사용',
    value: EvacuationDTOEvacuationsEnum.Independent,
  },
  {
    label: '화장실 유도',
    value: EvacuationDTOEvacuationsEnum.Guided,
  },
  {
    label: '이동식 변기 사용',
    value: EvacuationDTOEvacuationsEnum.PortableToilet,
  },
  {
    label: '기저귀 사용',
    value: EvacuationDTOEvacuationsEnum.Diaper,
  },
  {
    label: '소변통 사용',
    value: EvacuationDTOEvacuationsEnum.Urinal,
  },
  {
    label: '기타',
    value: EvacuationDTOEvacuationsEnum.Other,
  },
] as const;

export const EVACUATIONS_MAP: Record<EvacuationDTOEvacuationsEnum, string> =
  EVACUATIONS_OPTIONS.reduce(
    (acc, { value, label }) => ({
      ...acc,
      [value]: label,
    }),
    {} as Record<EvacuationDTOEvacuationsEnum, string>,
  );

export const SIGHTS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '잘 보임',
    value: CommunicationDTOSightsEnum.WellSeen,
  },
  {
    label: '잘 안보임',
    value: CommunicationDTOSightsEnum.PoorlySeen,
  },
  {
    label: '전혀 안보임',
    value: CommunicationDTOSightsEnum.NotSeen,
  },
  {
    label: '안경 사용',
    value: CommunicationDTOSightsEnum.UsingGlasses,
  },
] as const;

export const SIGHTS_MAP: Record<CommunicationDTOSightsEnum, string> =
  SIGHTS_OPTIONS.reduce(
    (acc, { value, label }) => ({
      ...acc,
      [value]: label,
    }),
    {} as Record<CommunicationDTOSightsEnum, string>,
  );

export const HEARINGS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '잘 들림',
    value: CommunicationDTOHearingsEnum.WellHeard,
  },
  {
    label: '잘 안들림',
    value: CommunicationDTOHearingsEnum.PoorlyHeard,
  },
  {
    label: '전혀 안들림',
    value: CommunicationDTOHearingsEnum.NotHeard,
  },
  {
    label: '보청기 사용',
    value: CommunicationDTOHearingsEnum.UsingHearingAid,
  },
] as const;

export const HEARINGS_MAP: Record<CommunicationDTOHearingsEnum, string> =
  HEARINGS_OPTIONS.reduce(
    (acc, { value, label }) => ({
      ...acc,
      [value]: label,
    }),
    {} as Record<CommunicationDTOHearingsEnum, string>,
  );

export const COMMUNICATIONS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '소통 가능함',
    value: CommunicationDTOCommunicationsEnum.WellCommunicate,
  },
  {
    label: '대강 가능함',
    value: CommunicationDTOCommunicationsEnum.SemiCommunicate,
  },
  {
    label: '불가능',
    value: CommunicationDTOCommunicationsEnum.NotCommunicate,
  },
] as const;

export const COMMUNICATIONS_MAP: Record<
  CommunicationDTOCommunicationsEnum,
  string
> = COMMUNICATIONS_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<CommunicationDTOCommunicationsEnum, string>,
);

export const USING_KOREANS_OPTIONS: ButtonGroupOption[] = [
  {
    label: '읽기 가능',
    value: CommunicationDTOUsingKoreansEnum.Read,
  },
  {
    label: '쓰기 가능',
    value: CommunicationDTOUsingKoreansEnum.Write,
  },
] as const;

export const USING_KOREANS_MAP: Record<
  CommunicationDTOUsingKoreansEnum,
  string
> = USING_KOREANS_OPTIONS.reduce(
  (acc, { value, label }) => ({
    ...acc,
    [value]: label,
  }),
  {} as Record<CommunicationDTOUsingKoreansEnum, string>,
);

export const SMOKING_AMOUNT_OPTIONS: ButtonGroupOption[] = [
  { label: '1갑', value: SmokingDTOSmokingAmountEnum.OnePack },
  { label: '2갑', value: SmokingDTOSmokingAmountEnum.TwoPacks },
  { label: '3갑 이상', value: SmokingDTOSmokingAmountEnum.ThreeOrMorePacks },
] as const;

export const SMOKING_AMOUNT_MAP: Record<SmokingDTOSmokingAmountEnum, string> = {
  [SmokingDTOSmokingAmountEnum.None]: '비흡연',
  [SmokingDTOSmokingAmountEnum.OnePack]: '1갑',
  [SmokingDTOSmokingAmountEnum.TwoPacks]: '2갑',
  [SmokingDTOSmokingAmountEnum.ThreeOrMorePacks]: '3갑 이상',
} as const;

export const DRINKING_FREQUENCY_OPTIONS: ButtonGroupOption[] = [
  { label: '주 1회', value: DrinkingDTODrinkingAmountEnum.OnceAWeek },
  { label: '주 2회', value: DrinkingDTODrinkingAmountEnum.TwiceAWeek },
  { label: '주 3회', value: DrinkingDTODrinkingAmountEnum.ThreeTimesAWeek },
  { label: '주 4회', value: DrinkingDTODrinkingAmountEnum.FourTimesAWeek },
  {
    label: '주 5회 이상',
    value: DrinkingDTODrinkingAmountEnum.FiveOrMoreTimesAWeek,
  },
] as const;

export const DRINKING_FREQUENCY_MAP: Record<
  DrinkingDTODrinkingAmountEnum,
  string
> = {
  [DrinkingDTODrinkingAmountEnum.None]: '비음주',
  [DrinkingDTODrinkingAmountEnum.OnceAWeek]: '주 1회',
  [DrinkingDTODrinkingAmountEnum.TwiceAWeek]: '주 2회',
  [DrinkingDTODrinkingAmountEnum.ThreeTimesAWeek]: '주 3회',
  [DrinkingDTODrinkingAmountEnum.FourTimesAWeek]: '주 4회',
  [DrinkingDTODrinkingAmountEnum.FiveOrMoreTimesAWeek]: '주 5회 이상',
} as const;

export const SMOKING_OPTIONS: ButtonGroupOption[] = [
  { label: '흡연', value: 'true' },
  { label: '비흡연', value: 'false' },
] as const;

export const DRINKING_OPTIONS: ButtonGroupOption[] = [
  { label: '음주', value: 'true' },
  { label: '비음주', value: 'false' },
] as const;

export const ROLE_TYPE_MAP: Record<string, string> = {
  [GetCounselorResRoleTypeEnum.None]: '',
  [GetCounselorResRoleTypeEnum.Admin]: '관리자',
  [GetCounselorResRoleTypeEnum.Assistant]: '지원자',
  [GetCounselorResRoleTypeEnum.User]: '약사',
} as const;

export const ROLE_ACCESS = {
  ADMIN_ONLY: [GetCounselorResRoleTypeEnum.Admin],
  ADMIN_USER: [
    GetCounselorResRoleTypeEnum.Admin,
    GetCounselorResRoleTypeEnum.User,
  ],
  ALL_ROLES: [
    GetCounselorResRoleTypeEnum.Admin,
    GetCounselorResRoleTypeEnum.User,
    GetCounselorResRoleTypeEnum.Assistant,
  ],
};

export const COUNSELOR_ROLE_TYPE_OPTIONS: ButtonGroupOption[] = [
  { label: '관리자', value: CounselorListItemRoleTypeEnum.Admin },
  { label: '상담약사', value: CounselorListItemRoleTypeEnum.User },
  { label: '기록보조자', value: CounselorListItemRoleTypeEnum.Assistant },
  { label: '권한없음', value: CounselorListItemRoleTypeEnum.None },
] as const;

export const COUNSELOR_ROLE_TYPE_MAP: Record<
  CounselorListItemRoleTypeEnum,
  { label: string; textColor: string }
> = {
  [CounselorListItemRoleTypeEnum.Admin]: {
    label: '관리자',
    textColor: 'text-grayscale-100',
  },
  [CounselorListItemRoleTypeEnum.User]: {
    label: '상담약사',
    textColor: 'text-grayscale-100',
  },
  [CounselorListItemRoleTypeEnum.Assistant]: {
    label: '기록보조자',
    textColor: 'text-primary-60',
  },
  [CounselorListItemRoleTypeEnum.None]: {
    label: '권한미등록',
    textColor: 'text-error-60',
  },
} as const;
