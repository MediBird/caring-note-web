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
 * @interface AddAndUpdateMedicationRecordHistReq
 */
export interface AddAndUpdateMedicationRecordHistReq {
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'rowId'?: string;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'medicationId'?: string;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'divisionCode'?: AddAndUpdateMedicationRecordHistReqDivisionCodeEnum;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'prescriptionDate'?: string;
    /**
     * 
     * @type {number}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'prescriptionDays'?: number;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'medicationName'?: string;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'usageObject'?: string;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'unit'?: string;
    /**
     * 
     * @type {string}
     * @memberof AddAndUpdateMedicationRecordHistReq
     */
    'usageStatusCode'?: AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum;
}

export const AddAndUpdateMedicationRecordHistReqDivisionCodeEnum = {
    Prescription: 'PRESCRIPTION',
    Otc: 'OTC'
} as const;

export type AddAndUpdateMedicationRecordHistReqDivisionCodeEnum = typeof AddAndUpdateMedicationRecordHistReqDivisionCodeEnum[keyof typeof AddAndUpdateMedicationRecordHistReqDivisionCodeEnum];
export const AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum = {
    Regular: 'REGULAR',
    AsNeeded: 'AS_NEEDED',
    Stopped: 'STOPPED'
} as const;

export type AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum = typeof AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum[keyof typeof AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum];


