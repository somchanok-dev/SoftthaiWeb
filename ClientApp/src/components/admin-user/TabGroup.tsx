import React, { Fragment, useEffect, useState } from "react";
import "../_Layout-Admin/MP_Back.css";
import axios from "axios";
import { parse } from "query-string";
import {
    AvForm,
    AvField,
    AvRadioGroup,
    AvRadio,
    AvGroup,
} from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import {
    BoxMsg,
    DialogConfirm,
    Responsestart,
    Sweetalert,
} from "../Systems/SystemComponent";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import { Link } from "react-router-dom";
import CreateTable, { CellHeader } from "../Systems/Table";
import { count } from "console";

const Controller = "api/Userpermission";

const TabGroup = (props: any) => {
    const [data, setData] = useState({
        nID: 0,
        sName: "",
        IsActive: true,
    });
    const [lstPermission, setPermission] = useState([] as any);
    const { nID, sName, IsActive } = data;
    const history = useHistory();
    const [listAdminMenu, setlistAdminMenu] = useState([] as any);
    const [cChangeradio, setChangeradio] = useState("");
    console.log(cChangeradio);

    const EditData = async () => {
        var { nID } = parse(window.location.search);
        let result: any = await AxiosGetJson(
            Controller + "/EditDataAdminGroup?nID=" + nID
        );
        console.log("result", result);
        setPermission(result.lstPermission);
        if (result.lstdata.nID === 0) {
            setChangeradio("1");
        } else if (result.lstdata != null) {
            setData(result.lstdata);
            setChangeradio(result.lstdata.bStatus == true ? "1" : "0");
        }
    };

    useEffect(() => {
        EditData();
    }, []);
//   const onDataSubmit = (e, errors, values) => {
//     if (errors.length === 0) {
//       let data = {
//         nID: nID,
//         sName: sName,
//         IsActive: values.cChangeradio == "1" ? true : false,
//         lstPermission: lstPermission,
//         };
//         console.log("data", data)
//       DialogConfirm(async () => {
//         let result: any = await AxiosPostJson(
//           "api/Userpermission/SaveAdminGroup",
//           data
//         );
//         if (result.data.sStatus === Responsestart.success) {
//           await LinkToListPage();
//           await Sweetalert.Success(
//             BoxMsg.Title_Confirm,
//             BoxMsg.Desc_Success_Save,
//             null
//           );
//         } else if (result.data.sStatus === Responsestart.warning) {
//           Sweetalert.Warning(BoxMsg.Desc_Warning_Save, result.data.sMsg, null);
//         } else {
//           Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
//         }
//       });
//     } else {
//       Sweetalert.Warning(BoxMsg.Title_Warning, "", null);
//     }
//   };

    const onDataSubmit = (e, errors, values) => {
        if (errors.length === 0) {
            let data = {
                nID: nID,
                sName: sName,
                IsActive: values.cChangeradio == "1" ? true : false,
                lstPermission: lstPermission,
            };
            DialogConfirm(async () => {
                let result: any = await AxiosPostJson(
                    "api/Userpermission/SaveAdminGroup",
                    data
                );
                if (result.data.sStatus === Responsestart.success) {
                    await LinkToListPage();
                    await Sweetalert.Success(
                        BoxMsg.Title_Confirm,
                        BoxMsg.Desc_Success_Save,
                        null
                    );
                } else if (result.data.sStatus === Responsestart.warning) {
                    Sweetalert.Warning(BoxMsg.Desc_Warning_Save, result.data.sMsg, null);
                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            });
        } else {
            Sweetalert.Warning(BoxMsg.Title_Warning, "", null);
        }
    };

    const LinkToListPage = () => {
        let el = document.getElementById("LinkBackToList") as any;
        el && el.click();
    };

    let headerAdminMenu: CellHeader[] = [];
    headerAdminMenu.push(
        {
            Sortby: "",
            SortType: String,
            label: "ลำดับที่",
            Rowspan: 2,
            ClassName: "align-middle text-center text-nowrap",
            CSSStyle: { width: 110 },
        },
        {
            Sortby: "",
            label: "ชื่อเมนู",
            SortType: String,
            Rowspan: 2,
            ClassName: "align-middle",
        },
        {
            Sortby: "",
            label: "สิทธิการเข้าถึง",
            SortType: String,
            Colspan: 3,
            ClassName: "align-middle",
        }
    );
    const ChangeStart = () => {
        console.log("T1", lstPermission);
    };
    const CreateData = (o, i) => {
        return (
            <tr key={i}>
                <td className="align-middle text-center">{i + 1}</td>
                <td className="align-middle text-center">{o.sName}</td>
                <td className="align-middle text-center">
                    <AvRadioGroup
                        inline
                        name={"Radios_" + i}
                        value={o.nPermission}
                        onChange={(e) => {
                            o.nPermission = 1;
                            ChangeStart();
                        }}
                    >
                        <AvRadio value={1} id={"DisableID" + i} />
                    </AvRadioGroup>
                </td>
                <td className="align-middle text-center">
                    <AvRadioGroup
                        inline
                        name={"Radios_" + i}
                        value={o.nPermission}
                        onChange={(e) => {
                            o.nPermission = 2;
                            ChangeStart();
                        }}
                    >
                        <AvRadio value={2} id={"Read_onlyID" + i} />
                    </AvRadioGroup>
                </td>
                <td className="align-middle text-center">
                    <AvRadioGroup
                        inline
                        name={"Radios_" + i}
                        value={o.nPermission}
                        onChange={(e) => {
                            o.nPermission = 3;
                            ChangeStart();
                        }}
                    >
                        <AvRadio value={3} id={"EnableID" + i} />
                    </AvRadioGroup>
                </td>
            </tr>
        );
    };

    useEffect(() => {
        GetMenu();
    }, []);

    const GetMenu = async () => {
        let result: any = await AxiosGetJson("Userpermission/getListUserMenu");
        setlistAdminMenu(result.lstAdminMenu);
    };

    return (
        <Fragment>
            <AvForm onSubmit={onDataSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                <b>ชื่อกลุ่ม</b>
                            </label>{" "}
                            <span className="text-danger">•</span>&nbsp;
              <AvField
                                type="text"
                                name="text"
                                errorMessage="กรุณาระบุชื่อกลุ่ม"
                                validate={{
                                    required: { value: true },
                                    maxLength: { value: 250 },
                                }}
                                onChange={(e: { target: { value: any } }) => {
                                    setData({ ...data, sName: e.target.value });
                                }}
                                value={data.sName}
                            ></AvField>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-auto">
                        <label>
                            <b>สิทธิการใช้งานระบบ</b>
                        </label>{" "}
                        <span className="text-danger">•</span>
                    </div>
                </div>
                <div className="row mt-1">
                    <CreateTable
                        Header={headerAdminMenu}
                        ItemData={lstPermission}
                        CreateDataRow={CreateData}
                        Header2="4"
                    />
                </div>
                <div className="row">
                    <div className="col-auto">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-auto">
                                    <label>
                                        <b>สถานะ</b>
                                    </label>{" "}
                                    <span className="text-danger">•</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-auto">
                                    <AvRadioGroup
                                        inline
                                        name="cChangeradio"
                                        required
                                        value={cChangeradio}
                                    >
                                        <AvRadio label="&nbsp;ใช้งาน" value="1" id="inlineRadio1" />
                                        <AvRadio
                                            label="&nbsp;ไม่ใช้งาน"
                                            value="0"
                                            id="inlineRadio2"
                                        />
                                    </AvRadioGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="form-row justify-content-between">
                    <div className="form-row justify-content-start">
                        <div className="col-auto">
                            <div className="form-group">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={(c) => {
                                        history.push("/admin-user");
                                    }}
                                >
                                    <i className="fas fa-times"></i> ยกเลิก
                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-row justify-content-end">
                        <div className="col-auto">
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                //onClick={onDataSubmit}
                                >
                                    <i className="fas fa-save"></i> บันทึก
                </button>
                                <Link id={"LinkBackToList"} to="/admin-user" hidden></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AvForm>
        </Fragment>
    );
};
export default TabGroup;
