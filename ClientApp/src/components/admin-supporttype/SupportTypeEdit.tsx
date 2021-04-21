import React, { Fragment, useEffect, useState } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { parse } from "query-string";
import {
  BoxMsg,
  DialogConfirm,
  Responsestart,
  Sweetalert,
} from "../Systems/SystemComponent";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";

const SupportTypeEdit = (props: any) => {
  const history = useHistory();

  const [data, setData] = useState({
    nID: 0,
    sName: "",
    IsActive: true,
  });

  const { nID, sName, IsActive } = data;

  const onSaveDB = (e: any, errors: any) => {
    if (errors.length === 0) {
      let data = {
        nID: nID,
        sName: sName,
        IsActive: IsActive,
      };
      DialogConfirm(async () => {
        let result: any = await AxiosPostJson("SupportType/SavetoDB", data);
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

  useEffect(() => {
    var { nID } = parse(window.location.search);
    axios
      .get("api/SupportType/EditSupportType?nID=" + nID, {})
      .then((res) => {
        let data = res.data;
        setData({
          nID: data.nID,
          sName: data.sName,
          IsActive: data.IsActive,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Fragment>
      <AvForm onSubmit={onSaveDB}>
        <div className="row">
          <div className="col-md-6">
            <label>
              <b>ประเภทเรื่อง</b>
            </label>
            &nbsp;
            <AvField
              name="name"
              type="text"
              errorMessage="กรุณาระบุประเภทเรื่อง"
              validate={{
                required: { value: true },
              }}
              onChange={(e: { target: { value: any } }) => {
                setData({ ...data, sName: e.target.value });
              }}
              value={data.sName}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-auto">
            <div className="form-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="0"
                  checked={IsActive === true}
                  onChange={(e: { target: { value: any } }) => {
                    setData({ ...data, IsActive: true });
                  }}
                />
                &nbsp;
                <label className="form-check-label">ใช้งาน</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  value="1"
                  checked={IsActive === false}
                  onChange={(e: { target: { value: any } }) => {
                    setData({ ...data, IsActive: false });
                  }}
                />
                &nbsp;
                <label className="form-check-label">ไม่ใช้งาน</label>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="form-row">
          <div className="col-auto">
            <div className="form-group">
              {/* <a href="/admin-support_type"> */}
                <button type="button" className="btn btn-secondary" onClick={c => { history.push("/admin-support_type") }}>
                  <i className="fas fa-times"></i> ยกเลิก
                </button>
              {/* </a> */}
            </div>
          </div>
          <div className="col-auto ml-auto">
            <div className="form-row">
              <div className="col-auto">
                <div className="form-group">
                  <Button className="btn btn-success">
                    <i className="fas fa-save"></i> บันทึก
                  </Button>
                  <Link id={"LinkBackToList"} to="/admin-support_type" hidden></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AvForm>
    </Fragment>
  );
};
export default SupportTypeEdit;
