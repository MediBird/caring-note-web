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
import type { SelectCounselSessionRes } from './select-counsel-session-res';

/**
 * 
 * @export
 * @interface PageResSelectCounselSessionRes
 */
export interface PageResSelectCounselSessionRes {
    /**
     * 
     * @type {Array<SelectCounselSessionRes>}
     * @memberof PageResSelectCounselSessionRes
     */
    'content'?: Array<SelectCounselSessionRes>;
    /**
     * 
     * @type {number}
     * @memberof PageResSelectCounselSessionRes
     */
    'page'?: number;
    /**
     * 
     * @type {number}
     * @memberof PageResSelectCounselSessionRes
     */
    'size'?: number;
    /**
     * 
     * @type {number}
     * @memberof PageResSelectCounselSessionRes
     */
    'totalElements'?: number;
    /**
     * 
     * @type {number}
     * @memberof PageResSelectCounselSessionRes
     */
    'totalPages'?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageResSelectCounselSessionRes
     */
    'hasNext'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageResSelectCounselSessionRes
     */
    'hasPrevious'?: boolean;
}

