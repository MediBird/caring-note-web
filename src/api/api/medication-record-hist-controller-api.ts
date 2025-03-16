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


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { AddAndUpdateMedicationRecordHistReq } from '../models';
// @ts-ignore
import type { CommonResListAddAndUpdateMedicationRecordHistRes } from '../models';
// @ts-ignore
import type { CommonResListSelectMedicationRecordHistRes } from '../models';
// @ts-ignore
import type { CommonResVoid } from '../models';
// @ts-ignore
import type { DeleteCounselor400Response } from '../models';
// @ts-ignore
import type { ErrorRes } from '../models';
/**
 * MedicationRecordHistControllerApi - axios parameter creator
 * @export
 */
export const MedicationRecordHistControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 처방 의약품 추가
         * @param {string} counselSessionId 
         * @param {Array<AddAndUpdateMedicationRecordHistReq>} addAndUpdateMedicationRecordHistReq 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addAndUpdateMedicationRecordHist: async (counselSessionId: string, addAndUpdateMedicationRecordHistReq: Array<AddAndUpdateMedicationRecordHistReq>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'counselSessionId' is not null or undefined
            assertParamExists('addAndUpdateMedicationRecordHist', 'counselSessionId', counselSessionId)
            // verify required parameter 'addAndUpdateMedicationRecordHistReq' is not null or undefined
            assertParamExists('addAndUpdateMedicationRecordHist', 'addAndUpdateMedicationRecordHistReq', addAndUpdateMedicationRecordHistReq)
            const localVarPath = `/v1/counsel/medication/record/{counselSessionId}`
                .replace(`{${"counselSessionId"}}`, encodeURIComponent(String(counselSessionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer-jwt required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(addAndUpdateMedicationRecordHistReq, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 처방 의약품 삭제
         * @param {string} counselSessionId 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteMedicationRecordHist: async (counselSessionId: string, id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'counselSessionId' is not null or undefined
            assertParamExists('deleteMedicationRecordHist', 'counselSessionId', counselSessionId)
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteMedicationRecordHist', 'id', id)
            const localVarPath = `/v1/counsel/medication/record/{counselSessionId}/{id}`
                .replace(`{${"counselSessionId"}}`, encodeURIComponent(String(counselSessionId)))
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer-jwt required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 처방 의약품 일괄 삭제
         * @param {string} counselSessionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteMedicationRecordHistsByCounselSessionId: async (counselSessionId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'counselSessionId' is not null or undefined
            assertParamExists('deleteMedicationRecordHistsByCounselSessionId', 'counselSessionId', counselSessionId)
            const localVarPath = `/v1/counsel/medication/record/{counselSessionId}`
                .replace(`{${"counselSessionId"}}`, encodeURIComponent(String(counselSessionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer-jwt required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 처방 의약품 리스트 조회
         * @param {string} counselSessionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        selectMedicationRecordListBySessionId1: async (counselSessionId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'counselSessionId' is not null or undefined
            assertParamExists('selectMedicationRecordListBySessionId1', 'counselSessionId', counselSessionId)
            const localVarPath = `/v1/counsel/medication/record/{counselSessionId}`
                .replace(`{${"counselSessionId"}}`, encodeURIComponent(String(counselSessionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer-jwt required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * MedicationRecordHistControllerApi - functional programming interface
 * @export
 */
export const MedicationRecordHistControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = MedicationRecordHistControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary 처방 의약품 추가
         * @param {string} counselSessionId 
         * @param {Array<AddAndUpdateMedicationRecordHistReq>} addAndUpdateMedicationRecordHistReq 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addAndUpdateMedicationRecordHist(counselSessionId: string, addAndUpdateMedicationRecordHistReq: Array<AddAndUpdateMedicationRecordHistReq>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CommonResListAddAndUpdateMedicationRecordHistRes>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addAndUpdateMedicationRecordHist(counselSessionId, addAndUpdateMedicationRecordHistReq, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['MedicationRecordHistControllerApi.addAndUpdateMedicationRecordHist']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary 처방 의약품 삭제
         * @param {string} counselSessionId 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteMedicationRecordHist(counselSessionId: string, id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CommonResVoid>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteMedicationRecordHist(counselSessionId, id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['MedicationRecordHistControllerApi.deleteMedicationRecordHist']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary 처방 의약품 일괄 삭제
         * @param {string} counselSessionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteMedicationRecordHistsByCounselSessionId(counselSessionId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CommonResVoid>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteMedicationRecordHistsByCounselSessionId(counselSessionId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['MedicationRecordHistControllerApi.deleteMedicationRecordHistsByCounselSessionId']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary 처방 의약품 리스트 조회
         * @param {string} counselSessionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async selectMedicationRecordListBySessionId1(counselSessionId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CommonResListSelectMedicationRecordHistRes>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.selectMedicationRecordListBySessionId1(counselSessionId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['MedicationRecordHistControllerApi.selectMedicationRecordListBySessionId1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * MedicationRecordHistControllerApi - factory interface
 * @export
 */
export const MedicationRecordHistControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = MedicationRecordHistControllerApiFp(configuration)
    return {
        /**
         * 
         * @summary 처방 의약품 추가
         * @param {string} counselSessionId 
         * @param {Array<AddAndUpdateMedicationRecordHistReq>} addAndUpdateMedicationRecordHistReq 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addAndUpdateMedicationRecordHist(counselSessionId: string, addAndUpdateMedicationRecordHistReq: Array<AddAndUpdateMedicationRecordHistReq>, options?: RawAxiosRequestConfig): AxiosPromise<CommonResListAddAndUpdateMedicationRecordHistRes> {
            return localVarFp.addAndUpdateMedicationRecordHist(counselSessionId, addAndUpdateMedicationRecordHistReq, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 처방 의약품 삭제
         * @param {string} counselSessionId 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteMedicationRecordHist(counselSessionId: string, id: string, options?: RawAxiosRequestConfig): AxiosPromise<CommonResVoid> {
            return localVarFp.deleteMedicationRecordHist(counselSessionId, id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 처방 의약품 일괄 삭제
         * @param {string} counselSessionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteMedicationRecordHistsByCounselSessionId(counselSessionId: string, options?: RawAxiosRequestConfig): AxiosPromise<CommonResVoid> {
            return localVarFp.deleteMedicationRecordHistsByCounselSessionId(counselSessionId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 처방 의약품 리스트 조회
         * @param {string} counselSessionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        selectMedicationRecordListBySessionId1(counselSessionId: string, options?: RawAxiosRequestConfig): AxiosPromise<CommonResListSelectMedicationRecordHistRes> {
            return localVarFp.selectMedicationRecordListBySessionId1(counselSessionId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * MedicationRecordHistControllerApi - object-oriented interface
 * @export
 * @class MedicationRecordHistControllerApi
 * @extends {BaseAPI}
 */
export class MedicationRecordHistControllerApi extends BaseAPI {
    /**
     * 
     * @summary 처방 의약품 추가
     * @param {string} counselSessionId 
     * @param {Array<AddAndUpdateMedicationRecordHistReq>} addAndUpdateMedicationRecordHistReq 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MedicationRecordHistControllerApi
     */
    public addAndUpdateMedicationRecordHist(counselSessionId: string, addAndUpdateMedicationRecordHistReq: Array<AddAndUpdateMedicationRecordHistReq>, options?: RawAxiosRequestConfig) {
        return MedicationRecordHistControllerApiFp(this.configuration).addAndUpdateMedicationRecordHist(counselSessionId, addAndUpdateMedicationRecordHistReq, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 처방 의약품 삭제
     * @param {string} counselSessionId 
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MedicationRecordHistControllerApi
     */
    public deleteMedicationRecordHist(counselSessionId: string, id: string, options?: RawAxiosRequestConfig) {
        return MedicationRecordHistControllerApiFp(this.configuration).deleteMedicationRecordHist(counselSessionId, id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 처방 의약품 일괄 삭제
     * @param {string} counselSessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MedicationRecordHistControllerApi
     */
    public deleteMedicationRecordHistsByCounselSessionId(counselSessionId: string, options?: RawAxiosRequestConfig) {
        return MedicationRecordHistControllerApiFp(this.configuration).deleteMedicationRecordHistsByCounselSessionId(counselSessionId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 처방 의약품 리스트 조회
     * @param {string} counselSessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MedicationRecordHistControllerApi
     */
    public selectMedicationRecordListBySessionId1(counselSessionId: string, options?: RawAxiosRequestConfig) {
        return MedicationRecordHistControllerApiFp(this.configuration).selectMedicationRecordListBySessionId1(counselSessionId, options).then((request) => request(this.axios, this.basePath));
    }
}

