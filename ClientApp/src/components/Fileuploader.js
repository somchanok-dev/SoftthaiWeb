import * as React from "react";
const $ = window.jQuery;
export const Extension = {
    Image: ['jpg', 'jpeg', 'png', 'gif'],
    Video: ['mov', 'wmv', 'avi', 'mp4'],
    PDF: ['pdf'],
    Document: ['doc', 'docx', 'xls', 'xlsx', 'txt'],
    Word: ["doc", "docx"],
    Excel: ["xls", "xlsx"],
    Powpoint: ["pptx", "pdf", "ppt"],
    txt: ["txt"],
    //Email: ["msg"],
    Other: ['rar', 'zip'],
    AllType: null

};



class Fileuploader extends React.Component {
    constructor(props) {
        super(props);
        const sPath = process.env.REACT_APP_URL + "api/"  + "/UploadFileToTemp";


        this.state = {
            name: "files",
            options: {
                upload: {
                    url: sPath,
                }
            }
        };
        this.state.options['upload'] = {
            url: sPath,
            beforeSend: function(item, listEl, parentEl, newInputEl, inputEl) {
                return true;
            },
        }
        this.state.lst = [];
        this.state.options['editor'] = true;
        let sFileType = "";
        this.state.sextensions = "";
        this.state.maxSize = 10;
        this.state.extensions = this.props.extensions;
        if (this.props.extensions == null) {
            let arrExt = [];
            $.each(Extension, function() {
                for (var key in this) {
                    if (key != 'GetAll') arrExt = arrExt.concat(this[key]);
                }
            });
            this.state.extensions = arrExt;
        }
        $.each(this.state.extensions, function() {
            sFileType += " /. " + this;
        });
        this.state.sextensions = sFileType;
    }
    SetUploadFile() {
        let onComplete = this.props.onComplete;
        let onRemoveComplete = this.props.onRemoveComplete;

        this.$el = $(this.el);
        let arrFile = this.state.lst;
        //const sPath = process.env.REACT_APP_API_URL + "api/UploadFileToTemp";
        const sPath = process.env.REACT_APP_URL + "api"  +  "/UploadFileToTemp";
        let fileList = this.props.fileList;
        var ThisIsRefProp = this
        let thiAPI = [];
        this.$el.fileuploader($.extend({
            enableApi: true,
            limit: this.props.limit,
            clipboardPaste: false,
            maxSize: this.props.maxSize,
            fileMaxSize: this.props.fileMaxSize,
            extensions: this.state.extensions,
            files: null,
            changeInput:
            // '<div class="row">' +
            //     '<div class="col-12 col-sm-12 col-lg-12 col-xl-6 ">' +
            //         '<div class="fileuploader-input-caption form-control">' +
            //             '<span>${captions.feedback}</span>' +
            //         '</div>' +
            //     '</div>' +
            //     '<div class="col-12 col-sm-12 col-lg-12 col-xl-6">' +
            //         '<button class="btn btn-primary">' +
            //             '<span>${captions.button}</span>' +
            //         '</button>' +
            //     '</div>' +
            // '</div>' +
            // '<div class="form-group dvValidate">' +
            // '<span class="text-muted small">' +
            // 'File size limits up to ' + this.props.fileMaxSize + ' MB. Allowed file types: ' + this.state.sextensions +
            // '</span' +
            // '</div>'

                '<div class="input-group">' +
                '<div class="fileuploader-input-caption form-control">${captions.feedback}</div>' +
                '<div class="input-group-append">' +
                '<button class="btn btn-dark"><i class="fa fa-paperclip"></i> ${captions.button}</button>' +
                '</div>' +
                '</div>' +
                '<span class="dvValidate text-muted small">' +
                'ไฟล์ที่อนุญาต: ' + this.props.extensions.join(" ,") + ' ขนาดไม่เกิน ' + this.props.fileMaxSize + ' MB' +
                '</span>',
            captions: {
                button: function(options) { return 'แนบไฟล์' },
                feedback: function(options) { return 'คลิกเพื่อเลือกไฟล์'; },
                feedback2: function (options) { return 'ไฟล์แนบ' + ' ' + options.length + ' ' + 'รายการ'; },

                confirm: 'ยืนยัน',
                cancel: 'ยกเลิก',
                name: 'ชื่อ',
                type: 'ประเภท',
                size: 'ขนาด',
                dimensions: 'มิติข้อมูล',
                duration: 'ระยะเวลา',
                crop: 'ครอบตัด',
                rotate: 'หมุน',
                sort: 'เรียงลำดับ',
                open: 'เปิด',             
                download: 'ดาวน์โหลด',
                remove: 'ลบ',
                drop: 'วางไฟล์ที่นี้เพื่ออัพโหลด',
                paste: '<div class="fileuploader-pending-loader"></div> กำลังวางไฟล์, คลิกที่นี้เพท่อยกเลิก',
               
                removeConfirmation: 'ท่านต้องการลบข้อมูลที่เลือกหรือไม่?',
                errors: {
                    filesLimit: function (options) {
                        return 'สามารถแนบไฟล์ได้ไม่เกิน ${limit} ไฟล์'
                    },
                    filesType: 'สามารถอัพโหลดได้เฉพาะไฟล์นามสกุลดังนี้ ${extensions} ขนาดไม่เกิน 10 MB',
                    fileSize: 'ไฟล์ ${name} มีขนาดใหญ่เกิน ${fileMaxSize} MB',
                    filesSizeAll: 'ไฟล์ที่เลือกทั้งหมดมีขนาดใหญ่เกิน ${maxSize} MB',
                    fileName: 'ชื่อไฟล์ ${name} ถูกอัพโหลดเรียบร้อยแล้ว',
                    remoteFile: 'ไม่อนุญาต Remote files',
                    folderUpload: 'โฟลเดอร์ไม่ได้รับอนุญาต',
                }
            },
            upload: {
                url: sPath,
                beforeSend: function(item, listEl, parentEl, newInputEl, inputEl) { return true; },
                onSuccess: function(data, item, listEl, parentEl, newInputEl, inputEl, textStatus, jqXHR) {
                    item.html.find('.fileuploader-action-remove').addClass('fileuploader-action-success');

                    setTimeout(function() { item.html.find('.progress-bar2').fadeOut(400); }, 400);
                    data.sSize = item.size + "";
                    let nID = 1;
                    let lstFile = ThisIsRefProp.props.fileList;
                    //let a = fileList;
                    //debugger;
                    if (lstFile.length > 0) {
                        nID = lstFile.reduce(
                            (max, lstFile) => (lstFile.nID > max ? lstFile.nID : max),
                            lstFile[0].nID
                        );
                        data.nID = nID;
                    }
                    item.url = process.env.REACT_APP_URL + "api/"  + data.sSaveToPath + '/' + data.sSaveToFileName;
                    //item.url = data.sSaveToPath + '/' + data.sSaveToFileName;
                    //fileList.length = 0
                    item.IsCompleted = data.IsCompleted;
                    item.IsDelete = false
                    item.IsNewFile = data.IsNewFile;
                    item.nID = data.nID;
                    item.sFileName = data.sFileName;
                    item.sFileType = data.sFileType;
                    item.sMsg = data.sMsg;
                    item.sSaveToFileName = data.sSaveToFileName;
                    item.sSaveToPath = data.sSaveToPath;
                    item.sSize = data.sSize;
                    item.sUrl = data.url;
                    ThisIsRefProp.props.fileList.push(data);
                    //var b = ThisIsRefProp.props.fileList; 
                    //debugger;
                },
                onComplete: function(listEl, parentEl, newInputEl, inputEl, jqXHR, textStatus) {

                    var arrTempFile = thiAPI.getUploadedFiles();
                    //let a = fileList;
                    //debugger;

                    arrTempFile.forEach(data => {
                        var item = {};
                        if (data.IsCompleted) {
                            for (var x = 0; x < ThisIsRefProp.props.fileList.length; x++) {
                                if (ThisIsRefProp.props.fileList[x].sSaveToFileName === data.sSaveToFileName) {
                                    ThisIsRefProp.props.fileList.splice(x, 1);
                                    thiAPI.remove(item);
                                }
                            }
                            item.IsCompleted = false;
                            item.IsDelete = false
                            item.IsNewFile = data.IsNewFile;
                            item.nID = data.nID;
                            item.sFileName = data.sFileName;
                            item.sFileType = data.sFileType;
                            item.sMsg = data.sMsg;
                            item.sSaveToFileName = data.sSaveToFileName;
                            item.sSaveToPath = data.sSaveToPath;
                            item.sSize = data.sSize;
                            item.sUrl = data.url;
                            ThisIsRefProp.props.fileList.push(item)
                        }

                    });
                    console.log(ThisIsRefProp.props.fileList);
                    if (onComplete) onComplete()
                },
                onError: function(item, listEl, parentEl, newInputEl, inputEl, jqXHR, textStatus, errorThrown) {
                    var progressBar = item.html.find('.progress-bar2');

                    if (progressBar.length > 0) {
                        progressBar.find('span').html(0 + "%");
                        progressBar.find('.fileuploader-progressbar .bar').width(0 + "%");
                        item.html.find('.progress-bar2').fadeOut(400);
                    }
                    if (item.upload.status !== 'cancelled' && item.html.find('.fileuploader-action-retry').length === 0) {
                        item.html.find('.column-actions').prepend('<button class="btn btn-sm btn-warning fileuploader-action-retry" type="button"  data-toggle="tooltip" title="Retry" style="margin-right:6px;"><i class="fa fa-redo"></i></button>');
                    }
                    // if (item.upload.status !== 'cancelled' && item.html.find('.fileuploader-action-retry').length === 0) {
                    //     item.html.find('.column-actions').prepend('<a class="fileuploader-action fileuploader-action-retry" title="Retry"><i></i></a>')
                    // }
                    // item.upload.status !== 'cancelled' && item.html.find('.fileuploader-action-retry').length === 0 ? item.html.find('.column-actions').prepend('<a class="fileuploader-action fileuploader-action-retry" title="Retry"><i></i></a>') : null;
                },
                onProgress: function(data, item, listEl, parentEl, newInputEl, inputEl) {
                    var progressBar = item.html.find('.progress-bar2');

                    if (progressBar.length > 0) {
                        progressBar.show();
                        progressBar.find('span').html(data.percentage + "%");
                        progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
                    }
                },

            },
            onRemove: function(item, listEl, parentEl, newInputEl, inputEl) {
                var index;
                for (var x = 0; x < ThisIsRefProp.props.fileList.length; x++) {
                    index = x;
                    var a = ThisIsRefProp.props.fileList[x].sSaveToFileName;
                    if (ThisIsRefProp.props.fileList[x].sSaveToFileName === item.sSaveToFileName && ThisIsRefProp.props.fileList[x].nID === item.nID) {
                        ThisIsRefProp.props.fileList.splice(x, 1);
                        thiAPI.remove(item);
                    }
                }


                //debugger;
                //var index;
                //for (var x = 0; x < ThisIsRefProp.props.fileList.length; x++) {
                //    index = x;
                //    var a = ThisIsRefProp.props.fileList[x].nID;
                //    if (ThisIsRefProp.props.fileList[x].nID === item.nID) {
                //        ThisIsRefProp.props.fileList.splice(x, 1);
                //        thiAPI.remove(item);
                //    }
                //}

                // for (var x = 0; x < fileList.length; x++) {
                //     if (fileList[x].sFileName === item.name && Number(fileList[x].sSize) === item.size)
                //         index = x;
                // }

                // fileList.splice(index, 1);
                if (onRemoveComplete) onRemoveComplete()
            },
        }, {}));

        this.api = $.fileuploader.getInstance(this.$el);
        let objtest = this.api;
        this.API_Obj = this.api;
        thiAPI = this.API_Obj;
        fileList.forEach(e => {

            if (e.sSaveToFileName !== "") {
                let arrfilename = (e.sSaveToFileName + "").split('.');
                e.sFileType = arrfilename[arrfilename.length - 1];

                let format = "application"
                let sType = format;
                if (Extension.Image.indexOf(e.sFileType) > -1) {
                    format = "image";
                }
                if (Extension.Video.indexOf(e.sFileType) > -1) {
                    format = 'video';
                }
                sType = format + "/" + e.sFileType;
                e.format = format;
                e.sFileType = sType;
                e.name = e.sFileName
                //e.file = process.env.REACT_APP_API_URL + e.sSaveToPath + e.sSaveToFileName
                e.file = process.env.REACT_APP_URL +e.sSaveToPath; // + e.sSaveToFileName
                e.type = e.sFileType
                e.size = e.sSize
                //e.url = process.env.REACT_APP_API_URL + e.sSaveToPath + e.sSaveToFileName;
                e.url = process.env.REACT_APP_URL + e.sSaveToPath; // + e.sSaveToFileName;
                e.sUrl = e.url;
                this.api.append(e)
            }

        })
        if (this.props.readOnly) {
            this.api.disable()
            this.api.getListEl().find(".btn-remove").hide()
            this.api.getParentEl().find("div[class=fileuploader-input]").hide()
            this.api.getParentEl().find("div[class*=dvValidate]").hide()
        } else {
            this.api.enable()
        }

    }
    componentDidMount() {
        this.SetUploadFile()
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.fileList !== nextProps.fileList) {
            this.api.reset();
            nextProps.fileList.forEach(e => {

                if (e.sSaveToFileName !== "") {
                    let arrfilename = (e.sSaveToFileName + "").split('.');
                    e.sFileType = arrfilename[arrfilename.length - 1];

                    let format = "application"
                    let sType = format;
                    if (Extension.Image.indexOf(e.sFileType.toLowerCase()) > -1) {
                        format = "image";
                    }
                    if (Extension.Video.indexOf(e.sFileType.toLowerCase()) > -1) {
                        format = 'video';
                    }
                    sType = format + "/" + e.sFileType;
                    e.format = format;
                    e.sFileType = sType;
                    e.name = e.sFileName
                    //e.file = process.env.REACT_APP_API_URL + e.sSaveToPath + e.sSaveToFileName
                    e.file = process.env.REACT_APP_URL + e.sSaveToPath; // + e.sSaveToFileName
                    e.type = e.sFileType
                    e.size = e.sSize
                    //e.url = process.env.REACT_APP_API_URL + e.sSaveToPath + e.sSaveToFileName;
                    e.url = process.env.REACT_APP_URL +e.sSaveToPath; // + e.sSaveToFileName;
                    e.sUrl = e.url;
                    this.api.append(e)
                }

            })
            if (this.props.readOnly) {
                this.api.disable()
                this.api.getListEl().find(".btn-remove").hide()
                this.api.getParentEl().find("div[class=fileuploader-input]").hide()
                this.api.getParentEl().find("div[class*=dvValidate]").hide()
            } else {
                this.api.enable()
                this.api.getListEl().find(".btn-remove").show()
                this.api.getParentEl().find("div[class=fileuploader-input]").show()
                this.api.getParentEl().find("div[class*=dvValidate]").show()
            }
        }
    }

    componentWillUnmount() {
        if (this.api)
            this.api.destroy();
    }

    render() {

        return ( < div > < input type = "file"
            name = {
                this.state.name
            }
            ref = {
                el => this.el = el
            }
            /></div >
        )
    }
}

export default Fileuploader;