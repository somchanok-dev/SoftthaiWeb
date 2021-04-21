import React, { CSSProperties, SVGAttributes } from 'react'
import './style.css';

class DATA_ProjectItem {
    public ID: number = 0;
    public TypeID: number = 0;
    public Title: string = "";
    public Type: string = "";
    public ImageSrc?: string;
    public Desc?: string;
}

interface IState {
    source: Array<DATA_ProjectItem>,
    filter_TypeID: number,
    selected_ID: number
}

export default class Project extends React.Component<{}, IState> {
    constructor(props) {
        super(props);
        this.state = { source: [], filter_TypeID: 0, selected_ID: 0 };
    }

    private WhiteOutline_TextAttr: SVGAttributes<SVGTextElement> = {
        textAnchor: "start",
        x: "0",
        fill: "none",
        stroke: "#ffffff",
        strokeWidth: 0.5,
        style: { whiteSpace: "normal" } as CSSProperties
    };

    private Adjust = {
        Display: () => {
            var d = this.state.source.find(w => w.ID == this.state.selected_ID);
            if (d != null) {
                return (
                    <React.Fragment>
                        <div className="dp-cover"></div>
                        <div className="dp-title">{d.Title}</div>
                        <div className="dp-type">{d.Type}</div>
                        <div className="dp-desc">{d.Desc}</div>
                    </React.Fragment>)
            }
        },
        SetFilter: (TypeID: number) => {
            var d = this.state.source.find(w => w.TypeID == TypeID);
            this.setState({
                filter_TypeID: TypeID,
                selected_ID: d != null ? d.ID : this.state.selected_ID
            });
        },
        SetSelect: (ID: number) => { this.setState({ selected_ID: ID }); }
    }

    componentDidMount() {
        let arrData = [
            {
                ID: 1, TypeID: 1, Title: "Project A", Type: "Web Application",
                Desc: "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
            },
            { ID: 2, TypeID: 2, Title: "Project B", Type: "SharePoint" },
            { ID: 3, TypeID: 3, Title: "Project C", Type: "Mobile Application" },
            { ID: 4, TypeID: 2, Title: "Project D", Type: "SharePoint" },
            { ID: 5, TypeID: 1, Title: "Project E", Type: "Web Application" }
        ] as Array<DATA_ProjectItem>

        this.setState({
            source: arrData,
            filter_TypeID: 0,
            selected_ID: arrData[0].ID
        });
    }

    render() {
        return (
            <div id="WORK">
                <div className="page-cover">
                    <div className="container">
                        <div className="cover-content">
                            <div className="cover-title text-carrot">Our Works</div>
                            <div className="cover-title mt-2">
                                <svg width="100%" style={{ overflow: "visible", verticalAlign: "baseline" }}>
                                    <text y="82.5%" {...this.WhiteOutline_TextAttr}>Development</text>
                                </svg>
                                <svg width="100%" style={{ overflow: "visible", verticalAlign: "baseline" }}>
                                    <text y="82.5%" {...this.WhiteOutline_TextAttr}>for better solutions</text>
                                </svg>
                            </div>
                            <div className="cover-desc mt-5">
                                นอกจากเครื่องมือที่ทันสมัยและการใส่ใจคุณภาพ
                                เรายังออกแบบและพัฒนาระบบเพื่อประโยชน์สูงสุดของลูกค้า
                                ด้วยความเข้าใจผู้ใช้งานผ่านประสบการณ์การให้บริการมาอย่างยาวนานเกือบ 2 ทศวรรษ
                                เพื่อสร้างความสะดวกสบายต่อผู้ใช้งานได้อย่างแท้จริง
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="container">
                        <div id="PROJECT_LIST">
                            <div className="p-selector">
                                <div className="sl-filter">
                                    <button onClick={() => this.Adjust.SetFilter(0)} className={this.state.filter_TypeID == 0 ? "active" : undefined}>All</button>
                                    <button onClick={() => this.Adjust.SetFilter(1)} className={this.state.filter_TypeID == 1 ? "active" : undefined}>Web Application</button>
                                    <button onClick={() => this.Adjust.SetFilter(2)} className={this.state.filter_TypeID == 2 ? "active" : undefined}>SharePoint</button>
                                    <button onClick={() => this.Adjust.SetFilter(3)} className={this.state.filter_TypeID == 3 ? "active" : undefined}>Mobile Application</button>
                                </div>
                                <ul className="sl-option">
                                    {
                                        this.state.source
                                            .filter(w => this.state.filter_TypeID ? w.TypeID == this.state.filter_TypeID : true)
                                            .map((d, i) => {
                                                return (
                                                    <li key={"PL_" + d.ID} className={this.state.selected_ID == d.ID ? "active" : undefined}>
                                                        <div className="opt-box" onClick={() => this.Adjust.SetSelect(d.ID)}>
                                                            <div className="opt-thumb"></div>
                                                            <div className="opt-label">
                                                                <div className="label-title">{d.Title}</div>
                                                                <div className="label-type">{d.Type}</div>
                                                            </div>
                                                        </div>
                                                    </li>);
                                            })
                                    }
                                </ul>
                            </div>
                            <div className="p-display">{this.Adjust.Display()}</div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}