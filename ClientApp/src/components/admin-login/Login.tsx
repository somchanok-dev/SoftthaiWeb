import React, { Fragment } from "react";
import "./style.css"
import { useHistory } from "react-router";
import AuthenService from "../Service/AuthenService";
import { AuthToken } from "../Service/Config/AuthToken";
import { Sweetalert, BoxMsg } from "../Systems/SystemComponent";

const Login = () => {
    const history = useHistory();
    const [st_CapsLock, setActiveCapsLock] = React.useState<Boolean>();

    const Input_GetValue = (_inputID: string) => {
        var _val: string | undefined;
        var _input = document.getElementById(_inputID) as HTMLInputElement | null;
        if (_input) _val = _input.value || "";
        return _val;
    };

    const Login_Action = async (_Username: string, _Password: string) => {
        let objLogin = { sUsername: _Username, sPassword: _Password }
        const token_response = await AuthenService.CreateTokenLogin(objLogin);
        const token = token_response.data.token;
        if (token) {
            AuthToken.set(token);
            history.push("/admin-news");
        }
        else {
            Sweetalert.Warning(BoxMsg.Title_Warning, token_response.data.message, null);
            await AuthenService.SignOut()
        };
    };
    const formLogin_onSubmit = () => {
        var _Username = Input_GetValue("txtUsername");
        var _Password = Input_GetValue("txtPassword");
        if (_Username && _Password) Login_Action(_Username, _Password);
        else Sweetalert.Warning(BoxMsg.Title_Warning, "โปรดระบุชื่อผู้ใช้งานและรหัสผ่าน", null);
    };
    const txtUsername_onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.which === 13 && e.currentTarget.value) {
            var e_txtPassword = document.getElementById("txtPassword");
            if (e_txtPassword) e_txtPassword.focus();
            return false;
        }
        else if (e.which === 220) return false;
    };
    const txtPassword_onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.which === 13) {
            formLogin_onSubmit();
            return false;
        }
        else if (e.which === 220) return false;
    };



    React.useEffect(() => {
        document.addEventListener("mouseenter", (e: MouseEvent) => { try { setActiveCapsLock(e.getModifierState("CapsLock")) } catch { } });
        document.addEventListener("click", (e: MouseEvent) => { try { setActiveCapsLock(e.getModifierState("CapsLock")) } catch { } });
        document.addEventListener("keyup", (e: KeyboardEvent) => { try { setActiveCapsLock(e.getModifierState("CapsLock")) } catch { } });
    }, [])

    return (
        <div id="LOGIN">
            <div className="box-login">
                <div className="box-title title-1">Softthai Application</div>
                {/* <div className="box-title title-2">Administrator</div> */}
                <div className="box-title title-2">ผู้ดูแลระบบ</div>

                <div className="form-group mt-4">
                    <div className="login-input">
                        <img src={require("./assets/ico-user.png")} />
                        <input id="txtUsername" type="text" placeholder="ชื่อผู้ใช้งาน" onKeyPress={txtUsername_onKeyPress} />
                    </div>
                </div>
                <div className="form-group mb-4">
                    <div className="login-input">
                        <img src={require("./assets/ico-lock.png")} />
                        <input id="txtPassword" type="password" placeholder="รหัสผ่าน" onKeyPress={txtPassword_onKeyPress} />
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-auto mr-auto" style={{ paddingLeft: "2em" }}>
                        {st_CapsLock
                            ? <Fragment>
                                <span className="badge badge-pill badge-danger"><i className="fa fa-exclamation"></i></span> Caps Lock is activated
                            </Fragment>
                            : null}
                    </div>
                    <div className="col-auto ml-auto">
                        <button id="btnLogin" type="button" className="btn btn-light"
                            onClick={formLogin_onSubmit}>เข้าสู่ระบบ <i className="fa fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        </div>);
}
export default Login;