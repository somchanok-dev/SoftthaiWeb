import axios from 'axios';
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
const Controller = 'T_Project';
const UploadFile = 'api/UploadFileSevice';

export const FilesUploadComponent = forwardRef((props: any, ref) => {
    const [file, setFile] = useState({} as any);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("")
    const [TitleName, setTitleName] = useState("");
    const [filesent, setFileSent] = useState({} as any);
    const [allFile, setArrFile] = useState([] as any);
    let ArrFile: { ShipArrivalAttachmentID: number; SystemFileName: any; FileName: any; FileSize: any; FileToPath: any; }[] = [];

    const handleUploadImage = (e: any) => {
        if (e.target.files[0] != undefined) {
            const file = e.target.files[0]
            const reader = new FileReader();
            const formData = new FormData();
            formData.append("file", file, file.name);
            formData.append("sfolder", "T_Project");
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
                        FileSize: res.data["lstData"][0]["sSize"],
                        FileToPath: res.data["lstData"][0]["saveToPath"],
                    });
                    setArrFile(ArrFile);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }





    const onSave = () => {
        let data = {
            File: file
        }
        console.log("data", data)
       
        if (file != undefined) {



            axios.post(Controller + "/Saveimage", file)
                .then(res => {
                    // res.data;
                })
                .catch((error) => {
                    console.log(error)
                })
            axios.post(Controller + "/Saveimage", file)
                .then(res => {
                    // res.data;
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    };
    return (
        <Fragment>
            <div className="container">
                <div className="row">   
                    <div className="col-2">
                        {
                            imagePreviewUrl ?
                                <img src={imagePreviewUrl} className="imageL_NEW" />
                                :
                                <img src={"https://dcvta86296.i.lithium.com/t5/image/serverpage/image-id/14321i0011CCD2E7F3C8F8/image-size/large?v=1.0&px=999"} className="imageL_NEW" />
                        }
                        <input type="file" name="name" onChange={handleUploadImage} />
                        {/*<button onClick={onSave}> Upload </button>*/}
                    </div>
                </div>
                
            </div>
        </Fragment >
    );
});
