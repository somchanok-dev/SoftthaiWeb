import * as React from 'react';
import { useHistory } from 'react-router';
import { Fragment, useEffect, useState } from 'react';
import { AxiosGetJson, AxiosPostJson } from '../../Service/Config/AxiosMethod';
import { CellHeader } from '../../Systems/Table';
import Fileuploader, { Extension } from "../../Fileuploader";
import { BoxMsg, Decrypt, DialogConfirm, Responsestart, Sweetalert } from '../../Systems/SystemComponent';
import { parse } from 'query-string';
import { AvRadioGroup, AvRadio, AvForm } from "availity-reactstrap-validation";
import { Button, FormGroup } from 'reactstrap';


const Home_Panel1 = (props: any) => {
    var { nPanelID, nMainMenuID } = parse(window.location.search);
    nPanelID = nPanelID && Decrypt(nPanelID)
    nMainMenuID = nMainMenuID && Decrypt(nMainMenuID)
    const Controller = 'api/PANE_1';

    const history = useHistory();
    const [fileList, setFileList] = useState([] as any);


    const [IsActive, setIsActive] = useState("1");


    const CheckUser = () => {
        const tokenUser = localStorage.getItem("softhaiWebJWTKey");
        if (!tokenUser) {
            window.location.href = "/admin-login"
        }
        return true;
    }

    useEffect(() => {
        if (CheckUser()) {
            GetDataOnPageLoad();
        }
    }, []);




    const GetDataOnPageLoad = async () => {

        let fileListresult: any = await AxiosPostJson(Controller + "/GetFileList?nPanelID=" + 1 + "&&nMainMenuID=" + 1);

        if (fileListresult = null) {
            setFileList(fileListresult);
        }


        let isactiveresult: any = await AxiosPostJson(Controller + "/GetIsActive?nPanelID=" + 1 + "&&nMainMenuID=" + 1);
        setIsActive(isactiveresult == true ? "1" : "0");

    };

    const onSave = (values: any) => {


        if (fileList.length != 0) {
            let data = {
                nPanelID: nPanelID,
                nMainMenuID: nMainMenuID,
                IsActive: values.IsActive == "1" ? true : false,
                file: fileList
            }
            DialogConfirm(async () => {
                let result: any = await AxiosPostJson(Controller + "/Savedata", data);
                if (result.data.sStatus === Responsestart.success) {

                     Sweetalert.Success(BoxMsg.Title_Confirm, BoxMsg.Desc_Success_Save, null);

                } else {
                    Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
                }
            }, null, BoxMsg.Title_Confirm, BoxMsg.Desc_Confirm_Save)
        } else {
            Sweetalert.Warning(BoxMsg.Title_Warning, "กรูณาอัพโหลดภาพประกอบโครงการ", null);
        }



    };

    var onUploadFileSuccess = () => { }


    const onInvalidSubmit = (event: any, errors: [], values: any) => {
        if (errors.length == 0) {


            onSave(values);
        }
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

    return (
        <Fragment>
            <AvForm onSubmit={onInvalidSubmit}>
                <div className="row">
                    <div className="col-xl-6 col-md-8">
                        <div className="form-group">
                            <b>Upload Video </b>
                            <span className="text-danger">•</span>{" "}
                            <span className="text-muted small">แนะนำขนาดรูปภาพ 1200 x 600 px</span>
                            <Fileuploader
                                limit="1"
                                setFileList={setFileList}
                                fileList={fileList}
                                onComplete={onUploadFileSuccess}
                                onRemoveComplete={onUploadFileSuccess}
                                fileMaxSize="10"
                                extensions={Extension.Video} />
                        </div>
                    </div>
                </div>
                <b className="form-check-b" >สถานะ <span className="text-danger">•</span></b>




                <AvRadioGroup inline name="IsActive" required value={IsActive} >
                    <AvRadio label="&nbsp;ใช้งาน" value="1" id="inlineRadio1" />
                    <AvRadio label="&nbsp;ไม่ใช้งาน" value="0" id="inlineRadio2" />
                </AvRadioGroup>
                <ColoredLine color="#2196f3" />

                <div className="form-row justify-content-between">
                    <div className="form-row justify-content-start">
                        <div className="col-auto">
                            <div className="form-group">
                                <button type="button" className="btn btn-secondary" onClick={c => { history.push("/admin-content") }}>
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
                        </div>
                    </div>
                </div>


            </AvForm>
        </Fragment >
    );
};
export default Home_Panel1;

