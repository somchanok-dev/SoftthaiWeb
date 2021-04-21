import React, { CSSProperties, SVGAttributes } from 'react'
import ContactForm from './form';
import './style.css';

export default class contact extends React.Component {
    private WhiteOutline_TextAttr: SVGAttributes<SVGTextElement> = {
        textAnchor: "end",
        x: "100%",
        fill: "none",
        stroke: "#ffffff",
        strokeWidth: 0.5,
        style: { whiteSpace: "normal" } as CSSProperties
    };

    private sURL_GoogleMap: string = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.370246900747!2d100.55588851477931!3d13.756531990344355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e9354e3eb5d%3A0x1d05a92d22e0899d!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4i-C4reC4n-C4l-C5jOC5hOC4l-C4oiDguYHguK3guJ7guKXguLTguYDguITguIrguLHguYjguJkg4LiI4Liz4LiB4Lix4LiU!5e0!3m2!1sen!2sth!4v1615551835527!5m2!1sen!2sth";

    render() {
        return (
            <div id="CONTACT">
                <div className="page-cover">
                    <div className="container">
                        <div className="cover-content">
                            <div className="cover-title">
                                <svg width="100%" style={{ overflow: "visible", verticalAlign: "baseline" }}>
                                    <text y="82.5%" {...this.WhiteOutline_TextAttr}>Softthai</text>
                                </svg>
                            </div>
                            <div className="cover-title mt-2">Customer Care</div>
                            <div className="cover-desc mt-5">
                                <div>
                                    <span className="d-inline-block">ความพึงพอใจของลูกค้า</span>
                                    {" "}
                                    <span className="d-inline-block">นั้นคือหัวใจสำคัญในการให้บริการของเรา</span>
                                </div>
                                <div>
                                    <span className="d-inline-block">ท่านสามารถสอบถามข้อมูลหรือแจ้งประเด็นการใช้งานระบบ</span>
                                </div>
                                <div>
                                    <span className="d-inline-block">ผ่านช่องทางต่าง ๆ ที่เราเปิดให้บริการ</span>
                                    {" "}
                                    <span className="d-inline-block">เพื่อความสะดวกของลูกค้าทุกท่าน</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div id="contact_info" className="page-contact">
                                    <div className="contact-title"><b>Contact</b> Us</div>
                                    <ul className="list-unstyled mt-5">
                                        <li className="media align-items-center mb-4">
                                            <img src={require("./assets/ico-email.png")} className="mr-3" height={50} />
                                            <div className="media-body">
                                                <b className="text-denim mt-0 mb-1">E-mail</b>
                                                <p className="mb-0">support@softthai.com</p>
                                            </div>
                                        </li>
                                        <li className="media align-items-center mb-4">
                                            <img src={require("./assets/ico-phone.png")} className="mr-3" height={50} />
                                            <div className="media-body">
                                                <b className="text-denim mt-0 mb-1">Telephone No.</b>
                                                <p className="mb-0">02-6416503-5</p>
                                            </div>
                                        </li>
                                        <li className="media align-items-center mb-4">
                                            <img src={require("./assets/ico-facebook.png")} className="mr-3" height={50} />
                                            <div className="media-body">
                                                <b className="text-denim mt-0 mb-1">Facebook</b>
                                                <p className="mb-0">
                                                    <a href="https://www.facebook.com/Softthai" target="_blank">
                                                        <div className="d-inline-block">https://www.facebook.com</div>
                                                        <div className="d-inline-block">/Softthai</div>
                                                    </a>
                                                </p>
                                            </div>
                                        </li>
                                        <li className="media align-items-center">
                                            <img src={require("./assets/ico-line.png")} className="mr-3" height={50} />
                                            <div className="media-body">
                                                <b className="text-denim mt-0 mb-1">Line ID</b>
                                                <p className="mb-0">@softthai</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6"><ContactForm id="contact_form"></ContactForm></div>
                        </div>
                    </div>
                </div>
                <div className="page-address">
                    <div className="row">
                        <div className="col-lg-4 col-md-auto">
                            <div className="address-title text-left">Our <b>Location</b></div>
                            <p className="mt-4 text-uppercase"><b>Softthai Application Co., Ltd.</b></p>
                            <p className="mt-2">
                                บริษัท ซอฟท์ไทย แอพลิเคชั่น จำกัด<br />
                                8 ซ.ขวัญพัฒนา 2 ถ.อโศก-ดินแดง<br />
                                แขวง/เขต ดินแดง กรุงเทพฯ 10400
                            </p>
                        </div>
                        <div className="col">
                            <iframe src={this.sURL_GoogleMap} allowFullScreen={true}
                                style={{ borderWidth: 0, width: "100%", height: "45vh" }}></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}