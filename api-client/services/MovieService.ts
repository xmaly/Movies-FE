/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMovieDto } from '../models/CreateMovieDto';
import type { MovieItem } from '../models/MovieItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MovieService {
    /**
     * @returns MovieItem OK
     * @throws ApiError
     */
    public static getApiMovie(): CancelablePromise<Array<MovieItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Movie',
        });
    }
    /**
     * @param requestBody
     * @returns MovieItem OK
     * @throws ApiError
     */
    public static postApiMovie(
        requestBody: CreateMovieDto,
    ): CancelablePromise<MovieItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Movie',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns MovieItem OK
     * @throws ApiError
     */
    public static getApiMovie1(
        id: number,
    ): CancelablePromise<MovieItem> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Movie/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiMovie(
        id: number,
        requestBody: CreateMovieDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Movie/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiMovie(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Movie/{id}',
            path: {
                'id': id,
            },
        });
    }
}
