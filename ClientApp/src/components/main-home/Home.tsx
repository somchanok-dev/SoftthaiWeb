import * as React from 'react';
import './style.css';
import { AxiosGetJson } from "../Service/Config/AxiosMethod";

class DATA_NewsItem {
    public Title?: string | JSX.Element;
    public Description?: string | JSX.Element;
    public ImageSrc?: string;
}

const paneVDO_Build = () => {
    const VDO = {
        GetMedia: () => { return document.getElementById("vmediaPANE1") as HTMLMediaElement; },
        Playing: true,
        ButtonPlay_onClick: (e: React.MouseEvent) => {
            VDO.Playing = !VDO.Playing;
            var media = VDO.GetMedia();
            if (VDO.Playing) media.play(); else media.pause();
            e.currentTarget.innerHTML = "<i class='fa fa-" + (VDO.Playing ? "pause" : "play") + "'></i>";
        },
        ButtonRepeat_onClick: (e: React.MouseEvent) => {
            var media = VDO.GetMedia();
            var isPlaying = VDO.Playing;
            media.currentTime = 0;
            if (isPlaying) media.play();
        },
        ButtonSound_onClick: (e: React.MouseEvent) => {
            var media = VDO.GetMedia();
            media.muted = !media.muted;
            e.currentTarget.innerHTML = "<i class='fa fa-volume-" + (media.muted ? "mute" : "up") + "'></i>";
        },
    };

    return (
        <div id="PANE_1" className="pane">
            <div className="p1-vdo-box">
                <video id="vmediaPANE1" loop={true} autoPlay={true} muted={true}
                    onContextMenu={(e) => e.preventDefault()} onClick={(e) => {
                        var ctrl = document.getElementById("vctrlPANE1");
                        if (ctrl) {
                            var btnPlay = ctrl.querySelector("button[data-handler=play]") as HTMLButtonElement;
                            if (btnPlay) btnPlay.click();
                        }
                        e.preventDefault();
                    }}>
                    <source src={require("./PANE_1/bg-vdo.mp4")} type="video/mp4" />
                </video>
                <ul id="vctrlPANE1" className="vdo-controls">
                    <li key={"vctrlPANE1_play"}>
                        <button data-handler="play" onClick={VDO.ButtonPlay_onClick}><i className="fa fa-pause"></i></button>
                    </li>
                    <li key={"vctrlPANE1_repeat"}>
                        <button data-handler="repeat" onClick={VDO.ButtonRepeat_onClick}><i className="fa fa-redo"></i></button>
                    </li>
                    <li key={"vctrlPANE1_sound"}>
                        <button data-handler="sound" onClick={VDO.ButtonSound_onClick}><i className="fa fa-volume-mute"></i></button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const paneAbout_Build = () => {
    return (
        <div id="PANE_2" className="pane">
            <div className="container">
                <div className="pane-title text-apricot"><b>18 Years</b> Experience</div>
                <h4 className="text-uppercase text-center text-denim mt-3">Softthai Application Co., Ltd.</h4>
                <div className="row my-4">
                    <div className="col-auto mx-auto lead text-center">
                        <div>
                            <span className="d-inline-block">ตลอด 18 ปีที่ผ่านมา</span>
                            {" "}
                            <span className="d-inline-block">เราพัฒนา</span>
                            {" "}
                            <span className="d-inline-block"><b>Web Application</b> มากกว่า 200 โครงการ</span>
                        </div>
                        <div>
                            <span className="d-inline-block"><b>SharePoint</b> มากกว่า 50 โครงการ</span>{" "}
                            <span className="d-inline-block">และ <b>Mobile Application</b> มากกว่า 15 โครงการ</span>
                        </div>
                    </div>
                </div>
                <div className="d-sm-flex justify-content-center text-center mt-5">
                    <div className="box-info">
                        <div className="row">
                            <div className="col-sm-12 col-auto">
                                <div className="box-circle" style={{ backgroundImage: "url(" + require("./PANE_2/ico-service1.png") + ")" }}></div>
                            </div>
                            <div className="col-sm-12 col">
                                <h4 className="text-denim mt-sm-4 mt-2 mb-0"><b className="d-sm-block d-md-inline-block">Web</b> <b>Application</b></h4>
                                <div className="d-inline-block">
                                    <div className="media mt-3">
                                        <img src={require("./PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                        <div className="media-body">
                                            <b className="text-uppercase">C#.NET</b>
                                        </div>
                                    </div>
                                    <div className="media mt-3">
                                        <img src={require("./PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                        <div className="media-body">
                                            <b className="text-uppercase">React.js</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-info mt-sm-0 mt-3">
                        <div className="row">
                            <div className="col-sm-12 col-auto">
                                <div className="box-circle" style={{ backgroundImage: "url(" + require("./PANE_2/ico-service3.png") + ")" }}></div>
                            </div>
                            <div className="col-sm-12 col">
                                <h4 className="text-denim mt-sm-4 mt-2 mb-0"><b>SharePoint</b></h4>
                                <div className="d-inline-block">
                                    <div className="media mt-3">
                                        <img src={require("./PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                        <div className="media-body">
                                            <b className="text-uppercase">Hybrid Cloud</b>
                                        </div>
                                    </div>
                                    <div className="media mt-3">
                                        <img src={require("./PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                        <div className="media-body">
                                            <b className="text-uppercase">FastTrack</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-info mt-sm-0 mt-3">
                        <div className="row">
                            <div className="col-sm-12 col-auto">
                                <div className="box-circle" style={{ backgroundImage: "url(" + require("./PANE_2/ico-service2.png") + ")" }}></div>
                            </div>
                            <div className="col-sm-12 col">
                                <h4 className="text-denim mt-sm-4 mt-2 mb-0"><b className="d-sm-block d-md-inline-block">Mobile</b> <b>Application</b></h4>
                                <div className="d-inline-block">
                                    <div className="media mt-3">
                                        <img src={require("./PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                        <div className="media-body">
                                            <b className="text-uppercase">React Native</b>
                                        </div>
                                    </div>
                                    <div className="media mt-3">
                                        <img src={require("./PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                        <div className="media-body">
                                            <b className="text-uppercase">Ionic</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const paneNews_Build = (SliderSource: Array<DATA_NewsItem>) => {
    let current_index = 0;
    const Slider_SetSelectedIndex = function (i: number) {
        let SLIDER = document.getElementById("P3Slider");
        if (SLIDER) {
            let monitor_item = SLIDER.querySelectorAll(".monitor-item");
            let bullet_item = SLIDER.querySelectorAll(".slider-indicators > li > a");
            let caption_item = SLIDER.querySelectorAll(".caption-item");

            monitor_item.forEach((x) => x.classList.remove("active"));
            bullet_item.forEach((x) => x.classList.remove("active"));
            caption_item.forEach((x) => x.classList.remove("active"));

            try { monitor_item.item(i).classList.add("active"); } catch { }
            try { bullet_item.item(i).classList.add("active"); } catch { }
            try { caption_item.item(i).classList.add("active"); } catch { }

            current_index = i;
        }
    }

    let slider_showtime = 8000; //ms
    let slider_activity = function () { Slider_SetSelectedIndex(current_index < SliderSource.length - 1 ? current_index + 1 : 0); };
    let slider_timing: NodeJS.Timeout;
    if (SliderSource.length) slider_timing = setInterval(slider_activity, slider_showtime);

    return (
        <div id="PANE_3" className="pane">
            <div className="container">
                <div className="pane-title"><b>News</b> &amp; <b>Activity</b></div>
                {/* <div className="row my-4">
          <div className="col-auto mx-auto lead text-center">
            <div>ผลสำเร็จของพวกเราตลอด 18 ปีที่ผ่านมา</div>
            <div>Web Application, Sharepoint และ Mobile Application</div>
            <div><a href="#" className="btn btn-link">View more <i className="fa fa-chevron-right"></i></a></div>
          </div>
        </div> */}
            </div>
            <div id="P3Slider" className="slider mt-4">
                <div className="slider-display">
                    <div className="slider-monitor">
                        <img src={require("./PANE_3/monitor-top.png")} className="monitor-top" />
                        <div className="monitor-body">
                            <div className="monitor-left">
                                <img src={require("./PANE_3/monitor-left.png")} />
                            </div>
                            <div className="monitor-screen">
                                {
                                    SliderSource.map((d, i) =>
                                        <div className={"monitor-item" + (i == 0 ? " active" : "")}
                                            style={d.ImageSrc ? { backgroundImage: "url(" + d.ImageSrc + ")" } : undefined}></div>)
                                }
                            </div>
                            <div className="monitor-right">
                                <img src={require("./PANE_3/monitor-right.png")} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="slider-space">
                    <div className="container">
                        <ul className="slider-indicators">
                            {
                                SliderSource.map((d, i) => <li key={"slider-indicators-" + i}><a className={i == 0 ? " active" : ""} onClick={(e) => {
                                    if (!e.currentTarget.classList.contains("active")) {
                                        Slider_SetSelectedIndex(i);
                                        clearInterval(slider_timing);
                                        slider_timing = setInterval(slider_activity, slider_showtime);
                                    }
                                    e.preventDefault();
                                }}></a></li>)
                            }
                        </ul>
                        <div className="slider-caption">
                            {
                                SliderSource.map((d, i) =>
                                    <div className={"caption-item" + (i == 0 ? " active" : "")}>
                                        <h3>{d.Title}</h3>
                                        {d.Description}
                                    </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const paneService_Build = () => {
    return (
        <div id="PANE_4" className="pane">
            <div className="container">
                <div className="pane-title">Our <b>Services</b></div>
                {/* <div className="row my-4">
          <div className="col-auto mx-auto lead text-center">
            <div>
              <span className="d-inline-block">ตลอด 18 ปีที่ผ่านมา</span>
              <span className="d-inline-block"><b>Softthai</b> พัฒนา</span>
              <span className="d-inline-block"><b>Web Application</b> มากกว่า 200 โครงการ</span>
            </div>
            <div>
              <span className="d-inline-block"><b>Sharepoint</b> มากกว่า 50 โครงการ</span>
              <span className="d-inline-block">และ <b>Mobile Application</b> มากกว่า 15 โครงการ</span>
            </div>
          </div>
        </div> */}
                <div className="form-row mt-5">
                    <div className="col-lg-3 col-sm-6 mb-3">
                        <div className="p4-box">
                            <div className="box-title">
                                <b>Web</b>
                                <div>Application</div>
                            </div>
                            <div className="box-icon">
                                <img src={require("./PANE_4/ico-globe.png")} />
                            </div>
                            <div className="box-content">เราพัฒนาในรูปแบบ Responsive Web คือรองรับการทำงานในทุก Devices เช่น Notebook, Computer PC, Tablet, Smart Phone และสามารถแสดง ผลบน Web Browser ต่างๆ</div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 mb-3">
                        <div className="p4-box">
                            <div className="box-title">
                                <b>Sharepoint</b>
                                <div>Application</div>
                            </div>
                            <div className="box-icon">
                                <img src={require("./PANE_4/ico-connection.png")} />
                            </div>
                            <div className="box-content">เราพัฒนาในรูปแบบ Responsive Web ทั้ง SharePoint 2010, 2013 และ 2019 สามารถ Migrate Data จาก Version ต่ำกว่าไปสูงกว่าได้</div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 mb-3">
                        <div className="p4-box">
                            <div className="box-title">
                                <b>Mobile</b>
                                <div>Application</div>
                            </div>
                            <div className="box-icon">
                                <img src={require("./PANE_4/ico-watchvdo.png")} />
                            </div>
                            <div className="box-content">เรารับพัฒนาโปรแกรมทั้งแบบ Hybrid และ Native App ทั้งโปรแกรมที่ใช้ภายในองค์กรเชื่อมต่อกับ Web Database และเพื่อประชาสัมพันธ์ และกิจกรรมอื่น ๆ</div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 mb-3">
                        <div className="p4-box">
                            <div className="box-title">
                                <b>BI</b>
                                <div>Application</div>
                            </div>
                            <div className="box-icon">
                                <img src={require("./PANE_4/ico-jigsaw.png")} />
                            </div>
                            <div className="box-content">เราร่วมมือกับลูกค้าเพื่อวิเคราะห์/สังเคราะห์ข้อมูล พร้อมออกแบบการแสดงผลในรูปแบบ Dashboard และ Report ต่าง ๆ ด้วย Power BI และ Tableau</div>
                        </div>
                    </div>
                </div>
                {/* <div className="row mt-4">
          <div className="col-auto ml-auto">
            <a href="#" className="text-white">View Projects <i className="fa fa-arrow-right"></i></a>
          </div>
        </div> */}
            </div>
        </div>
    );
}

const paneCustomer_Build = () => {
    return (
        <div id="PANE_5" className="pane">
            <div className="container">
                <div className="pane-title">Our <b>Customers</b></div>
                {/* <div className="row my-4">
          <div className="col-auto mx-auto lead text-center">
            <div>
              <span className="d-inline-block">ตลอด 18 ปีที่ผ่านมา</span>
              <span className="d-inline-block"><b>Softthai</b> พัฒนา</span>
              <span className="d-inline-block"><b>Web Application</b> มากกว่า 200 โครงการ</span>
            </div>
            <div>
              <span className="d-inline-block"><b>Sharepoint</b> มากกว่า 50 โครงการ</span>
              <span className="d-inline-block">และ <b>Mobile Application</b> มากกว่า 15 โครงการ</span>
            </div>
          </div>
        </div> */}
                <div className="d-flex justify-content-center mt-3">
                    <ul className="p5-customer">
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/PTT.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/PTTEP.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/OR.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/GC.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/GCME.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/GGC.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/LNG.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/PTT_Digital.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/TEX.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/THAIOIL.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/SAT.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/PEA.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/EastWater.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/THAICOM.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/DIP.jpg")} />
                            </a>
                        </li>
                        <li>
                            <a className="p5-link">
                                <img src={require("./PANE_5/SWU.jpg")} />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const paneQuote_Build = () => {
    class P7_Inform {
        public ID: number = 0;
        public Title?: string | JSX.Element;
        public Content?: string | JSX.Element;
        public ImageSrc?: string;
    }

    const P7_BoxContent = {
        Source: [
            {
                ID: 1,
                Title: <React.Fragment><div>Employee</div><b>Training</b></React.Fragment>,
                Content: <React.Fragment>เรามีการจัดอบรมเพื่อเพิ่มทักษะและความรู้ให้กับพนักงาน
                โดยมีทั้งวิทยากรภายในของบริษัทและภายนอกที่ได้รับเชิญเข้ามา
                นอกจากนี้ในทุก ๆ เดือน ยังมีการจัด Softthai Sharing Day
                เพื่อให้ทีมงานมาแบ่งปันความรู้ไม่ว่าจะเป็นด้าน Technical ส่วนตัว,
                Tools ใหม่ ๆ ที่มีประโยชน์และน่าสนใจ หรือบอกเล่าประสบการณ์ต่าง ๆ
                เพื่อนำไปพัฒนาประสิทธิภาพการทำงาน และให้เกิดผลงานที่มีคุณภาพสอดรับกับความพึงพอใจของลูกค้ายิ่ง ๆ ขึ้นไป</React.Fragment>,
                ImageSrc: require("./PANE_7/cover-employee_trainning.jpg")
            },
            {
                ID: 2,
                Title: <React.Fragment><div>Client</div><b>Meeting</b></React.Fragment>,
                Content: <React.Fragment>ในทุก ๆ การประชุม นอกจากการรับฟังความต้องการเพื่อนำมาวิเคราะห์การทำงานให้ตอบโจทย์ที่สุดแล้ว
                เรายังให้ความสำคัญกับการนำเสนอ Idea ที่เป็นประโยชน์ เพื่อให้เกิด Solution ที่ดีที่สุดกับงานนั้น ๆ
                และเพื่อสร้างความไว้วางใจต่อลูกค้าในการเลือกใช้บริการของเรา
                สู่การพัฒนาการทำงานใหม่ ๆ หรือต่อยอดการทำงานเดิมให้เกิดประโยชน์สูงสุด</React.Fragment>,
                ImageSrc: require("./PANE_7/cover-client_meeting.jpg")
            },
            {
                ID: 3,
                Title: <React.Fragment><div>Client</div><b>Supporting</b></React.Fragment>,
                Content: <React.Fragment>การให้บริการที่รวดเร็วเป็นสิ่งสำคัญยิ่งสำหรับเรา
                ลูกค้าสามารถติดต่อเราได้หลากหลายช่องทาง ในปัจจุบันเราเปิดใช้บริการ Line Official Account
                เพื่อรับทราบประเด็นต่าง ๆ จากลูกค้าโดยตรง ทำให้ทีมงานในส่วนที่เกี่ยวข้องสามารถตอบรับประเด็นสอบถามของลูกค้าได้อย่างรวดเร็ว
                และลูกค้าของเรายังสามารถติดตามข้อสอบถามได้สะดวกสบายยิ่งขึ้นอีกด้วย</React.Fragment>,
                ImageSrc: require("./PANE_7/cover-client_supporting.jpg")
            }
        ] as Array<P7_Inform>,
        Title_onClick: function (e: React.MouseEvent) {
            let t = e.currentTarget;
            let attrHref = t.attributes.getNamedItem("href");
            let boxID_selector = attrHref != null ? attrHref.value : "";
            let box = document.querySelector(boxID_selector);
            document.querySelectorAll("div[id^='p7box_']" + (boxID_selector ? ":not(" + boxID_selector + ")" : ""))
                .forEach((b) => b.classList.remove("selected"));
            if (box) {
                box.classList.add("selected");
                let box_cover = document.querySelector("#PANE_7 > .p7-cover") as HTMLElement;
                let arrBoxID = boxID_selector.split("_");
                if (box_cover && arrBoxID.length == 2) {
                    let ContentID = +arrBoxID[1];
                    let ct = P7_BoxContent.Source.find(w => w.ID == ContentID);
                    if (ct) box_cover.style.backgroundImage = "url(" + ct.ImageSrc + ")";
                }
            }
            e.preventDefault();
        },
        Build: function () {
            return this.Source.map((d, i) => {
                return <div id={"p7box_" + d.ID} className={"info-box" + (i == 0 ? " selected" : "")}>
                    <div className="box-hline"></div>
                    <div className="box-body">
                        <a href={"#p7box_" + d.ID} className="box-title" onClick={this.Title_onClick}>
                            <div className="title-bullet">
                                <img src={require("./PANE_7/bullet.png")} className="bullet-main" />
                                <img src={require("./PANE_7/bullet-selected.png")} className="bullet-selected" />
                            </div>
                            <div className="title-label">{typeof d.Title == "string" ? <b>{d.Title}</b> : d.Title}</div>
                        </a>
                        <div className="box-content">{d.Content}</div>
                    </div>
                </div>;
            });
        }
    };

    return P7_BoxContent.Source.length ? (
        <div id="PANE_7" className="pane">
            <div className="col-lg-7 col-md-6 col-12 p7-cover" style={{ backgroundImage: "url(" + P7_BoxContent.Source[0].ImageSrc + ")" }}></div>
            <div className="col-lg-5 col-md-6 col-12 p7-info">{P7_BoxContent.Build()}</div>
        </div>
    ) : null;
}

const paneProject_Build = () => {
    return (
        <div id="work">
            <div id="PANE_8" className="pane">
                <div className="container">
                    <div className="pane-title mb-4">Our <b>Works</b></div>
                    {/* <div className="row my-4">
                    <div className="col-auto mx-auto lead text-center">
                        <div>
                            <span className="d-inline-block">ตลอด 18 ปีที่ผ่านมา</span>
                            <span className="d-inline-block"><b>Softthai</b> พัฒนา</span>
                            <span className="d-inline-block"><b>Web Application</b> มากกว่า 200 โครงการ</span>
                        </div>
                        <div>
                            <span className="d-inline-block"><b>Sharepoint</b> มากกว่า 50 โครงการ</span>
                            <span className="d-inline-block">และ <b>Mobile Application</b> มากกว่า 15 โครงการ</span>
                        </div>
                    </div>
                </div> */}
                    <div className="p8-cover">
                        <img src={require("./PANE_8/cover.jpg")} />
                    </div>
                    <div className="p8-board">
                        <div className="form-row">
                            <div className="col-sm-7">
                                <a className="p-link link-1" data-title="E-Magazine" style={{ backgroundImage: "url(" + require("./PANE_8/link-1-emagazine.png") + ")" }}></a>
                                <div className="form-row">
                                    <div className="col-6">
                                        <div className="board-logo"></div>
                                    </div>
                                    <div className="col-6">
                                        <a className="p-link link-2" data-title="PRE-Registration" style={{ backgroundImage: "url(" + require("./PANE_8/link-2-p_reg.png") + ")" }}></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <a className="p-link link-3" data-title="Phasing Budget" style={{ backgroundImage: "url(" + require("./PANE_8/link-3-phasing_budget.png") + ")" }}></a>
                                <a className="p-link link-3" data-title="Document Warehouse" style={{ backgroundImage: "url(" + require("./PANE_8/link-4-doc_warehouse.png") + ")" }}></a>
                                <a className="p-link-more">
                                    <div className="link-label">More Projects <i className="fa fa-arrow-right"></i></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const paneTechnology_Build = () => {
    return (
        <div id="PANE_6" className="pane">
            <div className="container">
                <div className="pane-title"><b>Technology</b></div>
                <div className="form-row my-4 justify-content-center">
                    <div className="col-auto">
                        <img src={require("./PANE_6/dotnet.png")} height="70" />
                    </div>
                    <div className="col-auto">
                        <img src={require("./PANE_6/react.png")} height="70" />
                    </div>
                    <div className="col-auto">
                        <img src={require("./PANE_6/angular.png")} height="70" />
                    </div>
                    <div className="col-auto">
                        <img src={require("./PANE_6/bootstrap.png")} height="70" />
                    </div>
                </div>
            </div>
        </div>);
}

const paneContact_Build = () => {
    const sURL_GoogleMap = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.370246900747!2d100.55588851477931!3d13.756531990344355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e9354e3eb5d%3A0x1d05a92d22e0899d!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4i-C4reC4n-C4l-C5jOC5hOC4l-C4oiDguYHguK3guJ7guKXguLTguYDguITguIrguLHguYjguJkg4LiI4Liz4LiB4Lix4LiU!5e0!3m2!1sen!2sth!4v1615551835527!5m2!1sen!2sth";

    return (
        <div id="PANE_9" className="pane">
            <div className="p9-cover col">
                <div className="p9-content">
                    <div className="row">
                        <div className="col-lg-4 col-md-auto">
                            <b className="pane-title text-left">Contact Us</b>
                            <p className="text-carrot mt-4 text-uppercase">Softthai Application Co., Ltd.</p>
                            <p className="text-honey mt-2">
                                บริษัท ซอฟท์ไทย แอพลิเคชั่น จำกัด<br />
                                8 ซ.ขวัญพัฒนา 2 ถ.อโศก-ดินแดง<br />
                                แขวง/เขต ดินแดง กรุงเทพฯ 10400
                            </p>
                            <ul className="list-unstyled mt-3" style={{ lineHeight: 1 }}>
                                <li key="ct-email" className="media align-items-center mb-1">
                                    <img src={require("../main-contact/assets/ico-email.png")} className="mr-3" height={30} />
                                    <div className="media-body">support@softthai.com</div>
                                </li>
                                <li key="ct-tel" className="media align-items-center mb-1">
                                    <img src={require("../main-contact/assets/ico-phone.png")} className="mr-3" height={30} />
                                    <div className="media-body">02-6416503-5</div>
                                </li>
                                <li key="ct-fb" className="media align-items-center mb-1">
                                    <img src={require("../main-contact/assets/ico-facebook.png")} className="mr-3" height={30} />
                                    <div className="media-body">
                                        <a href="https://www.facebook.com/Softthai" target="_blank" style={{ color: "inherit" }}>
                                            <div className="d-inline-block">https://www.facebook.com</div>
                                            <div className="d-inline-block">/Softthai</div>
                                        </a>
                                    </div>
                                </li>
                                <li key="ct-line" className="media align-items-center">
                                    <img src={require("../main-contact/assets/ico-line.png")} className="mr-3" height={30} />
                                    <div className="media-body">@softthai</div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <iframe src={sURL_GoogleMap} allowFullScreen={true}
                                style={{ borderWidth: 0, width: "100%", height: "45vh" }}></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Home = () => {
    const [SliderSource, setSliderSource] = React.useState([] as Array<DATA_NewsItem>);

    let ListNews = async () => {
        let d: any = await AxiosGetJson("api/Home/ListNews");
        let arrItem: Array<DATA_NewsItem> = [];
        (d.lstData as Array<any>).map((news) => {
            arrItem.push({
                Title: news.sTitle as string,
                Description: <p>{news.sDescription as string}</p>,
                ImageSrc: news.sImageSrc as string //require((news.ImageSrc as string).replace(new RegExp("^[/]+|[/]+$", "g"), "")) //Trim "/"
            });
        });
        setSliderSource(arrItem);
    };

    React.useEffect(() => { ListNews(); }, []);

    return (
        <React.Fragment>
            {paneVDO_Build()}
            {SliderSource.length ? paneNews_Build(SliderSource) : null}
            {paneAbout_Build()}
            {paneQuote_Build()}
            {paneProject_Build()}
            {paneService_Build()}
            {/* {paneTechnology_Build()} */}
            {paneCustomer_Build()}
            {paneContact_Build()}
        </React.Fragment>
    );
}

export default Home;
