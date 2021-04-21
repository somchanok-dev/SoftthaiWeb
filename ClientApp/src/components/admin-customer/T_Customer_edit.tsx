import React, { Fragment, useEffect, useState } from 'react';
import '../_Layout-Admin/MP_Back';
import { parse } from "query-string"
import { BoxMsg, Decrypt, DialogConfirm, Responsestart, Sweetalert } from '../Systems/SystemComponent';
import { useHistory } from 'react-router';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import Fileuploader, { Extension } from "../Fileuploader";
import { AvForm, AvField, AvRadioGroup, AvRadio, AvGroup } from 'availity-reactstrap-validation';
import { FormGroup, Label, CustomInput, InputGroupAddon, InputGroupText, Button } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import { AxiosPostJson } from '../Service/Config/AxiosMethod';
import { Link } from 'react-router-dom';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "react-datepicker/dist/react-datepicker.css";
const Controller = 'api/Customer';

const T_Customer_edit = (props: any) => {
    var { nID, sMode } = parse(window.location.search);
    nID = nID && Decrypt(nID)
    sMode = sMode && Decrypt(sMode)
    const [fileList, setFileList] = React.useState([] as any);
    const [cfile, setLstData_File] = useState({} as any);
    const [cTitleName, setTitleName] = useState("");
    const [cDescription, setDescription] = useState("");
    const [cChangeradio, setChangeradio] = useState("1");
    const [isDisplay, setIsDisplay] = useState("None");
    const history = useHistory();



    const CheckUser = () => {
        const tokenUser = localStorage.getItem("softhaiWebJWTKey");
        if (!tokenUser) {
            window.location.href = "/admin-login"
        }
        return true;
    }

    const [sFilePath, setFilePath] = useState({
        sSystemFileName: "",
        sFileName: "",
        sFileSize: ""
    } as any);
    let File: any[] = [];

    useEffect(() => {

        if (CheckUser()) {
            if (sMode == "Edit") {
                GetDataOnPageLoad();
            }
        }
    }, []);

    const GetDataOnPageLoad = async () => {
        setIsDisplay("none");
        let result: any = await AxiosPostJson(Controller + "/Customer?nID=" + nID);

        setTitleName(result.data.sTitle);
        setDescription(result.data.sDesc);
        setChangeradio(result.data.isActive == true ? "1" : "0");

        setFileList(result.data.listFile)
    };

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

    const onSave = (values: any) => {
        if (fileList.length != 0) {
            let data = {
                nID: nID,
                TitleName: values.cTitleName,
                sDesc: values.cDescription,
                isActive: values.cChangeradio == "1" ? true : false,
                file: fileList
            }
            DialogConfirm(async () => {
                let result: any = await AxiosPostJson(Controller + "/Savedata", data);
                if (result.data.sStatus === Responsestart.success) {
                    await LinkToListPage();
                    await Sweetalert.Success(BoxMsg.Title_Confirm, BoxMsg.Desc_Success_Save, null);

                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            }, null, BoxMsg.Title_Confirm, BoxMsg.Desc_Confirm_Save)
        } else {
            Sweetalert.Warning(BoxMsg.Title_Warning, "กรูณาอัพโหลดภาพประกอบ", null);
        }
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
    var onUploadFileSuccess = () => {
    }

    return (

        <Fragment>
            <AvForm onSubmit={onInvalidSubmit}>

                <div className="App">

                    <div className="form-group">
                        <div className="row">
                            <div className="col-12 col-sm-12 col-lg-12 col-xl-6">
                                <b>ชื่อโครงการ <span className="text-danger">•</span></b>
                                <AvField
                                    name="cTitleName"
                                    type="text"
                                    maxLength="250"
                                    errorMessage="กรุณาระบุชื่อบัญชีผู้ใช้งาน"
                                    value={cTitleName}
                                    validate={{
                                        required: { value: true },
                                    }}
                                />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                                <b>คำอธิบาย</b>
                                <AvField
                                    name="cDescription"
                                    type="textarea"
                                    errorMessage="กรุณาระบุชื่อบัญชีผู้ใช้งาน"
                                    value={cDescription}
                                    validate={{
                                        required: { value: false },
                                    }}

                                />
                            </div>

                        </div>
                        <div className="row">

                            <div className="col-12 col-sm-12 col-lg-12 col-xl-12">
                                <FormGroup>
                                    <b>ภาพประกอบ </b>
                                    <span className="text-danger">•</span><span className="text-muted small"> แนะนำขนาดรูปภาพ 1200 x 600 px</span>
                                    <Fileuploader
                                        limit="1"
                                        setFileList={setFileList}
                                        fileList={fileList}
                                        onComplete={onUploadFileSuccess}
                                        onRemoveComplete={onUploadFileSuccess}
                                        fileMaxSize="10"
                                        extensions={Extension.Image} />
                                </FormGroup>
                            </div>
                        </div>
                    </div>

                    <b className="form-check-b" >สถานะ <span className="text-danger">•</span></b>
                    <AvRadioGroup inline name="cChangeradio" required value={cChangeradio} >
                        <AvRadio label="&nbsp;ใช้งาน" value="1" id="inlineRadio1" />
                        <AvRadio label="&nbsp;ไม่ใช้งาน" value="0" id="inlineRadio2" />
                    </AvRadioGroup>
                    <ColoredLine color="#2196f3" />
                    <div className="form-row justify-content-between">
                        <div className="form-row justify-content-start">
                            <div className="col-auto">
                                <div className="form-group">
                                    <button type="button" className="btn btn-secondary" onClick={c => { history.push("/admin-Customer_list") }}>
                                        <i className="fas fa-times"></i> ยกเลิก</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-row justify-content-end">
                            <div className="col-auto">
                                <FormGroup>
                                    <Button className="btn btn-success">
                                        <i className="fas fa-save"> บันทึก</i>
                                    </Button>
                                </FormGroup>
                                <Link id={"LinkBackToList"} to="/admin-Customer_list" hidden ></Link>
                            </div>
                        </div>
                    </div>

                </div>
            </AvForm>
        </Fragment >

    );
};
export default T_Customer_edit;