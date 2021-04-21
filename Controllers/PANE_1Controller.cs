using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysModalGlobal;
using System;
using System.Collections.Generic;
using System.Linq;


namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PANE_1Controller : ControllerBase
    {

        public SoftthaiWebContext db = new SoftthaiWebContext();
        [HttpPost]
        public IActionResult GetFileList(int nPanelID, int nMainMenuID)
        {
            T_MainMenu_Panel_File qt_mainMenu_panel_file = new T_MainMenu_Panel_File();
            lstFile objFile = new lstFile();
            db = new SoftthaiWebContext();
            qt_mainMenu_panel_file = db.T_MainMenu_Panel_File.Where(w => w.nPanelID == nPanelID && w.nMainMenuID == nMainMenuID).FirstOrDefault();
            if (qt_mainMenu_panel_file != null)
            {

                objFile.sFileName = qt_mainMenu_panel_file.sFileName_Origin;
                objFile.sSaveToFileName = qt_mainMenu_panel_file.sFileName_System;
                //objFile.sSize = qt_mainMenu_panel_file.sFileSize;
                objFile.sSaveToPath = qt_mainMenu_panel_file.sFolderPath;
                objFile.IsNewFile = false;
                objFile.IsDelete = false;
            }

            return Ok(objFile);

        }

        public IActionResult GetIsActive(int nPanelID, int nMainMenuID)
        {
            T_MainMenu_Panel qt_mainMenu_panel = new T_MainMenu_Panel();
            db = new SoftthaiWebContext();
            bool isActive = db.T_MainMenu_Panel.Where(w => w.nPanelID == nPanelID && w.nMainMenuID == nMainMenuID).Select(s => s.isActive).FirstOrDefault();

            return Ok(isActive);

        }



        //[HttpPost]
        //public CResutlWebMethod Savedata(PANE_1SaveData data)
        //{
        //    UserAccount user = new UserAccount();
        //    CResutlWebMethod result = new CResutlWebMethod();
        //    db = new SoftthaiWebContext();
        //    result.sStatus = Systemfunction.process_Success();
        //    try
        //    {
        //        if (!db.T_Project.Any(w => w.sTitle.ToLower().Trim() == data.TitleName.ToLower().Trim() && w.isDel == false && w.nID + "" != data.nID))
        //        {

        //            if (data.file.Count > 0)
        //            {
        //                user = _Auth.GetUserAccount();
        //                var qdata = db.T_Project.FirstOrDefault(w => w.nID + "" == data.nID);
        //                string sProjectPath = "T_Project";
        //                string sTempPath = "Temp";
        //                string foldersTempPath = MapCurrentPath(sTempPath + "/");
        //                string foldersProjectPath = MapCurrentPath(sProjectPath + "/");
        //                string ProjectTemp = "UploadFile/" + sProjectPath + "/" + data.file[0].sSaveToFileName;

        //                if (qdata == null)
        //                {
        //                    qdata = new T_Project();
        //                    qdata.dCreate = DateTime.Now;
        //                    qdata.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);

        //                    db.T_Project.Add(qdata);
        //                }
        //                qdata.sTitle = data.TitleName;
        //                qdata.sDesc = data.sDesc;
        //                qdata.isActive = data.isActive;
        //                qdata.dUpdate = DateTime.Now;
        //                qdata.nUserID_Update = Systemfunction.ParseIntToNull(user.sUserID);
        //                qdata.sFilePath = ProjectTemp;
        //                qdata.sFileName = data.file[0].sFileName;
        //                qdata.sSystemFileName = data.file[0].sSaveToFileName;
        //                qdata.sFileSize = data.file[0].sSize;
        //                qdata.nTypeId = data.nTypeId;


        //                db.SaveChanges();

        //                if (data.file[0].IsNewFile)
        //                {

        //                    SysFunc.FolderCreate("T_Project");
        //                    string OldTemp = foldersTempPath + data.file[0].sSaveToFileName;
        //                    string NewTemp = foldersProjectPath + data.file[0].sSaveToFileName;

        //                    System.IO.File.Move(OldTemp, NewTemp);
        //                    DeleteFile(OldTemp);
        //                }


        //            }
        //            else
        //            {
        //                result.sStatus = Systemfunction.process_Warning();
        //            }
        //        }
        //        else
        //        {
        //            result.sMsg = "ชื่อโครงการนี้มีในระบบแล้ว";
        //            result.sStatus = Systemfunction.process_Warning();
        //        }


        //    }
        //    catch (Exception e)
        //    {
        //        result.sStatus = Systemfunction.process_Failed();
        //        result.sMsg = e.ToString();
        //    }
        //    return result;

        //}



        public class PANE_1SaveData
        {
            public int nPanelID { get; set; }
            public string nMainMenuID { get; set; }
            public bool IsActive { get; set; }
            public List<cArrFile> file { get; set; }
        }

    }






}
