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



/**
 * 
 * @export
 * @interface BaseInfoDTO
 */
export interface BaseInfoDTO {
    /**
     * 
     * @type {string}
     * @memberof BaseInfoDTO
     */
    'counseleeId'?: string;
    /**
     * 
     * @type {string}
     * @memberof BaseInfoDTO
     */
    'counseleeName'?: string;
    /**
     * 
     * @type {string}
     * @memberof BaseInfoDTO
     */
    'birthDate'?: string;
    /**
     * 
     * @type {string}
     * @memberof BaseInfoDTO
     */
    'lastCounselDate'?: string;
    /**
     * 
     * @type {string}
     * @memberof BaseInfoDTO
     */
    'healthInsuranceType'?: BaseInfoDTOHealthInsuranceTypeEnum;
}

export const BaseInfoDTOHealthInsuranceTypeEnum = {
    HealthInsurance: 'HEALTH_INSURANCE',
    MedicalAid: 'MEDICAL_AID',
    VeteransBenefits: 'VETERANS_BENEFITS',
    NonCovered: 'NON_COVERED'
} as const;

export type BaseInfoDTOHealthInsuranceTypeEnum = typeof BaseInfoDTOHealthInsuranceTypeEnum[keyof typeof BaseInfoDTOHealthInsuranceTypeEnum];


