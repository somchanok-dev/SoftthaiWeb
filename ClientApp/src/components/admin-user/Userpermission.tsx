import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  CustomInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { Badge } from "reactstrap";
import "../_Layout-Admin/MP_Back.css";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BoxMsg,
  DialogConfirm,
  DialogDelete,
  Encrypt,
  Responsestart,
  Sweetalert,
  TooltipsMSG,
} from "../Systems/SystemComponent";
import CreateTable, { CellHeader } from "../Systems/Table";
import { AxiosGetJson, AxiosPostJson } from "../Service/Config/AxiosMethod";
import axios from "axios";

const Userpermission = (props: any) => {
  const history = useHistory();
  const [Activetab, setActivetab] = useState("tabgroup");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [listAdminInfo, setlistAdminInfo] = useState([] as any);
  const [listAdminGroup, setlistAdminGroup] = useState([] as any);
  const [RowSelected, setRowSelected] = useState([] as any);

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

  const [txtSearch, SetTxtSearch] = React.useState({
    stxtSearch: "",
    sIsActive: "",
  });

  const { stxtSearch, sIsActive } = txtSearch;

  const [textSearch, SetTextSearch] = React.useState({
    stextSearch: "",
    txtGroupSearch: "",
    sisActive: "",
  });
  const { stextSearch, txtGroupSearch, sisActive } = textSearch;

  const CheckUser = () => {
    const tokenUser = localStorage.getItem("softhaiWebJWTKey");
    if (!tokenUser) {
      window.location.href = "/admin-login";
    }
    return true;
  };

  useEffect(() => {
    if (CheckUser()) {
      GetDataOnTabGroupLoad();
    }
  }, []);

  const GetDataOnTabGroupLoad = async () => {
    let result: any = await AxiosGetJson("api/Userpermission/getListUserGroup");
    setlistAdminGroup(result.lstAdminGroup);
  };

  useEffect(() => {
    if (CheckUser()) {
      GetDataOnTabAdminLoad(0);
    }
  }, []);

  const GetPermission = async () => {
    let result: any = await AxiosGetJson(
      "api/CheckPermission/GetPermission?id=1"
    );
  };

  useEffect(() => {
    GetPermission();
  }, []);

  const GetDataOnTabAdminLoad = async (id: any) => {
    let result: any = await AxiosGetJson("api/Userpermission/getListUserInfo");
    setlistAdminInfo(result.lstAdminInfo);
    let ag = result.lstAdminInfo.filter(
      (element: { nID: any }) => element.nID === id
    );
    if (id != 0) {
      setlistAdminInfo(ag);
    }
  };

  const SearchData = async () => {
    let urlPath = "";
    if (stxtSearch !== "" || sIsActive !== "") {
      urlPath =
        "api/Userpermission/getListUserGroup?txtSearch=" +
        (stxtSearch === "" ? "none" : stxtSearch) +
        "&sIsActive=" +
        sIsActive;
    } else {
      urlPath = "api/Userpermission/getListUserGroup";
    }
    let result: any = await AxiosGetJson(urlPath);
    console.log("result", result);
    setlistAdminGroup(result.lstAdminGroup);
  };

  const SearchDataAdminInfo = async () => {
    let urlPath = "";
    if (stextSearch !== "" || txtGroupSearch !== "" || sisActive !== "") {
      urlPath =
        "api/Userpermission/getListUserInfo?txtSearch=" +
        (stextSearch === "" ? "none" : stextSearch) +
        "&sIsActive=" +
        sisActive +
        "&txtGroupSearch=" +
        (txtGroupSearch === "" ? "none" : txtGroupSearch);
    } else {
      urlPath = "api/Userpermission/getListUserInfo";
    }
    let result: any = await AxiosGetJson(urlPath);
    console.log("result", result);
    setlistAdminInfo(result.lstAdminInfo);
  };

  const onDeleteAdminGroup = () => {
    if (RowSelected.length > 0) {
      DialogDelete(async () => {
        var str = RowSelected.toString();
        let result: any = await AxiosPostJson(
          "api/Userpermission/DeleteAdminGroup?str=" + str
        );
        if (result.data.sStatus === Responsestart.success) {
          await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
          GetDataOnTabGroupLoad();
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

  const onDeleteAdminInfo = () => {
    if (RowSelected.length > 0) {
      DialogDelete(async () => {
        var str = RowSelected.toString();
        let result: any = await AxiosPostJson(
          "api/Userpermission/DeleteAdminInfo?str=" + str
        );
        if (result.data.sStatus === Responsestart.success) {
          await Sweetalert.Success(BoxMsg.Title_Success, BoxMsg.Desc_Success_Delete, null);
          GetDataOnTabAdminLoad(0);
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

  var onDataSubmitAdminGroup = async (e: any, errors: string | any[]) => {
    console.log("a");
    if (errors.length === 0) {
      if (nID) {
        let result: any = await AxiosGetJson(
          "api/Userpermission/EditDataAdminGroup"
        );
      }
    }
  };

  var onDataSubmitAdminInfo = async (e: any, errors: string | any[]) => {
    console.log("a");
    if (errors.length === 0) {
      if (nID) {
        let result: any = await AxiosGetJson(
          "api/Userpermission/EditDataAdminUser"
        );
      }
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
    setRowSelected([...RowSelected, id]);
  };

  var onDeSelectedRow = (id: number) => {
    var index = RowSelected.indexOf(id);
    if (index !== -1) {
      RowSelected.splice(index, 1);
      setRowSelected([...RowSelected]);
    }
  };

  const headerAdminGroup: CellHeader[] = [
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
      label: "ชื่อกลุ่ม",
      Sortby: "sName",
      ClassName: "align-middle",
      SortType: Number,
    },
    {
      label: "สมาชิก",
      Sortby: "nMember",
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
            history.push("/admin-user_group-edit?nID=0");
          }}
        >
          <FontAwesomeIcon icon={["fas", "plus"]} />
        </Button>
      ),
      ClassName: "align-middle text-center",
      CSSStyle: { width: 1 },
    },
  ];
  const getLinkToTNEW_datail = (id: number) => {
    let sTypeComponent = `admin-user_group-edit/`;
    let sPath = `${sTypeComponent}?nID=${id}`;
    history.push(sPath);
  };
  const CreateDataAdminGroupRow = (o: any, i: any) => {
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
              checked={RowSelected.indexOf(o.nID) !== -1}
            />
          </td>
        }
        <td className="align-middle text-center">{i + 1}</td>
        <td className="align-middle">{o.sName}</td>
        <td
          className="align-middle"
          onClick={() => {
            setActivetab("tabadmin");
            GetDataOnTabAdminLoad(o.nID);
          }}
          style={{ cursor: "pointer" }}
        >
          {o.nMember}
        </td>
        <td className="align-middle text-center">
          <Badge
            color={o.bStatus ? "success" : "danger"}
            style={{ fontSize: 11 }}
          >
            {o.sStatus_Name}
          </Badge>
        </td>
        <td className="align-middle text-center">
          <Button
            size="sm"
            className="btn btn-info btn-sm"
            type="button"
            onClick={() => {
              getLinkToTNEW_datail(o.nID);
            }}
          >
            <i className="fas fa-pencil-alt"></i>
          </Button>
        </td>
      </tr>
    );
  };

  const headerAdminInfo: CellHeader[] = [
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
      label: "กลุ่ม",
      Sortby: "nGroup",
      ClassName: "align-middle",
      SortType: Number,
    },
    {
      label: "ชื่อผู้ใช้งาน",
      Sortby: "sUsername",
      ClassName: "align-middle",
      SortType: Number,
    },
    {
      label: "ชื่อ-สกุล",
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
      label: "",
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
            history.push("/admin-user_info-edit?nID=0");
          }}
        >
          <FontAwesomeIcon icon={["fas", "plus"]} />
        </Button>
      ),
      ClassName: "align-middle text-center",
      CSSStyle: { width: 1 },
    },
  ];
  const getLinkToTNEW_Info = (id: number) => {
    let sTypeComponent = `admin-user_info-edit/`;
    let sPath = `${sTypeComponent}?nID=${id}`;
    history.push(sPath);
  };
  const Changepassword = (e, errors, values) => {
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
          "api/Userpermission/SaveAdminInfo",
          data
        );
        console.log("result", result);
        if (result.data.sStatus === Responsestart.success) {
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
  const Changepassword_api = () => {
    console.log("values");
  };
  const CreateDataAdminInfoRow = (o: any, i: any) => {
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
              checked={RowSelected.indexOf(o.nID) !== -1}
            />
          </td>
        }
        <td className="align-middle text-center">{i + 1}</td>
        <td className="align-middle text-center">{o.sGroup}</td>
        <td className="align-middle ">{o.sUsername}</td>
        <td className="align-middle ">{o.sName}</td>
        <td className="align-middle text-center">
          <Badge
            color={o.bStatus ? "success" : "danger"}
            style={{ fontSize: 11 }}
          >
            {o.sStatus_Name}
          </Badge>
        </td>
        <td className="align-middle text-center">
          <button
            type="button"
            className="btn btn-warning btn-sm text-nowrap"
            onClick={toggle}
          >
            <i className="fas fa-key"></i> รหัสผ่าน
          </button>

          <Modal isOpen={modal} toggle={toggle}>
            <AvForm onSubmit={Changepassword}>
              <ModalHeader toggle={toggle}>Modal title</ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="col">
                    <label>
                      <b>ชื่อบัญชีผู้ใช้งาน</b>
                    </label>
                    &nbsp;{" "}
                    <AvField
                      name="name"
                      type="text"
                      value={o.sUsername}
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label>
                      <b>รหัสผ่าน</b>
                    </label>{" "}
                    &nbsp;
                    <AvField name="sPass" type="text" />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label>
                      <b>ยืนยันรหัสผ่าน</b>
                    </label>
                    &nbsp;
                    <AvField name="sConfPass" type="text" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="form-row">
                  <div className="col-auto">
                    <Button color="secondary" onClick={toggle}>
                      ยกเลิก
                    </Button>
                  </div>
                  <div className="col-auto ml-auto">
                    <div className="form-row">
                      <div className="col-auto">
                        <Button type="submit" color="success">
                          {" "}
                          บันทึก
                        </Button>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalFooter>
            </AvForm>
          </Modal>
        </td>
        
        <td className="align-middle text-center">
          <Button
            size="sm"
            className="btn btn-info btn-sm"
            type="button"
            onClick={() => {
              getLinkToTNEW_Info(o.nID);
            }}
          >
            <i className="fas fa-pencil-alt"></i>
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Fragment>
      <Nav className="nav nav-tabs navTabList" role="tablist">
        <NavItem>
          <NavLink
            className={Activetab === "tabgroup" ? "active" : ""}
            onClick={() => {
              setActivetab("tabgroup");
            }}
          >
            <i className="fas fa-users-cog"></i> กลุ่มผู้ดูแลระบบ
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={Activetab === "tabadmin" ? "active" : ""}
            onClick={() => {
              setActivetab("tabadmin");
            }}
          >
            <i className="fas fa-user-friends"></i> ข้อมูลผู้ดูแลระบบ
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={Activetab}>
        <TabPane tabId="tabgroup">
          <AvForm onSubmit={onDataSubmitAdminGroup}>
            <div className="form-row">
              <div className="col-auto ml-auto">
                <div className="form-row">
                  <div className="col-auto">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหาจากชื่อกลุ่ม"
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
              </div>
            </div>

            <div className="row mt-1">
              <CreateTable
                Header={headerAdminGroup}
                ItemData={listAdminGroup}
                CreateDataRow={CreateDataAdminGroupRow}
                IsHasBtnDEL={true}
                onBtnDelClick={onDeleteAdminGroup}
                onClickHeadCB={onClickHeadCB}
                rowSelected={RowSelected}
              />
            </div>
          </AvForm>
        </TabPane>

        <TabPane tabId="tabadmin">
          <AvForm onSubmit={onDataSubmitAdminInfo}>
            <div className="form-row">
              <div className="col-auto ml-auto">
                <div className="form-row">
                  <div className="col-md">
                    <div className="form-group">
                      <select
                        className="custom-select form-control"
                        onChange={(e) => {
                          SetTextSearch({
                            ...textSearch,
                            txtGroupSearch: e.target.value,
                          });
                        }}
                      >
                        <option value="">กลุ่ม</option>
                        <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                        <option value="superadmin">superadmin</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหาจากชื่อผู้ใช้งาน, ชื่อ-สกุล"
                        onChange={(e) =>
                          SetTextSearch({
                            ...textSearch,
                            stextSearch: e.target.value,
                          })
                        }
                        onKeyPress={(e) => {
                          e.key === "Enter" && SearchDataAdminInfo();
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="form-group">
                      <select
                        className="custom-select form-control"
                        onChange={(e) => {
                          SetTextSearch({
                            ...textSearch,
                            sisActive: e.target.value,
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
                        onClick={() => SearchDataAdminInfo()}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-1">
              <CreateTable
                Header={headerAdminInfo}
                ItemData={listAdminInfo}
                CreateDataRow={CreateDataAdminInfoRow}
                IsHasBtnDEL={true}
                onBtnDelClick={onDeleteAdminInfo}
                onClickHeadCB={onClickHeadCB}
                rowSelected={RowSelected}
              />
            </div>
          </AvForm>
        </TabPane>
      </TabContent>
    </Fragment>
  );
};
export default Userpermission;
