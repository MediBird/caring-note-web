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
import type { DiseaseInfoDTO } from './disease-info-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { MedicationSideEffectDTO } from './medication-side-effect-dto';

/**
 * 
 * @export
 * @interface CounselCardHealthInformationRes
 */
export interface CounselCardHealthInformationRes {
    /**
     * 
     * @type {AllergyDTO}
     * @memberof CounselCardHealthInformationRes
     */
    'allergy'?: AllergyDTO;
    /**
     * 
     * @type {DiseaseInfoDTO}
     * @memberof CounselCardHealthInformationRes
     */
    'diseaseInfo'?: DiseaseInfoDTO;
    /**
     * 
     * @type {MedicationSideEffectDTO}
     * @memberof CounselCardHealthInformationRes
     */
    'medicationSideEffect'?: MedicationSideEffectDTO;
}

