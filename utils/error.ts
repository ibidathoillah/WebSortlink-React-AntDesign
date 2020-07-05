import { message } from "antd"

export function catchErr(err: any) {
    
    if(err.response) switch(err.response.status){
        case 401:
            message.error(err.response.statusText)
            localStorage.removeItem("token")
            location.href="/"
            break
    }

    // error hanlding
    process.env.DEBUG=='true' ? console.log(err) : null
    
}