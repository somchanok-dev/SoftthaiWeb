import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  AvForm,
  AvField,
  AvRadioGroup,
  AvRadio,
} from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import { parse } from "query-string";
import axios from "axios";
import { BoxMsg, DialogConfirm, Responsestart, Sweetalert } from "../Systems/SystemComponent";

const ContactInfo_Edit = () => {
  const history = useHistory();
  const [cChangeradio, setChangeradio] = useState("1");

  const [data, setData] = useState({
    nID: "",
    sLabel: "",
    sText: "",
    IsActive: true,
  });

  const { nID, sLabel, sText, IsActive } = data;

  const onSaveDB = (e, errors, values) => {
    if (errors.length === 0) {
      let data = {
        nID: nID,
        sLabel: sLabel,
        sText: sText,
        IsActive: values.cChangeradio == "1" ? true : false,
      };
      DialogConfirm(async () => {
        let result: any = await AxiosPostJson("api/ContactInfo/SavetoDB", data);
        console.log("result", result);
        if (result.data.sStatus === Responsestart.success) {
          await LinkToListPage();
          await Sweetalert.Success(BoxMsg.Title_Confirm, BoxMsg.Desc_Success_Save, null);
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

  const EditData = async () => {
    var { nID } = parse(window.location.search);
    let result: any = await AxiosGetJson(
      "api/ContactInfo/EditContactInfo?nID=" + nID,
      {}
    );
    setData(result);
    setChangeradio(result.bStatus == true ? "1" : "0");
  };

  useEffect(() => {
    EditData();
  }, []);


  return (
    <Fragment>
      <AvForm onSubmit={onSaveDB}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>
                <b>หัวข้อ</b> <span className="text-danger">•</span>
              </label>
              &nbsp;
              <AvField
                name="sLabel"
                type="text"
                errorMessage="กรุณาระบุหัวข้อ"
                validate={{
                  required: { value: true },
                }}
                autoComplete="off"
                value={sLabel}
                onChange={(e: { target: { value: any } }) => {
                  setData({ ...data, sLabel: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>
                <b>ข้อความ</b> <span className="text-danger">•</span>
              </label>
              <AvField
                name="sText"
                type="text"
                errorMessage="กรุณาระบุข้อความ"
                validate={{
                  required: { value: true },
                }}
                autoComplete="off"
                value={sText}
                onChange={(e: { target: { value: any } }) => {
                  setData({ ...data, sText: e.target.value });
                }}
              />
            </div>
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
                    value={cChangeradio}
                    required
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
        <div className="form-row">
          <div className="col-auto">
            <div className="form-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(c) => {
                  history.push("/admin-contact_info");
                }}
              >
                <i className="fas fa-times"></i> ยกเลิก
              </button>
            </div>
          </div>
          <div className="col-auto ml-auto">
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                <i className="fas fa-save"></i> บันทึก
              </button>
              <Link
                id={"LinkBackToList"}
                to="/admin-contact_info"
                hidden
              ></Link>
            </div>
          </div>
        </div>
      </AvForm>
    </Fragment>
  );
};
export default ContactInfo_Edit;
