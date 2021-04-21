import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import * as React from 'react';
import { Lightbox } from "react-modal-image";

const FileUpload = (props: {
    id: any,
    isMultiple: any,
    minFileSize?: any,
    maxFileSize?: any,
    maxAllFileSize?: any,
    savePath: any,
    removePath: any,
    acceptType?: any,
    onSelected: any,
    onSuccess?: any,
    onDeleteFile: any,
    fileRef: any,
    readOnlyMode: any
}) => {
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isView, setView] = React.useState(false);
    const [imageDest, setDest] = React.useState(null as any);

    const path: object = {
        removeUrl: props.removePath,
        // saveUrl: process.env.REACT_APP_API_URL + "api/UploadFileToTemp"
        saveUrl: props.savePath
    }
    const uploadObj: UploaderComponent = new UploaderComponent(props.id);
    let stat: any;
    let dropAreaRef: HTMLElement | any;

    const onCreated = () => {
        uploadObj.dropArea = dropAreaRef;
        uploadObj.dataBind();
    }

    const onUploadSuccess = (args: any) => {
        if (props.onSuccess) props.onSuccess(args)
    }
    const onUploadFailure = (args: any) => {
        //alert("Upload Failure");
    }

    const onSelected = (args: any) => {
        setLoad(true);
        setError("")

        var errorFlagMF = false;
        var errorFlagMAF = false;
        var dat = args.filesData;
        var maxFileSize = convertToByte(props.maxFileSize == null ? 100 : props.maxFileSize);
        var maxAllFileSize = convertToByte(props.maxAllFileSize == null ? 100 : props.maxAllFileSize);

        var allFileSize = 0;
        for (let a = 0; a < props.fileRef.length; a++) {
            allFileSize = allFileSize + parseInt(props.fileRef[a].size);
        }

        var dateTime: any = [];
        var today = new Date();
        var date = (today.getDate() < 10 ? "0" : today.getDate()) + "" +
            ((today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "" +
            today.getFullYear();
        var time = (today.getHours() < 10 ? "0" + today.getHours() : today.getHours()) + "" +
            (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()) + "" +
            (today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds()) + "" +
            (today.getMilliseconds() < 10 ? "00" + today.getMilliseconds() : (today.getMilliseconds() < 100 ? "0" + today.getMilliseconds() : today.getMilliseconds()));
        var result = date + time;
        for (let i = 0; i < dat.length; i++) {
            //Case MaxFileSize
            if (dat[i].size > maxFileSize) { errorFlagMF = true; }

            //Case MaxAllFileSize
            if (props.isMultiple && !errorFlagMF) {
                allFileSize = allFileSize + dat[i].size;
                if (allFileSize > maxAllFileSize) { errorFlagMAF = true; }
            }

            var dt = result + (dateTime.length == 0 ? "" : "_" + (i + 1));
            dateTime.push(dt);
        }

        if (!errorFlagMF && !errorFlagMAF) {
            props.onSelected(dat, dateTime);
        }
        else {
            if (errorFlagMF) {
                setError("File too large. (Maximum is " + props.maxFileSize + " MB)");
            }
            else {
                setError("Total select file's size is " + convertToMB(allFileSize) + " MB. (Maximum all file(s) is " + props.maxAllFileSize + " MB)");
            }
        }
        setLoad(false);

    }

    const onRemove = (args: any) => {
        //var dat = args.filesData;
        //props.onSelected(dat);
    }

    const convertToByte = (mb) => {
        return mb * 1000000;
    }

    const convertToMB = (byte) => {
        return (byte / 1000000).toFixed(1);
    }

    var onView = (fileName, source) => {
        let dat;
        let sPath = "Temp/";
        if (source !== "Temp") {
            sPath = source;
        }
        //dat = require(`../UploadFile/` + sPath + `${fileName}`);
        dat = process.env.REACT_APP_URL + `api/`  + `UploadFile/` + sPath + `${fileName}`;

        if (fileName.includes(".pdf") || fileName.includes(".doc") || fileName.includes(".xls") || fileName.includes(".ppt")) {
            window.open(dat, '_blank');
        }
        else {
            setDest(dat);
            setView(true);
        }
    }

    const onCloseView = () => {
        setDest(null);
        setView(false);
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className='control-pane'>
                        <div className='control-section row uploadpreview' ref={dropAreaEle => dropAreaRef = dropAreaEle} >
                            <div className='col-md-12'>
                                <div style={{ display: (props.readOnlyMode ? "none" : "") }}>
                                    <div className='upload_wrapper'>
                                        <UploaderComponent
                                            id={props.id}
                                            multiple={props.isMultiple ? true : false}
                                            autoUpload={true} //Default True
                                            asyncSettings={path}
                                            minFileSize={convertToByte(props.minFileSize == null ? 0 : props.minFileSize)}
                                            maxFileSize={convertToByte(props.maxFileSize == null ? 100 : props.maxFileSize)}
                                            allowedExtensions={props.acceptType == undefined ? "" : props.acceptType}  //'.doc, .docx, .xls, .xlsx'
                                            created={onCreated}
                                            success={onUploadSuccess}
                                            failure={onUploadFailure}
                                            selected={onSelected}
                                            removing={onRemove}
                                            showFileList={false}
                                            disabled={props.isMultiple ? false : (props.fileRef.length == 1 ? true : false)}
                                            ref={scope => stat = scope}
                                        />
                                    </div>
                                    <div className='upload_wrapper' style={{ display: (error == "" ? "none" : "") }}>
                                        <label className="text-danger" style={{ fontSize: "12px" }}>{error}</label>
                                    </div>
                                </div>
                                <div className="control-section row uploadpreview" style={{ display: props.fileRef.length == 0 ? "none" : "" }}>
                                    <div className="col-md-12">
                                        <div className="e-upload e-control-wrapper e-lib e-keyboard">
                                            <ul className="e-upload-files">
                                                {
                                                    !load && props.fileRef.map((i) =>
                                                        <li className="e-upload-file-list e-upload-success" data-file-name="" data-files-count="1">
                                                            <div onClick={() => {

                                                                onView((i.source == "Temp" ? i.name : i.sysName), i.source);
                                                            }}>
                                                                <span className="e-file-container"><span className="e-file-name" title="">{i.name}</span>
                                                                    <span className="e-file-type">&nbsp;</span>
                                                                    <span className="e-file-size">{convertToMB(i.size)} MB</span>
                                                                    <span className="e-file-status e-upload-success"></span>
                                                                </span>
                                                            </div>
                                                            <span className="e-icons e-file-delete-btn" style={{ display: (props.readOnlyMode ? "none" : "") }} onClick={() => {
                                                                props.onDeleteFile(i);
                                                                stat.clearAll();
                                                            }} title="Delete file"></span>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {
                                        isView &&
                                        <Lightbox
                                            id={"ShowFile"}
                                            medium={imageDest}
                                            large={imageDest}
                                            alt=" "
                                            onClose={onCloseView}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUpload;





