export const APIShortLink = {
    get baseUrl(){
        return process.env.API_URL
    },
    get headers() {
        return {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
    }
}