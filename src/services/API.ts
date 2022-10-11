import {string} from '@tensorflow/tfjs-core';
import axios from 'axios';
import {Settings} from '../settings/Settings';
import {AuthSelector} from '../store/selectors/AuthSelector';

export class APIService {
    private static token = null;

    public static login = async ({
        email,
        password
    }: {
        email: string;
        password: string;
    }) => {
        return await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            url: `${Settings.API_PREFIX}/login`,
            data: {id: email, password}
        });
    };

    public static fetchImages = async ({
        offset,
        limit,
        image_status
    }: {
        offset: number;
        limit: number;
        image_status?: string;
    }) => {
        const token = AuthSelector.getToken();
        if (!token) {
            throw Error('Token is required');
        }
        return await axios({
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            url: `${Settings.API_PREFIX}/labeler/images`,
            params: {limit, offset, image_status}
        });
    };

    public static updateImage = async ({
        imageId,
        json
    }: {
        imageId: string;
        json: string;
    }) => {
        const token = AuthSelector.getToken();
        // console.log('token = ', token);
        console.log('json = ', json);
        console.log('imageId = ', imageId);
        if (!token) {
            throw Error('Token is required');
        }
        if (!imageId) {
            throw Error('ImageId is required');
        }
        if (!json) {
            throw Error('JSON is required');
        }
        return await axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            url: `${Settings.API_PREFIX}/labeler/images/${imageId}`,
            data: {
                json
            }
        });
    };
    public static getTasks = async () => {
        const token = AuthSelector.getToken();
        if (!token) {
            throw Error('Token is required');
        }
        return await axios({
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            url: `${Settings.API_PREFIX}/labeler/tasks`
        });
    };

    public static getTaskStatus = async () => {
        const token = AuthSelector.getToken();
        if (!token) {
            throw Error('Token is required');
        }
        return await axios({
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            url: `${Settings.API_PREFIX}/labeler/taskStatus`
        });
    };

    public static getSummary = async () => {
        const token = AuthSelector.getToken();
        if (!token) {
            throw Error('Token is required');
        }
        return await axios({
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            url: `${Settings.API_PREFIX}/labeler/common_summary`
        });
    };
}
