import React, { Fragment, useEffect, useState } from "react";
import "../_Layout-Admin/MP_Back.css";
import {
  AvForm,
  AvField,
  AvRadioGroup,
  AvRadio,
  AvGroup,
} from "availity-reactstrap-validation";
import axios from "axios";
import { parse } from "query-string";
import {
  BoxMsg,
  DialogConfirm,
  Responsestart,
  Sweetalert,
} from "../Systems/SystemComponent";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import { Link } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useHistory } from "react-router";

const Controller = 'api/Userpermission';

const TabAdmin = (props: any) => {
  const [data, setData] = useState({
    nID: 0,
    nGroup_ID: 0,
    sGroup: "",
    sUsername: "",
    sName: "",
    sEmail: "",
    sPassword: "",
    sConfirmPassword: "",
    IsActive: true,
  });

  const {
    nID,
    nGroup_ID,
    sGroup,
    sUsername,
    sName,
    sEmail,
    sPassword,
    sConfirmPassword,
    IsActive,
  } = data;

  const [optUserGroup, setUserGroup] = useState([] as any);
  const [valUserGroup, setValUserGroup] = useState([] as any);
  const history = useHistory();
  var nGroup: any = [];
  const [cChangeradio, setChangeradio] = useState("1");

  const onDataSubmit = (e, errors, values) => {
    if (errors.length === 0) {
      let data = {
        nID: nID,
        nGroupID: nGroup_ID,
        sGroup: sGroup,
        sUsername: sUsername,
        sName: sName,
        sEmail: sEmail,
        sPassword: sPassword,
        sConfirmPassword: sConfirmPassword,
        IsActive: values.cChangeradio == "1" ? true : false,
      };
      DialogConfirm(async () => {
        let result: any = await AxiosPostJson(
          Controller + "/SaveAdminInfo",
          data
        );
        console.log("result", result);
        if (result.data.sStatus === Responsestart.success) {
          await LinkToListPage();
          await Sweetalert.Success(
            BoxMsg.Title_Confirm,
            BoxMsg.Desc_Success_Save,
            null
          );
        } else if (result.data.sStatus === Responsestart.warning) {
          Sweetalert.Warning(BoxMsg.Title_Warning, result.data.sMsg, null);
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

  useEffect(() => {
    GetDropdown();
    EditData();
  }, []);

  const GetDropdown = async () => {
    let result: any = await AxiosGetJson(Controller + "/GetUserGroup");
    setUserGroup(result);
    nGroup = result;
  };

  const EditData = async () => {
    var { nID } = parse(window.location.search);
    let result: any = await AxiosGetJson(
      Controller + "/EditDataAdminUser?nID=" + nID,
      {}
    );
    setData(result);
    let ag = nGroup.find(
      (element: { value: any }) => element.value === result.nGroup.toString()
    );
    if (ag != undefined) {
      setValUserGroup(ag);
    }
  };

  // useEffect(() => {
  //   EditData();
  // }, []);

  return (
    <Fragment>
      <AvForm onSubmit={onDataSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>
                <b>กลุ่มผู้ดูแลระบบ</b>
              </label>
              &nbsp;
              <small className="text-muted">(กำหนดสิทธิการใช้งาน)</small>{" "}
              <span className="text-danger">•</span>
              {/* <AvField
                type="select"
                name="select"
                options={optUserGroup}
                value={sGroup}
                errorMessage="กรุณาระบุกลุ่ม"
                validate={{
                  required: { value: true },
                }}
                onChange={(value: any) => {
                  setUserGroup(value);
                }}
              ></AvField> */}
              <CreatableSelect
                isClearable
                options={optUserGroup}
                closeMenuOnSelect={true}
                placeholder="เลือกกลุ่ม"
                errorMessage="กรุณาระบุกลุ่ม"
                value={valUserGroup}
                onChange={(value) => {
                  setValUserGroup(value);
                  setData({ ...data, nGroup_ID: parseInt(value.value) });
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label>
              <b>ชื่อ-นามสกุล</b>
            </label>
            &nbsp;
            <small className="text-muted">
              (ระบุอย่างน้อย 3 ตัวอักษรเพื่อค้นหา)
            </small>{" "}
            <span className="text-danger">•</span>
            <AvField
              name="name"
              type="text"
              errorMessage="กรุณาระบุชื่อ-นามสกุล"
              value={sName}
              validate={{
                required: { value: true },
              }}
              onChange={(e: { target: { value: any } }) => {
                setData({ ...data, sName: e.target.value });
              }}
            />
          </div>

          <div className="col-md-6">
            <label>
              <b>อีเมล</b>
            </label>{" "}
            <span className="text-danger">•</span>&nbsp;
            <AvField
              name="email"
              type="email"
              errorMessage="กรุณาระบุอีเมล"
              value={sEmail}
              validate={{
                required: { value: true },
              }}
              onChange={(e: { target: { value: any } }) => {
                setData({ ...data, sEmail: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label>
              <b>ชื่อบัญชีผู้ใช้งาน</b>
            </label>{" "}
            <span className="text-danger">•</span>&nbsp;
            <AvField
              name="username"
              type="text"
              errorMessage="กรุณาระบุชื่อบัญชีผู้ใช้งาน"
              value={sUsername}
              validate={{
                required: { value: true },
              }}
              onChange={(e: { target: { value: any } }) => {
                setData({ ...data, sUsername: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label>
              <b>รหัสผ่าน</b>
            </label>
            &nbsp;
            <small className="text-muted">
              (ความยาว 8-20 ตัวอักษร ภาษาอังกฤษพิมพ์เล็ก/ใหญ่
              ตัวเลขและอักขระพิเศษ)
            </small>{" "}
            <span className="text-danger">•</span>
            {/* <input type="password" className="form-control" required /> */}
            <AvField
              name="password"
              type="password"
              errorMessage="กรุณาระบุรหัสผ่าน"
              value={sPassword}
              validate={{
                required: { value: true },
                pattern: {
                  value:
                    "(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.*[!@@#$%^&*])(?=.{8,})",
                  errorMessage:
                    "รหัสผ่านของคุณเป็นตัวเลข 8-20 หลักและต้องผสมกันระหว่างตัวพิมพ์เล็กตัวพิมพ์ใหญ่ภาษาอังกฤษตัวเลขและอักขระพิเศษ",
                },
                minLength: {
                  value: 8,
                  errorMessage:
                    "รหัสผ่านของคุณต้องมีความยาวระหว่าง 8 ถึง 20 ตัวอักษร",
                },
                maxLength: {
                  value: 20,
                  errorMessage:
                    "รหัสผ่านของคุณต้องมีความยาวระหว่าง 8 ถึง 20 ตัวอักษร",
                },
              }}
              onChange={(e: { target: { value: any } }) => {
                setData({ ...data, sPassword: e.target.value });
              }}
            />
          </div>

          <div className="col-md-6">
            <label>
              <b>ยืนยันรหัสผ่าน</b>
            </label>
            &nbsp;
            <small className="text-muted">(ระบุรหัสผ่านอีกครั้ง)</small>{" "}
            <span className="text-danger">•</span>
            {/* <input type="password" className="form-control" required /> */}
            <AvField
              name="newpass"
              type="password"
              errorMessage="กรุณาระบุรหัสผ่านอีกครั้ง"
              value={sConfirmPassword}
              validate={{
                required: { value: true },
                pattern: {
                  value:
                    "(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.*[!@@#$%^&*])(?=.{8,})",
                  errorMessage:
                    "รหัสผ่านของคุณเป็นตัวเลข 8-20 หลักและต้องผสมกันระหว่างตัวพิมพ์เล็กตัวพิมพ์ใหญ่ภาษาอังกฤษตัวเลขและอักขระพิเศษ",
                },
                minLength: {
                  value: 8,
                  errorMessage:
                    "รหัสผ่านของคุณต้องมีความยาวระหว่าง 8 ถึง 20 ตัวอักษร",
                },
                maxLength: {
                  value: 20,
                  errorMessage:
                    "รหัสผ่านของคุณต้องมีความยาวระหว่าง 8 ถึง 20 ตัวอักษร",
                },
                match: {
                  value: "password",
                  errorMessage: "Your Password not match",
                },
              }}
              onChange={(e: { target: { value: any } }) => {
                setData({ ...data, sConfirmPassword: e.target.value });
              }}
            />
          </div>
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
                  //onClick={onSaveAdminInfo}
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
export default TabAdmin;
