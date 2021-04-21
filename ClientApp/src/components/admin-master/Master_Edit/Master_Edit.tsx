import React, { Fragment, useEffect, useMemo, useState } from 'react';
import '../../_Layout-Admin/MP_Back.css';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { BoxMsg, Decrypt, DialogConfirm, Responsestart, Sweetalert } from '../../Systems/SystemComponent';
import { parse } from "query-string"
import { AvForm, AvField, AvRadioGroup, AvRadio, AvGroup } from "availity-reactstrap-validation";
import { Button, FormGroup } from 'reactstrap';
import { AxiosPostJson } from '../../Service/Config/AxiosMethod';

const Controller = 'api/Master';

const Master_Edit = (props: any) => {
    var { nID, type, sMode } = parse(window.location.search);
    const nID_edit = Decrypt(nID)
    const sMode_edit = Decrypt(sMode)
    const PnID_Type = Decrypt(type)
    const [sName, setsName] = useState("");
    const [sNameTatal, setsNameTatal] = useState("");
    const [Active, setisActive] = useState(true);
    const [lstDataRow, setLstDataRow] = useState([] as any);
    const history = useHistory();
    const CheckUser = () => {
        const tokenUser = localStorage.getItem("softhaiWebJWTKey");
        if (!tokenUser) {
            window.location.href = "/admin-login"
        }
        return true;
    }
    const ColoredLine = (color: any) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 3,
                margin: '5% 0px 3%'
            }}
        />
    );
    useMemo(() => {
        let lstdata;
        if (sMode_edit === "Edit") {
            lstdata = {
                L1: "ข้อมูลพื้นฐาน",
                pathL1: "/admin-master",
                L2: sNameTatal,
                pathL2: "admin-Master-list/?type=" + type,
                L3: "แก้ไขข้อมูล",
                pathL3: "admin-Master-edit/?nID=" + nID + "&&sMode=" + sMode + "&&type=" + type,
                nID: nID_edit,
                PnID_Type: PnID_Type
            }

        } else {
            lstdata = {
                L1: "ข้อมูลพื้นฐาน",
                pathL1: "/admin-master",
                L2: sNameTatal,
                pathL2: "",
                L3: "เพิ่มข้อมูล",
                pathL3: "admin-Master-edit/?type=" + type,
                nID: nID_edit,
                PnID_Type: PnID_Type
            }
        }
        props.Title(lstdata); }, [sNameTatal]);
    useEffect(() => {
        if (CheckUser()) {
             GetDataOnPageLoad();
        }
    }, []);
    const GetDataOnPageLoad = async () => {
        let data = {
            nID: nID_edit || 0,
            PnID_Type: +PnID_Type,
        }
        let result: any = await AxiosPostJson(Controller + "/GetData_Edit", data);
        setsNameTatal(result.data.sName_Type);
        setsName(result.data.lstData[0].sName)
        setisActive(result.data.lstData[0].isActive)
    }
    const onSave = (values: any) => {
        let data = {
            nID: nID_edit,
            isActive: values.isActive == "0" ? true : false,
            sName: values.sName,
            nTypeID: PnID_Type,
        }
        console.log("data", data);
        DialogConfirm(async () => {
            let result: any = await AxiosPostJson(Controller + "/Savedata", data);

            if (result.data.status === Responsestart.success) {
                await LinkToListPage();
                await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Save, null);
            } else if (result.data.status === Responsestart.warning) {
                Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
            } else {
                Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
            }
        })

    };
    const LinkToListPage = () => {
        let el = document.getElementById("LinkBackToList") as any
        el && el.click()
    }
    const onInvalidSubmit = (event: any, errors: [], values: any) => {
        if (errors.length == 0) {
            onSave(values);
        }
    };
    const getLinkTo_list = () => {
        let sTypeComponent = `/admin-Master-list/`
        let sPath = `${sTypeComponent}?type=${type}`
        return history.push(sPath);
    }
    return (
        <Fragment>
            <AvForm onSubmit={onInvalidSubmit}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-lg-12 col-xl-6">
                            <b>{sNameTatal}<span className="text-danger">•</span></b>
                            <AvField
                                name="sName"
                                type="text"
                                className="form-control"
                                errorMessage="กรุณาระบุชื่อ"
                                maxLength="250"
                                value={sName}
                                validate={{
                                    required: { value: true },
                                }}
                                onBlur={(v: { target: { value: React.SetStateAction<string>; }; }) => setsName(v.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <b className="form-check-b" >สถานะ <span className="text-danger">•</span></b>
                    <AvRadioGroup inline name="isActive" required value={Active ? "0" : "1"} >
                        <AvRadio label=" ใช้งาน" value="0" id="inlineRadio1" />
                        <AvRadio label=" ไม่ใช้งาน" value="1" id="inlineRadio2" />
                    </AvRadioGroup>
                </div>
                <ColoredLine color="#2196f3" />
                <div className="form-row justify-content-between">
                    <div className="form-row justify-content-start">
                        <div className="col-auto">
                            <div className="form-group">
                                <button type="button" className="btn btn-secondary" onClick={c => { getLinkTo_list() }}>
                                    <i className="fas fa-times"></i> ยกเลิก</button>
                            </div>
                        </div>
                    </div>
                    <div className="form-row justify-content-end">
                        <div className="col-auto">
                            <div className="form-group">
                                <FormGroup>
                                    <Button className="btn btn-success"><i className="fas fa-save"></i> บันทึก</Button>
                                </FormGroup>

                                <Link id={"LinkBackToList"} to={`/admin-Master-list/?type=${type}`} hidden ></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AvForm>
        </Fragment >
    );
};
export default Master_Edit;

