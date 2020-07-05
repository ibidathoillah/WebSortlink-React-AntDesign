import axios from 'axios'
import { message } from 'antd';
import { APIShortLink } from './auth';
import Router from 'next/router'


export class UserForm {
    email: string
    password: string
    remember: string
}

export async function doLogin (user:UserForm) : Promise<any> {
    
    try {
        const res = await axios.post(`${APIShortLink.baseUrl}/auth/login`, user);
        if (res.status == 201) {
            message.success('Login success');
            localStorage.setItem('token', res.data.access_token);
            Router.push('/dashboard')
            return res;
        }

        throw new Error(res.toString())
    }
    catch (err) {
        let res = err.response
        if(res && res.status==401){
            message.error(res.data.message)
        } else {
            message.error(`Login failed`);
        }
        return err;
    }
}

  