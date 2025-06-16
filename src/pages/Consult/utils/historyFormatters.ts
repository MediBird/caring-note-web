import {
  COUNSEL_PURPOSE_MAP,
  DISEASE_MAP,
  DRINKING_FREQUENCY_MAP,
  EVACUATIONS_MAP,
  EXERCISE_PATTERN_MAP,
  HEARINGS_MAP,
  COMMUNICATIONS_MAP,
  MEDICATION_ASSISTANTS_MAP,
  MEAL_PATTERN_MAP,
  SIGHTS_MAP,
  SMOKING_AMOUNT_MAP,
  USING_KOREANS_MAP,
  WALKING_EQUIPMENTS_MAP,
  WALKING_METHODS_MAP,
  WATER_INTAKE_MAP,
} from '@/utils/constants';
import {
  CommunicationDTOCommunicationsEnum,
  CommunicationDTOHearingsEnum,
  CommunicationDTOSightsEnum,
  CommunicationDTOUsingKoreansEnum,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
  DiseaseInfoDTODiseasesEnum,
  DrinkingDTODrinkingAmountEnum,
  EvacuationDTOEvacuationsEnum,
  ExerciseDTOExercisePatternEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
  NutritionDTOMealPatternEnum,
  NutritionDTOWaterIntakeEnum,
  SmokingDTOSmokingAmountEnum,
  WalkingDTOWalkingEquipmentsEnum,
  WalkingDTOWalkingMethodsEnum,
} from '@/api';

// 상담 목적 히스토리 포맷팅 함수
export const formatCounselPurposeHistory = (data: unknown): string[] => {
  console.log('formatCounselPurposeHistory - input data:', data);

  // 데이터가 직접 배열인 경우 처리
  if (Array.isArray(data)) {
    console.log('formatCounselPurposeHistory - data is array:', data);
    const purposes = data
      .map(
        (purpose) =>
          COUNSEL_PURPOSE_MAP[
            purpose as CounselPurposeAndNoteDTOCounselPurposeEnum
          ],
      )
      .filter(Boolean)
      .join(', ');
    console.log('formatCounselPurposeHistory - formatted purposes:', purposes);
    return purposes ? [purposes] : ['데이터 없음'];
  }

  // 기존 객체 형태 처리 (하위 호환성)
  if (typeof data === 'object' && data !== null) {
    const counselData = data as {
      counselPurpose?: string[];
    };

    console.log(
      'formatCounselPurposeHistory - parsed counselData:',
      counselData,
    );

    const items: string[] = [];

    if (
      counselData.counselPurpose &&
      Array.isArray(counselData.counselPurpose)
    ) {
      const purposes = counselData.counselPurpose
        .map(
          (purpose) =>
            COUNSEL_PURPOSE_MAP[
              purpose as CounselPurposeAndNoteDTOCounselPurposeEnum
            ],
        )
        .filter(Boolean)
        .join(', ');
      if (purposes) items.push(purposes);
      console.log(
        'formatCounselPurposeHistory - formatted purposes:',
        purposes,
      );
    }

    console.log('formatCounselPurposeHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }

  console.log(
    'formatCounselPurposeHistory - returning 데이터 없음 (not array or object)',
  );
  return ['데이터 없음'];
};

// 특이사항 히스토리 포맷팅 함수
export const formatSignificantNoteHistory = (data: unknown): string[] => {
  console.log('formatSignificantNoteHistory - input data:', data);

  // 데이터가 직접 문자열인 경우 처리
  if (typeof data === 'string' && data.trim()) {
    console.log('formatSignificantNoteHistory - data is string:', data);
    return [data];
  }

  // 기존 객체 형태 처리 (하위 호환성)
  if (typeof data === 'object' && data !== null) {
    const noteData = data as {
      significantNote?: string;
    };

    console.log('formatSignificantNoteHistory - parsed noteData:', noteData);

    const items: string[] = [];

    if (noteData.significantNote) {
      items.push(noteData.significantNote);
    }

    console.log('formatSignificantNoteHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatSignificantNoteHistory - returning 데이터 없음 (not string or object)',
  );
  return ['데이터 없음'];
};

// 약물 히스토리 포맷팅 함수
export const formatMedicationHistory = (data: unknown): string[] => {
  console.log('formatMedicationHistory - input data:', data);

  // 데이터가 직접 문자열인 경우 처리
  if (typeof data === 'string' && data.trim()) {
    console.log('formatMedicationHistory - data is string:', data);
    return [data];
  }

  // 기존 객체 형태 처리 (하위 호환성)
  if (typeof data === 'object' && data !== null) {
    const medicationData = data as {
      medicationNote?: string;
    };

    console.log(
      'formatMedicationHistory - parsed medicationData:',
      medicationData,
    );

    const items: string[] = [];

    if (medicationData.medicationNote) {
      items.push(medicationData.medicationNote);
    }

    console.log('formatMedicationHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatMedicationHistory - returning 데이터 없음 (not string or object)',
  );
  return ['데이터 없음'];
};

// 질병 정보 히스토리 포맷팅 함수 (앓고 있는 질병용)
export const formatDiseaseHistory = (data: unknown): string[] => {
  console.log('formatDiseaseHistory - input data:', data);

  // 데이터가 직접 배열인 경우 처리
  if (Array.isArray(data)) {
    console.log('formatDiseaseHistory - data is array:', data);
    const diseases = data
      .map((disease) => DISEASE_MAP[disease as DiseaseInfoDTODiseasesEnum])
      .filter(Boolean)
      .join(' · ');
    console.log('formatDiseaseHistory - formatted diseases:', diseases);
    return diseases ? [diseases] : ['데이터 없음'];
  }

  // 기존 객체 형태 처리 (하위 호환성)
  if (typeof data === 'object' && data !== null) {
    const diseaseData = data as {
      diseases?: string[];
    };

    console.log('formatDiseaseHistory - parsed diseaseData:', diseaseData);

    const items: string[] = [];

    if (diseaseData.diseases && Array.isArray(diseaseData.diseases)) {
      const diseases = diseaseData.diseases
        .map((disease) => DISEASE_MAP[disease as DiseaseInfoDTODiseasesEnum])
        .filter(Boolean)
        .join(' · ');
      if (diseases) items.push(diseases);
      console.log('formatDiseaseHistory - formatted diseases:', diseases);
    }

    console.log('formatDiseaseHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatDiseaseHistory - returning 데이터 없음 (not array or object)',
  );
  return ['데이터 없음'];
};

// 질병 및 수술 이력 히스토리 포맷팅 함수
export const formatDiseaseHistoryNote = (data: unknown): string[] => {
  console.log('formatDiseaseHistoryNote - input data:', data);

  // 데이터가 직접 문자열인 경우 처리
  if (typeof data === 'string' && data.trim()) {
    console.log('formatDiseaseHistoryNote - data is string:', data);
    return [data];
  }

  // 기존 객체 형태 처리 (하위 호환성)
  if (typeof data === 'object' && data !== null) {
    const diseaseData = data as {
      historyNote?: string;
    };

    console.log('formatDiseaseHistoryNote - parsed diseaseData:', diseaseData);

    const items: string[] = [];

    if (diseaseData.historyNote) {
      items.push(diseaseData.historyNote);
    }

    console.log('formatDiseaseHistoryNote - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatDiseaseHistoryNote - returning 데이터 없음 (not string or object)',
  );
  return ['데이터 없음'];
};

// 주요 불편 증상 히스토리 포맷팅 함수
export const formatMainInconvenienceHistory = (data: unknown): string[] => {
  console.log('formatMainInconvenienceHistory - input data:', data);

  // 데이터가 직접 문자열인 경우 처리
  if (typeof data === 'string' && data.trim()) {
    console.log('formatMainInconvenienceHistory - data is string:', data);
    return [data];
  }

  // 기존 객체 형태 처리 (하위 호환성)
  if (typeof data === 'object' && data !== null) {
    const diseaseData = data as {
      mainInconvenienceNote?: string;
    };

    console.log(
      'formatMainInconvenienceHistory - parsed diseaseData:',
      diseaseData,
    );

    const items: string[] = [];

    if (diseaseData.mainInconvenienceNote) {
      items.push(diseaseData.mainInconvenienceNote);
    }

    console.log('formatMainInconvenienceHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatMainInconvenienceHistory - returning 데이터 없음 (not string or object)',
  );
  return ['데이터 없음'];
};

// 알레르기 히스토리 포맷팅 함수
export const formatAllergyHistory = (data: unknown): string[] => {
  console.log('formatAllergyHistory - input data:', data, 'type:', typeof data);

  if (typeof data === 'object' && data !== null) {
    const allergyData = data as {
      isAllergic?: boolean;
      allergyNote?: string;
    };

    console.log('formatAllergyHistory - parsed allergyData:', allergyData);

    const items: string[] = [];

    if (allergyData.isAllergic !== undefined) {
      items.push(`알레르기 여부: ${allergyData.isAllergic ? '있음' : '없음'}`);
    }

    if (allergyData.allergyNote) {
      items.push(`의심 식품/약물: ${allergyData.allergyNote}`);
    }

    console.log('formatAllergyHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatAllergyHistory - returning 데이터 없음 (not object or null)',
  );
  return ['데이터 없음'];
};

// 약물 부작용 히스토리 포맷팅 함수
export const formatMedicationSideEffectHistory = (data: unknown): string[] => {
  console.log(
    'formatMedicationSideEffectHistory - input data:',
    data,
    'type:',
    typeof data,
  );

  if (typeof data === 'object' && data !== null) {
    const sideEffectData = data as {
      isMedicationSideEffect?: boolean;
      suspectedMedicationNote?: string;
      symptomsNote?: string;
    };

    console.log(
      'formatMedicationSideEffectHistory - parsed sideEffectData:',
      sideEffectData,
    );

    const items: string[] = [];

    if (sideEffectData.isMedicationSideEffect !== undefined) {
      items.push(
        `부작용 여부: ${sideEffectData.isMedicationSideEffect ? '있음' : '없음'}`,
      );
    }

    if (sideEffectData.suspectedMedicationNote) {
      items.push(`부작용 의심 약물: ${sideEffectData.suspectedMedicationNote}`);
    }

    if (sideEffectData.symptomsNote) {
      items.push(`부작용 증상: ${sideEffectData.symptomsNote}`);
    }

    console.log('formatMedicationSideEffectHistory - final items:', items);
    return items.length > 0 ? items : ['데이터 없음'];
  }
  console.log(
    'formatMedicationSideEffectHistory - returning 데이터 없음 (not object or null)',
  );
  return ['데이터 없음'];
};

// 의사소통 히스토리 포맷팅 함수
export const formatCommunicationHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const commData = data as {
      sights?: string[];
      hearings?: string[];
      communications?: string;
      usingKoreans?: string[];
    };

    const items: string[] = [];

    if (commData.sights && Array.isArray(commData.sights)) {
      const sights = commData.sights
        .map((sight) => SIGHTS_MAP[sight as CommunicationDTOSightsEnum])
        .filter(Boolean)
        .join(', ');
      if (sights) items.push(`시력: ${sights}`);
    }

    if (commData.hearings && Array.isArray(commData.hearings)) {
      const hearings = commData.hearings
        .map((hearing) => HEARINGS_MAP[hearing as CommunicationDTOHearingsEnum])
        .filter(Boolean)
        .join(', ');
      if (hearings) items.push(`청력: ${hearings}`);
    }

    if (commData.communications) {
      const communication =
        COMMUNICATIONS_MAP[
          commData.communications as CommunicationDTOCommunicationsEnum
        ];
      if (communication) items.push(`언어 소통: ${communication}`);
    }

    if (commData.usingKoreans && Array.isArray(commData.usingKoreans)) {
      const koreans = commData.usingKoreans
        .map(
          (korean) =>
            USING_KOREANS_MAP[korean as CommunicationDTOUsingKoreansEnum],
        )
        .filter(Boolean)
        .join(', ');
      if (koreans) items.push(`한글 사용: ${koreans}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 보행 히스토리 포맷팅 함수
export const formatWalkingHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const walkingData = data as {
      walkingMethods?: string[];
      walkingEquipments?: string[];
      walkingNote?: string;
    };

    const items: string[] = [];

    if (
      walkingData.walkingMethods &&
      Array.isArray(walkingData.walkingMethods)
    ) {
      const methods = walkingData.walkingMethods
        .map(
          (method) =>
            WALKING_METHODS_MAP[method as WalkingDTOWalkingMethodsEnum],
        )
        .filter(Boolean)
        .join(', ');
      if (methods) items.push(`보행 여부: ${methods}`);
    }

    if (
      walkingData.walkingEquipments &&
      Array.isArray(walkingData.walkingEquipments)
    ) {
      const equipments = walkingData.walkingEquipments
        .map(
          (equipment) =>
            WALKING_EQUIPMENTS_MAP[
              equipment as WalkingDTOWalkingEquipmentsEnum
            ],
        )
        .filter(Boolean)
        .join(', ');
      if (equipments) items.push(`이동 장비: ${equipments}`);
    }

    if (walkingData.walkingNote) {
      items.push(`기타 이동 장비: ${walkingData.walkingNote}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 배변 처리 히스토리 포맷팅 함수
export const formatEvacuationHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const evacuationData = data as {
      evacuations?: string[];
      evacuationNote?: string;
    };

    const items: string[] = [];

    if (
      evacuationData.evacuations &&
      Array.isArray(evacuationData.evacuations)
    ) {
      const evacuations = evacuationData.evacuations
        .map(
          (evacuation) =>
            EVACUATIONS_MAP[evacuation as EvacuationDTOEvacuationsEnum],
        )
        .filter(Boolean)
        .join(', ');
      if (evacuations) items.push(`배변 처리 방식: ${evacuations}`);
    }

    if (evacuationData.evacuationNote) {
      items.push(`기타 배변 처리: ${evacuationData.evacuationNote}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 흡연 히스토리 포맷팅 함수
export const formatSmokingHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const smokingData = data as {
      smokingAmount?: string;
      smokingPeriodNote?: string;
    };

    const items: string[] = [];
    if (smokingData.smokingPeriodNote) {
      items.push(`총 흡연 기간: ${smokingData.smokingPeriodNote}`);
    }

    if (smokingData.smokingAmount) {
      const amount =
        SMOKING_AMOUNT_MAP[
          smokingData.smokingAmount as SmokingDTOSmokingAmountEnum
        ];
      if (amount) items.push(`하루 평균 흡연량: ${amount}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 음주 히스토리 포맷팅 함수
export const formatDrinkingHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const drinkingData = data as {
      drinkingAmount?: string;
    };

    const items: string[] = [];

    if (drinkingData.drinkingAmount) {
      const amount =
        DRINKING_FREQUENCY_MAP[
          drinkingData.drinkingAmount as DrinkingDTODrinkingAmountEnum
        ];
      if (amount) items.push(`음주 횟수: ${amount}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 운동 히스토리 포맷팅 함수
export const formatExerciseHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const exerciseData = data as {
      exercisePattern?: string;
      exerciseNote?: string;
    };

    const items: string[] = [];

    if (exerciseData.exercisePattern) {
      const pattern =
        EXERCISE_PATTERN_MAP[
          exerciseData.exercisePattern as ExerciseDTOExercisePatternEnum
        ];
      if (pattern) items.push(`운동 패턴: ${pattern}`);
    }

    if (exerciseData.exerciseNote) {
      items.push(`운동 종류: ${exerciseData.exerciseNote}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 약물 관리 히스토리 포맷팅 함수
export const formatMedicationManagementHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const medData = data as {
      isAlone?: boolean;
      houseMateNote?: string;
      medicationAssistants?: string[];
      customMedicationAssistant?: string;
    };

    const items: string[] = [];

    if (medData.isAlone !== undefined) {
      items.push(`거주 형태: ${medData.isAlone ? '독거' : '동거'}`);
    }

    if (medData.houseMateNote) {
      items.push(`동거인 구성원: ${medData.houseMateNote}`);
    }

    if (
      medData.medicationAssistants &&
      Array.isArray(medData.medicationAssistants)
    ) {
      const assistants = medData.medicationAssistants
        .map(
          (assistant) =>
            MEDICATION_ASSISTANTS_MAP[
              assistant as MedicationManagementDTOMedicationAssistantsEnum
            ],
        )
        .filter(Boolean)
        .join(', ');
      if (assistants) items.push(`투약 보조자: ${assistants}`);
    }

    if (medData.customMedicationAssistant) {
      items.push(`기타 투약 보조자: ${medData.customMedicationAssistant}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};

// 영양 히스토리 포맷팅 함수
export const formatNutritionHistory = (data: unknown): string[] => {
  if (typeof data === 'object' && data !== null) {
    const nutritionData = data as {
      mealPattern?: string;
      waterIntake?: string;
      nutritionNote?: string;
    };

    const items: string[] = [];

    if (nutritionData.mealPattern) {
      const pattern =
        MEAL_PATTERN_MAP[
          nutritionData.mealPattern as NutritionDTOMealPatternEnum
        ];
      if (pattern) items.push(`식사 패턴: ${pattern}`);
    }

    if (nutritionData.waterIntake) {
      const intake =
        WATER_INTAKE_MAP[
          nutritionData.waterIntake as NutritionDTOWaterIntakeEnum
        ];
      if (intake) items.push(`수분 섭취량: ${intake}`);
    }

    if (nutritionData.nutritionNote) {
      items.push(`식생활 특이사항: ${nutritionData.nutritionNote}`);
    }

    return items.length > 0 ? items : ['데이터 없음'];
  }
  return ['데이터 없음'];
};
