import React, { Fragment, useEffect, useState } from "react";
import { Badge, Button, CustomInput } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AvForm } from "availity-reactstrap-validation";
import { BoxMsg, DialogDelete, TooltipsMSG } from "../Systems/SystemComponent";
import CreateTable, { CellHeader } from "../Systems/Table";
import { useHistory } from "react-router";
import { AxiosGetJson } from "../Service/Config/AxiosMethod";
import { Responsestart, Sweetalert } from "../Systems/SystemComponent";
import { AxiosPostJson } from "../Service/Config/AxiosMethod";

const Controller = 'api/SupportType';

const SupportType = (props: any) => {
  const history = useHistory();
  const [rowSelected, setRowSelected] = React.useState([] as any);
  const [lstSupport_Type, setlstSupport_Type] = React.useState([] as any);

  const [data, setData] = useState({
    nID: "",
    sName: "",
    IsActive: true,
  });

  const { nID, sName, IsActive } = data;

  const [txtSearch, SetTxtSearch] = React.useState({
    stxtSearch: "",
    sIsActive: "",
  });
  const { stxtSearch, sIsActive } = txtSearch;

  var onDataSubmit = async (e: any, errors: string | any[]) => {
    console.log("a");
    if (errors.length === 0) {
      if (nID) {
        let result: any = await AxiosGetJson(Controller + "/EditSupportType");
      }
    }
  };

  const SearchData = async () => {
    let urlPath = "";
    if (stxtSearch !== "" || sIsActive !== "") {
      urlPath =
        Controller + "/GetListSupport?txtSearch=" +
        (stxtSearch === "" ? "none" : stxtSearch) +
        "&sIsActive=" +
        sIsActive;
    } else {
      urlPath = Controller + "/GetListSupport";
    }
    let result: any = await AxiosGetJson(urlPath);
    console.log("result", result);
    setlstSupport_Type(result.lstSupportType);
  };

  const CheckUser = () => {
    const tokenUser = localStorage.getItem("softhaiWebJWTKey");
    if (!tokenUser) {
      window.location.href = "/admin-login";
    }
    return true;
  };

  useEffect(() => {
    if (CheckUser()) {
      GetDataOnPageNewLoad();
    }
  }, []);

  const GetDataOnPageNewLoad = async () => {
    let result: any = await AxiosGetJson(Controller + "/GetListSupport");
    setlstSupport_Type(result.lstSupportType);
  };

  const onDeleteClick = () => {
    if (rowSelected.length > 0) {
      DialogDelete(async () => {
        var str = rowSelected.toString();
        let result: any = await AxiosPostJson(
          Controller + "/DeleteData?str=" + str
        );
        if (result.data.sStatus === Responsestart.success) {
          await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
          GetDataOnPageNewLoad();
        } else if (result.data.sStatus === Responsestart.warning) {
          Sweetalert.Warning(
            BoxMsg.Desc_Warning_Delete,
            result.data.sMsg,
            null
          );
        } else {
          Sweetalert.Error(BoxMsg.Title_Error, result.data.sMsg, null);
        }
      });
    }
  };

  var onClickHeadCB = (e: any, currentData: any) => {
    let el = e.target;
    let dataSelect = el.checked
      ? currentData === null
        ? []
        : currentData.map((x: any) => x.nID)
      : [];
    setRowSelected(dataSelect);
  };
  var onSelectedRow = (id: number) => {
    setRowSelected([...rowSelected, id]);
  };

  var onDeSelectedRow = (id: number) => {
    var index = rowSelected.indexOf(id);
    if (index !== -1) {
      rowSelected.splice(index, 1);
      setRowSelected([...rowSelected]);
    }
  };

  const header: CellHeader[] = [
    {
      Sortby: "",
      SortType: Number,
      label: "",
      ClassName: "align-middle text-center",
      IsCheckBox: true,
      CSSStyle: { width: 1 },
    },
    {
      Sortby: "",
      SortType: Number,
      label: "ลำดับที่",
      ClassName: "align-middle text-center text-nowrap",
      CSSStyle: { width: 110 },
    },
    {
      label: "ประเภทเรื่อง",
      Sortby: "sName",
      ClassName: "align-middle",
      SortType: Number,
    },
    {
      label: "สถานะ",
      Sortby: "",
      ClassName: "align-middle text-center",
      SortType: String,
    },
    {
      Sortby: "",
      SortType: false,
      label: (
        <Button
          size="sm"
          color="primary"
          type="button"
          data-tip={TooltipsMSG.Add}
          onClick={() => {
            history.push("/admin-support_type-edit?nID=0");
          }}
        >
          <FontAwesomeIcon icon={["fas", "plus"]} />
        </Button>
      ),
      ClassName: "align-middle text-center",
      CSSStyle: { width: 1 },
    },
  ];

  const CreateDataRow = (o: any, i: any) => {
    return (
      <tr key={i}>
        {
          <td className="align-middle text-center">
            <CustomInput
              type="checkbox"
              id={`cbBody_${o.nID}`}
              label={""}
              onChange={(e: any) => {
                let el = e.target;
                if (el.checked) {
                  onSelectedRow(o.nID);
                } else {
                  onDeSelectedRow(o.nID);
                }
              }}
              checked={rowSelected.indexOf(o.nID) !== -1}
            />
          </td>
        }
        <td className="align-middle text-center">{i + 1}</td>
        <td className="align-middle">{o.sName}</td>
        <td className="align-middle text-center">
          <Badge
            color={o.bStatus ? "success" : "danger"}
            style={{ fontSize: 11 }}
          >
            {o.sStatus_Name}
          </Badge>
        </td>
        <td className="align-middle text-center">
          {/* <a href={"/admin-support_type-edit?nID=" + o.nID}> */}
          <Button
            size="sm"
            type="button"
            color="info"
            onClick={() => {
              history.push("/admin-support_type-edit?nID=" + o.nID);
            }}
          >
            <FontAwesomeIcon icon={["fas", "pencil-alt"]} />
          </Button>
          {/* </a> */}
        </td>
      </tr>
    );
  };

  return (
    <Fragment>
      <AvForm onSubmit={onDataSubmit}>
        <div className="form-row">
          <div className="col-auto ml-auto">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาจากประเภทเรื่อง"
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
            ItemData={lstSupport_Type}
            CreateDataRow={CreateDataRow}
            IsHasBtnDEL={true}
            onBtnDelClick={onDeleteClick}
            onClickHeadCB={onClickHeadCB}
            rowSelected={rowSelected}
          />
        </div>
      </AvForm>
    </Fragment>
  );
};

export default SupportType;
