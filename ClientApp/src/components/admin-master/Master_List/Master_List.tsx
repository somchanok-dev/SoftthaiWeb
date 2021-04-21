import React, { Fragment, useEffect, useState } from 'react';
import '../../_Layout-Admin/MP_Back.css';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { parse } from "query-string"
import { BoxMsg, Decrypt, DialogConfirm, DialogDelete, Encrypt, Responsestart, Sweetalert } from '../../Systems/SystemComponent';
import { AxiosGetJson, AxiosPostJson } from '../../Service/Config/AxiosMethod';
import CreateTable, { CellHeader } from '../../Systems/Table';
import { Badge, Button, CustomInput, FormGroup } from 'reactstrap';
import { count } from 'rxjs/src/operators';

const Controller = 'api/Master';

const Master_List = (props: any) => {
    var { type } = parse(window.location.search);
    const PnID_Type = Decrypt(type)
    const [lstDataRow, setLstDataRow] = React.useState([] as any);
    const [sName_Type, setsName_Type] = React.useState("");
    const [rowSelected, setRowSelected] = React.useState([] as any);
    const history = useHistory();
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

    React.useEffect(() => { if (CheckUser()) { GetDataOnPageLoad() } }, []);

    const GetDataOnPageLoad = async () => {
        let result: any = await AxiosPostJson(Controller + "/GetData_List?nID=" + PnID_Type);
        setLstDataRow(result.data.lstData);
        setsName_Type(result.data.sName_Type);
        let data = {
            L1: "ข้อมูลพื้นฐาน",
            pathL1: "/admin-master",
            L2: result.data.sName_Type,
            pathL2: "admin-Master-list/?type=" + type,
            L3: "",
            nID: "",
            PnID_Type: PnID_Type
        }
        props.Title(data)
    }
    const header: CellHeader[] = [
        {
            Sortby: "nID",
            SortType: Number,
            label: "",
            ClassName: "align-middle text-center",
            IsCheckBox: true,
            CSSStyle: { width: "2%" }
        },
        {
            Sortby: "nNo",
            SortType: Number,
            ClassName: "align-middle text-center text-nowrap",
            label: "ลำดับที่",
            CSSStyle: {
                width: 110
            }
        },
        {
            label: sName_Type,
            Sortby: "sName",
            SortType: String,
            ClassName: "align-middle",
        },

        {
            label: "สถานะ",
            Sortby: "",
            SortType: String,
            ClassName: "align-middle text-center",
        },
        {
            Sortby: "",
            SortType: false,
            label: <Button size="sm" color="#007bff" className="btn btn-primary btn-sm" type="button" onClick={() => { getLinkTo_Edit() }}><i className="fas fa-plus"></i></Button>,
            CSSStyle: { width: 1 },
            ClassName: "align-middle text-center",
        },
    ];
    var onSelectedRow = (id: number) => {
        setRowSelected([...rowSelected, id])
    }
    var onDeSelectedRow = (id: number) => {
        var index = rowSelected.indexOf(id)
        if (index !== -1) {
            rowSelected.splice(index, 1);
            setRowSelected([...rowSelected]);
        }
    }
    const getLinkToTNEW_datail = (id: number) => {
        let sTypeComponent = `/admin-Master-edit/`
        let nID_Mas = Encrypt(id)
        let nID_Type = Encrypt(PnID_Type)
        let sMode = Encrypt("Edit")
        let sPath = `${sTypeComponent}?nID=${nID_Mas}&&sMode=${sMode}&&type=${nID_Type}`
        history.push(sPath);
    }
    const getLinkTo_Edit = () => {
        let sTypeComponent = `/admin-Master-edit/`
        let sPath = `${sTypeComponent}?type=${type}`
        return history.push(sPath);
    }
    var onDeleteClick = () => {
        if (rowSelected.length > 0) {
            var data = {
                nID: rowSelected
            };
            DialogDelete(async () => {
                let result: any = await AxiosPostJson(Controller + "/Del_datarow", data);
                if (result.data.status === Responsestart.success) {
                    GetDataOnPageLoad();
                    await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
                } else if (result.data.status === Responsestart.warning) {
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
    const SearchData = async () => {
        let data = { txtSearch: stxtSearch, IsActive: sIsActive, nTypeID: PnID_Type, }
        let result: any = await AxiosPostJson(Controller + "/Search_data", data);
        if (result.data.status === Responsestart.success) {
            setLstDataRow(result.data.lstData);
        } else if (result.data.status === Responsestart.warning) {
            Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
        } else {
            Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
        }
    };
    const ColoredLine = (color: any) => (<hr style={{ color: color, backgroundColor: color, height: 3, margin: '5% 0px 3%' }} />);
    const CreateDataRow = (o: any, i: any) => {
        return (
            <tr key={i}>
                {<td align="center"><CustomInput type="checkbox" id={`News_${o.nID}`} label={''}
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
                <td className="text-center">{o.nNo}</td>
                <td className="text-center">{o.sName}</td>
                <td className="text-center">
                    <Badge color={o.isActive === true ? "success" : "danger"} style={{ fontSize: 11 }}>
                        {o.isActive === true ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge >
                </td>
                <td className="text-center"><Button size="sm" className="btn btn-info btn-sm" type="button" onClick={() => { getLinkToTNEW_datail(o.nID) }}><i className="fas fa-pencil-alt"></i></Button></td>
            </tr>
        )
    }
    const getLinkTo_list = () => {
        let sTypeComponent = `/admin-Master`
        let sPath = `${sTypeComponent}`
        return history.push(sPath);
    }
    return (
        <Fragment>
            <div className="form-row">
                <div className="col-auto ml-auto">
                    <div className="form-row">
                        <div className="col-auto">
                            <div className="form-group">
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ค้นหาจากชื่อ"
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
            <ColoredLine color="#2196f3" />
            <div className="form-row justify-content-between">
                <div className="form-row justify-content-start">
                    <div className="col-auto">
                        <div className="form-group">
                            <button type="button" className="btn btn-secondary" onClick={c => { getLinkTo_list() }}>
                                <i className="fas fa-chevron-left"></i> ย้อนกลับ</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment >
    );
};
export default Master_List;

