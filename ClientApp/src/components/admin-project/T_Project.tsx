import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import '../_Layout-Admin/MP_Back';
import { FilesUploadComponent } from '../admin-project/FilesUploadComponent';
import { parse } from 'query-string';
import { useHistory } from 'react-router';
import { AlertIcon, BoxMsg, Decrypt, DialogConfirm, Responsestart, Sweetalert } from '../Systems/SystemComponent';
import { AvForm, AvField, AvRadioGroup, AvRadio } from "availity-reactstrap-validation";
import { Button, FormGroup, Label } from 'reactstrap';
import Fileuploader, { Extension } from "../Fileuploader";
import { AxiosPostJson } from '../Service/Config/AxiosMethod';
import { Link } from 'react-router-dom';




const T_Project = (props: any) => {

    var { nID, sMode } = parse(window.location.search);
    nID = nID && Decrypt(nID)
    sMode = sMode && Decrypt(sMode)
    const [fileList, setFileList] = React.useState([] as any);
    const Controller = 'api/T_Project';
    const [cfile, setLstData_File] = useState({} as any);
    const [cTitleName, setTitleName] = useState("");
    const [cDescription, setDescription] = useState("");
    const [cChangeradio, setChangeradio] = useState("1");
    const [isDisplay, setIsDisplay] = useState("None");
    const [nTypeId, setnTypeId] = useState(1);
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
        let result: any = await AxiosPostJson(Controller + "/T_Project?nID=" + nID);

        setTitleName(result.data.sTitle);
        setDescription(result.data.sDesc);
        setChangeradio(result.data.isActive == true ? "1" : "0");
        setnTypeId(result.data.nTypeId)

        console.log("result.data.listFile", result.data.listFile) 

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
                file: fileList,
                nTypeId : +values.nTypeId  
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
            Sweetalert.Warning(BoxMsg.Title_Warning, "กรูณาอัพโหลดภาพประกอบโครงการ", null);
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
                                    errorMessage="กรุณาระบุชื่อบัญชีผู้ใช้งาน"

                                    value={cTitleName}
                                    validate={{
                                        required: { value: true },
                                        maxLength: { value: 250 },
                                    }}
                                />
                            </div>
                            <div className="col-12 col-sm-12 col-lg-12 col-xl-6">
                                <b>ประเภทโครงการ <span className="text-danger">•</span></b>

                                <AvField type="select" name="nTypeId" value={nTypeId}>
                                    <option value={1}  >Web Application</option>
                                    <option value={2}>Sharepoint</option>
                                    <option value={3} >Mobile Applicatio</option>

                                </AvField>



                                {

                                    //<AvField
                                    //    name="cTitleName"
                                    //    type="text"
                                    //    errorMessage="กรุณาระบุชื่อบัญชีผู้ใช้งาน"

                                    //    value={cTitleName}
                                    //    validate={{
                                    //        required: { value: true },
                                    //        maxLength: { value: 250 },
                                    //    }}
                                    ///>


                                }
                              
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
                                    <button type="button" className="btn btn-secondary" onClick={c => { history.push("/admin-project") }}>
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
                                <Link id={"LinkBackToList"} to="/admin-project" hidden ></Link>
                            </div>
                        </div>
                    </div>

                </div>
            </AvForm>
        </Fragment >

    );
};
export default T_Project;