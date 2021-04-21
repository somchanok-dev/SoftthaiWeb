import * as React from 'react';
import NavBar from './MP_Front_Menu';
import './MP_Front.css';
import LayoutMain from './interface';
import { GetElementPosition } from '../Systems/SystemComponent';

export default class MP_Front extends React.PureComponent<any, {}> {
    private LayoutImage = {
        Logo1: require('../../Images/master/logo-1.png'),
        Logo2: require('../../Images/master/logo-2.png')
    };

    private MenuID_Selected: Number = parseInt(this.props.MenuID_Selected) || 0;

    private arrMenu: Array<LayoutMain.Menu> = [
        { label: "Home", to: "", active: this.MenuID_Selected === 1 },
        { label: "Who Are We", to: "about", active: this.MenuID_Selected === 2 },
        {
            label: "Our Works", to: "works", active: this.MenuID_Selected === 3,
            // children: [
            //     { label: "Web Application", to: "#work/web_app" },
            //     { label: "Sharepoint", to: "#work/sharepoint" },
            //     { label: "Mobile Application", to: "#work/mobile_app" },
            //     { label: "Power BI", to: "#work/power_bi" },
            // ]
        },
        { label: "Customer Care", to: "customer_care", active: this.MenuID_Selected === 4 }
    ];

    private Element = {
        BODY: document.getElementsByTagName("body")[0],
        BODY_AddClass: (sClass: string) => { this.Element.BODY.classList.add(sClass); },
        BODY_RemoveClass: (sClass: string) => { this.Element.BODY.classList.remove(sClass); }
    };

    private NAVBAR_Expand = () => { this.Element.BODY_AddClass("nav-expanded"); };
    private NAVBAR_Collapse = () => { this.Element.BODY_RemoveClass("nav-expanded"); };

    private ScrollByHash = (dalaySecond: number = 0) => {
        var hash = window.location.hash;
        if (hash) {
            setTimeout(function () {
                var pos = GetElementPosition(hash.replace("#", ""));
                if (pos) window.scrollTo({ top: pos.top - 70 });
            }, dalaySecond * 1000);
        }
    };

    componentDidMount = () => {
        this.ScrollByHash(0.8);

        window.addEventListener("hashchange", () => { this.ScrollByHash(); });
    };

    public render() {
        return (
            <React.Fragment>
                <div id="SITE_NAVBAR"><NavBar id="navSIDE" source={this.arrMenu} isSide={true} /></div>
                <div id="SITE_CONTENT">
                    <div id="HEAD">
                        <div className="container">
                            <div className="head-content">
                                <a href="" className="head-logo">
                                    <div className="logo-icon">
                                        <img src={this.LayoutImage.Logo1} />
                                    </div>
                                    <div className="logo-name">
                                        <img src={this.LayoutImage.Logo2} />
                                    </div>
                                </a>
                                <div className="head-menu">
                                    <NavBar id="navTOP" source={this.arrMenu} />
                                    <a id="NAVBAR_TRIGGER" onClick={this.NAVBAR_Expand}><i className="fa fa-bars"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="BODY" style={this.props.BODY_style}>{this.props.children}</div>
                    <div id="FOOT">
                        <div className="container">
                            <div className="footer-row">
                                <div className="footer-cell"></div>
                                <div className="footer-cell text-right">
                                    <span className="d-inline-block"><b>Softthai</b> Application Co., Ltd.</span>&nbsp;
                                    <span className="d-inline-block"><span className="HelveticaNeue">&copy;</span> 2021  All Right Reserved</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="CONTENT_BLOCK" onClick={this.NAVBAR_Collapse}>
                    <div className="block-label"><i className="fa fa-exchange-alt"></i></div>
                </div>
            </React.Fragment>
        )
    }
}
