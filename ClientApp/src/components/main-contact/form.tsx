import * as React from 'react';
import { AvForm, AvInput } from "availity-reactstrap-validation";
import { BoxMsg, DialogConfirm, Responsestart, Sweetalert } from '../Systems/SystemComponent';
import { AxiosPostJson } from '../Service/Config/AxiosMethod';

const Form = (props) => {
    const [requestType, setRequestType] = React.useState("" as any)
    const [description, setDescription] = React.useState("" as any)
    const [name, setName] = React.useState("" as any)
    const [email, setEmail] = React.useState("" as any)
    const [tel, setTel] = React.useState("" as any)
    const [replyType, setReplyType] = React.useState("" as any)

    const onDataSubmit = (e: any, errors: string | any[]) => {
        if (errors.length === 0) {
            if (replyType === "email") {
                //if (/^(([^<>()[\]\\.,;:\s@@\"]+(\.[^<>()[\]\\.,;:\s@@\"]+)*)|(\".+\"))@@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                //    setEmail(email.trim())
                //}
                //else {
                //    Sweetalert.Warning(BoxMsg.Title_Warning, "อีเมลไม่ถูกต้อง", null);
                //    return;
                //}
                if (email.trim() === "") {
                    Sweetalert.Warning(BoxMsg.Title_Warning, "อีเมลไม่ถูกต้อง", null);
                    return;
                }
            }
            else if (replyType === "phone") {
                //if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(tel)) {
                //    setTel(tel.trim())
                //}
                //else {
                //    Sweetalert.Warning(BoxMsg.Title_Warning, "เบอร์โทรศัพท์ไม่ถูกต้อง", null);
                //    return;
                //}

                if (tel.trim() === "") {
                    Sweetalert.Warning(BoxMsg.Title_Warning, "เบอร์โทรศัพท์ไม่ถูกต้อง", null);
                    return;
                }
            }

            let data = {
                nID: 0,
                requestType: requestType,
                description: description,
                name: name,
                email: email,
                tel: tel,
                replyType: replyType
            }

            DialogConfirm(async () => {
                let result: any = await AxiosPostJson("api/CustomerCare/SaveDataForm", data);
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
    }

    //const onSave = (values: any) => {
    //    if (fileList.length != 0) {
    //        let data = {
    //            nID: nID,
    //            DateStart: cDateStart,
    //            TitleName: values.TitleName,
    //            sDesc: values.cDescription,
    //            isActive: values.IsisActive == "1" ? true : false,
    //            sContent: sContent,
    //            file: fileList,
    //            fileTNewsFile: fileTNewsFile
    //        }
    //        DialogConfirm(async () => {
    //            let result: any = await AxiosPostJson(Controller + "/Savedata", data);
    //            if (result.data.sStatus === Responsestart.success) {
    //                await LinkToListPage();
    //                await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Save, null);
    //            } else if (result.data.sStatus === Responsestart.warning) {
    //                Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
    //            } else {
    //                Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
    //            }
    //        })
    //    } else {
    //        Sweetalert.Warning(BoxMsg.Title_Warning, "กรูณาอัพโหลดภาพประกอบ", null);
    //    }
    //};

    React.useEffect(() => { //ComponentDidmount
    }, [])
    
    return (
        <div id={props.id} className="page-form">
            <AvForm onSubmit={onDataSubmit}>
                <div className="container-fluid position-relative">
                    <div className="form-title">Customer <b>Support</b></div>
                    <div className="mt-4">
                        <div className="form-group">
                            <div className="text-honey">Topic</div>
                            <AvInput type="select" className="form-control rounded-0 border-0" name="ddRequestType" id="ddRequestType" value={requestType}
                                onChange={(e: { target: { value: any; }; }) => {
                                    setRequestType(e.target.value)
                                }} required>
                                <option value="">- หัวข้อสอบถาม -</option>
                                <option value="5">สอบถามข้อมูลบริการ / Service Information</option>
                                <option value="6">แจ้งประเด็นการใช้งาน / Issue Notification</option>
                                <option value="7">เสนอแนะ / Suggestion</option>
                                <option value="8">อื่นๆ / Other</option>
                            </AvInput>
                        </div>
                        <div className="form-group">
                            <div className="text-honey">Your Requirement</div>
                            <AvInput type="textarea" name="txtDescription" rows={4} className="form-control rounded-0 border-0" placeholder="ระบุความต้องการของท่าน" maxLength={5000} value={description}
                                onChange={(e: { target: { value: any; }; }) => {
                                    setDescription(e.target.value)
                                }} required>
                            </AvInput>
                        </div>
                        <div className="form-group">
                            <div className="text-honey">Your Name</div>
                            <AvInput type="text" name="txtRequester" className="form-control rounded-0 border-0" placeholder="ชื่อ - นามสกุล" maxLength={100} value={name} onChange={(e: { target: { value: any; }; }) => {
                                setName(e.target.value)
                            }} required />
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="form-group">
                                    <div className="text-honey">E-mail</div>
                                    <AvInput type="email" name="txtEmail" className="form-control rounded-0 border-0" placeholder="example@email.com" maxLength={50} value={email} onChange={(e: { target: { value: any; }; }) => {
                                        setEmail(e.target.value)
                                    }} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <div className="text-honey">Tel.</div>
                                    <AvInput type="text" name="txtPhone" className="form-control rounded-0 border-0" placeholder="เบอร์โทรศัพท์" maxLength={20} value={tel} onChange={(e: { target: { value: any; }; }) => {
                                        setTel(e.target.value)
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="text-honey">How would you like us to contact you?</div>
                            <AvInput type="select" name="ddReplyType" className="form-control rounded-0 border-0" value={replyType}
                                onChange={(e: { target: { value: any; }; }) => {
                                    setReplyType(e.target.value)
                                }} required>
                                <option value="">- ช่องทางที่ท่านสะดวกให้ติดต่อกลับ -</option>
                                <option value="email">อีเมลล์ / E-mail</option>
                                <option value="phone">โทรศัพท์ / Telephone</option>
                                <option value="none">ไม่สะดวก / Inconvenient</option>
                            </AvInput>
                        </div>
                        <div className="mt-5 text-right">
                            <button type="submit" className="btn btn-carrot rounded-0"><i className="fa fa-paper-plane" ></i>&nbsp;Submit</button>
                        </div>
                    </div>
                </div>
            </AvForm>
        </div>
    );
}
export default Form;

function LinkToListPage() {
    throw new Error('Function not implemented.');
}
