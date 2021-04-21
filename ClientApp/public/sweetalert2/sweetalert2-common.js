/// <reference path="../jquery.min.js" />
/// <reference path="sweetalert2.min.js" />

function SwAlert_Title(sTitle) {
    return '<strong>' + sTitle + '</strong>';
}

var SwAlert = {
    Common: function (sTitle, sMessage, fnOK) {
        swal({
            title: SwAlert_Title(sTitle == undefined ? '' : sTitle + ''),
            html: sMessage,
            confirmButtonText: 'ปิด',
            allowOutsideClick: false,
            allowEscapeKey: false
        }, fnOK);
    },
    Info: function (sTitle, sMessage, fnOK) {
        swal({
            title: SwAlert_Title(sTitle == undefined ? 'Success' : sTitle + ''),
            html: sMessage,
            type: 'info',
            confirmButtonText: 'ปิด',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function (result) {
            if (result.value) {
                if (fnOK != undefined) {
                    fnOK();
                }
                else {
                    swal.close();
                }
            }
        });
    },
    Success: function (sTitle, sMessage, fnOK) {
        swal({
            title: SwAlert_Title(sTitle == undefined ? 'Success' : sTitle + ''),
            html: sMessage,
            type: 'success',
            confirmButtonText: 'ปิด',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function (result) {
            if (result.value) {
                if (fnOK != undefined) {
                    fnOK();
                }
                else {
                    swal.close();
                }
            }
        });
    },
    Error: function (sTitle, sMessage, fnOK) {
        swal({
            type: 'error',
            title: SwAlert_Title(sTitle == undefined ? 'Error' : sTitle + ''),
            html: sMessage,
            confirmButtonText: 'ปิด',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function (result) {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                }
                else {
                    swal.close();
                }
            }
        });
    },
    Warning: function (sTitle, sMessage, fnOK) {
        swal({
            type: 'warning',
            title: SwAlert_Title(sTitle == undefined ? 'Error' : sTitle + ''),
            html: sMessage,
            confirmButtonText: 'ปิด',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function (result) {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                }
                else {
                    swal.close();
                }
            }
        });
    },
    Confirm: function (sTitle, sMessage, fnYes, fnNo) {
        swal({
            title: sTitle,
            text: sMessage,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    swal.disableButtons();

                    if (fnYes != undefined) {
                        fnYes();
                    }
                    else {
                        swal.close();
                    }
                });
            },
        }).then(function (d) {
            if (d.dismiss == "cancel") {
                if (fnNo != undefined) {
                    fnNo();
                } else {
                    swal.close();
                }
            }
        });
    },
    ConfirmYN: function (sTitle, sMessage, fnYes, fnNo) {
        swal({
            title: SwAlert_Title(sTitle == undefined ? 'Confirmation' : sTitle + ''),
            html: sMessage,
            type: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonColor: '#5cb85c', //"#2098D1",
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirmed) {
                if (isConfirmed) {
                    if (fnYes != undefined) fnYes();
                    else swal.close();
                }
                else {
                    if (fnNo != undefined) fnNo();
                    else swal.close();
                }
            });
    },
    Input: function (sTitle, sMessage, sPlaceHolder, sWarnMsg, fnYes, fnNo) {
        swal({
            title: SwAlert_Title(sTitle == undefined ? 'Input' : sTitle + ''),
            html: sMessage,
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonColor: '#5cb85c', //"#2098D1",
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            closeOnConfirm: false,
            closeOnCancel: true,
            showLoaderOnConfirm: true,
            inputPlaceholder: sPlaceHolder == undefined ? 'Please specify...' : sPlaceHolder + ''
        },
            function (inputValue) {
                if (inputValue === false) {
                    if (fnNo != undefined) fnNo();
                    else swal.close();
                }
                else {
                    if (inputValue === "") { swal.showInputError(sWarnMsg == undefined ? 'Please specify...' : sWarnMsg + ''); return false }

                    if (fnYes != undefined) fnYes(inputValue);
                    else swal.close();
                }
            });
    },
    CustomIcon: function (sTitle, sMessage, sImageIconUrl, fnOK) {
        if (sImageIconUrl != undefined) {
            swal({
                title: SwAlert_Title(sTitle == undefined ? '' : sTitle + ''),
                html: sMessage,
                confirmButtonText: 'Yes',
                allowOutsideClick: false,
                allowEscapeKey: false,
                imageUrl: sImageIconUrl
            }, fnOK);
        }
        else SwAlert.Common(sTitle, sMessage, fnOK);
    },
    DisableButton: swal.disableButtons,
    Close: swal.close
};