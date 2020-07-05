import axios from 'axios'
import { message } from 'antd';
import { APIShortLink } from './auth';

export async function getProfile ()  : Promise<any> {
    try {
        const res = await axios.get(`${APIShortLink.baseUrl}/profile`, APIShortLink.headers);
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

  