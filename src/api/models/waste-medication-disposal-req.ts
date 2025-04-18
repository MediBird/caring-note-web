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
 * @interface WasteMedicationDisposalReq
 */
export interface WasteMedicationDisposalReq {
    /**
     * 
     * @type {Array<string>}
     * @memberof WasteMedicationDisposalReq
     */
    'unusedReasonTypes'?: Array<WasteMedicationDisposalReqUnusedReasonTypesEnum>;
    /**
     * 
     * @type {string}
     * @memberof WasteMedicationDisposalReq
     */
    'unusedReasonDetail'?: string;
    /**
     * 
     * @type {string}
     * @memberof WasteMedicationDisposalReq
     */
    'drugRemainActionType'?: WasteMedicationDisposalReqDrugRemainActionTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof WasteMedicationDisposalReq
     */
    'drugRemainActionDetail'?: string;
    /**
     * 
     * @type {string}
     * @memberof WasteMedicationDisposalReq
     */
    'recoveryAgreementType'?: WasteMedicationDisposalReqRecoveryAgreementTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof WasteMedicationDisposalReq
     */
    'wasteMedicationGram'?: number;
}

export const WasteMedicationDisposalReqUnusedReasonTypesEnum = {
    Recovered: 'RECOVERED',
    SideEffect: 'SIDE_EFFECT',
    Retreated: 'RETREATED',
    Replaced: 'REPLACED',
    Forgotten: 'FORGOTTEN',
    Reserved: 'RESERVED',
    Etc: 'ETC'
} as const;

export type WasteMedicationDisposalReqUnusedReasonTypesEnum = typeof WasteMedicationDisposalReqUnusedReasonTypesEnum[keyof typeof WasteMedicationDisposalReqUnusedReasonTypesEnum];
export const WasteMedicationDisposalReqDrugRemainActionTypeEnum = {
    DoctorOrPharmacist: 'DOCTOR_OR_PHARMACIST',
    SelfDecision: 'SELF_DECISION',
    None: 'NONE'
} as const;

export type WasteMedicationDisposalReqDrugRemainActionTypeEnum = typeof WasteMedicationDisposalReqDrugRemainActionTypeEnum[keyof typeof WasteMedicationDisposalReqDrugRemainActionTypeEnum];
export const WasteMedicationDisposalReqRecoveryAgreementTypeEnum = {
    Agree: 'AGREE',
    Disagree: 'DISAGREE'
} as const;

export type WasteMedicationDisposalReqRecoveryAgreementTypeEnum = typeof WasteMedicationDisposalReqRecoveryAgreementTypeEnum[keyof typeof WasteMedicationDisposalReqRecoveryAgreementTypeEnum];


