import React, { Fragment, useEffect, useState } from "react";
import { Button, CustomInput, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane, } from "reactstrap";
import { Badge } from "reactstrap";
import "../_Layout-Admin/MP_Back.css";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import moment from 'moment';
import { BoxMsg, DialogDelete, Encrypt, Responsestart, Sweetalert, TooltipsMSG, } from "../Systems/SystemComponent";
import CreateTable, { CellHeader } from "../Systems/Table";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import { List } from 'linqts';

const Content_list = (props: any) => {
    const history = useHistory();
    const [Activetab, setActivetab] = useState("tabgroup");
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [listAdminInfo, setlistAdminInfo] = useState([] as any);
    const [listMain, setlistMain] = useState([] as any);
    const [listPanel, setlistPanel] = useState([] as any);
    const [RowSelected, setRowSelected] = useState([] as any);
    const [setOrder, setRowOrder] = useState([] as any);
    const [data, setData] = useState({ nID: "", nGroup_ID: "", sEmpCode: "", sUsername: "", sName: "", sEmail: "", sPassword: "", IsActive: true, });
    const [txtSearch, SetTxtSearch] = React.useState({ stxtSearch: "", sIsActive: "", });
    const [textSearch, SetTextSearch] = React.useState({ stextSearch: "", txtGroupSearch: "", sisActive: "", });

    const Controller = 'api/Content/';

    const CheckUser = () => {
        const tokenUser = localStorage.getItem("softhaiWebJWTKey");
        if (!tokenUser) {
            window.location.href = "/admin-login";
        }
        return true;
    };

    useEffect(() => {
        if (CheckUser()) {
            GetDataOnTabAdminLoad();
            GetDataPathLoad();
        }
    }, []);

    const GetDataPathLoad = async () => {
        let result: any = await AxiosGetJson(Controller + "lstContentdata");
        console.log("result",result)
        setlistMain(result.lstMenu);
        setlistPanel(result.lstPanel);

    };

    const GetDataOnTabAdminLoad = async () => {

    };

    const SearchData = async () => {

    };

    const SearchDataAdminInfo = async () => {

    };

    const onDeleteAdminGroup = () => {
        if (RowSelected.length > 0) {
            DialogDelete(async () => {
                var str = RowSelected.toString();
                let result: any = await AxiosPostJson(Controller + "DeleteAdminGroup");
                if (result.data.sStatus === Responsestart.success) {
                    await Sweetalert.Success(BoxMsg.Desc_Success_Delete, "", null);
                    GetDataPathLoad();
                } else if (result.data.sStatus === Responsestart.warning) {
                    Sweetalert.Warning(
                        BoxMsg.Desc_Warning_Delete,
                        result.data.sMsg,
                        null
                    );
                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            });
        }
    };

    const onDeleteAdminInfo = () => {
        if (RowSelected.length > 0) {
            DialogDelete(async () => {
                var str = RowSelected.toString();
                let result: any = await AxiosPostJson("Userpermission/DeleteAdminInfo?str=" + str
                );
                if (result.data.sStatus === Responsestart.success) {
                    await Sweetalert.Success(BoxMsg.Desc_Success_Delete, "", null);
                    GetDataOnTabAdminLoad();
                } else if (result.data.sStatus === Responsestart.warning) {
                    Sweetalert.Warning(
                        BoxMsg.Desc_Warning_Delete,
                        result.data.sMsg,
                        null
                    );
                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            });
        }
    };

    var onDataSubmitAdminGroup = async (e: any, errors: string | any[]) => {

    };

    var onDataSubmitAdminInfo = async (e: any, errors: string | any[]) => {

    };

    var onClickHeadCB = (e: any, currentData: any) => {
        let el = e.target;
        let dataSelect = el.checked
            ? currentData === null
                ? []
                : currentData.map((x: any) => x.nID)
            : [];
        setRowSelected(dataSelect);
    };
    var onSelectedRow = (id: number) => {
        setRowSelected([...RowSelected, id]);
    };

    var onDeSelectedRow = (id: number) => {
        var index = RowSelected.indexOf(id);
        if (index !== -1) {
            RowSelected.splice(index, 1);
            setRowSelected([...RowSelected]);
        }
    };
    const FilterPanel = (nID) => {

    }
    const headerMainmenu: CellHeader[] = [
        { Sortby: "", SortType: Number, label: "", ClassName: "align-middle text-center", IsCheckBox: true, CSSStyle: { width: 1 }, },
        { Sortby: "nRunning", SortType: Number, label: "ลำดับที่", ClassName: "align-middle text-center text-nowrap", CSSStyle: { width: 110 }, },
        { label: "ชื่อเมนู", SortType: String, Sortby: "sName", ClassName: "align-middle", },
        { label: "จำนวน Panel", Sortby: "nPanel", ClassName: "align-middle", SortType: Number, },
        { label: "สถานะ", Sortby: "", ClassName: "align-middle text-center", SortType: String, },
        { Sortby: "", SortType: false, label: "", ClassName: "align-middle text-center", CSSStyle: { width: 1 }, },
    ];
    const getLinkToTNEW_datail = (id: number) => {
        let sTypeComponent = `admin-user_group-edit/`
        let sPath = `${sTypeComponent}?nID=${id}`
        history.push(sPath);
    }
    const CreateDataAdminGroupRow = (o: any, i: any) => {
        return (
            <tr key={i}>
                {
                    <td className="align-middle text-center">
                        <CustomInput
                            type="checkbox"
                            id={`cbBody_${o.nID}`}
                            label={""}
                            onChange={(e: any) => {
                                let el = e.target;
                                if (el.checked) {
                                    onSelectedRow(o.nID);
                                } else {
                                    onDeSelectedRow(o.nID);
                                }
                            }}
                            checked={RowSelected.indexOf(o.nID) !== -1}
                        />
                    </td>
                }
                <td className="align-middle text-center">{o.nRunning}</td>
                <td className="align-middle">{o.sName}</td>
                <td className="align-middle text-center">{o.nPanel}</td>

                <td className="align-middle text-center">
                    <Badge color={o.isActive === true ? "success" : "danger"} style={{ fontSize: 11 }}>
                        {o.isActive === true ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge >
                </td>
                <td className="align-middle text-center"><Button size="sm" className="btn btn-info btn-sm" type="button" onClick={() => { getLinkToTNEW_datail(o.nID); }}><i className="fas fa-pencil-alt"></i></Button></td>
            </tr>
        );
    };

    const headerContent: CellHeader[] = [
        { Sortby: "", SortType: Number, label: "", ClassName: "align-middle text-center", IsCheckBox: true, CSSStyle: { width: 1 }, },
        { label: "ลำดับที่",Sortby: "", SortType: Number,  ClassName: "align-middle text-center text-nowrap", CSSStyle: { width: 110 }, },
        { label: "ลำดับที่",Sortby: "", SortType: Number,  ClassName: "align-middle text-center text-nowrap", CSSStyle: { width: 110 }, },
        { label: "ชื่อ Panel", Sortby: "nGroup", ClassName: "align-middle", SortType: Number, },
        { label: "สถานะ", Sortby: "", ClassName: "align-middle text-center", SortType: String, },
        { label: "วันที่ปรับปรุงล่าสุด", Sortby: "", ClassName: "align-middle text-center", SortType: String, },
        { Sortby: "", SortType: false, label: "", ClassName: "align-middle text-center", CSSStyle: { width: 1 }, },
    ];
    const getLinkToPage = (nMainMenuID, nPanel, sURL_AdjustPage) => {
        let sTypeComponent = "/"+sURL_AdjustPage;
        let sPath = `${sTypeComponent}?nMainMenuID=${nMainMenuID}&&nPanel=${nPanel}`
        history.push(sPath);
    }
    const Changepassword = (e, errors, values) => {
        console.log("values", values)
    }
    const Changepassword_api = () => {
        console.log("values")
    }
    const SetOrder = async (val) => {
        console.log("val", val)

    }
    const CreateDataAdminInfoRow = (o: any, i: any) => {
        return (
            <tr key={i}>
                {
                    <td className="align-middle text-center">
                        <CustomInput
                            type="checkbox"
                            id={`cbBody_${o.nID}`}
                            label={""}
                            onChange={(e: any) => {
                                let el = e.target;
                                if (el.checked) {
                                    onSelectedRow(o.nID);
                                } else {
                                    onDeSelectedRow(o.nID);
                                }
                            }}
                            checked={RowSelected.indexOf(o.nID) !== -1}
                        />
                    </td>
                }
                <td className="align-middle text-center">{o.nRunning}</td>
                <select className="form-control" name="nOrder" id="nOrder" defaultValue={o.nOrder != null ? o.nOrder : "1"}
                    onChange={(e: any) => SetOrder(e.target.value)}>
                    {

                        listPanel.map((o, i) => {
                            console.log("o",o)
                            return (
                                <option id={"op_" + i} value={o.nOrder} className="dropdown-item" >{o.nOrder}</option>
                            );
                        })
                    }
                    <option value={o.nOrder} className="dropdown-item" >{o.nOrder}</option>

                </select>
                <td className="align-middle">{o.sName}</td>
               
                <td className="align-middle text-center">
                    <Badge color={o.isActive === true ? "success" : "danger"} style={{ fontSize: 11 }}>
                        {o.isActive === true ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge >
                </td>
                <td className="align-middle text-center">{o.dUpdate != null ? moment(o.dUpdate).format("DD/MM/YYYY") : "-"} </td>
                <td className="align-middle text-center"><Button size="sm" className="btn btn-info btn-sm" type="button" onClick={() => { getLinkToPage(o.nMainMenuID, o.nPanel, o.sURL_AdjustPage); }}><i className="fas fa-pencil-alt"></i></Button></td>


            </tr>
        );
    };

    return (
        <Fragment>
            <Nav className="nav nav-tabs navTabList" role="tablist">
                <NavItem>
                    <NavLink
                        className={Activetab === "tabgroup" ? "active" : ""}
                        onClick={() => {
                            setActivetab("tabgroup");
                        }}
                    >
                        <i className="fas fa-users-cog"></i> เมนูหลัก
          </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={Activetab === "tabadmin" ? "active" : ""}
                        onClick={() => {
                            setActivetab("tabadmin");
                        }}
                    >
                        <i className="fas fa-user-friends"></i> เนื้อหาและบทความ
          </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={Activetab}>
                <TabPane tabId="tabgroup">
                    <AvForm onSubmit={onDataSubmitAdminGroup}>
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
                                Header={headerMainmenu}
                                ItemData={listMain}
                                CreateDataRow={CreateDataAdminGroupRow}
                                IsHasBtnDEL={true}
                                onBtnDelClick={onDeleteAdminGroup}
                                onClickHeadCB={onClickHeadCB}
                                rowSelected={RowSelected}
                            />
                        </div>
                    </AvForm>
                </TabPane>

                <TabPane tabId="tabadmin">
                    <AvForm onSubmit={onDataSubmitAdminInfo}>
                        <div className="form-row">
                            <div className="col-auto ml-auto">
                                <div className="form-row">
                                    <div className="col-md">
                                        <div className="form-group">
                                            <select
                                                className="custom-select form-control"
                                                onChange={(e) => {
                                                    SetTextSearch({
                                                        ...textSearch,
                                                        txtGroupSearch: e.target.value,
                                                    });
                                                }}
                                            >
                                                <option value="">กลุ่ม</option>
                                                <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                                                <option value="superadmin">superadmin</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="ค้นหาจากชื่อผู้ใช้งาน, ชื่อ-สกุล"
                                                onChange={(e) =>
                                                    SetTextSearch({
                                                        ...textSearch,
                                                        stextSearch: e.target.value,
                                                    })
                                                }
                                                onKeyPress={(e) => {
                                                    e.key === "Enter" && SearchDataAdminInfo();
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <div className="form-group">
                                            <select
                                                className="custom-select form-control"
                                                onChange={(e) => {
                                                    SetTextSearch({
                                                        ...textSearch,
                                                        sisActive: e.target.value,
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
                                                onClick={() => SearchDataAdminInfo()}
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
                                Header={headerContent}
                                ItemData={listPanel}
                                CreateDataRow={CreateDataAdminInfoRow}
                                IsHasBtnDEL={true}
                                onBtnDelClick={onDeleteAdminInfo}
                                onClickHeadCB={onClickHeadCB}
                                rowSelected={RowSelected}
                            />
                        </div>
                    </AvForm>
                </TabPane>
            </TabContent>
        </Fragment>
    );
};
export default Content_list;
