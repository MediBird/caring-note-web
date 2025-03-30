/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { AllergyDTO } from './allergy-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { CommunicationDTO } from './communication-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { CounselPurposeAndNoteDTO } from './counsel-purpose-and-note-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { DiseaseInfoDTO } from './disease-info-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { DrinkingDTO } from './drinking-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { EvacuationDTO } from './evacuation-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { ExerciseDTO } from './exercise-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { MedicationManagementDTO } from './medication-management-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { MedicationSideEffectDTO } from './medication-side-effect-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { NutritionDTO } from './nutrition-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { SmokingDTO } from './smoking-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { WalkingDTO } from './walking-dto';

/**
 * 
 * @export
 * @interface UpdateCounselCardReq
 */
export interface UpdateCounselCardReq {
    /**
     * 
     * @type {CounselPurposeAndNoteDTO}
     * @memberof UpdateCounselCardReq
     */
    'counselPurposeAndNote'?: CounselPurposeAndNoteDTO;
    /**
     * 
     * @type {AllergyDTO}
     * @memberof UpdateCounselCardReq
     */
    'allergy'?: AllergyDTO;
    /**
     * 
     * @type {DiseaseInfoDTO}
     * @memberof UpdateCounselCardReq
     */
    'diseaseInfo'?: DiseaseInfoDTO;
    /**
     * 
     * @type {MedicationSideEffectDTO}
     * @memberof UpdateCounselCardReq
     */
    'medicationSideEffect'?: MedicationSideEffectDTO;
    /**
     * 
     * @type {DrinkingDTO}
     * @memberof UpdateCounselCardReq
     */
    'drinking'?: DrinkingDTO;
    /**
     * 
     * @type {ExerciseDTO}
     * @memberof UpdateCounselCardReq
     */
    'exercise'?: ExerciseDTO;
    /**
     * 
     * @type {MedicationManagementDTO}
     * @memberof UpdateCounselCardReq
     */
    'medicationManagement'?: MedicationManagementDTO;
    /**
     * 
     * @type {NutritionDTO}
     * @memberof UpdateCounselCardReq
     */
    'nutrition'?: NutritionDTO;
    /**
     * 
     * @type {SmokingDTO}
     * @memberof UpdateCounselCardReq
     */
    'smoking'?: SmokingDTO;
    /**
     * 
     * @type {CommunicationDTO}
     * @memberof UpdateCounselCardReq
     */
    'communication'?: CommunicationDTO;
    /**
     * 
     * @type {EvacuationDTO}
     * @memberof UpdateCounselCardReq
     */
    'evacuation'?: EvacuationDTO;
    /**
     * 
     * @type {WalkingDTO}
     * @memberof UpdateCounselCardReq
     */
    'walking'?: WalkingDTO;
}

