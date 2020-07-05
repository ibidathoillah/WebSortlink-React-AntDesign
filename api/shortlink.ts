// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import { message } from 'antd';
import { convertToSlug } from '../utils/utils';
import { APIShortLink } from './auth';

export class ShortLink {
    key : string
    _id: string
    userId: string
    title: string
    slug: string
    redirectUrl: string
}

export class ShortLinkPaginate {
    docs: any[]
    limit: number
    page:number
    pages:number
    total:number
}

export async function isExist(slug: string): Promise<boolean> {
    if (slug)
        try {
            const res = await axios.get(`${APIShortLink.baseUrl}/shortlink/slug/${slug}`, APIShortLink.headers);
            if (res.status == 200) {
                return res.data.IsExist;
            }

            throw new Error(res.toString())
        }
        catch (err) {
            message.error(`Fetch data failed`);
            return false
        }
}

export async function getShortlink(page:number): Promise<ShortLinkPaginate> {
    try {
        const res = await axios.get(`${APIShortLink.baseUrl}/shortlink?page=${page}`, APIShortLink.headers);
        if (res.status == 200) {
            return res.data;
        }

        throw new Error(res.toString())
    }
    catch (err) {
        message.error(`Fetch data failed`);
        return Promise.reject(err);
    }
}


export async function createCustom(data: any): Promise<any> {
    try {

        data.slug = convertToSlug(data.slug)

        const res = await axios.post(`${APIShortLink.baseUrl}/shortlink`, data, APIShortLink.headers);
        if (res.status == 201 || res.status == 200) {
            message.success("Create Custom Success");
            return res.data;
        }
    }
    catch (err) {
        if (err.response && err.response.status == 400) {
            message.error(err.response.data.message);
        } else if (err.response && err.response.status == 422) {
            message.error(`Slug '${data.slug}' Already Used / Not Available`);
        } else {
            message.error("Failed to create custom link");
        }
        return Promise.reject(err);
    }
}


export async function updateLink(data: ShortLink): Promise<any> {
    try {
        const res = await axios.put(`${APIShortLink.baseUrl}/shortlink`, data, APIShortLink.headers);
        if (res.status == 201 || res.status == 200) {
            message.success("Update Success");
            return res.data;
        }
    }
    catch (err) {
        if (err.response && err.response.status == 400) {
            message.error(err.response.data.message);
        } else if (err.response && err.response.status == 422) {
            message.error(`Slug '${data.slug}' Already Used / Not Available`);
        } else {
            message.error("Failed to update data");
        }
        return Promise.reject(err);
    }
}


export async function deleteLink(id: string): Promise<any> {
    try {
        const res = await axios.delete(`${APIShortLink.baseUrl}/shortlink/${id}`, APIShortLink.headers);
        if (res.status == 201 || res.status == 200) {
            message.success("Delete Success");
            return res.data;
        }
    }
    catch (err) {
        if (err.response && err.response.status == 400) {
            message.error(err.response.data.message);
        } else {
            message.error("Failed to delete data");
        }
        return Promise.reject(err);
    }
}


export async function createRandom(data: any): Promise<any> {
    try {
        const res = await axios.post(`${APIShortLink.baseUrl}/shortlink/random`, { redirectUrl: data.redirectUrl }, APIShortLink.headers);
        if (res.status == 201 || res.status == 200) {
            message.success("Success Create Random");
            return res.data;
        }
    }
    catch (err) {
        if (err.response && err.response.status == 400) {
            message.error(err.response.data.message);
        } else {
            message.error("Failed to update data");
        }
        return Promise.reject(err);
    }
}



