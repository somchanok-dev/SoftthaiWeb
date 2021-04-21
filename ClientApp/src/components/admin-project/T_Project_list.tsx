import React, { Fragment, useEffect, useState } from 'react';
import '../_Layout-Admin/MP_Back.css';
import { FilesUploadComponent } from './FilesUploadComponent'
import { Badge, Button, CustomInput, Dropdown, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import axios from 'axios';
import { AlertIcon, BoxMsg, DialogConfirm, DialogDelete, Encrypt, Responsestart, Sweetalert, TooltipsMSG } from '../Systems/SystemComponent';
import { useHistory } from 'react-router';
import CreateTable, { CellHeader } from '../Systems/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosGetJson, AxiosPostJson } from '../Service/Config/AxiosMethod';
import { Box, Pin, PinFill } from 'react-bootstrap-icons';
import Select from 'react-select'
import moment from 'moment';

const Controller = 'api/T_Project';

const T_Project = () => {

    const [lstDataRow, setLstDataRow] = useState([] as any);
    const history = useHistory();
    const [ncurrentpage, setcurrentpage] = useState(0);
    const [rowSelected, setRowSelected] = useState([] as any);
    const [Activetab, setActivetab] = useState("tabProject");
    const [lstDataRowPins, setLstDataRowPins] = useState([] as any);
    const [Pins_rowSelected, setPins_RowSelected] = useState([] as any);
    const [lstDropdownPins, setDropdownPins] = useState([] as any);
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

    var onSelectedRow = (id: number) => {
        setRowSelected([...rowSelected, id])
    }



    useEffect(() => {
        if (CheckUser()) {
            GetDataOnPageLoad();
            GetDataOnPagePinLoad()
        }
    }, []);

    const getLinkToTProject_datail = (id: number) => {
        let sTypeComponent = `admin-project-edit/`
        let nID = Encrypt(id)
        let sMode = Encrypt("Edit")
        let sPath = `${sTypeComponent}?nID=${nID}&&sMode=${sMode}`
        history.push(sPath);
    }

    const GetDataOnPageLoad = async () => {
        let result: any = await AxiosGetJson(Controller + "/T_Project_list");
        setLstDataRow(result);

    };

    const SearchData = async () => {
        let result: any = await AxiosGetJson(Controller + "/SearchTProjectbyTitle?txtSearch=" + stxtSearch + "&sIsActive=" + sIsActive);
        setLstDataRow(result);
    };


    const GetDataOnPagePinLoad = async () => {
        let result: any = await AxiosGetJson(Controller + "/GetPinlstdata");
        setLstDataRowPins(result.lstData)


    }


    const onDeSelectedRow = (id: number) => {
        const index = rowSelected.indexOf(id)
        if (index !== -1) {
            rowSelected.splice(index, 1);
            setRowSelected([...rowSelected]);
        }
    }



    const Use_Projectspin = async (nID: number, inx: number) => {
        var lstpin: any = [...lstDataRow];
        lstpin[inx].isPin = !lstpin[inx].isPin;

        DialogConfirm(async () => {
            let result: any = await AxiosPostJson(Controller + "/Change_Pins", lstDataRow[inx]);
            if (result.data.sStatus === Responsestart.success) {
                GetDataOnPageLoad()
                GetDataOnPagePinLoad()         
                await Sweetalert.Success(BoxMsg.Title_Success, lstDataRow[inx].isPin == true ? "ปักหมุดข้อมูลเรียบร้อย" : "เอาปักหมุดออกเรียบร้อย", null);
            } else if (result.data.sStatus === Responsestart.warning) {
                Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
            } else {
                Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
            }
        }, "", "", lstDataRow[inx].isPin == true ? "ท่านต้องการปักหมุดข้อมูลหรือไม่?" : "ท่านต้องการเอาปักหมุดออกหรือไม่?")
        GetDataOnPageLoad();
        GetDataOnPagePinLoad()

    }


    const CreateDataRow = (o: any, i: any) => {
        const spanStatus = (status: any) => { return <span className={`text-${status === "Active" ? "success" : "danger"}`}>{status}</span> }
        return (
            <tr key={i}>
                {
                    <td align='center'><CustomInput type='checkbox' id={`cbBody_${o.nID}`} label={''}
                        onChange={(e: any) => {
                            let el = e.target
                            if (el.checked) {
                                onSelectedRow(o.nID)
                            } else {
                                onDeSelectedRow(o.nID)
                            }
                        }}
                        checked={rowSelected.indexOf(o.nID) !== -1}
                    /></td>
                }
                <td className="text-center">{i + 1}</td>
                <td >{o.sTitle}</td>
                <td className="text-center">
                    <Badge color={o.isActive === true ? "success" : "danger"}>
                        {o.isActive === true ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge >
                </td>

                {
                    o.isActive ?
                        <td className="text-center">
                            <Button size="sm" id={`bt_${o.nID}`} color="link" type="button" onClick={(e: any) => { Use_Projectspin(o.nID, i) }}>
                                {o.isPin === true ? <PinFill /> : <Pin style={{ transform: "rotate(45deg)" }} />}
                            </Button></td>
                        : <td className="text-center"></td>
                }
                <td className="text-center">
                    <Button size="sm" className="btn btn-info btn-sm" type="button" onClick={() => { getLinkToTProject_datail(o.nID); }}><i className="fas fa-pencil-alt"></i></Button>
                </td>

            </tr>
        )
    }

    const header: CellHeader[] = [
        {
            Sortby: "nID",
            SortType: Number,
            label: "",
            IsCheckBox: true,
            CSSStyle: { width: 1 }
        },
        {
            Sortby: "",
            SortType: "",
            label: "ลำดับที่",
            ClassName: "text-nowrap",
            CSSStyle: { width: 110 }
        },
        {
            label: "ชื่อโครงการ",
            Sortby: "sTitle",
            SortType: String,
        },
        {
            label: "สถานะ",
            Sortby: "",
            SortType: String,
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
            label: <Button size="sm" color="#007bff" className="btn btn-primary btn-sm" type="button" data-tip={TooltipsMSG.Add}
                onClick={() => { history.push("/admin-project-edit") }}>
                <FontAwesomeIcon icon={['fas', 'plus']} /></Button>,
            CSSStyle: { width: 1 }
        },
    ];




    const objOrder = [
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
        }
    ];



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
            CSSStyle: { width: "5%" }
        },
        {
            label: "ชื่อโครงการ",
            Sortby: "sTitle",
            SortType: String,
            CSSStyle: { width: "6%" }
        },
        {
            label: "สถานะ",
            Sortby: "",
            SortType: "",
            CSSStyle: { width: "4%" }
        }
    ];



    const onDeleteClick = () => {
        if (rowSelected.length > 0) {
            let data = {
                nID: rowSelected
            };
            DialogDelete(async () => {
                let result: any = await AxiosPostJson(Controller + "/Del_T_Project", data);
                if (result.data.sStatus === Responsestart.success) {
                    GetDataOnPageLoad();
                    await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
                } else if (result.data.sStatus === Responsestart.warning) {
                    Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            })
        }
    }


    var onClickHeadCB = (e: any, currentData: any) => {
        let el = e.target;
        let dataSelect = el.checked ? (currentData === null ? [] : currentData.map((x: any) => x.nID)) : [];
        setRowSelected(dataSelect);
    }





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
                    <select className="form-control" name="nOrder" id="nOrder" value={o.nOrder != null ? o.nOrder.toString() : "1"}
                        onChange={(e: any) => SetOrder(e.target.value, o.nID)}>
                        {

                            lstDataRowPins.map((p) => {
                            return (
                                <option value={p.nOrder} className="dropdown-item" >{p.nOrder}</option>
                            )})
                        }


                    </select>
                </td>
                <td className="text-center">{o.sTitle}</td>
                <td className="text-center">{moment(o.dPost).format("DD/MM/YYYY")}</td>
            </tr>
        )
    }


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




    var Pins_onDeleteClick = () => {
        if (Pins_rowSelected.length > 0) {
            var data = {
                nID: Pins_rowSelected
            };
            DialogConfirm(async () => {
                let result: any = await AxiosPostJson(Controller + "/Del_datarowPins", data);
                if (result.data.sStatus === Responsestart.success) {
                    GetDataOnPagePinLoad();
                    GetDataOnPageLoad();
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


    return (

        <Fragment>
            <Nav className="nav nav-tabs navTabList" role="tablist">
                <NavItem>
                    <NavLink
                        className={Activetab === "tabProject" ? "active" : ""}
                        onClick={() => {
                            setActivetab("tabProject");
                            GetDataOnPageLoad();
                            GetDataOnPagePinLoad();
                        }}
                    >
                        <i className="fas fa-users-cog"></i> จัดการข้อมูลโครงการ
                        </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={Activetab === "tabProjectpin" ? "active" : ""}
                        onClick={() => {
                            setActivetab("tabProjectpin");
                            GetDataOnPageLoad();
                            GetDataOnPagePinLoad();
                        }}
                    >
                        <i className="fas fa-user-friends"></i> โครงการที่ปักหมุด
                        </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={Activetab}>
                <TabPane tabId="tabProject">
                    <div className="form-row">
                        <div className="col-auto ml-auto">
                            <div className="form-row">
                                <div className="col-auto">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="ค้นหาจากชื่อโครงการ"
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
                            Header={header}
                            ItemData={lstDataRow}
                            CreateDataRow={CreateDataRow}
                            IsHasBtnDEL={true}
                            onBtnDelClick={onDeleteClick}
                            onClickHeadCB={onClickHeadCB}
                            rowSelected={rowSelected}
                        />
                    </div>
                </TabPane>
                <TabPane tabId="tabProjectpin">
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
        </Fragment>







    );
};
export default T_Project;