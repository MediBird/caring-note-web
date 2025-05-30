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
 * @interface SelectCounselSessionRes
 */
export interface SelectCounselSessionRes {
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'counselSessionId'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'scheduledTime'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'scheduledDate'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'counseleeId'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'counseleeName'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'counselorId'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'counselorName'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'sessionNumber'?: string;
    /**
     * 
     * @type {string}
     * @memberof SelectCounselSessionRes
     */
    'status'?: SelectCounselSessionResStatusEnum;
}

export const SelectCounselSessionResStatusEnum = {
    Scheduled: 'SCHEDULED',
    InProgress: 'IN_PROGRESS',
    Completed: 'COMPLETED',
    Canceled: 'CANCELED'
} as const;

export type SelectCounselSessionResStatusEnum = typeof SelectCounselSessionResStatusEnum[keyof typeof SelectCounselSessionResStatusEnum];


