import React, { Fragment, useState } from "react";
import "./MP_Back.css";
import "./MP_Back-custom.css";

import PerfectScrollbar from "react-perfect-scrollbar";
import logo from "../../Images/master/logo-1.png";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import AuthenService from "../Service/AuthenService";
import { DialogLogout } from "../Systems/SystemComponent";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { count } from "console";

const MP_Back = (props: any) => {
    const [Activetab, setActivetab] = useState("up");
    const [isNavside, setIsNavside] = useState(true);

    const toggleSideNav = () => {
        setIsNavside(!isNavside);
        if (document.body.className === "nav-mobile") {
            document.body.classList.remove("nav-mobile");
        } else {
            document.body.classList.add("nav-mobile");
        }
    };

    const Controller = "api/_LayoutAdmin";
    const [lstDataRow, setLstMenu] = React.useState([] as any);
    const [sName, setNams] = React.useState("");

    const GetMenu = async (nID: any) => {
        let result: any = await AxiosPostJson(Controller + "/Getmanu?nID=" + nID);
        setNams(result.data.sName);
        setLstMenu(result.data.lstMenuL1);
    };

    React.useEffect(() => {
        GetMenu(props.MenuID_Selected);
    }, []);

    const onLogOut = () => {
        DialogLogout(async () => {
            await Swal.close();
            AuthenService.SignOut();
        });
    };
    const SideNav = {
        GetElement: () => {
            return document.getElementById("navSIDE");
        },
        CurrentLevel: 0,
        TranslateX: function () {
            let Menu = this.GetElement();
            let nLengthTranslate = this.CurrentLevel * -100;
            if (Menu) Menu.style.transform = "translateX(" + nLengthTranslate + "%)";
        },
        Next: function () {
            this.CurrentLevel += 1;
            this.TranslateX();
        },
        Previous: function (toFirst?: boolean) {
            toFirst = Boolean(toFirst);
            this.CurrentLevel -= toFirst ? this.CurrentLevel : 1;
            this.TranslateX();
            let Menu = this.GetElement();
            if (Menu && toFirst) {
                let menu_current = Menu.getElementsByClassName("menu-current");
                Array.prototype.forEach.call(menu_current, function (m) {
                    m.classList.remove("menu-current");
                });
            }
        },
        LinkNext_onClick: (e: React.MouseEvent) => {
            e.currentTarget.classList.add("menu-current");
            SideNav.Next();
            e.preventDefault();
        },
        LinkPrev_onClick: (e: React.MouseEvent) => {
            SideNav.Previous();
            let tag_li = e.currentTarget.parentElement; //<li>
            let tag_ul = tag_li ? tag_li.parentElement : null; //<ul>
            let tag_link = tag_ul
                ? tag_ul.classList.contains("menu-sub")
                    ? tag_ul.previousElementSibling
                    : null
                : null; //<a>
            if (tag_link) tag_link.classList.remove("menu-current");
            e.preventDefault();
        },
        Build: (arrMenu: any, isSide?: boolean) => {
            return arrMenu.map((m: any, i: any) => (
                <li key={i}>
                    <Link
                        to={m.sURL}
                        className={
                            (m.lstMenuL2 ? "has-children " : "") + (m.bActive ? "active" : "")
                        }
                        onClick={
                            isSide && m.lstMenuL2 ? SideNav.LinkNext_onClick : undefined
                        }
                    >
                        {m.sIcon ? (
                            <div className="menu-icon" style={{ width: 30 }}>
                                <i className={m.sIcon}></i>
                            </div>
                        ) : null}
                        <div className="menu-label"> {m.sName} </div>
                        {m.lstMenuL2 ? (
                            <div className="link-caret setfa-chevron">
                                {
                                    isSide ? (
                                    <i className="fa fa-chevron-right"></i>
                                ) : (
                                    <i className="fa fa-chevron-down"></i>
                                    )
                                }
                            </div>
                        ) : null}
                    </Link>
                    {m.lstMenuL2 ? (
                        <ul className="menu menu-sub">
                            {isSide ? (
                                <li>
                                    <i className={m.sIcon}></i>
                                    <a className="link-back" onClick={SideNav.LinkPrev_onClick}>
                                        <div className="menu-icon">
                                            <i className="fa fa-chevron-left"></i>
                                        </div>
                                        <div className="menu-label">Back</div>
                                    </a>
                                </li>
                            ) : null}
                            {SideNav.Build(m.lstMenuL2)}
                        </ul>
                    ) : null}
                </li>
            ));
        },
    };
    const pathL1 = () => {
        let el = document.getElementById("pathL1") as any
        el && el.click()
    }
    const pathL2 = () => {
        let el = document.getElementById("pathL2") as any
        el && el.click()
    }
    const pathLits = () => {
        let el = document.getElementById("pathLits") as any
        el && el.click()
    }
    const setTitle = () => {
        if (props.Sublsttitle != null) {
            if (props.Sublsttitle.L3 != "") {
                return (
                    <Fragment>
                        <td>
                            <a className="setTitle" onClick={pathL1} >{props.Sublsttitle.L1} </a>
                            <i className="fa fa-chevron-right">  </i> <a className="setTitle" onClick={pathL2}>{props.Sublsttitle.L2} </a>
                            <i className="fa fa-chevron-right">  </i> <a id="SublsttitleTop"> {props.Sublsttitle.L3} </a>
                           
                            <Link id={"pathL1"} to={props.Sublsttitle.pathL1} hidden></Link>
                            <Link id={"pathL2"} to={"/" + props.Sublsttitle.pathL2} hidden></Link>
                        </td>
                    </Fragment>
                );
            } else if (props.Sublsttitle.L2 != "") {
                return (
                    <Fragment>
                        <td>
                            <a className="setTitle" onClick={pathLits}>{props.Sublsttitle.L1} </a>
                            <i className="fa fa-chevron-right"></i>
                            <a id="SublsttitleTop"> {props.Sublsttitle.L2} </a>
                            <Link id={"pathLits"} to={props.Sublsttitle.pathL1} hidden></Link>

                        </td>
                    </Fragment>
                );
            } else if (props.Sublsttitle.L1 != "") {
                return (
                    <Fragment>
                        <td>
                            <a id="SublsttitleTop"> {props.Sublsttitle.L1} </a>
                        </td>
                    </Fragment>
                );
            }
        } else {
            return (
                <Fragment>
                    <td>
                        {
                            props.title != "" ?  <a id="SublsttitleTop">{props.title}</a> : false
                        }
                    </td>
                </Fragment>
            );
        }
    }
    return (
        <Fragment>
            <div id="CONTENT_BACK">
                <div className="content-header">
                    <div className="header-item">
                        <div className="main-mobile">
                            <a id="NAV_TRIGGER" onClick={toggleSideNav}>
                                <i className="fas fa-bars"></i>
                            </a>
                        </div>
                        <div className="main-title">
                            <div className="title-image">
                                {/* <img src="Images/ico-ptt.png" /> */}
                                <img src={logo} />
                            </div>
                            <div className="title-label">
                                <div className="title-1">Softthai</div>
                                <div className="title-2">Application</div>
                            </div>
                        </div>
                    </div>
                    <div className="main-info">
                        <div className="info-content">
                            <div className="title">{sName}</div>
                        </div>
                        <div className="info-tool">
                            <i className="fas fa-sign-out-alt" onClick={onLogOut}></i>
                        </div>
                    </div>
                </div>

                <div className="content-body">
                    <div className="body-side">
                        <div className="main-nav">
                            <PerfectScrollbar
                                options={{ wheelSpeed: 0.25 }}
                                style={{
                                    position: "relative",
                                    height: "calc(100vh - 130px)",
                                    paddingRight: "7px",
                                    paddingLeft: "15px",
                                    paddingTop: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                <ul id="navSIDE" className="menu">
                                    {SideNav.Build(lstDataRow, true)}
                                </ul>
                            </PerfectScrollbar>
                        </div>
                    </div>
                    <div></div>
                    <div className="body-main">
                        <div className="main-head">
                            <div className="head-flag">
                                <div className="flag-item">
                                    <div className="head-icon">
                                        {
                                            props.titleIcon != "" ? props.titleIcon : false
                                        }
                                    </div>
                                    <div className="head-title">
                                        {
                                            setTitle()
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="main-body">{props.children}</div>
                    </div>
                </div>

                <div className="content-footer">
                    <div className="footer-panel">
                        <div className="footer-content">
                            <div className="footer-title">
                                Powered by Softthai Application Co., Ltd.
              </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="SITE_MOBILE">
                <ul className="menu">
                    {SideNav.Build(lstDataRow, true)}
                    {/* <li>
            <a href="admin-user">
              <div className="menu-icon">
                <i className="fas fa-users-cog"></i>
              </div>
              <div className="menu-label">สิทธิผู้ดูแลระบบ</div>
            </a>
          </li>
          <li>
            <a href="admin-news">
              <div className="menu-icon">
                <i className="far fa-newspaper"></i>
              </div>
              <div className="menu-label">ข่าวสาร</div>
            </a>
          </li>
          <li>
            <a href="admin-project">
              <div className="menu-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <div className="menu-label">โครงการ</div>
            </a>
          </li>
          <li>
            <a href="admin-support_type">
              <div className="menu-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <div className="menu-label">ประเภทเรื่อง</div>
            </a>
          </li> */}
                </ul>
            </div>
        </Fragment>
    );
};
export default MP_Back;
