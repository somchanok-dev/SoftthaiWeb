import { url } from 'inspector';
import React, { CSSProperties, SVGAttributes } from 'react'
import './style.css';

export default class about extends React.Component {
    private BoxCover_Build = function () {
        const WhiteOutline_TextAttr: SVGAttributes<SVGTextElement> = {
            fill: "rgba(255,255,255,0.25)",
            stroke: "#ffffff",
            strokeWidth: 1.5,
            style: { whiteSpace: "normal" } as CSSProperties
        };

        return (
            <div className="page-cover">
                <div className="container">
                    <div className="cover-content" style={{ textShadow: "1px 1px 0px rgba(0, 0, 0, 1)" }}>
                        <div className="cover-title">
                            <svg width="100%" style={{ overflow: "visible", verticalAlign: "baseline" }}>
                                <text y="82.5%" {...WhiteOutline_TextAttr}>We Are</text>
                            </svg>
                        </div>
                        <div className="cover-title mt-2">Softthai<br />Application</div>
                        <div className="cover-desc mt-5">
                            <div>
                                <span className="d-inline-block">Softthai พัฒนา</span>
                                {" "}
                                <span className="d-inline-block">Web Application มากกว่า 200 โครงการ</span>
                            </div>
                            <div>
                                <span className="d-inline-block">Sharepoint มากกว่า 50 โครงการ</span>
                                {" "}
                                <span className="d-inline-block">และ Mobile Application มากกว่า 15 โครงการ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
    private BoxHistory_Build = function () {
        return (
            <div className="container">
                <div className="box-history">
                    <div className="box-left">
                        <img src={require("./assets/software_technology.png")} className="img-title" />
                    </div>
                    <div className="box-right">
                        <h4 className="text-carrot mt-4"><b>ประวัติความเป็นมา</b></h4>
                        <p className="mt-4">
                            เริ่มธุรกิจเมื่อปี 2546 ตอนนั้นยังเป็น Freelance โดยรับพัฒนา Web Application และงานด้าน Multimedia
                            ต่อมาในช่วงกลางปี 2547 ได้จดทะเบียนเป็นบริษัท โดยเน้นให้บริการในการพัฒนา Web Application เป็นหลัก
                            กลุ่มลูกค้าส่วนใหญ่เป็นหน่วยงานราชการ เมื่อปี 2553 บริษัทได้เพิ่มบริการรับพัฒนา SharePoint Application
                            และ Mobile Application โดยกลุ่มลูกค้าส่วนใหญ่เปลี่ยนมาเป็นบริษัทเอกชนจนถึงปัจจุบัน
                        </p>
                        <p className="mt-4 text-emphasize">
                            <div className="text-uppercase">More Than Software</div>
                            <div className="text-uppercase text-right"><b>We Build Technology</b></div>
                        </p>
                        <p className="mt-4">
                            ก้าวต่อไปของเราจะเพิ่มบริการพัฒนา Business Intelligence
                            โดยอาศัยความรู้ความเข้าใจด้านข้อมูลที่ได้รับผ่านประสบการณ์อันยาวนาน
                            จากการพัฒนาระบบงานเพื่อองค์กรชั้นนำระดับประเทศมาอย่างมากมาย
                            โดยให้บริการทั้ง Power BI และ Tableau
                        </p>
                    </div>
                </div>
            </div>)
    }
    private BoxTopic_Build = function () {
        return (
            <div className="box-topic">
                <div className="container">
                    <div className="d-sm-flex justify-content-center text-center">
                        <div className="box-info">
                            <div className="row">
                                <div className="col-sm-12 col-auto">
                                    <div className="box-circle bg-carrot text-white">
                                        <div className="w-100">Consulting</div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col">
                                    <div className="d-inline-block">
                                        <div className="media mt-4">
                                            <img src={require("../main-home/PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                            <div className="media-body">
                                                <b className="text-uppercase">Meeting</b>
                                            </div>
                                        </div>
                                        <div className="media mt-4">
                                            <img src={require("../main-home/PANE_2/ico-st-apricot.png")} className="mr-2 media-icon" />
                                            <div className="media-body">
                                                <b className="text-uppercase">Coordinating</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-info mt-sm-0">
                            <div className="row">
                                <div className="col-sm-12 col-auto">
                                    <div className="box-circle bg-denim text-white">
                                        <div className="w-100">Development</div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col">
                                    <div className="d-inline-block">
                                        <div className="media mt-4">
                                            <img src={require("../main-home/PANE_2/ico-st-denim.png")} className="mr-2 media-icon" />
                                            <div className="media-body">
                                                <b className="text-uppercase">Analyzing &amp; Planning</b>
                                            </div>
                                        </div>
                                        <div className="media mt-4">
                                            <img src={require("../main-home/PANE_2/ico-st-denim.png")} className="mr-2 media-icon" />
                                            <div className="media-body">
                                                <b className="text-uppercase">Coding &amp; Testing</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-info mt-sm-0">
                            <div className="row">
                                <div className="col-sm-12 col-auto">
                                    <div className="box-circle bg-arctic text-white">
                                        <div className="w-100">Supporting</div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col">
                                    <div className="d-inline-block">
                                        <div className="media mt-4">
                                            <img src={require("../main-home/PANE_2/ico-st-arctic.png")} className="mr-2 media-icon" />
                                            <div className="media-body">
                                                <b className="text-uppercase">Getting Feedback</b>
                                            </div>
                                        </div>
                                        <div className="media mt-4">
                                            <img src={require("../main-home/PANE_2/ico-st-arctic.png")} className="mr-2 media-icon" />
                                            <div className="media-body">
                                                <b className="text-uppercase">Fixing Problem</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
    private BoxStory_Build = function () {
        return (
            <div className="box-story">
                <div className="story-title text-denim text-center">What <b>We Do</b></div>
                <div className="story-content story-content-carrot">
                    <div className="container">
                        <div className="content-body">
                            <div className="content-title" aria-label="Consulting"></div>
                            <p>ปัจจุบันเทคโนโลยีการสื่อสารมีความก้าวหน้าและพัฒนาไปอย่างรวดเร็ว
                            Softthai มีการแนะนำและให้คำปรึกษาในด้าน Software ที่เหมาะสมกับการทำงานแต่ละประเภทของแต่ละองค์กร
                            เพื่อเพิ่มประสิทธิภาพในการทำงานและประหยัดต้นทุนด้านเวลาและโอกาสที่เกิดจากความล่าช้าในการทำงานด้วยเอกสารเดิม ๆ</p>
                        </div>
                        <div className="content-cover" style={{ backgroundImage: "url(" + require("./assets/cover-consulting.jpg") + ")" }}></div>
                    </div>
                </div>
                <div className="story-content story-content-denim story-content-right">
                    <div className="container">
                        <div className="content-body">
                            <div className="content-title" aria-label="Development"></div>
                            <p>ในการพัฒนา Software เพื่อตอบโจทย์การทำงานของลูกค้า เราค้นคว้าและพัฒนาระบบงานเพื่อใช้เทคโนโลยีที่ดีให้ชิ้นงานได้อย่างเหมาะสม
                            การทดสอบระบบ มีทั้งการทดสอบเป็นส่วนย่อยและภาพรวม เพื่อป้องกันข้อผิดพลาดเมื่อลูกค้านำไปใช้งาน
                            ตลอดจนการจัดทำเอกสารต่าง ๆ ที่เกี่ยวข้องกับระบบ และคู่มือประกอบการใช้งานสำหรับผู้ปฏิบัติงาน</p>
                        </div>
                        <div className="content-cover" style={{ backgroundImage: "url(" + require("./assets/cover-development.jpg") + ")" }}></div>
                    </div>
                </div>
                <div className="story-content story-content-arctic">
                    <div className="container">
                        <div className="content-body">
                            <div className="content-title" aria-label="Supporting"></div>
                            <p>การบริการหลังการขายเป็นวิธีสร้างความประทับใจที่ดีให้กับลูกค้าของเรา สำหรับในปัจจุบันที่มีบริษัทด้าน Software มากมาย
                            ทำให้เกิดการแข่งขันที่สูง ทั้งคู่แข่งที่มีเทคโนโลยีทันสมัย หรือแม้กระทั่งการตัดราคากัน ซึ่งลูกค้าสามารถใช้บริการได้อย่างหลากหลาย
                            สิ่งหนึ่งที่จะทำให้เราเหนือกว่าคู่แข่งได้ก็คือ บริการหลังการขาย ไม่ว่าจะเป็นการติดตามผลหลังจากนำระบบขึ้นใช้งาน
                            การตอบรับเพื่อแก้ปัญหาให้กับลูกค้าอย่างรวดเร็ว หรือรับทราบความคิดเห็นของผู้ใช้งานเพื่อนำมาพัฒนาผลงานได้ดียิ่งขึ้นไป</p>
                        </div>
                        <div className="content-cover" style={{ backgroundImage: "url(" + require("./assets/cover-supporting.jpg") + ")" }}></div>
                    </div>
                </div>
            </div>)
    }
    private BoxMember_Build = function () {
        return (
            <div className="box-member">
                <div className="container">
                    <div className="member-title text-center"><b className="text-carrot">Work</b> and <b className="text-arctic">Team</b></div>
                    <div className="member-container">
                        {/* <div className="member-icon">
                            <div className="emp-icon emp-icon-1" style={{ backgroundImage: "url(" + require("./assets/emp-1.jpg") + ")" }}></div>
                            <div className="emp-icon emp-icon-2" style={{ backgroundImage: "url(" + require("./assets/emp-2.jpg") + ")" }}></div>
                            <div className="emp-icon emp-icon-3" style={{ backgroundImage: "url(" + require("./assets/emp-3.jpg") + ")" }}></div>
                            <div className="emp-icon emp-icon-4" style={{ backgroundImage: "url(" + require("./assets/emp-4.jpg") + ")" }}></div>
                        </div> */}
                        <div className="member-cover" style={{  backgroundImage: "url(" + require("./assets/cover-team_work.jpg") + ")"}}></div>
                        <div className="member-content">
                            <p className="text-uppercase"><b>Work</b> and <b>Team</b> Relationship</p>
                            <p className="mt-4">
                                ระบบทีมงานที่มีประสิทธิภาพย่อมเป็นส่วนสำคัญที่จะก่อให้เกิดผลงานที่ดีได้
                                เราให้ความสำคัญต่อการสร้างความร่วมแรงร่วมใจของทีมงาน ส่งเสริมการสร้างปฏิสัมพันธ์ที่ดีภายในองค์กร
                                ถึงแม้บทบาทหน้าที่ของแต่ละคนจะแตกต่างกันออกไป แต่เราเน้นย้ำถึงแนวทางการทำงานที่ดีอยู่เสมอ
                                เพื่อการบรรลุเป้าหมายร่วมกันอย่างมีคุณภาพ เมื่อทีมงานมีทัศนคติและความรู้สึกร่วมไปในจุดมุ่งหมายดียวกัน
                                การพัฒนาศักยภาพองค์กรจะสามารถทำได้อย่างยั่งยืน
                                ตลอดจนการพัฒนาบุคลากรก็จะสามารถเติบโตไปพร้อมกับองค์กรได้อย่างมั่นคง
                            </p>
                            <div className="mt-4 text-emphasize">
                                <div className="text-uppercase text-xl-right">
                                    <div className="d-inline-block">We are</div>{" "}
                                    <b className="d-inline-block">Softthai Application</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }

    render() {
        return <div id="ABOUT">
            {this.BoxCover_Build()}
            {this.BoxHistory_Build()}
            {this.BoxTopic_Build()}
            {this.BoxStory_Build()}
            {this.BoxMember_Build()}
        </div>;
    }
}