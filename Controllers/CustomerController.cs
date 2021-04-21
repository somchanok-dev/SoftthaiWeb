using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysGlobal;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static SoftthaiWeb.App_Code._UploadFileUI;
using SoftthaiWeb.SysModalGlobal;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        public SoftthaiWebContext db = new SoftthaiWebContext();
        CultureInfo culture = new CultureInfo("en-US");
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public CustomerController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }
        public CResutlWebMethod Savedata(T_ProjectSaveData data)
        {
            UserAccount user = new UserAccount();
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            result.sStatus = Systemfunction.process_Success();
            try
            {
                if (data.file.Count > 0)
                {
                    user = _Auth.GetUserAccount();
                    var qdata = db.T_Customer.FirstOrDefault(w => w.nID + "" == data.nID);
                    string sProjectPath = "T_Customer";
                    string sTempPath = "Temp";
                    string foldersTempPath = MapCurrentPath(sTempPath + "/");
                    string foldersProjectPath = MapCurrentPath(sProjectPath + "/");
                    string ProjectTemp = "/UploadFile/" + sProjectPath + "/" + data.file[0].sSaveToFileName;

                    if (qdata == null)
                    {
                        qdata = new T_Customer();
                        qdata.dCreate = DateTime.Now;
                        qdata.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);

                        db.T_Customer.Add(qdata);
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
                    if (!db.T_Customer.Any(w => w.sTitle.ToLower().Trim() == data.TitleName.ToLower().Trim() && w.isDel == false && w.nID != qdata.nID))
                    {
                        db.SaveChanges();
                    }
                    else
                    {
                        result.sMsg = "ชื่อโครงการนี้มีในระบบแล้ว";
                        result.sStatus = Systemfunction.process_Warning();
                    }

                    if (data.file[0].IsNewFile)
                    {
                        SysFunc.FolderCreate("T_Customer");
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
            catch (Exception e)
            {
                result.sStatus = Systemfunction.process_Failed();
                result.sMsg = e.ToString();
            }
            return result;

        }
        public string MapCurrentPath(string path)
        {
            string webRootPath = _hostingEnvironment.ContentRootPath;
            var fileRoute = Path.Combine(webRootPath, "ClientApp\\build\\UploadFile");

            var filePath = fileRoute + "\\" + path.Replace("../", "\\").Replace("/", "\\");
            return filePath;
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

        public GetMas_datalstCus Customer_lst()
        {
            GetMas_datalstCus result = new GetMas_datalstCus();
            List<T_Customer> lstCustomer = new List<T_Customer>();
            db = new SoftthaiWebContext();
            int Count = 1;
            lstCustomer = db.T_Customer.Where(w => w.isDel == false).OrderByDescending(o => o.dUpdate).ToList();
            List<Get_DataBytableCus> lst = new List<Get_DataBytableCus>();
            foreach (var i in lstCustomer)
            {
                Get_DataBytableCus s = new Get_DataBytableCus();
                s.nNo = Count;
                s.nID = i.nID;
                s.sTitle = i.sTitle;
                s.isActive = i.isActive;
                s.isPin = i.isPin;
                lst.Add(s);
                Count++;
            }
            result.lstData = lst;

            return result;
        }
        public GetMas_datalstCus Search_data(Search_Data data)
        {
            GetMas_datalstCus result = new GetMas_datalstCus();
            List<Get_DataBytableCus> lst = new List<Get_DataBytableCus>();
            db = new SoftthaiWebContext();
            if (data != null)
            {
                bool? IsActive = null;
                int nTypeID = Systemfunction.ParseIntToZero(data.nTypeID);
                if (data.IsActive != "")
                    if (data.IsActive == "2")
                    {
                        IsActive = false;
                    }
                    else
                    {
                        IsActive = true;
                    }
                var qGetMasData = db.T_Customer.Where(w => !w.isDel
                && (IsActive.HasValue ? w.isActive == IsActive : true)
                && (data.txtSearch != "" ? w.sTitle.ToLower().Contains(data.txtSearch.ToLower().Trim()) : true)).ToList();
                int Count = 1;
                foreach (var i in qGetMasData)
                {
                    Get_DataBytableCus s = new Get_DataBytableCus();
                    s.nNo = Count;
                    s.nID = i.nID;
                    s.sTitle = i.sTitle;
                    s.isActive = i.isActive;
                    lst.Add(s);
                    Count++;
                }
                result.lstData = lst;
                result.sStatus = Systemfunction.process_Success();
            }
            else
            {
                result.sMsg = "ข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
                result.sStatus = Systemfunction.process_Failed();
            }

            return result;
        }
        public CResutlWebMethod Del_lst(GetnID data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            UserAccount user = new UserAccount();
            if (data.nID.Count > 0)
            {
                user = _Auth.GetUserAccount();
                var qData = db.T_Customer.Where(w => data.nID.Contains(w.nID)).ToList();
                foreach (var i in qData)
                {
                    i.isDel = true;
                    i.nUserID_Delete = Systemfunction.ParseIntToNull(user.sUserID);
                    db.SaveChanges();
                }

                var qData_Pin = db.T_Customer_Pin.Where(w => data.nID.Contains(w.nID)).ToList();
                db.T_Customer_Pin.RemoveRange(qData_Pin);
                db.SaveChanges();

                result.sStatus = Systemfunction.process_Success();
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
            var qCheckPinsMax = db.T_Customer_Pin.ToList();
            int nID = data.nID;
            var qUpdate = db.T_Customer.FirstOrDefault(w => w.nID == nID);
            if (qUpdate != null)
            {
                user = _Auth.GetUserAccount();
                qUpdate.isPin = data.isPin;

                var nOrders = db.T_Customer_Pin.OrderBy(o => o.nOrder).Select(s => s.nOrder).ToList();
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

                var Cus_Change_Pins = db.T_Customer_Pin.FirstOrDefault(w => w.nID == nID);
                if (Cus_Change_Pins == null)
                {
                    T_Customer_Pin s = new T_Customer_Pin();
                    s.nID = nID;
                    //s.nOrder = db.T_Customer_Pin.Count() == 0 ? 1 : db.T_Customer_Pin.Count() + 1;
                    s.nOrder = nOrder;
                    s.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);
                    s.dCreate = DateTime.Now;
                    db.T_Customer_Pin.Add(s);

                    db.SaveChanges();
                    result.sStatus = Systemfunction.process_Success();
                }
                else
                {
                    GetnID getnID = new GetnID();
                    getnID.nID = new List<int?>();
                    getnID.nID.Add(data.nID);
                    Del_datarowPins(getnID);
                    result.sStatus = Systemfunction.process_Success();
                }
            }
            else
            {
                result.sStatus = Systemfunction.process_Warning();
            }
            return result;
        }
        public T_NewlstData Del_datarowPins(GetnID data)
        {
            T_NewlstData result = new T_NewlstData();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            if (data.nID.Count > 0)
            {
                user = _Auth.GetUserAccount();
                var qData = db.T_Customer_Pin.Where(w => data.nID.Contains(w.nID)).ToList();
                db.T_Customer_Pin.RemoveRange(qData);
                db.SaveChanges();

                var qData_Pin = db.T_Customer.Where(w => data.nID.Contains(w.nID)).ToList();
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
        public T_PinDetailData GetPinlstdata()
        {
            T_PinDetailData result = new T_PinDetailData();
            db = new SoftthaiWebContext();
            //var lstPin = db.T_Customer_Pin.ToList();
            //var lstProject = db.T_Customer.ToList();
            //var lstPins = (from p in lstPin
            //               from n in lstProject.Where(w => w.nID == p.nID)
            //               select new TNewsRetruntData
            //               {
            //                   nOrder = p.nOrder,
            //                   nID = p.nID,
            //                   sTitle = n.sTitle,
            //                   dPost = p.dCreate,

            //               }).OrderBy(o => o.nID).ToList();

            //result.lstData = lstPins;

            //var lstOrder = db.T_Customer_Pin.Select(s => s.nOrder).OrderBy(o => o).ToList();
            //if (lstOrder.Count == 0)
            //{
            //    lstOrder.Add(1);
            //}
            //result.lstOrder = lstOrder;
            var lstPins = (from p in db.T_Customer_Pin
                           from n in db.T_Customer.Where(w => w.nID == p.nID)
                           select new TNewsRetruntData
                           {
                               dPost = p.dCreate,
                               nOrder = p.nOrder,
                               nID = p.nID,
                               sTitle = n.sTitle,

                           }).OrderBy(o => o.dPost).ToList();
            result.lstData = lstPins;

            return result;
        }

        public CResutlWebMethod SetOrder(GetOrdet_Pin data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            result.sStatus = Systemfunction.process_Success();
            int nID = data.nID;
            int nOrder = data.nOrder;
            var lstItem = db.T_Customer_Pin.ToList();
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
        public IActionResult Customer(int nID)
        {
            RetlsT_Project retlsT_Project = new RetlsT_Project();


            T_Customer qData = new T_Customer();
            db = new SoftthaiWebContext();


            qData = db.T_Customer.Where(w => w.nID == nID).FirstOrDefault();


            if (qData != null)
            {
                int id = qData.nID;
                retlsT_Project.sTitle = qData.sTitle;
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
    }
    public class T_PinDetailData : CResutlWebMethod
    {
        public List<TNewsRetruntData> lstData { get; set; }
        public List<int?> lstOrder { get; set; }
    }
    public class TNewsRetruntData
    {
        public int? nID { get; set; }
        public int? nOrder { get; set; }
        public string sTitle { get; set; }
        public DateTime? dPost { get; set; }
    }
    public class GetMas_datalstCus : CResutlWebMethod
    {
        public List<Get_DataBytableCus> lstData { get; set; }
    }
    public class Get_DataBytableCus
    {
        public int nID { get; set; }
        public int nNo { get; set; }
        public string sTitle { get; set; }
        public string sDesc { get; set; }
        public string sFileName { get; set; }
        public string sSystemFileName { get; set; }
        public string sFilePath { get; set; }
        public bool isActive { get; set; }
        public int? nUserID_Create { get; set; }
        public DateTime? dCreate { get; set; }
        public int? nUserID_Update { get; set; }
        public DateTime? dUpdate { get; set; }
        public int? nUserID_Delete { get; set; }
        public DateTime? dDelete { get; set; }
        public bool isDel { get; set; }
        public string sFileSize { get; set; }
        public bool isPin { get; set; }
    }

}
