import * as React from 'react';
//import { Link } from 'react-router-dom';
import { Button, InputGroup } from 'reactstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TooltipsMSG } from '../Systems/SystemComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import axios from 'axios';
import { AxiosGetJson } from '../Service/Config/AxiosMethod';
const CustomerCareDetail = () => {
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-6">
                    <label className="control-label">ชื่อผู้ร้องขอ</label>
                    <br />
                    <label>นายสมชาย ทองปาน</label>
                </div>
                <div className="col-md-6">
                    <label className="control-label">วันที่ส่งเมล</label>
                    <br />
                    <label>-</label>
                </div>
            </div>
        </React.Fragment>
    )
}
export default CustomerCareDetail