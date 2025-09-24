export function logOutUser() {

    localStorage.removeItem("token")
    window.location.href = "login.html"

}

export function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
    return token;
}