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
 * @interface UpdateStatusInCounselSessionReq
 */
export interface UpdateStatusInCounselSessionReq {
    /**
     * 
     * @type {string}
     * @memberof UpdateStatusInCounselSessionReq
     */
    'counselSessionId'?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateStatusInCounselSessionReq
     */
    'status': UpdateStatusInCounselSessionReqStatusEnum;
}

export const UpdateStatusInCounselSessionReqStatusEnum = {
    Scheduled: 'SCHEDULED',
    InProgress: 'IN_PROGRESS',
    Completed: 'COMPLETED',
    Canceled: 'CANCELED'
} as const;

export type UpdateStatusInCounselSessionReqStatusEnum = typeof UpdateStatusInCounselSessionReqStatusEnum[keyof typeof UpdateStatusInCounselSessionReqStatusEnum];


