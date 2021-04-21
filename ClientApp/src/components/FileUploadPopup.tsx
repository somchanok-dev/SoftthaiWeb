//import { useState, useEffect, Fragment, CSSProperties } from 'react'
import * as React from "react";
// import 'bootstrap/dist/css/bootstrap.css';


export const UploadPopup = (Props: {   
    isPopupOpen: Boolean, name: string, type: string, imageURL: string, dimension: string , size : string
}) => {//
    const { name, type, imageURL, dimension, isPopupOpen, size} = Props
    
  
    return (
        <React.Fragment>
            <div className="fileuploader-popup" style={isPopupOpen ? {} : { display: "none" }}>
                <div className="fileuploader-popup-preview">
                    <button type="button" className="fileuploader-popup-move" data-action="prev">
                        <i className="fileuploader-icon-arrow-left">
                        </i>
                    </button>
                    <div className="fileuploader-popup-node node-image">
                        <div className="reader-node" style={{ left: 0, top: 0 }}>
                            <img src={imageURL}>
                            </img>
                        </div>
                        <div className="fileuploader-popup-content">
                            <div className="fileuploader-popup-footer">
                                <ul className="fileuploader-popup-tools">
                                    <li className="fileuploader-popup-zoomer">
                                        <button type="button" data-action="zoom-out">−</button>
                                        <input type="range" min="0" max="100" />
                                        <button type="button" data-action="zoom-in">+</button>
                                        <span>33%</span>

                                        <li><a href={imageURL} download=""><button type="button" className="fileuploader-action fileuploader-action-download btn-primary" style={{ display: "inline-block", padding: 16, paddingBottom: 13, cursor: "pointer", textDecoration: "none", color: "#fdfdfd", borderBottom: "3px solid transparent" }}><i className="fileuploader-icon-download"></i> Download</button></a></li>

                                    </li>
                                </ul>
                            </div>
                            <div className="fileuploader-popup-header">
                                <ul className="fileuploader-popup-meta">
                                    <li>
                                        <span>Name:</span>
                                        <h5>{name}</h5>
                                    </li>
                                    <li>
                                        <span>Type:</span>
                                        <h5>{type}</h5>
                                    </li>
                                    <li>
                                        <span>Size:</span>
                                        <h5>{size}</h5>
                                    </li>
                                    <li>
                                        <span>Dimensions:</span>
                                        <h5>{dimension}</h5>
                                    </li>
                                </ul>
                                <div className="fileuploader-popup-info">
                                </div>
                                <ul className="fileuploader-popup-buttons">
                                    <li>
                                        <button type="button" className="fileuploader-popup-button" data-action="cancel"
                                            //onClick={() => { isPopupOpen(false) }}
                                        >Cancel</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button type="button" className="fileuploader-popup-move" data-action="next">
                            <i className="fileuploader-icon-arrow-right">
                            </i>
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UploadPopup