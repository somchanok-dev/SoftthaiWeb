import React, { Fragment, useEffect, useState } from 'react';
import { parse } from "query-string"
import { AlertIcon, BoxMsg, Decrypt, DialogConfirm, Responsestart, Sweetalert } from '../Systems/SystemComponent';
import { useHistory } from 'react-router';
import "./T_New.css";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import Fileuploader, { Extension } from "../Fileuploader";
import { AvForm, AvField, AvRadioGroup, AvRadio, AvGroup } from "availity-reactstrap-validation";
import { FormGroup, Label, CustomInput, InputGroupAddon, InputGroupText, Button, Row } from 'reactstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosPostJson } from '../Service/Config/AxiosMethod';
import { Link } from 'react-router-dom';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "react-datepicker/dist/react-datepicker.css";
import locale_th from "date-fns/locale/th";

registerLocale("th", locale_th);

const Controller = 'api/T_New';

const T_New = (props: any) => {
    var { nID, sMode } = parse(window.location.search);
    nID = nID && Decrypt(nID)
    sMode = sMode && Decrypt(sMode)
    const [fileList, setFileList] = useState([] as any);
    const [fileTNewsFile, setfileTNewsFile] = useState([] as any);
    const [cDateStart, setDateStart] = useState(null as any);
    const [isDisplay, setIsDisplay] = useState("None");
    const [isimage, setIsimage] = useState("None");
    const [cTitleName, setTitleName] = useState("");
    const [cDescription, setDescription] = useState("");
    const [sContent, setContent] = useState("");
    const [IsisActive, setisActive] = useState("1");
    const [IsActive, setActive] = useState(true);
    const [IsCheck, setCheck] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const history = useHistory();



    let sHost = window.location.protocol + '//' + window.location.host + '/';


    var configs = {
        height: 110,
        placeholderText: "",
        imageUploadURL: process.env.REACT_APP_URL + 'api/UploadFileNews/uploadImage',
        videoUploadURL: process.env.REACT_APP_URL + 'api/UploadFileNews/uploadImage',
        key: "0BA3jA11B5C7C4A4D3aIVLEABVAYFKc2Cb1MYGH1g1NYVMiG5G4E3C3A1C8A6D4A3B4==",
        toolbarBottom: true,
        toolbarButtons: [
            'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|',
            'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|',
            'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-',
            'insertLink', 'insertImage', 'insertVideo', 'insertTable']
    }

    useEffect(() => {

        if (CheckUser()) {
            if (sMode == "Edit") {
                GetDataOnPageLoad();
            }
        }
    }, []);
    const CheckUser = () => {
        const tokenUser = localStorage.getItem("softhaiWebJWTKey");
        if (!tokenUser) {
            window.location.href = "/admin-login"
        }
        return true;
    }
    const GetDataOnPageLoad = async () => {
        setIsDisplay("none");
        let data = {
            nID: nID,
        }
        let result: any = await AxiosPostJson(Controller + "/Getdata_detail", data);
        setTitleName(result.data.sTitle);
        setDescription(result.data.sDesc);
        setContent(result.data.sContent);
        setDateStart(new Date(result.data.dPost));
        setisActive(result.data.isActive == true ? "1" : "0");
        setFileList(result.data.listFile)
        setfileTNewsFile(result.data.listTNewFile)
    }

    const onSave = (values: any) => {
        if (fileList.length != 0) {
            if (cDateStart != null) {


                let data = {
                    nID: nID,
                    DateStart: cDateStart,
                    TitleName: values.TitleName,
                    sDesc: values.cDescription,
                    isActive: values.IsisActive == "1" ? true : false,
                    sContent: sContent,
                    file: fileList,
                    fileTNewsFile: fileTNewsFile
                }
                DialogConfirm(async () => {
                    let result: any = await AxiosPostJson(Controller + "/Savedata", data);
                    if (result.data.sStatus === Responsestart.success) {
                        await LinkToListPage();
                        await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Save, null);
                    } else if (result.data.sStatus === Responsestart.warning) {
                        Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
                    } else {
                        Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                    }
                })
            }


        } else {
            Sweetalert.Warning(BoxMsg.Title_Warning, "กรุณาอัพโหลดภาพประกอบข่าว", null);
        }
    };
    const LinkToListPage = () => {
        let el = document.getElementById("LinkBackToList") as any
        el && el.click()
    }
    var onUploadFileSuccess = () => { }
    const onInvalidSubmit = (event: any, errors: [], values: any) => {
        if (errors.length == 0) onSave(values);
    };
    var handleModelChange = (model: any) => { setContent(model); }

    return (
        <AvForm onSubmit={onInvalidSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <b>ชื่อข่าว <span className="text-danger">•</span></b>
                        <AvField
                            name="TitleName"
                            type="text"
                            className="form-control"
                            errorMessage="กรุณาระบุชื่อข่าว"
                            value={cTitleName}
                            validate={{ required: { value: true }, maxLength: { value: 250 }, }}
                            onBlur={(v: { target: { value: React.SetStateAction<string>; }; }) => setTitleName(v.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <b>วันที่ประกาศ <span className="text-danger">•</span></b>
                        <AvGroup className="input-group" >
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><FontAwesomeIcon icon={['fas', 'calendar-alt']} /></InputGroupText>
                            </InputGroupAddon>
                            <DatePicker
                                name="txtSearcStartDate"
                                id="txtSearcStartDate"
                                className={`form-control ${isDisplay === "" ? "red-border" : ""}`}
                                dateFormat="dd/MM/yyyy"
                                locale="th"
                                autoComplete="off"
                                selected={cDateStart}
                                onChange={(date: any) => {
                                    setDateStart(date);
                                    date === null ? setIsDisplay("") : setIsDisplay("None");
                                }}

                            />
                            <span className="small text-danger" style={{ display: isDisplay }}>โปรดระบุวันที่ประกาศ</span>
                        </AvGroup>
                    </div>
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
                        maxLength={5000}
                        rows={4}
                        validate={{
                            required: { value: false },
                        }}

                    />
                </div>

            </div>

            <div className="form-group">
                <b>เนื้อหาข่าว</b>
                <FroalaEditor model={sContent} config={configs} onModelChange={handleModelChange} />
            </div>

            <div className="row">
                <div className="col-xl-6 col-md-8">
                    <div className="form-group">
                        <b>ภาพประกอบข่าว </b>
                        <span className="text-danger">•</span>{" "}
                        <span className="text-muted small">แนะนำขนาดรูปภาพ 1200 x 600 px</span>
                        <Fileuploader
                            limit="1"
                            setFileList={setFileList}
                            fileList={fileList}
                            onComplete={onUploadFileSuccess}
                            onRemoveComplete={onUploadFileSuccess}
                            fileMaxSize="10"
                            extensions={Extension.Image} />
                    </div>
                </div>
                <div className="col-xl-6 col-md-8">
                    <div className="form-group">
                        <b>อัลบั้มภาพ </b>
                        <span className="text-muted small">แนะนำขนาดรูปภาพ 1200 x 600 px (สามารถระบุได้มากกว่า 1 ไฟล์) </span>
                        <Fileuploader
                            setFileList={setfileTNewsFile}
                            fileList={fileTNewsFile}
                            onComplete={onUploadFileSuccess}
                            onRemoveComplete={onUploadFileSuccess}
                            fileMaxSize="10"
                            extensions={Extension.Image} />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <b className="form-check-b" >สถานะ <span className="text-danger">•</span></b>
                <AvRadioGroup inline name="IsisActive" required value={IsisActive}>
                    <AvRadio label="&nbsp;ใช้งาน" value="1" id="inlineRadio1" />
                    <AvRadio label="&nbsp;ไม่ใช้งาน" value="0" id="inlineRadio2" />
                </AvRadioGroup>
            </div>

            <hr />

            <div className="form-row justify-content-between">
                <div className="form-row justify-content-start">
                    <div className="col-auto">
                        <div className="form-group">
                            <button type="button" className="btn btn-secondary" onClick={c => { history.push("/admin-news") }}>
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

                            <Link id={"LinkBackToList"} to="/admin-news" hidden ></Link>
                        </div>
                    </div>
                </div>
            </div>
        </AvForm>
    );
};
export default T_New;