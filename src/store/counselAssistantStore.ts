import {
  AddCounselCardReqCardRecordStatusEnum,
  BaseInfoDTOHealthInsuranceTypeEnum,
  BaseInformationDTO,
  HealthInformationDTO,
  IndependentLifeInformationDTO,
  LivingInformationDTO,
} from '@/api/api';
import { create } from 'zustand';

// 상담 카드 등록 정보 관련 상태 관리
export interface counselAssistantType {
  counselCardId?: string;
  counselSessionId?: string;
  cardRecordStatus?: AddCounselCardReqCardRecordStatusEnum;
  baseInformation?: BaseInformationDTO;
  healthInformation?: HealthInformationDTO;
  livingInformation?: LivingInformationDTO;
  independentLifeInformation?: IndependentLifeInformationDTO;
}

export interface CounselAssistantState {
  counselAssistant: counselAssistantType;
  setCounselAssistant: (
    counselAssistant: CounselAssistantState['counselAssistant'],
  ) => void;
}

// 실제 사용하는 훅
export const useCounselAssistantStore = create<CounselAssistantState>()(
  (set) => ({
    counselAssistant: {
      counselCardId: '',
      counselSessionId: '',
      cardRecordStatus: AddCounselCardReqCardRecordStatusEnum.Recorded,
      baseInformation: {
        version: '1.1',
        baseInfo: {
          name: '',
          birthDate: '',
          healthInsuranceType:
            BaseInfoDTOHealthInsuranceTypeEnum.HealthInsurance,
          counselSessionOrder: '1회차',
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
          isAllergy: false,
          allergyNote: '',
        },
        medicationSideEffect: {
          isSideEffect: false,
          suspectedMedicationNote: '',
          symptomsNote: '',
        },
      },
      livingInformation: {
        version: '1.1',
        smoking: {
          isSmoking: false,
          smokingAmount: '',
          smokingPeriodNote: '',
        },
        drinking: {
          isDrinking: false,
          drinkingAmount: '',
        },
        nutrition: {
          mealPattern: '',
          nutritionNote: '',
        },
        exercise: {
          exercisePattern: '운동 안 함',
          exerciseNote: '',
        },
        medicationManagement: {
          isAlone: true,
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
    setCounselAssistant: (data) =>
      set((state) => ({
        counselAssistant: {
          ...state.counselAssistant,
          ...data,
          baseInformation: {
            ...state.counselAssistant.baseInformation,
            ...(data.baseInformation || {}),
          },
          healthInformation: {
            ...state.counselAssistant.healthInformation,
            ...(data.healthInformation || {}),
          },
          livingInformation: {
            ...state.counselAssistant.livingInformation,
            ...(data.livingInformation || {}),
          },
          independentLifeInformation: {
            ...state.counselAssistant.independentLifeInformation,
            ...(data.independentLifeInformation || {}),
          },
        },
      })),
  }),
);
