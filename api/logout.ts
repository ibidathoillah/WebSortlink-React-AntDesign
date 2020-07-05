import Router from 'next/router'
import { message } from 'antd'

export function logOut(){
    localStorage.removeItem("token")
    message.success("Logged out")
    Router.push('/')
}