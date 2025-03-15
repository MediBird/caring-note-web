import {
  AddCounselCardReq,
  AllergyDTO,
  CounselCardRes,
  CounselPurposeAndNoteDTO,
  DiseaseInfoDTO,
  DrinkingDTO,
  ExerciseDTO,
  MedicationManagementDTO,
  MedicationSideEffectDTO,
  NutritionDTO,
  SmokingDTO,
  UpdateCounselCardReq,
} from '@/api/api';
import { create } from 'zustand';

export interface CounselCardState {
  counselCardData: Partial<CounselCardRes> | null;
  isLoading: boolean;
  error: string | null;
  setCounselCardData: (data: Partial<CounselCardRes>) => void;
  clearCounselCardData: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCounselCardStore = create<CounselCardState>((set) => ({
  counselCardData: null,
  isLoading: false,
  error: null,
  setCounselCardData: (data) => set({ counselCardData: data }),
  clearCounselCardData: () => set({ counselCardData: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// 각 DTO의 기본값 생성
const getEmptyCounselPurposeAndNote = (): CounselPurposeAndNoteDTO => ({
  counselPurpose: new Set(),
  significantNote: '',
  medicationNote: '',
});

const getEmptyAllergyDTO = (): AllergyDTO => ({
  allergyNote: '',
});

const getEmptyDiseaseInfoDTO = (): DiseaseInfoDTO => ({
  diseases: new Set(),
  historyNote: '',
  mainInconvenienceNote: '',
});

const getEmptyMedicationSideEffectDTO = (): MedicationSideEffectDTO => ({
  suspectedMedicationNote: '',
  symptomsNote: '',
});

const getEmptyDrinkingDTO = (): DrinkingDTO => ({
  drinkingAmount: undefined,
});

const getEmptyExerciseDTO = (): ExerciseDTO => ({
  exercisePattern: undefined,
  exerciseNote: '',
});

const getEmptyMedicationManagementDTO = (): MedicationManagementDTO => ({
  houseMateNote: '',
  medicationAssistants: new Set(),
});

const getEmptyNutritionDTO = (): NutritionDTO => ({
  mealPattern: undefined,
  nutritionNote: '',
});

const getEmptySmokingDTO = (): SmokingDTO => ({
  smokingPeriodNote: '',
  smokingAmount: undefined,
});

export const getAddCounselCardReq = (
  counselSessionId: string,
  data: Partial<CounselCardRes>,
): AddCounselCardReq => {
  return {
    counselSessionId,
    cardRecordStatus: data.cardRecordStatus,
    counselPurposeAndNote:
      data.counselPurposeAndNote || getEmptyCounselPurposeAndNote(),
    allergy: data.allergy || getEmptyAllergyDTO(),
    diseaseInfo: data.diseaseInfo || getEmptyDiseaseInfoDTO(),
    medicationSideEffect:
      data.medicationSideEffect || getEmptyMedicationSideEffectDTO(),
    drinking: data.drinking || getEmptyDrinkingDTO(),
    exercise: data.exercise || getEmptyExerciseDTO(),
    medicationManagement:
      data.medicationManagement || getEmptyMedicationManagementDTO(),
    nutrition: data.nutrition || getEmptyNutritionDTO(),
    smoking: data.smoking || getEmptySmokingDTO(),
  };
};

export const getUpdateCounselCardReq = (
  counselSessionId: string,
  data: Partial<CounselCardRes>,
): UpdateCounselCardReq => {
  return {
    counselSessionId,
    cardRecordStatus: data.cardRecordStatus,
    counselPurposeAndNote: data.counselPurposeAndNote,
    allergy: data.allergy,
    diseaseInfo: data.diseaseInfo,
    medicationSideEffect: data.medicationSideEffect,
    drinking: data.drinking,
    exercise: data.exercise,
    medicationManagement: data.medicationManagement,
    nutrition: data.nutrition,
    smoking: data.smoking,
  };
};
