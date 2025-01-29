import {
  AddCounselCardReqCardRecordStatusEnum,
  BaseInformationDTO,
  HealthInformationDTO,
  IndependentLifeInformationDTO,
  LivingInformationDTO,
} from '@/api/api';
import { create } from 'zustand';

// 상담 카드 등록 정보 관련 상태 관리
export interface CounselSurveyType {
  counselCardId?: string;
  counselSessionId?: string;
  cardRecordStatus?: AddCounselCardReqCardRecordStatusEnum;
  baseInformation?: BaseInformationDTO;
  healthInformation?: HealthInformationDTO;
  livingInformation?: LivingInformationDTO;
  independentLifeInformation?: IndependentLifeInformationDTO;
}

export interface CounselSurveyState {
  counselSurvey: CounselSurveyType;
  setCounselSurvey: (
    updateFn: (prevState: CounselSurveyType) => CounselSurveyType,
  ) => void;
}

// Zustand Store
export const useCounselSurveyStore = create<CounselSurveyState>()((set) => ({
  counselSurvey: {
    counselCardId: '',
    counselSessionId: '',
    cardRecordStatus: AddCounselCardReqCardRecordStatusEnum.Recorded,
    baseInformation: {
      version: '1.1',
      baseInfo: {
        name: '',
        birthDate: '',
        healthInsuranceType: undefined,
        counselSessionOrder: '',
        lastCounselDate: '',
      },
      counselPurposeAndNote: {
        counselPurpose: [],
        SignificantNote: '',
        MedicationNote: '',
      },
    },
    healthInformation: {
      version: '1.1',
      diseaseInfo: {
        diseases: [],
        historyNote: '',
        mainInconvenienceNote: '',
      },
      allergy: {
        isAllergy: undefined,
        allergyNote: '',
      },
      medicationSideEffect: {
        isSideEffect: undefined,
        suspectedMedicationNote: '',
        symptomsNote: '',
      },
    },
    livingInformation: {
      version: '1.1',
      smoking: {
        isSmoking: undefined,
        smokingAmount: '',
        smokingPeriodNote: '',
      },
      drinking: {
        isDrinking: undefined,
        drinkingAmount: '',
      },
      nutrition: {
        mealPattern: '',
        nutritionNote: '',
      },
      exercise: {
        exercisePattern: '',
        exerciseNote: '',
      },
      medicationManagement: {
        isAlone: undefined,
        houseMateNote: '',
        medicationAssistants: [],
      },
    },
    independentLifeInformation: {
      version: '1.1',
      walking: {
        walkingMethods: [],
        walkingEquipments: [],
        etcNote: '',
      },
      evacuation: {
        evacuationMethods: [],
        etcNote: '',
      },
      communication: {
        sights: [],
        hearings: [],
        communications: [],
        usingKoreans: [],
      },
    },
  },
  setCounselSurvey: (updateFn) =>
    set((state) => ({
      counselSurvey: updateFn(state.counselSurvey),
    })),
}));
