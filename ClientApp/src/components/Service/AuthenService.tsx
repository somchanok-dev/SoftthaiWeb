import { AuthToken } from "./Config/AuthToken";
import { AxiosPostJson } from "./Config/AxiosMethod";
import { getHistory } from "../../App";
export default class AuthenService {
    static CreateTokenLogin(data: any) {

        const response = AxiosPostJson('api/Login/CreateTokenLogin', data);
        return response;
    }

    static DataUserAppBar() {
        const response = AxiosPostJson(process.env.REACT_APP_URL + '/Login/DataUserAppBar');
        return response;
    }

    static async SignOut() {
        await AuthToken.set(null);
        getHistory().push("/admin-login");
    }

    static GetMenuWithPermission() {
        const response = AxiosPostJson(process.env.REACT_APP_URL + '/Authen/GetMenuWithPermission');
        return response;
    }

}