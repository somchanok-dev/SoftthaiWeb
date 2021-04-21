import { useDispatch } from "react-redux";
import axios from "axios";
import Crypto from "crypto-js";
import Swal, { SweetAlertIcon } from "sweetalert2";

export const arrShortMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const ColumnWidthInput = {
    Delete: 50,
    No: 70,
    General: 200,
    Specific: 300,
    Unit: 150,
    Source: 250,
    Month: 160,
};

export const TooltipsMSG = {
    Add: "Add",
    Edit: "Edit",
    Delete: "Delete",
    View: "View",
    Search: "Search",
    Save: "Save",
    Approve: "Approve",
    Reject: "Reject",
    Cancel: "Cancel",
    Logout: "Logout",
    ReviewContent: "Review Content",
    File: "File",
    DownloadTemplate: "Download Template",
    Download: "Download",
    Close: "Close",
    MasterData: "Master Data",
    DocRef: "Document reference",
    Check: "Check",
    Submit: "Submit",
    NewRegistration: "Registration",
    Withdraw: "Withdraw",
    SendToVendor: "Send To Vendor",
    ViewCategory: "View Category",
    SpecialRequest: "Request Special Approve",
    NotApprove: "Not Approve",
    ReviewforAction: "Review for Action",
    Accept: "Accept",
    Next: "Next",
    Back: "Back",
    Finished: "ยืนยันการใช้งานเสร็จสิ้น",
    Extend: "ขอขยาย Expire Date",
    OK: "OK",
};

export const AlertTitle = {
    Success: "Action Completed",
    Warning: "Warning",
    Error: "Error",
    Info: "Information",
    Confirm: "Confirmation",
    Hint: "Hint",
    Duplicate: "Duplicate",
};

export const AlertMsg = {
    SaveComplete: "Data is already saved.",
    DeleteComplete: "Data is already deleted.",
    Warning: "Warning",
    Error: "Some thing went wrong",
    ConfirmSave: "Do you want to save data?",
    ConfirmDelete: "Do you want to delete data?",
    UploadImage: "Please upload image",
};

export const Process_System = {
    process_SessionExpire: "SSEXP",
    process_Duplicate: "DUP",
    process_Success: "Success",
    process_Error: "Error",
};

export const AlertButtonText = {
    OK: "OK",
    Cancel: "Cancel",
    Close: "Close",
    Yes: "Yes",
    Confirm: "Confirm",
};

export const SwAlert_Title = (sTitle: any) => {
    return "<strong>" + sTitle + "</strong>";
};

export const actionBlockUI = () => {
    return { type: "BLOCK_UI" };
};

export const actionUnBlockUI = () => {
    return { type: "UNBLOCK_UI" };
};

export const FnBlock_UI = () => {
    const Dispatch = useDispatch();
    const BlockUI = () => {
        Dispatch(actionBlockUI());
    };
    const UnBlockUI = () => Dispatch(actionUnBlockUI());
    return { BlockUI, UnBlockUI };
};

export const scrollToElementValidate = (formID?: any) => {
    let elForm: any = formID
        ? (document.querySelector("form[id=" + formID + "]") as any)
        : document.querySelector("form");
    let elByClass = elForm.querySelectorAll("div.Mui-error") as any;
    if (elByClass && elByClass.length > 0)
        elByClass[0].scrollIntoView({ behavior: "smooth", block: "center" });
};

export const lnkToLogin = () => {
    let el = document.getElementById("lnkToLogin") as any;
    el && el.click();
};

export const lnkToNotPermission = () => {
    let el = document.getElementById("NotPermission") as any;
    el && el.click();
};

export const Effect = (props: any) => {
    const effect = () => {
        if (props.formik.submitCount > 0 && !props.formik.isValid) {
            props.onSubmissionError();
        }
    };
    props.useEffect(effect, [props.formik.submitCount, props.formik.errors]);
    return null;
};

export const IsNumberic = (sVal: any) => {
    sVal = (sVal + "").replace(/,/g, "");
    return !isNaN(sVal);
};
export const addCommas = (nStr: any) => {
    nStr += "";
    let x = nStr.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1,$2");
    }
    return x1 + x2;
};
export const SetFormatNumber = (nNumber: any, nDecimal: any, sEmpty: any) => {
    if (IsNumberic(nNumber)) {
        if (IsNumberic(nDecimal)) return addCommas(nNumber.toFixed(nDecimal));
        else return addCommas(nNumber);
    } else {
        return !nNumber ? (sEmpty === undefined ? "" : sEmpty) : nNumber;
    }
};

const URL_API = process.env.REACT_APP_URL + "api/";
export const AutocompleteDataSource = async (
    Controller: any,
    MethodName: any,
    ObjSearch: any
) => {
    const res = await axios.post(
        URL_API + Controller + "/" + MethodName,
        ObjSearch
    );
    return res;
};

const keyCrypto = "P4ssw0rd3ndCr7pt";
export const Encrypt = (dataEncrypt: any) => {
    let data = dataEncrypt + "";

    let result = Crypto.AES.encrypt(data, keyCrypto).toString();
    result = result.replace(/\//g, "s14sh").replace(/\+/g, "p1u5");

    return result;
};
export const Decrypt = (dataDecrypt: any) => {
    if (dataDecrypt != null) {
        dataDecrypt = dataDecrypt + "";
        dataDecrypt = dataDecrypt.replace(/s14sh/g, "/").replace(/p1u5/g, "+");
        let bytes = Crypto.AES.decrypt(dataDecrypt, keyCrypto);
        let result = bytes.toString(Crypto.enc.Utf8);
        return result;
    } else {
        return "";
    }
};

export const TableRowColor = {
    OutputTotal: "rgb(167, 215, 113)",
    RowCollapse: "rgb(167, 215, 113)",
    OutputSubTotal1: "rgb(223, 237, 161)",
};

export const BackToComponent = (lnkBack: any) => {
    var elLink = document.getElementById(lnkBack) as any;
    if (elLink) {
        elLink.click();
    }
};

export const RegexpPasswork = () => {
    let regexp1 = "((?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))"; //พิมพ์ใหญ่และตัวเลขและอักขระพิเศษ
    let regexp2 = "((?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?=.{8,}))";
    let regexp3 = "((?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))";
    let regexp4 = "((?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))";
    let regexp5 = "((?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,}))";
    let regexp6 = "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))"; //พิมพ์เล็กและพิมพ์ใหญ่และตัวเลขและอักขระพิเศษ
    let egexp =
        "^(" +
        regexp1 +
        "|" +
        regexp2 +
        "|" +
        regexp3 +
        "|" +
        regexp4 +
        "|" +
        regexp5 +
        "|" +
        regexp6 +
        ")";
    return egexp;
};
export const MsgValidate = {
    PleaseSpecify: "Please Specify ",
    Passwork:
        "Passwords must have at least 8 characters and contain at least three of the following: uppercase letters, lowercase letters, numbers, symbols.",
    InvalidEmail: "Invalid Email",
    ConfirmPassword: "Invalid Password",
};

export const MsgValidateMaxLength = (sField: any, nMaxLength: any) => {
    return sField + " must be at most " + nMaxLength + " characters";
};

export const resetFromData = (formProps: any, sFild: any, sValue: any) => {
    formProps.setFieldValue(sFild, sValue, false);
    formProps.setFieldError(sFild, "", false);
};
export const resetFromSubmitData = (
    setFieldValue: any,
    setFieldError: any,
    sFild: any,
    sValue: any
) => {
    setFieldValue(sFild, sValue, false);
    setFieldError(sFild, "", false);
};

export const exportsFileSave = (
    data: any,
    filename: any,
    mime?: any,
    bom?: any
) => {
    var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
    var blob = new Blob(blobData, { type: mime || "application/octet-stream" });
    if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var blobURL =
            window.URL && window.URL.createObjectURL
                ? window.URL.createObjectURL(blob)
                : window.webkitURL.createObjectURL(blob);
        var tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename);
        if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function () {
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }, 200);
    }
};



export const BoxMsg = {
    Title_Confirm: 'ยืนยันการดำเนินการ',
    Title_Warning: 'แจ้งเตือน',
    Title_Success: 'ดำเนินการเสร็จสิ้น',
    Title_Error: 'เกิดข้อผิดพลาด',

    Desc_Confirm_Delete: 'ท่านต้องการลบข้อมูลที่เลือกหรือไม่?',
    Desc_Warning_Delete: 'โปรดทำเครื่องหมายถูก <i class="fa fa-check-square"></i> หน้ารายการที่ต้องการลบ',
    Desc_Success_Delete: 'ลบข้อมูลเรียบร้อย',

    Desc_Confirm_Cancel: 'ท่านต้องการยกเลิกการบันทึกข้อมูลนี้หรือไม่?',
    Desc_Confirm_ChangeOrder: 'ท่านต้องการเปลี่ยนลำดับข้อมูลที่เลือกหรือไม่?',
    Desc_Confirm_Back: 'ท่านต้องการออกจากหน้านี้หรือไม่?',

    Desc_Confirm_Save: 'ท่านต้องการบันทึกข้อมูลหรือไม่?',
    Desc_Warning_Save: 'โปรดระบุข้อมูลให้ถูกต้องครบถ้วนก่อนดำเนินการ',
    Desc_Success_Save: 'บันทึกข้อมูลเรียบร้อย',

    Desc_Warning_FinishForm: 'โปรดบันทึกข้อมูลรายการที่ดำเนินการค้างไว้ให้เรียบร้อย',

    Desc_Error: 'พบข้อขัดข้องในการทำงาน ไม่สามารถดำเนินการต่อได้ โปรดติดต่อผู้ดูแลระบบ',

    Desc_Warning_Login: 'โปรดระบุชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง',
    Desc_Confirm_Logout: 'ท่านต้องการออกจากระบบหรือไม่?',

    Desc_Warning_SessionExpire: 'สิ้นสุดช่วงเวลาในการใช้งานระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง',

    Desc_Warning_NoPermission: 'สิทธิ์ในการใช้งานถูกจำกัด',

    Desc_Warning_Duplicate: 'ไม่สามารถบันทึกข้อมูลซ้ำกันได้ โปรดระบุข้อมูลอีกครั้ง',
    Desc_Warning_Duplicate_Category: 'ไม่สามารถบันทึกข้อมูลซ้ำกันได้ โปรดระบุหมวดแบบประเมินอีกครั้ง',
    Desc_Warning_Duplicate_Qusetion: 'ไม่สามารถบันทึกข้อมูลซ้ำกันได้ โปรดระบุหัวข้อแบบประเมินอีกครั้ง',

    Desc_Confirm_Change_Order: 'ต้องการเปลี่ยนลำดับข้อมูลที่เลือกหรือไม่?'
};

export const DialogConfirm = (funcYes: any, funcNo?: any, title = "", message = "") => {
    Sweetalert.Confirm(title === "" ? BoxMsg.Title_Confirm : title, message === "" ? BoxMsg.Desc_Confirm_Save : message, funcYes, funcNo);
};
export const DialogDelete = (funcYes: any, funcNo?: any, title = "", message = "") => {
    Sweetalert.Confirm(title === "" ? BoxMsg.Title_Confirm : title, message === "" ? BoxMsg.Desc_Confirm_Delete : message, funcYes, funcNo);
};
export const DialogLogout = (funcYes: any, funcNo?: any, title = "", message = "") => {
    Sweetalert.Confirm(title === "" ? BoxMsg.Desc_Confirm_Logout : title, "", funcYes, funcNo);
};
export const AlertIcon = {
    info: "info" as SweetAlertIcon,
    success: "success" as SweetAlertIcon,
    error: "error" as SweetAlertIcon,
    warning: "warning" as SweetAlertIcon,
    question: "question" as SweetAlertIcon,
    confirm: "Confirmation" as SweetAlertIcon,
};
export const Responsestart = {
    success: "Success",
    error: "Failed",
    warning: "Warning",
    SSEXP: "SSEXP",
};
export const Sweetalert = {
    Warning: function (sTitle: any, sMessage: any, fnOK?: any) {
        Swal.fire({
            icon: AlertIcon.warning,
            title: sTitle,
            html: sMessage,
            confirmButtonText: "ยกเลิก",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(function (result) {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Success: function (sTitle: any, sMessage: any, fnOK?: any) {
        Swal.fire({
            title: sTitle || "Action Completed",
            html: sMessage || "Action Completed",
            icon: AlertIcon.success,
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(function (result) {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Error: function (sTitle: any, sMessage: any, fnOK?: any) {
        Swal.fire({
            icon: AlertIcon.error,
            title: sTitle || "Error",
            html: sMessage,
            confirmButtonText: "ยกเลิก",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(function (result) {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Confirm: function (sTitle: any, sMessage: any, fnYes?: any, fnNo?: any) {
        Swal.fire({
            title: sTitle,
            text: sMessage,
            icon: AlertIcon.question,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function () {
                return new Promise(function () {
                    //resolve, reject
                    Swal.disableButtons();

                    if (fnYes) {
                        fnYes();
                    } else {
                        Swal.close();
                    }
                });
            },
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                if (fnNo) {
                    fnNo();
                } else {
                    Swal.close();
                }
            }
        });
    },
};
export const GetElementPosition = (elementID: string) => {
    var e = document.getElementById(elementID);
    if (e) {
        var t = 0, l = 0;
        while (e ? e.tagName != "BODY" : false) {
            t += e ? e.offsetTop : 0;
            l += e ? e.offsetLeft : 0;
            e = e ? e.offsetParent as HTMLElement | null : null;
        }
        return { top: t, left: l };
    }
};