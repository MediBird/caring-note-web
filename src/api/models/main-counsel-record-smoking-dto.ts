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
import type { SmokingDTO } from './smoking-dto';
// May contain unused imports in some cases
// @ts-ignore
import type { TimeRecordedResSmokingDTO } from './time-recorded-res-smoking-dto';

/**
 * 
 * @export
 * @interface MainCounselRecordSmokingDTO
 */
export interface MainCounselRecordSmokingDTO {
    /**
     * 
     * @type {SmokingDTO}
     * @memberof MainCounselRecordSmokingDTO
     */
    'currentState'?: SmokingDTO;
    /**
     * 
     * @type {Array<TimeRecordedResSmokingDTO>}
     * @memberof MainCounselRecordSmokingDTO
     */
    'history'?: Array<TimeRecordedResSmokingDTO>;
}

