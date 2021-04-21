import React, { useState, useEffect, Fragment, CSSProperties } from 'react'
import Pagination from 'react-js-pagination';
import { Table, Col, Button, CustomInput, Row, FormGroup } from 'reactstrap'
// import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import ReactTooltip from 'react-tooltip'
import { TooltipsMSG } from './SystemComponent'
library.add(fas)
library.add(far)

export interface CellHeader extends Cell {
    Sortby: string | "",
    SortType: any | string,
    IsBtnCreate?: boolean | false,
    IsCheckBox?: boolean | false
}
interface Cell {
    label: any,
    ClassName?: string | "",
    CSSStyle?: React.CSSProperties | {},
    Colspan?: number,
    Rowspan?: number,
}

const TableHead = (Props: {
    Header: CellHeader[], Header2?: any, onSort: Function, sortColumn: string, sortDirection: string, onClickHeadCB: any
    , rowSelected?: any, currentData?: any, IsHasPermission: boolean
}) => {
    const { Header,Header2, onSort, sortColumn, sortDirection, onClickHeadCB, rowSelected, currentData, IsHasPermission } = Props
    return (
        <React.Fragment>
            <thead>
                <tr>
                    {
                        Header.map((data: any, indx: number) => {
                            return (
                                <Fragment key={indx}>
                                    {IsHasPermission || !data.IsCheckBox ?
                                        <th colSpan={data.Colspan} key={indx} rowSpan={data.Rowspan}
                                            style={data.CSSStyle}
                                            className={`text-center ${!!data.ClassName ? data.ClassName : ""} ${data.Sortby ? "sorting" : ""}`}
                                            onClick={data.IsCheckBox || !data.Sortby ? () => { } : onSort(data.Sortby, data.SortType)}>
                                            {data.IsCheckBox ? <CustomInput type="checkbox" id={`cbHead_${Math.floor(Math.random() * 100) + 1}`} onChange={onClickHeadCB} checked={currentData.length && (rowSelected && (rowSelected.length === currentData.length))} /> : data.label} {data.label === "Annual Evaluation Result " ? <span className="text-danger">*</span> : ""}
                                            {
                                                !!(data.Sortby) && !data.IsCheckBox &&
                                                <Fragment>&nbsp;<FontAwesomeIcon icon={['fas', sortColumn === data.Sortby ? (sortDirection === "asc" ? 'sort-up' : 'sort-down') : 'sort']} /> </Fragment>
                                            }
                                        </th> : <Fragment></Fragment>}
                                </Fragment>
                            )
                        })
                    }
                </tr>
                {
                    
                    Header2 === "1" ? <tr>
                        <td className="text-center" style={{ width: 120 }}>Issue Date</td>
                        <td className="text-center" style={{ width: 120 }}>Received Date</td>
                        <td className="text-center" style={{ width: 120 }}>Result</td>
                        <td className="text-center" style={{ width: 150 }}>Assessor</td>
                        <td className="text-center" style={{ width: 120 }}>Issue Date</td>
                        <td className="text-center" style={{ width: 120 }}>Received Date</td>
                        <td className="text-center" style={{ width: 120 }}>Result</td>
                        <td className="text-center" style={{ width: 150 }}>Assessor</td>
                        <td className="text-center" style={{ width: 120 }}>Issue Date</td>
                        <td className="text-center" style={{ width: 120 }}>Received Date</td>
                        <td className="text-center" style={{ width: 120 }}>Result</td>
                        <td className="text-center" style={{ width: 150 }}>Assessor</td>
                        <td className="text-center" style={{ width: 120 }}>Issue Date</td>
                        <td className="text-center" style={{ width: 120 }}>Received Date</td>
                        <td className="text-center" style={{ width: 120 }}>Result</td>
                        <td className="text-center" style={{ width: 150 }}>Assessor</td>
                    </tr> : true
                }
                {
                    Header2 === "2" ? <tr>
                        <td className="text-center" style={{ width: 150 }}>{"< 50% Poor"}</td>
                        <td className="text-center" style={{ width: 150 }}>{"50% - 69% Fair"}</td>
                        <td className="text-center" style={{ width: 150 }}>{"70% - 89% Good"}</td>
                        <td className="text-center" style={{ width: 150 }}>{"90% - 100% Excellent"}</td>
                    </tr> : true
                }
                {
                    Header2 === "3" ? <tr>
                        <td className="text-center" style={{ width: 150 }}>{"< 39.00"}<span style={{ display: "block" }}>C </span><span style={{ display: "block" }}> High risks- In default</span></td>
                        <td className="text-center" style={{ width: 150 }}>{"39.00 - 48.00"} <span style={{ display: "block" }}>CC </span><span style={{ display: "block" }}> Substantial risks- In default</span></td>
                        <td className="text-center" style={{ width: 150 }}>{"49.00 - 58.00"}<span style={{ display: "block" }}>B </span><span style={{ display: "block" }}> Speculative Grade Credit</span></td>
                        <td className="text-center" style={{ width: 150 }}>{"59.00 - 68.00"}<span style={{ display: "block" }}>BB </span><span style={{ display: "block" }}> Good Grade Credit</span></td>
                        <td className="text-center" style={{ width: 150 }}>{"69.00 - 78.00"}<span style={{ display: "block" }}>A </span><span style={{ display: "block" }}> High Grade Credit</span></td>
                        <td className="text-center" style={{ width: 150 }}>{"79.00 - 100.00"}<span style={{ display: "block" }}>AA </span><span style={{ display: "block" }}> Highest Grade Credit</span></td>
                    </tr> : true
                }
                {
                    Header2 === "4" ? <tr>
                        <td className="text-center" style={{ width: 180 }}>จำกัดสิทธิ์</td>
                        <td className="text-center" style={{ width: 180 }}>อ่านเท่านั้น</td>
                        <td className="text-center" style={{ width: 180 }}>อนุญาต (เพิ่ม/แก้ไข/ลบ)</td>
                    </tr> : true
                }
            </thead>
        </React.Fragment>
    )
}
const TableBody = (Props: { currentData: any, CreateDataRow: any, nStartIndx: number }) => {
    return (
        <React.Fragment>
            <tbody>
                {
                    Props.currentData.map((data: any, indx: number) => {
                        return (
                            Props.CreateDataRow(data, Props.nStartIndx + indx)
                        )
                    })
                }
            </tbody>
        </React.Fragment>
    )
}

export const CreateTable = (Props: {
    Header: CellHeader[], Header2?: any, ItemData: [], CreateDataRow: any, onBtnDelClick?: any, IsHasPermission?: any , IsNoPaging?: any
    , IsHasBtnDEL?: Boolean, onClickHeadCB?: any, rowSelected?: any | [], TableClassName?: any, TableStyles?: CSSProperties
}) => {//
    const { Header, Header2, ItemData, CreateDataRow, IsHasBtnDEL, onBtnDelClick, onClickHeadCB, rowSelected, TableClassName, TableStyles, IsHasPermission = true, IsNoPaging } = Props
    const [data, setData] = useState(ItemData);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerpage] = useState(10);
    const [sortColumn, setSortColumn] = useState("")
    const [sortDirection, setSortDirection] = useState('asc')

    useEffect(() => {
        setData(ItemData || [])
        ReactTooltip.rebuild()
        if (IsNoPaging)
            setDataPerpage(999)
    });
    useEffect(() => {
        setCurrentPage(1)
    }, [ItemData]);
    const indexOfLastPost = currentPage * dataPerPage;
    const indexOfFirstPost = indexOfLastPost - dataPerPage;
    const currentData = data.slice(indexOfFirstPost, indexOfLastPost);
    const nStartIndx = (currentPage - 1) * dataPerPage
    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const onSort = (column: any, SortType: any) => (e: any) => {
        const direction = sortColumn ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = data.sort((a: any, b: any) => {
            var result = 0;
            var nameA = a[column]
            var nameB = b[column]
            switch (SortType) {
                case Number:
                    if (direction === 'asc') {
                        result = parseFloat(nameA) - parseFloat(nameB)
                    } else {
                        result = parseFloat(nameB) - parseFloat(nameA)
                    }
                    break;
                case Date:
                    if (direction === 'asc') {
                        result = Date.parse(nameA) - Date.parse(nameB)
                    } else {
                        result = Date.parse(nameB) - Date.parse(nameA)
                    }
                    break;
                case String:
                default:
                    nameA = nameA.toUpperCase()
                    nameB = nameB.toUpperCase()
                    if (direction === 'asc') {
                        if (nameA < nameB) {
                            result = -1
                        } else {
                            result = 1
                        }
                    } else {
                        if (nameB < nameA) {
                            result = -1
                        } else {
                            result = 1
                        }
                    }
                    break
            }
            return result
        });


        setData(sortedData)
        setSortColumn(column)
        setSortDirection(direction)
    };

    const onChangeDataPerPage = (e: any) => {
        setDataPerpage(parseInt(e.target.value))
        setCurrentPage(1)
    }
    var Paging = currentData.length !== data.length ?
        <Col className="col-auto" md="auto" xs="12" sm="auto" style={Header2 ? { display: "none" } : {}}>
            <Pagination
                hideDisabled
                activePage={currentPage}
                itemsCountPerPage={dataPerPage}
                totalItemsCount={data.length}
                pageRangeDisplayed={3}
                onChange={paginate}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText="<"
                nextPageText=">"
                innerClass="pagination justify-content-end"
            /></Col>
        : ""

    var onChangeHeadCB = (e: any) => {
        onClickHeadCB(e, currentData)
    }
    const DataNotFound: any = currentData.length === 0 && <div className="alert alert-warning text-center">ไม่พบข้อมูล</div>
    return (
        <React.Fragment>
            
            <Col sm='12'>
                <div className={currentData.length === 0 ? "" : ""} style={currentData.length === 0 ? { display: "block", width: "100%", marginBottom: "1rem", overflowX: "hidden", overflowY: "auto" } : { display: "block", width: "100%", marginBottom: "1rem", overflowX: "unset", overflowY: "auto", borderBottom: "1px solid #dee2e6" }}>
                    <Table size="sm" responsive={currentData.length !== 0 ? true : false} className={TableClassName ? TableClassName : "small bg-white mb-0"} style={TableStyles}>
                    <TableHead Header={Header} onSort={onSort} sortColumn={sortColumn}
                        Header2={Header2}
                        sortDirection={sortDirection}
                        onClickHeadCB={onChangeHeadCB}
                        rowSelected={rowSelected}
                        currentData={currentData}
                        IsHasPermission={IsHasPermission}
                    />
                    <TableBody CreateDataRow={CreateDataRow} currentData={currentData} nStartIndx={nStartIndx} />
                    </Table>
                    </div>
                {DataNotFound}
            </Col>
            {/* </Row> */}
            {data.length !== 0 && <Fragment>

                {IsHasBtnDEL && data.length !== 0 && (IsHasPermission && <Col className="col-auto"><span data-tip={TooltipsMSG.Delete}><Button disabled={rowSelected && rowSelected.length === 0} size="sm" onClick={onBtnDelClick} type="button" className="btn btn-danger"><FontAwesomeIcon icon={['fas', 'trash']} /></Button></span></Col>)}

                <Col className="col-auto mr-auto ml-auto" style={IsNoPaging ? { display: "none" } : {}}>
                    <Row form>
                        {data.length >= 10 &&
                            <Col className="col-auto">
                                <FormGroup>
                                    <select className="form-control form-control-sm" onChange={onChangeDataPerPage} style={Header2 ? { display: "none" } : {}}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value={data.length}>All</option>
                                    </select>
                                </FormGroup>
                            </Col>
                        }
                        <Col className="col-form-label-sm" style={Header2 ? { display: "none" } : {}}>
                            ทั้งหมด <b>{data.length}</b> รายการ
                        </Col>
                    </Row>
                </Col>
                {Paging}
            </Fragment>}
            {/* </div> */}
        </React.Fragment>
    )
}

export default CreateTable