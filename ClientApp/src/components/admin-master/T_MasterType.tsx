 import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, CustomInput, Nav, NavItem, NavLink, Row, TabContent, TabPane, } from 'reactstrap';
import moment from 'moment';
import { Pin, PinFill } from 'react-bootstrap-icons';
import { useHistory } from 'react-router';
import { AlertIcon, BoxMsg, DialogConfirm, Encrypt, Responsestart, Sweetalert, TooltipsMSG } from '../Systems/SystemComponent';
import { AxiosGetJson, AxiosPostJson } from '../Service/Config/AxiosMethod';
import CreateTable, { CellHeader } from '../Systems/Table';
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation'

const Controller = 'T_New';

const T_New = (props: any) => {

    const [lstDataRow, setLstDataRow] = useState([] as any);
    const [lstDataRowPins, setLstDataRowPins] = useState([] as any);
    const [lstDropdownPins, setDropdownPins] = useState([] as any);
    const [Activetab, setActivetab] = useState("tabNews");
    const history = useHistory();
    const [News_rowSelected, setNews_RowSelected] = useState([] as any);
    const [Pins_rowSelected, setPins_RowSelected] = useState([] as any);
    const [listAdminGroup, setlistAdminGroup] = useState([] as any);

    const [txtSearch, SetTxtSearch] = React.useState({
        stxtSearch: "",
        sIsActive: "",
    });
    const { stxtSearch, sIsActive } = txtSearch;

    const CheckUser = () => {
        const tokenUser = localStorage.getItem("softhaiWebJWTKey");
        if (!tokenUser) {
            window.location.href = "/admin-login"
        }
        return true;
    }

    useEffect(() => {
        if (CheckUser()) {
            GetDataOnPageNewLoad();
            GetDataOnPagePinLoad();
        }
    }, []);
    const GetDataOnPageNewLoad = async () => {
        let result: any = await AxiosGetJson(Controller + "/Getlstdata");
        setLstDataRow(result.lstData);
    }




    const GetDataOnPagePinLoad = async () => {
        let result: any = await AxiosGetJson(Controller + "/GetPinlstdata");
        setLstDataRowPins(result.lstData)

        setDropdownPins(result.lstOrder.map((el: { label: any; value: string; }, indx: any) => {
            return {
                label: el.label,
                value: el.value + "",
            }
        }))
    }
    var News_onSelectedRow = (id: number) => {
        setNews_RowSelected([...News_rowSelected, id])
    }
    var News_onDeSelectedRow = (id: number) => {
        var index = News_rowSelected.indexOf(id)
        if (index !== -1) {
            News_rowSelected.splice(index, 1);
            setNews_RowSelected([...News_rowSelected]);
        }
    }
    var News_onDeleteClick = () => {
        if (News_rowSelected.length > 0) {
            var data = {
                nID: News_rowSelected
            };
            DialogConfirm(async () => {
                let result: any = await AxiosPostJson(Controller + "/Del_datarow", data);
                console.log("result", result)
                if (result.data.sStatus === Responsestart.success) {
                    GetDataOnPageNewLoad();
                    await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
                } else if (result.data.sStatus === Responsestart.warning) {
                    Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            })
        }
    }
    var News_onClickHeadCB = (e: any, currentData: any) => {
        let el = e.target;
        let dataSelect = el.checked ? (currentData === null ? [] : currentData.map((x: any) => x.nID)) : [];
        setNews_RowSelected(dataSelect);
    }



    const SearchData = async () => {
        let result: any = await AxiosGetJson(Controller + "/SearchTNewbyTitle?txtSearch=" + stxtSearch + "&sIsActive=" + sIsActive);
        setLstDataRow(result.lstData);
    };




    const Use_Newspin = async (nID: number, inx: number) => {
        var lstpin: any = [...lstDataRow];
        lstpin[inx].isPin = !lstpin[inx].isPin;
        setLstDataRow(lstpin)
        let result: any = await AxiosPostJson(Controller + "/Change_Pins", lstDataRow[inx]);

    }
    const News_CreateDataRow = (o: any, i: any) => {
        return (
            <tr key={i}>
                {
                    <td align="center"><CustomInput type="checkbox" id={`News_${o.nID}`} label={''}
                        onChange={(e: any) => {
                            let el = e.target
                            if (el.checked) {
                                News_onSelectedRow(o.nID)
                            } else {
                                News_onDeSelectedRow(o.nID)
                            }
                        }}
                        checked={News_rowSelected.indexOf(o.nID) !== -1}
                    /></td>
                }
                <td className="text-center">{i + 1}</td>
                <td className="text-center">{o.sTitle}</td>
                <td className="text-center">{moment(o.dPost).format("DD/MM/YYYY")}</td>
                <td className="text-center">
                    <Badge color={o.isActive === true ? "success" : "danger"} style={{ fontSize: 11 }}>
                        {o.isActive === true ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge >
                </td>
                <td className="text-center">
                    <Button size="sm" id={`bt_${o.nID}`} color="link" type="button" onClick={(e: any) => { Use_Newspin(o.nID, i) }}>
                        {o.isPin === true ? <PinFill /> : <Pin style={{ transform: "rotate(45deg)" }} />}
                    </Button></td>
                <td className="text-center"><Button size="sm" className="btn btn-info btn-sm" type="button" onClick={() => { getLinkToTNEW_datail(o.nID); }}><i className="fas fa-pencil-alt"></i></Button></td>
            </tr>
        )
    }
    const News_header: CellHeader[] = [
        {
            Sortby: "nID",
            SortType: Number,
            label: "",
            IsCheckBox: true,
            CSSStyle: { width: "2%" }
        },
        {
            Sortby: "",
            SortType: "",
            label: "ลำดับที่",
            CSSStyle: { width: "5%" }
        },
        {
            label: "ชื่อข่าว",
            Sortby: "sTitle",
            SortType: String,
            CSSStyle: { width: "6%" }
        },
        {
            label: "วันที่ประกาศ",
            Sortby: "dPost",
            SortType: String,
            CSSStyle: { width: "4%" }
        },
        {
            label: "สถานะ",
            Sortby: "",
            SortType: String,
            CSSStyle: { width: "4%" }
        },
        {
            Sortby: "",
            SortType: false,
            label: "",
            CSSStyle: { width: "1%" }
        },
        {
            Sortby: "",
            SortType: false,
            label: <Button size="sm" color="#007bff" className="btn btn-primary btn-sm" type="button" onClick={() => { history.push("/admin-news-edit") }}><i className="fas fa-plus"></i></Button>,
            CSSStyle: { width: "1%" }
        },
    ];

    var Pins_onSelectedRow = (id: number) => {
        setPins_RowSelected([...Pins_rowSelected, id])
    }
    var Pins_onDeSelectedRow = (id: number) => {
        var index = Pins_rowSelected.indexOf(id)
        if (index !== -1) {
            Pins_rowSelected.splice(index, 1);
            setPins_RowSelected([...Pins_rowSelected]);
        }
    }
    var Pins_onDeleteClick = () => {
        if (Pins_rowSelected.length > 0) {
            var data = {
                nID: Pins_rowSelected
            };
            DialogConfirm(async () => {
                let result: any = await AxiosPostJson(Controller + "/Del_datarowPins", data);
                if (result.data.sStatus === Responsestart.success) {
                    GetDataOnPagePinLoad();
                    GetDataOnPageNewLoad();
                    await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
                } else if (result.data.sStatus === Responsestart.warning) {
                    Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            })
        }
    }
    var Pins_onClickHeadCB = (e: any, currentData: any) => {
        let el = e.target;
        let dataSelect = el.checked ? (currentData === null ? [] : currentData.map((x: any) => x.nID)) : [];
        setPins_RowSelected(dataSelect);
    }
    const objOrder = [{
        value: "0",
        label: "Select"
    },
    {
        value: "1",
        label: "1"
    },
    {
        value: "2",
        label: "2"
    },
    {
        value: "3",
        label: "3"
    },
    {
        value: "4",
        label: "4"
    },
    {
        value: "5",
        label: "5"
    }];

    const Pins_CreateDataRow = (o: any, i: any) => {
        return (
            <tr key={i}>
                {
                    <td align="center"><CustomInput type="checkbox" id={`Pins_${o.nID}`} label={''}
                        onChange={(e: any) => {
                            let el = e.target
                            if (el.checked) {
                                Pins_onSelectedRow(o.nID)
                            } else {
                                Pins_onDeSelectedRow(o.nID)
                            }
                        }}
                        checked={Pins_rowSelected.indexOf(o.nID) !== -1}
                    /></td>
                }
                <td>
                    {/*<Select defaultValue={lstDropdownPins[o.nOrder - 1]} options={lstDropdownPins} onChange={(e: any) => SetOrder(e.value, o.nID)} />*/}
                    <select className="form-control" name="nOrder" id="nOrder" defaultValue={o.nOrder != null ? o.nOrder : "Slelct"}
                        onChange={(e: any) => SetOrder(e.target.value, o.nID)}>
                        {objOrder.map((val, index) => {
                            return (
                                <option value={val.value} className="dropdown-item">{val.label}</option>
                            )
                        })}
                    </select>
                </td>
                <td className="text-center">{o.sTitle}</td>
                <td className="text-center">{moment(o.dPost).format("DD/MM/YYYY")}</td>
            </tr>
        )
    }
    const SetOrder = async (val: any, nID: any) => {
        if (val != 0) {
            var data = {
                nOrder: val,
                nID: nID,
            };
            let result: any = await AxiosPostJson(Controller + "/SetOrder", data);
            if (result.data.sStatus === Responsestart.success) {
                await Sweetalert.Success(AlertIcon.success, "", setLstDataRowPins([]));
                GetDataOnPagePinLoad()
            } else if (result.data.sStatus === Responsestart.warning) {
                Sweetalert.Warning(AlertIcon.warning, result.data.sMsg, null);
            } else {
                Sweetalert.Error(AlertIcon.error, result.data.sMsg, null);
            }
        }

    }
    const getLinkToTNEW_datail = (id: number) => {
        let sTypeComponent = `admin-news-edit/`
        let nID = Encrypt(id)
        let sMode = Encrypt("Edit")
        let sPath = `${sTypeComponent}?nID=${nID}&&sMode=${sMode}`
        history.push(sPath);
    }

    const Pins_header: CellHeader[] = [
        {
            Sortby: "nID",
            SortType: Number,
            label: "",
            IsCheckBox: true,
            CSSStyle: { width: "2%" }
        },
        {
            Sortby: "nID",
            SortType: Number,
            label: "ลำดับที่",
            CSSStyle: { width: "2%" }
        },
        {
            label: "ชื่อข่าว",
            Sortby: "sTitle",
            SortType: String,
            CSSStyle: { width: "6%" }
        },
        {
            label: "วันที่ประกาศ",
            Sortby: "dPost",
            SortType: String,
            CSSStyle: { width: "4%" }
        }
    ];

    return (
        <Fragment>
            <Nav className="nav nav-tabs navTabList" role="tablist">
                <NavItem>
                    <NavLink
                        className={Activetab === "tabNews" ? "active" : ""}
                        onClick={() => {
                            setActivetab("tabNews");
                        }}
                    >
                        <i className="fas fa-users-cog"></i> จัดการข้อมูลข่าว
                        </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={Activetab === "tabNewspin" ? "active" : ""}
                        onClick={() => {
                            setActivetab("tabNewspin");
                            GetDataOnPagePinLoad();
                        }}
                    >
                        <i className="fas fa-user-friends"></i> ข่าวสารที่ปักหมุด
                        </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={Activetab}>
                <TabPane tabId="tabNews">
                    <div className="form-row">
                        <div className="col-auto ml-auto">
                            <div className="form-row">
                                <div className="col-auto">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="ค้นหาจากชื่อกลุ่ม"
                                            onChange={(e) =>
                                                SetTxtSearch({
                                                    ...txtSearch,
                                                    stxtSearch: e.target.value,
                                                })
                                            }
                                            onKeyPress={(e) => {
                                                e.key === "Enter" && SearchData();
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="form-group">
                                        <select
                                            className="custom-select form-control"
                                            onChange={(e) => {
                                                SetTxtSearch({
                                                    ...txtSearch,
                                                    sIsActive: e.target.value,
                                                });
                                            }}
                                        >
                                            <option value="">สถานะ</option>
                                            <option value="1">ใช้งาน</option>
                                            <option value="2">ไม่ใช้งาน</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() => SearchData()}
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <CreateTable
                            Header={News_header}
                            ItemData={lstDataRow}
                            CreateDataRow={News_CreateDataRow}
                            IsHasBtnDEL={true}
                            onBtnDelClick={News_onDeleteClick}
                            onClickHeadCB={News_onClickHeadCB}
                            rowSelected={News_rowSelected}
                        />
                    </div>
                </TabPane>
                <TabPane tabId="tabNewspin">
                    <div className="row mt-1">
                        <CreateTable
                            Header={Pins_header}
                            ItemData={lstDataRowPins}
                            CreateDataRow={Pins_CreateDataRow}
                            IsHasBtnDEL={true}
                            onBtnDelClick={Pins_onDeleteClick}
                            onClickHeadCB={Pins_onClickHeadCB}
                            rowSelected={Pins_rowSelected}
                        />
                    </div>
                </TabPane>
            </TabContent>
        </Fragment >
    );
};
export default T_New;

