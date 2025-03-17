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
 * @interface GetCounselorRes
 */
export interface GetCounselorRes {
    /**
     * 
     * @type {string}
     * @memberof GetCounselorRes
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCounselorRes
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCounselorRes
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCounselorRes
     */
    'phoneNumber'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCounselorRes
     */
    'roleType'?: GetCounselorResRoleTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof GetCounselorRes
     */
    'medicationCounselingCount'?: number;
    /**
     * 
     * @type {number}
     * @memberof GetCounselorRes
     */
    'counseledCounseleeCount'?: number;
    /**
     * 
     * @type {number}
     * @memberof GetCounselorRes
     */
    'participationDays'?: number;
}

export const GetCounselorResRoleTypeEnum = {
    Admin: 'ROLE_ADMIN',
    User: 'ROLE_USER',
    Assistant: 'ROLE_ASSISTANT',
    None: 'ROLE_NONE'
} as const;

export type GetCounselorResRoleTypeEnum = typeof GetCounselorResRoleTypeEnum[keyof typeof GetCounselorResRoleTypeEnum];


