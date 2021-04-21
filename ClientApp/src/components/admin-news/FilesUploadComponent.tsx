import axios from 'axios';
import { count } from 'console';
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
import "./T_New";
const Controller = 'api/T_New';
const UploadFile = 'api/UploadFileSevice';

export const FilesUploadComponent = forwardRef((props: any, ref) => {
    const { sFilePath } = props;

    const [file, setFile] = useState({} as any);
    const [filesent, setFileSent] = useState({} as any);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("")
    const [allFile, setArrFile] = useState([] as any);
    let ArrFile: { ShipArrivalAttachmentID: number; SystemFileName: any; FileName: any; FileSize: any; FileToPath: any; }[] = [];

    const handleUploadImage = (e: any) => {
        if (e.target.files[0].size <= 10485760) {
            if (e.target.files[0] != undefined) {
                const file = e.target.files[0]
                const reader = new FileReader();
                const formData = new FormData();
                var size = e.target.files[0].size;
                formData.append("file", file, file.name);
                formData.append("sfolder", "Temp");
                formData.append("sNewPath", "T_New");
                formData.append("sTempPath", "Temp");
                setFile(formData);
                setFileSent(formData);
                reader.onloadend = () => {
                    setImagePreviewUrl(reader.result + "")
                }
                reader.readAsDataURL(file)
                axios.post(UploadFile, formData)
                    .then(res => {
                        let nRounde = ArrFile.length + 1;
                        ArrFile.push({
                            ShipArrivalAttachmentID: nRounde,
                            SystemFileName: res.data["lstData"][0]["saveToFileName"],
                            FileName: res.data["lstData"][0]["fileName"],
                            FileSize: size + "",
                            FileToPath: res.data["lstData"][0]["saveToPath"],
                        });
                        setArrFile(ArrFile);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }

    useImperativeHandle(ref, () => {
        return {
            allFile,
        };
    });

    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <input type="file" style={{ width: "55%" }} onChange={handleUploadImage} />
                    {
                        imagePreviewUrl ?
                            <img src={imagePreviewUrl} style={{
                                width: "6%"
                            }} className="imageT_NEW" />
                            :
                            <img src={"https://dcvta86296.i.lithium.com/t5/image/serverpage/image-id/14321i0011CCD2E7F3C8F8/image-size/large?v=1.0&px=999"} style={{ width: "6%" }} className="imageT_NEW" />
                    }
                </div>
            </div>

        </Fragment >
    );
});
