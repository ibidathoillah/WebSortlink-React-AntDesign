import axios from 'axios'
import { message } from 'antd';
import { APIShortLink } from './auth';
import { UserForm } from './login';
import Router from 'next/router'


export async function doRegister (user:UserForm) : Promise<any> {
    try {
        console.log(APIShortLink.baseUrl)
        const res = await axios.post(`${APIShortLink.baseUrl}/auth/register`, user);
        if (res.status == 201) {
            message.success('Register success');
            Router.push('/login')
            return res;
        }

        throw new Error(res.toString())
    }
    catch (err) {
        let res = err.response
        if(res && res.status==400 && res.data.message.indexOf("unique") > -1 ){
            message.error("Email already registered")
        } else {
            message.error(`Register failed`);
        }
        
        return err;
    }
}

  