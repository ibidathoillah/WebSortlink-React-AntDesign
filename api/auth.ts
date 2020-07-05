export const APIShortLink = {
    get baseUrl(){
        return process.env.apiUrl
    },
    get headers() {
        return {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
    }
}