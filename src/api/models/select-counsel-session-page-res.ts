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
import type { PageRes } from './page-res';
// May contain unused imports in some cases
// @ts-ignore
import type { SelectCounselSessionRes } from './select-counsel-session-res';

/**
 * 
 * @export
 * @interface SelectCounselSessionPageRes
 */
export interface SelectCounselSessionPageRes {
    /**
     * 
     * @type {Array<SelectCounselSessionRes>}
     * @memberof SelectCounselSessionPageRes
     */
    'content'?: Array<SelectCounselSessionRes>;
    /**
     * 
     * @type {PageRes}
     * @memberof SelectCounselSessionPageRes
     */
    'pageInfo'?: PageRes;
}

