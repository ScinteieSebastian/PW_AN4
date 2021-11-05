import AuthenticationService from "../services/Authentication.service";

export function AuthHeader() {
    // return authorization header with jwt token
    const currentUser = AuthenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {};
    }
}

export default AuthHeader;