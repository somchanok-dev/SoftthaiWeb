using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysGlobal;
using SoftthaiWeb.SysModalGlobal;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using static SoftthaiWeb.App_Code._UploadFileUI;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class T_ProjectController : ControllerBase
    {
        public SoftthaiWebContext db = new SoftthaiWebContext();
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;

        public string MapCurrentPath(string path)
        {
            string webRootPath = _hostingEnvironment.ContentRootPath;
            var fileRoute = Path.Combine(webRootPath, "ClientApp\\build\\UploadFile");

            var filePath = fileRoute + "\\" + path.Replace("../", "\\").Replace("/", "\\");
            return filePath;
        }

        public T_ProjectController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }


        [HttpPost]
        public CResutlWebMethod Savedata(T_ProjectSaveData data)
        {
            UserAccount user = new UserAccount();
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            result.sStatus = Systemfunction.process_Success();
            try
            {
                if (!db.T_Project.Any(w => w.sTitle.ToLower().Trim() == data.TitleName.ToLower().Trim() && w.isDel == false && w.nID + "" != data.nID))
                {

                    if (data.file.Count > 0)
                    {
                        user = _Auth.GetUserAccount();
                        var qdata = db.T_Project.FirstOrDefault(w => w.nID + "" == data.nID);
                        string sProjectPath = "T_Project";
                        string sTempPath = "Temp";
                        string foldersTempPath = MapCurrentPath(sTempPath + "/");
                        string foldersProjectPath = MapCurrentPath(sProjectPath + "/");
                        string ProjectTemp = "UploadFile/" + sProjectPath + "/" + data.file[0].sSaveToFileName;

                        if (qdata == null)
                        {
                            qdata = new T_Project();
                            qdata.dCreate = DateTime.Now;
                            qdata.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);

                            db.T_Project.Add(qdata);
                        }
                        qdata.sTitle = data.TitleName;
                        qdata.sDesc = data.sDesc;
                        qdata.isActive = data.isActive;
                        qdata.dUpdate = DateTime.Now;
                        qdata.nUserID_Update = Systemfunction.ParseIntToNull(user.sUserID);
                        qdata.sFilePath = ProjectTemp;
                        qdata.sFileName = data.file[0].sFileName;
                        qdata.sSystemFileName = data.file[0].sSaveToFileName;
                        qdata.sFileSize = data.file[0].sSize;
                        qdata.nTypeId = data.nTypeId;


                        db.SaveChanges();

                        if (data.file[0].IsNewFile)
                        {

                            SysFunc.FolderCreate("T_Project");
                            string OldTemp = foldersTempPath + data.file[0].sSaveToFileName;
                            string NewTemp = foldersProjectPath + data.file[0].sSaveToFileName;

                            System.IO.File.Move(OldTemp, NewTemp);
                            DeleteFile(OldTemp);
                        }


                    }
                    else
                    {
                        result.sStatus = Systemfunction.process_Warning();
                    }
                }
                else
                {
                    result.sMsg = "ชื่อโครงการนี้มีในระบบแล้ว";
                    result.sStatus = Systemfunction.process_Warning();
                }


            }
            catch (Exception e)
            {
                result.sStatus = Systemfunction.process_Failed();
                result.sMsg = e.ToString();
            }
            return result;

        }



        public IActionResult DeleteFile(string delfilename)
        {
            ItemData data = new ItemData();
            try
            {
                if (System.IO.File.Exists(MapCurrentPath(delfilename.Replace("/", "\\"))))
                {
                    System.IO.File.Delete(MapCurrentPath(delfilename.Replace("/", "\\")));
                }
                data.IsCompleted = true;
                return Ok(data);
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }

        }

        public List<T_Project> T_Project_list()
        {
            List<T_Project> tbProject = new List<T_Project>();
            db = new SoftthaiWebContext();
            tbProject = db.T_Project.Where(w => w.isDel == false).OrderByDescending(o => o.dUpdate).ToList();
            return tbProject;
        }


        public List<T_Project> SearchTProjectbyTitle(string txtSearch, string sIsActive)
        {

            List<T_Project> tbProject = new List<T_Project>();
            db = new SoftthaiWebContext();
            tbProject = db.T_Project.Where(w => w.isDel == false && w.sTitle.Trim().ToLower().Contains((txtSearch ?? "").Trim().ToLower())
            && (sIsActive != null ? w.isActive == (sIsActive == "1") : 1 == 1)).OrderByDescending(o => o.dUpdate).ToList();

            return tbProject;
        }

        public IActionResult T_Project(int nID)
        {
            RetlsT_Project retlsT_Project = new RetlsT_Project();


            T_Project qData = new T_Project();
            db = new SoftthaiWebContext();


            qData = db.T_Project.Where(w => w.nID == nID).FirstOrDefault();


            if (qData != null)
            {
                int id = qData.nID;
                retlsT_Project.sTitle = qData.sTitle;
                retlsT_Project.nTypeId = qData.nTypeId;
                retlsT_Project.sDesc = qData.sDesc;
                retlsT_Project.isActive = qData.isActive;
                retlsT_Project.sSystemFileName = qData.sSystemFileName;
                retlsT_Project.listFile = new List<lstFile>();

                var objFile = new lstFile();
                objFile.sFileName = qData.sFileName;
                objFile.sSaveToFileName = qData.sSystemFileName;
                objFile.sSize = qData.sFileSize;
                objFile.sSaveToPath = qData.sFilePath;
                objFile.IsNewFile = false;
                objFile.IsDelete = false;

                retlsT_Project.listFile.Add(objFile);

                retlsT_Project.sStatus = Systemfunction.process_Success();
            }
            else
            {
                retlsT_Project.sStatus = Systemfunction.process_Failed();
            }
            return Ok(retlsT_Project);

        }



        public lstFile GetlstFile(int nID)
        {
            lstFile lstFile = new lstFile();
            db = new SoftthaiWebContext();
            T_Project tbProject = new T_Project();
            tbProject = db.T_Project.Where(w => w.nID == nID).FirstOrDefault();

            lstFile.sFileName = tbProject.sFileName;
            lstFile.sSaveToFileName = tbProject.sSystemFileName;
            lstFile.sSize = tbProject.sTitle;
            lstFile.sSaveToPath = tbProject.sDesc;
            lstFile.IsNewFile = false;
            lstFile.IsDelete = false;
            return lstFile;
        }

        public CResutlWebMethod Del_T_Project(GetnID data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            UserAccount user = new UserAccount();
            if (data.nID.Count > 0)
            {
                user = _Auth.GetUserAccount();

                var qData = db.T_Project.Where(w => data.nID.Contains(w.nID)).ToList();


                foreach (var i in qData)
                {
                    i.isDel = true;
                    i.nUserID_Delete = Systemfunction.ParseIntToNull(user.sUserID);
                    db.SaveChanges();
                }
                result.sStatus = Systemfunction.process_Success();

                Del_datarowPins(data);

            }
            else
            {
                result.sStatus = Systemfunction.process_Warning();
            }
            return result;
        }

        public CResutlWebMethod Change_Pins(retlstData data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            var qCheckPinsMax = db.T_Project_Pin.ToList();
            if (qCheckPinsMax.Count < 5 || (qCheckPinsMax.Count <= 5 && data.isPin == false))
            {
                int nID = data.nID;
                var qUpdate = db.T_Project.FirstOrDefault(w => w.nID == nID);
                if (qUpdate != null)
                {
                    user = _Auth.GetUserAccount();
                    qUpdate.isPin = data.isPin;


                    var qT_Project_Pin = db.T_Project_Pin.FirstOrDefault(w => w.nID == nID);


                    ///check  nOrders
                    var nOrders = db.T_Project_Pin.OrderBy(o => o.nOrder).Select(s => s.nOrder).ToList();
                    var nOrder = 0;

                    if (nOrders != null)
                    {
                        for (var i = 0; i < nOrders.Count; i++)
                        {
                            if (nOrders[i] != i + 1)
                            {
                                nOrder = i + 1;
                                break;
                            }
                        }

                        nOrder = nOrder == 0 ? nOrders.Count + 1 : nOrder;
                    }
                    ///check  nOrders

                    if (data.isPin)
                    {
                        T_Project_Pin s = new T_Project_Pin();
                        s.nID = nID;
                        s.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);
                        s.dCreate = DateTime.Now;
                        s.nOrder = nOrder;
                        db.T_Project_Pin.Add(s);
                    }
                    else
                    {
                        var qData_Pin = db.T_Project_Pin.FirstOrDefault(w => w.nID == nID);
                        db.T_Project_Pin.RemoveRange(qData_Pin);
                    }
                    db.SaveChanges();
                    result.sStatus = Systemfunction.process_Success();
                }
                else
                {
                    result.sStatus = Systemfunction.process_Warning();
                }
            }
            else
            {
                result.sMsg = "สามารถปักหมุดได้ไม่เกิน 5 ข่าว";
                result.sStatus = Systemfunction.process_Warning();
            }

            return result;
        }

        public CResutlWebMethod SetOrder(GetOrdet_Pin data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            result.sStatus = Systemfunction.process_Success();
            int nID = data.nID;
            int nOrder = data.nOrder;
            var lstItem = db.T_Project_Pin.ToList();
            var c = lstItem.FirstOrDefault(w => w.nID == nID);

            if (c != null)
            {
                c.nOrder = nOrder;

                int n = 0;
                var lstItem_OTHER = lstItem.Where(w => w.nID != nID).OrderBy(o => o.nOrder).ToList();
                lstItem_OTHER.ForEach(i =>
                {
                    n += 1;
                    if (n == nOrder) n += 1;
                    i.nOrder = n;
                });

                db.SaveChanges();

            }
            else
            {
                result.sMsg = "ไม่พบข้อมูลไม่ถูกต้อง";
                result.sStatus = Systemfunction.process_Warning();
            }
            return result;
        }

        public CResutlWebMethod Del_datarowPins(GetnID data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            if (data.nID.Count > 0)
            {
                user = _Auth.GetUserAccount();
                var qData = db.T_Project_Pin.Where(w => data.nID.Contains(w.nID)).ToList();
                db.T_Project_Pin.RemoveRange(qData);
                db.SaveChanges();

                var qData_Pin = db.T_Project.Where(w => data.nID.Contains(w.nID)).ToList();
                foreach (var i in qData_Pin)
                {
                    i.isPin = false;

                    db.SaveChanges();
                }

                result.sStatus = Systemfunction.process_Success();
            }
            else
            {
                result.sStatus = Systemfunction.process_Warning();
            }
            return result;
        }


        public T_ProjectPinDetailData GetPinlstdata()
        {
            T_ProjectPinDetailData result = new T_ProjectPinDetailData();
            db = new SoftthaiWebContext();
            var lstPin = db.T_Project_Pin.ToList();
            var lstProject = db.T_Project.ToList();
            var lstPins = (from p in lstPin
                           from n in lstProject.Where(w => w.nID == p.nID)
                           select new TProjectRetruntData
                           {
                               nOrder = p.nOrder,
                               nID = p.nID,
                               sTitle = n.sTitle,

                           }).OrderBy(o => o.nID).ToList();

            //var lstPins_2 = db.V_Project_PIN.ToList();
            result.lstData = lstPins;

            //var lstOrder = db.T_Master_data.Where(w => w.nType == 1).ToList();
            //result.lstOrder = lstOrder.Select(s => new cItemOption
            //{
            //    value = s.nID + "",
            //    label = s.sName,
            //}).ToList();

            return result;
        }






    }

    #region calss
    public class T_ProjectSaveData
    {
        public string nID { get; set; }
        public string TitleName { get; set; }
        public string sDesc { get; set; }
        public bool isActive { get; set; }
        public int? nTypeId { get; set; }
        public List<cArrFile> file { get; set; }
    }
    public class cArrFile
    {
        public int ID { get; set; }
        public int nFileID { get; set; }
        public string sSaveToFileName { get; set; }
        public string sFileName { get; set; }
        public string sSize { get; set; }
        public string sSaveToPath { get; set; }
        public bool IsNewFile { get; set; }
    }

    public class RetlsT_Project : CResutlWebMethod
    {
        public int nID { get; set; }
        public string sTitle { get; set; }
        public string sDesc { get; set; }
        public string sFileName { get; set; }
        public string sSystemFileName { get; set; }
        public string sFilePath { get; set; }
        public string sFilePath_Cover { get; set; }
        public bool isActive { get; set; }
        public int? nUserID_Create { get; set; }
        public DateTime? dCreate { get; set; }
        public int? nUserID_Update { get; set; }
        public DateTime? dUpdate { get; set; }
        public int? nUserID_Delete { get; set; }
        public DateTime? dDelete { get; set; }
        public bool isDel { get; set; }
        public int? nTypeId { get; set; }
        public List<lstFile> listFile { get; set; }

    }

    public class T_ProjectPinDetailData : CResutlWebMethod
    {
        public List<TProjectRetruntData> lstData { get; set; }
        //public List<cItemOption> lstOrder { get; set; }
    }

    public class TProjectRetruntData
    {
        public int? nID { get; set; }
        public int? nOrder { get; set; }
        public string sTitle { get; set; }
    }
    #endregion

}