import React, { Fragment, useEffect, useState } from 'react';
import '../_Layout-Admin/MP_Back';
import './MasterType.css';
import { AxiosGetJson, AxiosPostJson } from '../Service/Config/AxiosMethod';
import CreateTable, { CellHeader } from '../Systems/Table';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Encrypt } from '../Systems/SystemComponent';


const Controller = 'api/MasterType';

const T_MasterType = (props: any) => {


    const [lstDataRow, setLstDataRow] = useState([] as any);
    const history = useHistory();



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
        let data = {
            L1: "ข้อมูลพื้นฐาน",
            pathL1: "/admin-master",
            L2: "",
            pathL2: "",
            L3: "",
            nID: "",
            PnID_Type: "",
        }
        props.Title(data)

        let result: any = await AxiosGetJson(Controller + "/GetTMasterType");
        setLstDataRow(result);

    };


    const Header: CellHeader[] = [
        {
            Sortby: "nID",
            SortType: Number,
            label: "",
            IsCheckBox: true,
            CSSStyle: { width: "2%" }
        }

    ];



    const getLinkToNexPage = (id: number) => {
        let sTypeComponent = `/admin-Master-list/`
        let nID = Encrypt(id)
        let sPath = `${sTypeComponent}?type=${nID}`

        history.push(sPath);
    }


    return (
        <Fragment>

            <div className="row">
                {
                    lstDataRow.map((o: any, i: any) => {

                        return (
                            <div className="col-sm-4 " >
                                <p className="items-body-content decoration " onClick={c => { { getLinkToNexPage(o.nID) } }} > <i className="fas fa-angle-double-right"></i> {o.sName}  </p>
                            </div>

                        )
                    })
                }

            </div>



        </Fragment >
    );
};
export default T_MasterType;

