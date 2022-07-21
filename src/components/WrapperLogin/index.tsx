import React from "react";
import { TextLogin, LogoLogin } from "../../assets/icons"
import GroupImageSrc from "../../assets/img/groupPeople.png"
import "./index.scss"
function WrapperLogin(props) {
    const { children } = props
    return (
        <>
            <LogoLogin className="login__logoLogin" />
            <TextLogin className="login__textImageLogin" />
            <div className="d-flex align-items-center justify-content-center login__container flex-column">
                {children}
                <img src={GroupImageSrc} alt="img"></img>
            </div>
        </>
    );
}
export default WrapperLogin;
