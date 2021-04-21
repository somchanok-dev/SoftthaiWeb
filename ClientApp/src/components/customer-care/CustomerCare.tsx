import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button,InputGroup } from 'reactstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TooltipsMSG } from '../Systems/SystemComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateTable, { CellHeader } from "../Systems/Table";
//import axios from 'axios';
import { AxiosGetJson } from '../Service/Config/AxiosMethod';
const CustomerCare = (props: any) => {
    const [startRequestDate, setStartRequestDate] = React.useState(null as any);
    const [endRequestDate, setEndRequestDate] = React.useState(null as any);
    const [listCustomerCare, setListCustomerCare] = React.useState([] as any)

    const headerCustomerCare: CellHeader[] = [
        {
            Sortby: "dRequestDate",
            SortType: Date,
            label: "วันที่แจ้ง",
            CSSStyle: { width: "10%" }
        },
        {
            Sortby: "dRequestDate",
            SortType: Date,
            label: "เวลา",
            CSSStyle: { width: "10%" }
        },
        {
            Sortby: "",
            SortType: String,
            label: "ประเภท",
            CSSStyle: { width: "20%" }
        },
        {
            Sortby: "",
            SortType: String,
            label: "หัวเรื่อง",
            CSSStyle: { width: "40%" }
        },
        {
            Sortby: "dReplyDate",
            SortType: Date,
            label: "วันที่ตอบกลับ",
            CSSStyle: { width: "10%" }
        },
        {
            Sortby: "",
            SortType: String,
            label: <Link id={"LinkNew"} to={`/customer-care-detail`}>
                    <Button size="sm" color="#007bff" className="btn btn-primary btn-sm" type="button" onClick={() => { }}><i className="fas fa-plus"></i></Button>
                   </Link>,
            CSSStyle: { width: "10%" }
        },
    ];

    const CreateDataCustomerCare = (o: any, i: any) => {
        return (
            <tr key={i}>
                <td className="text-center">{o.sReqDate}</td>
                <td className="text-center">{o.sReqTime}</td>
                <td className="text-center">{o.sType}</td>
                <td className="text-center">{o.sTopic}</td>
                <td className="text-center">{o.sReplyDate}</td>
                <td className="text-center">
                    <Link id={"LinkNew"} to={`/customer-care-detail`}>
                        <Button size="sm" className="btn btn-info btn-sm" type="button" onClick={() => { }}><i className="fas fa-pencil-alt"></i></Button>
                    </Link>
                </td>
            </tr>
        )
    }

    const DateFormat = (today: any) => {
        let day = today.getDate() < 10 ? ("0" + today.getDate().toString()) : today.getDate().toString();
        let month = (today.getMonth() + 1) < 10 ? ("0" + (today.getMonth() + 1).toString()) : (today.getMonth() + 1).toString();
        let date = month + "/" + day + "/" + today.getFullYear();

        return date;
    }

    const GetCustomerRequest = async () => {
        //BlockUI();
        let urlPath = "";
        if (startRequestDate !== null || endRequestDate !== null) {
            var sDate = "";
            var eDate = "";
            if (startRequestDate !== null) {
                sDate = DateFormat(startRequestDate);
            }
            if (endRequestDate !== null) {
                eDate = DateFormat(endRequestDate);
            }
            urlPath = "CustomerCare/GetCustomerCare?dsStartDate=" + sDate + "&dsEndDate=" + eDate;
        }
        else {
            urlPath = "CustomerCare/GetCustomerCare";
        }
        let result: any = await AxiosGetJson(urlPath);
        setListCustomerCare(result);
        //axios.get(process.env.REACT_APP_API_URL + urlPath)
        //    .then(res => {
        //            setListCustomerCare(res.data);

        //    })
        //    .catch(errors => alert(errors));
        
        //UnBlockUI();
    }

    React.useEffect(() => { //ComponentDidmount
        GetCustomerRequest();
    }, [])
    return (
        <div>
            <div className="form-row justify-content-end">
                <div className="col-6 col-md-auto">
                    <InputGroup size="sm">
                        <DatePicker
                            name="txtStartRequestDate"
                            id="txtStartRequestDate"
                            className="form-control form-control-sm"
                            dateFormat="dd/MM/yyyy"
                            autoComplete="off"
                            maxDate={endRequestDate}
                            selected={startRequestDate}
                            onChange={e => {
                                setStartRequestDate(e);
                            }}
                            placeholderText="วันที่แจ้ง"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </InputGroup>
                </div>
                <div className="col-6 col-md-auto">
                    <InputGroup size="sm">
                        <DatePicker
                            name="txtSearcEndDate"
                            id="txtSearcEndDate"
                            className="form-control form-control-sm"
                            dateFormat="dd/MM/yyyy"
                            autoComplete="off"
                            minDate={startRequestDate}
                            selected={endRequestDate}
                            onChange={e => {
                                setEndRequestDate(e);
                            }}
                            placeholderText="ถึง"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </InputGroup>
                </div>
                <div className="col-6 col-md-auto">
                    <InputGroup size="sm">
                        <Button type="button" className="btn-dark" size="sm" data-tip={TooltipsMSG.Search} onClick={() => { GetCustomerRequest() }}><FontAwesomeIcon icon={['fas', 'search']} /></Button>
                    </InputGroup>
                </div>
            </div>
            <div className="row mt-1">
                <CreateTable
                    Header={headerCustomerCare}
                    ItemData={listCustomerCare}
                    CreateDataRow={CreateDataCustomerCare}
                    IsHasBtnDEL={false}
                    //onBtnDelClick={onDeleteAdminGroup}
                    //onClickHeadCB={onClickHeadCB}
                    //rowSelected={RowSelected}
                />
            </div>
        </div>
    );
}
export default CustomerCare;