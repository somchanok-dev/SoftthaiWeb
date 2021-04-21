import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AvForm } from "availity-reactstrap-validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button } from "reactstrap";
import { TooltipsMSG } from "../Systems/SystemComponent";
import CreateTable, { CellHeader } from "../Systems/Table";
import { AxiosGetJson } from "../Service/Config/AxiosMethod";

const Contact_Info = () => {
  const history = useHistory();
  const [lstData, setlstData] = React.useState([] as any);

  const [data, setData] = useState({
    nID: "",
    sLabel: "",
    sText: "",
    IsActive: true,
  });

  const { nID, sLabel, sText, IsActive } = data;

  const [txtSearch, SetTxtSearch] = React.useState({
    stxtSearch: "",
    sIsActive: "",
  });
  const { stxtSearch, sIsActive } = txtSearch;

  useEffect(() => {
    GetDataOnPageNewLoad();
  }, []);

  const GetDataOnPageNewLoad = async () => {
    let result: any = await AxiosGetJson("api/ContactInfo/GetListContact");
    setlstData(result.lstContact);
  };

  const SearchData = async () => {
    let urlPath = "";
    if (stxtSearch !== "" || sIsActive !== "") {
      urlPath =
        "api/ContactInfo/GetListContact?txtSearch=" +
        (stxtSearch === "" ? "none" : stxtSearch) +
        "&sIsActive=" +
        sIsActive;
    } else {
      urlPath = "api/ContactInfo/GetListContact";
    }
    let result: any = await AxiosGetJson(urlPath);
    console.log("result", result);
    setlstData(result.lstContact);
  };

  var onDataEdit = async (e: any, errors: string | any[]) => {
    console.log("a");
    if (errors.length === 0) {
      if (nID) {
        let result: any = await AxiosGetJson(
          "api/ContactInfo/EditContactInfo"
        );
      }
    }
  };

  const header: CellHeader[] = [
    {
      Sortby: "",
      SortType: Number,
      label: "ลำดับที่",
      ClassName: "align-middle text-center text-nowrap",
      CSSStyle: { width: 1 },
    },
    {
      Sortby: "",
      SortType: Number,
      label: "หัวข้อ",
      ClassName: "align-middle text-center text-nowrap",
    },
    {
      Sortby: "",
      SortType: Number,
      label: "ข้อความ",
      ClassName: "align-middle text-center text-nowrap",
    },
    {
      Sortby: "",
      SortType: Number,
      label: "สถานะ",
      ClassName: "align-middle text-center text-nowrap",
      CSSStyle: { width: 1 },
    },
    {
      Sortby: "",
      SortType: Number,
      label: "วันที่ปรับปรุงล่าสุด",
      ClassName: "align-middle text-center text-nowrap",
      CSSStyle: { width: 250 },
    },
    {
      Sortby: "",
      SortType: false,
      label: "",
      ClassName: "align-middle text-center",
      CSSStyle: { width: 1 },
    },
  ];

  const CreateDataRow = (o: any, i: any) => {
    return (
      <tr key={i}>
        <td className="align-middle text-center">{i + 1}</td>
        <td className="align-middle">{o.sLabel}</td>
        <td className="align-middle">{o.sText}</td>
        <td className="align-middle text-center">
          <Badge
            color={o.bStatus ? "success" : "danger"}
            style={{ fontSize: 11 }}
          >
            {o.sStatus_Name}
          </Badge>
        </td>
        <td className="align-middle text-center">{o.sUpdate}</td>
        <td className="align-middle text-center">
          <Button
            size="sm"
            type="button"
            color="info"
            onClick={() => {
              history.push("/admin-contact_info-edit?nID=" + o.nID);
            }}
          >
            <FontAwesomeIcon icon={["fas", "pencil-alt"]} />
          </Button>
        </td>
      </tr>
    );
  };
  return (
    <Fragment>
      <AvForm onSubmit={onDataEdit}>
        <div className="form-row">
          <div className="col-auto ml-auto">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาจากหัวข้อ, ข้อความ"
                onChange={(e) =>
                  SetTxtSearch({
                    ...txtSearch,
                    stxtSearch: e.target.value,
                  })
                }
                onKeyPress={(e) => {
                  e.key === "Enter" && SearchData();
                }}
              />
            </div>
          </div>
          <div className="col-auto">
            <div className="form-group">
              <select
                className="custom-select form-control"
                onChange={(e) => {
                  SetTxtSearch({
                    ...txtSearch,
                    sIsActive: e.target.value,
                  });
                }}
              >
                <option value="">สถานะ</option>
                <option value="1">ใช้งาน</option>
                <option value="2">ไม่ใช้งาน</option>
              </select>
            </div>
          </div>
          <div className="col-auto">
            <div className="form-group">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => SearchData()}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-1">
          <CreateTable
            Header={header}
            ItemData={lstData}
            CreateDataRow={CreateDataRow}
            IsHasBtnDEL={false}
          />
        </div>
      </AvForm>
    </Fragment>
  );
};
export default Contact_Info;
