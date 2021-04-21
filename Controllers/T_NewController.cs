using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using SoftthaiWeb.Controllers;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysGlobal;
using SoftthaiWeb.SysModalGlobal;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using static SoftthaiWeb.App_Code._UploadFileUI;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class T_NewController : ControllerBase
    {
        public SoftthaiWebContext db = new SoftthaiWebContext();
        CultureInfo culture = new CultureInfo("en-US");
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public T_NewController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }
        public string MapCurrentPath(string path)
        {
            string webRootPath = _hostingEnvironment.ContentRootPath;
            var fileRoute = Path.Combine(webRootPath, "ClientApp\\build\\UploadFile");

            var filePath = fileRoute + "\\" + path.Replace("../", "\\").Replace("/", "\\");
            return filePath;
        }

        [HttpPost]
        public CResutlWebMethod Savedata(T_NewDetailData data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            result.sStatus = Systemfunction.process_Success();
            try
            {

                if (!db.T_News.Any(w => w.sTitle.ToLower().Trim() == data.TitleName.ToLower().Trim() && w.isDel == false && w.nID != data.nID))
                {

                    if (data.file.Count > 0)
                    {

                        user = _Auth.GetUserAccount();
                        T_News qDataTNews = db.T_News.FirstOrDefault(w => w.nID == data.nID);
                        string sNewPath = "T_News";
                        string sTepmPath = "Temp";
                        string foldersTempPath = MapCurrentPath(sTepmPath + "/");
                        string foldersNewPath = MapCurrentPath(sNewPath + "/");
                        string sNewTemp = "UploadFile/" + sNewPath + "/" + data.file[0].sSaveToFileName;

                        if (qDataTNews == null)
                        {
                            qDataTNews = new T_News();
                            qDataTNews.dUpdate = DateTime.Now;
                            qDataTNews.nUserID_Update = Systemfunction.ParseIntToNull(user.sUserID);
                            db.T_News.Add(qDataTNews);
                        }


                        qDataTNews.sTitle = data.TitleName;
                        qDataTNews.sDesc = data.sDesc;
                        qDataTNews.sContent = data.sContent;
                        qDataTNews.sFilePath = sNewTemp;
                        qDataTNews.dPost = Convert.ToDateTime(data.DateStart, culture);
                        qDataTNews.sFileName = data.file[0].sFileName;
                        qDataTNews.sFileSize = data.file[0].sSize;
                        qDataTNews.sSystemFileName = data.file[0].sSaveToFileName;
                        qDataTNews.isActive = (bool)data.isActive;


                        if (data.file[0].IsNewFile)
                        {

                            SysFunc.FolderCreate("T_News");

                            string OldTemp = foldersTempPath + data.file[0].sSaveToFileName;
                            string NewTemp = foldersNewPath + data.file[0].sSaveToFileName;

                            System.IO.File.Move(OldTemp, NewTemp);
                            DeleteFile(OldTemp);
                        }

                    }


                    List<T_News_File> qDataTNewsFiles = db.T_News_File.Where(w => w.nID == data.nID && w.isDel == false).ToList();
                    var nFileIDs = data.fileTNewsFile.Select(s => s.nFileID).ToList();
                    var nFileIDn = data.fileTNewsFile.Where(w => w.nFileID == 0).Select(s => s.nFileID).ToList();

                    if (data.fileTNewsFile.Count > 0)
                    {

                        foreach (T_News_File qDataTNewsFile in qDataTNewsFiles)
                        {
                            if (!nFileIDs.Contains(qDataTNewsFile.nFileID))
                            {
                                qDataTNewsFile.isDel = true;
                            }
                        }
                        if (nFileIDn.Count > 0)
                        {

                            foreach (cArrFile fileTNewsFilea in data.fileTNewsFile.Where(w => w.nFileID == 0))
                            {

                                T_News_File T_News_File = new T_News_File();
                                string sNewPath = "T_News_File/" + data.nID;
                                string sTepmPath = "Temp";
                                string foldersTempPath = MapCurrentPath(sTepmPath + "/");
                                string foldersNewPath = MapCurrentPath(sNewPath + "/");
                                string sNewTemp = "UploadFile/" + sNewPath + "/" + fileTNewsFilea.sSaveToFileName;

                                T_News_File.nID = data.nID;
                                T_News_File.sFileName_Origin = fileTNewsFilea.sFileName;
                                T_News_File.sFileName_System = fileTNewsFilea.sSaveToFileName;
                                T_News_File.sFolderPath = sNewTemp;
                                T_News_File.sFileSize = fileTNewsFilea.sSize;
                                db.T_News_File.Add(T_News_File);

                                if (fileTNewsFilea.IsNewFile)
                                {

                                    SysFunc.FolderCreate("T_News_File/" + data.nID);

                                    string OldTemp = foldersTempPath + fileTNewsFilea.sSaveToFileName;
                                    string NewTemp = foldersNewPath + fileTNewsFilea.sSaveToFileName;

                                    System.IO.File.Move(OldTemp, NewTemp);
                                    DeleteFile(OldTemp);
                                }
                            }
                        }
                    }
                    else
                    {
                        qDataTNewsFiles.ForEach(e => e.isDel = true);

                    }
                    db.SaveChanges();


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
        public T_NewlstData Getlstdata()
        {
            T_NewlstData result = new T_NewlstData();
            db = new SoftthaiWebContext();
            var qData = db.T_News.Where(w => w.isDel == false).OrderByDescending(o => o.dUpdate).ToList();
            List<retlstData> lstdata = new List<retlstData>();
            foreach (var i in qData)
            {
                retlstData s = new retlstData();
                s.nID = i.nID;
                s.sTitle = i.sTitle;
                s.sDesc = i.sDesc;
                s.dPost = i.dPost;
                s.isActive = i.isActive;
                s.isPin = i.isPin;

                lstdata.Add(s);
            }
            result.lstData = lstdata;

            return result;
        }


        public T_NewlstData SearchTNewbyTitle(string txtSearch, string sIsActive)
        {
            T_NewlstData result = new T_NewlstData();

            db = new SoftthaiWebContext();
            var qData = db.T_News.Where(w => w.isDel == false && w.sTitle.Trim().ToLower().Contains((txtSearch??"").Trim().ToLower())
            &&(sIsActive != null ? w.isActive ==(sIsActive == "1" ): 1 == 1)).OrderByDescending(o => o.dUpdate).ToList();

            List<retlstData> lstdata = new List<retlstData>();
            foreach (var i in qData)
            {
                retlstData s = new retlstData();
                s.nID = i.nID;
                s.sTitle = i.sTitle;
                s.sDesc = i.sDesc;
                s.dPost = i.dPost;
                s.isActive = i.isActive;
                s.isPin = i.isPin;

                lstdata.Add(s);
            }
            result.lstData = lstdata;

            return result;
        }


        public retlstData Getdata_detail(Mode_Edit_id data)
        {
            retlstData result = new retlstData();
            db = new SoftthaiWebContext();
            var qData = db.T_News.FirstOrDefault(w => w.nID == data.nID);

            List<T_News_File> qDatatNewsFile = db.T_News_File.Where(w => w.nID == data.nID && w.isDel == false).ToList();

            if (qData != null)
            {
                result.sTitle = qData.sTitle;
                result.sDesc = qData.sDesc;
                result.dPost = qData.dPost;
                result.isActive = qData.isActive;
                result.sPost = qData.dPost.Value.ToString("dd/MM/yyyy");
                result.sSystemFileName = qData.sSystemFileName;
                result.sContent = qData.sContent;

                result.listFile = new List<lstFile>();
                lstFile objFile = new lstFile();

                objFile.sFileName = qData.sFileName;
                objFile.sSaveToFileName = qData.sSystemFileName;
                objFile.sSize = qData.sFileSize;
                objFile.sSaveToPath = qData.sFilePath;
                objFile.IsNewFile = false;
                objFile.IsDelete = false;

                result.listFile.Add(objFile);

                result.listTNewFile = new List<lstFile>();
                foreach (T_News_File a in qDatatNewsFile)
                {

                    lstFile objlistTNewFile = new lstFile();
                    objlistTNewFile.nFileID = a.nFileID;
                    objlistTNewFile.sFileName = a.sFileName_Origin;
                    objlistTNewFile.sSaveToFileName = a.sFileName_System;
                    objlistTNewFile.sSize = a.sFileSize;
                    objlistTNewFile.sSaveToPath = a.sFolderPath;
                    objlistTNewFile.IsNewFile = false;
                    objlistTNewFile.IsDelete = false;

                    result.listTNewFile.Add(objlistTNewFile);
                }

                result.sStatus = Systemfunction.process_Success();
            }
            else
            {
                result.sStatus = Systemfunction.process_Failed();
            }
            return result;
        }
        public T_NewlstData Del_datarow(GetnID data)
        {
            T_NewlstData result = new T_NewlstData();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            if (data.nID.Count > 0)
            {
                user = _Auth.GetUserAccount();

                var qData = db.T_News.Where(w => data.nID.Contains(w.nID)).ToList();
                foreach (var i in qData)
                {
                    i.isDel = true;
                    i.nUserID_Delete = Systemfunction.ParseIntToNull(user.sUserID);

                    db.SaveChanges();
                }

                Del_datarowPins(data);


                result.sStatus = Systemfunction.process_Success();
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
                var qData = db.T_News_Pin.Where(w => data.nID.Contains(w.nID)).ToList();
                db.T_News_Pin.RemoveRange(qData);
                db.SaveChanges();

                var qData_Pin = db.T_News.Where(w => data.nID.Contains(w.nID)).ToList();
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
        public T_NewlstData Change_Pins(retlstData data)
        {
            T_NewlstData result = new T_NewlstData();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            var qCheckPinsMax = db.T_News_Pin.ToList();
            if (qCheckPinsMax.Count < 5  || (qCheckPinsMax.Count <= 5 && data.isPin==false))
            {
                int nID = data.nID;
                var qUpdate = db.T_News.FirstOrDefault(w => w.nID == nID);
                if (qUpdate != null)
                {
                    user = _Auth.GetUserAccount();
                    qUpdate.isPin = data.isPin;


                    ///check  nOrders
                    var nOrders = db.T_News_Pin.OrderBy(o => o.nOrder).Select(s => s.nOrder).ToList();
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
                        T_News_Pin s = new T_News_Pin();
                        s.nID = nID;
                        s.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);
                        s.nOrder = nOrder;  
                        s.dCreate = DateTime.Now;
                        db.T_News_Pin.Add(s);
                    }
                    else
                    {
                        var qData_Pin = db.T_News_Pin.FirstOrDefault(w => w.nID == nID);
                        db.T_News_Pin.RemoveRange(qData_Pin);
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
        public T_PinDetailData SetOrder(GetOrdet_Pin data)
        {
            T_PinDetailData result = new T_PinDetailData();
            int nID = data.nID;
            int nOrder = data.nOrder;
            var lstItem = db.T_News_Pin.ToList();
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
                result.sStatus = Systemfunction.process_Success();
            }
            else
            {
                result.sMsg = "ไม่พบข้อมูลไม่ถูกต้อง";
                result.sStatus = Systemfunction.process_Warning();
            }
            return result;
        }
        public T_PinDetailData GetPinlstdata()
        {
            T_PinDetailData result = new T_PinDetailData();
            db = new SoftthaiWebContext();
            //var lstPins = db.T_News_Pin.Where(w => w.isDel == false).ToList();

            var lstPins = (from p in db.T_News_Pin
                           from n in db.T_News.Where(w => w.nID == p.nID)
                           select new TNewsRetruntData
                           {
                               dPost = n.dPost,
                               nOrder = p.nOrder,
                               nID = p.nID,
                               sTitle = n.sTitle,

                           }).OrderBy(o => o.dPost).ToList();
            result.lstData = lstPins;

            return result;
        }









    }


    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UploadFileNewsController : Controller
    {
        private readonly IHostEnvironment _env;

        public UploadFileNewsController(IHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> uploadImage(List<IFormFile> files)
        {
            // Get the file from the POST request
            var theFile = HttpContext.Request.Form.Files.GetFile("file");
            var db = new SoftthaiWebContext();
            string sPathWeb = db.TM_Config.Where(w => w.nConfig_ID == 1).Select(s => s.sConfig_Varchar).FirstOrDefault();

            //string sPathWeb = db.TM_Config.Where(w => w.nConfig_ID == 7).Select(s => s.sConfig_Varchar).FirstOrDefault();
            //if (_env.IsDevelopment())
            //{
            //    sPathWeb = "https://localhost:44376/";
            //}

            // Get the server path, wwwroot   Forder รูป
            string webRootPath = _env.ContentRootPath;

            SysFunc.FolderCreate("TextEditor");

            // Building the path to the uploads directory   ที่อยู่รูป
            var fileRoute = Path.Combine(webRootPath, "ClientApp\\build\\UploadFile\\TextEditor");

            // Get the mime type
            var mimeType = HttpContext.Request.Form.Files.GetFile("file").ContentType;

            // Get File Extension   ชื่อรูป
            string extension = System.IO.Path.GetExtension(theFile.FileName);

            // Generate Random name.  เปลี่ยนชื่อรูป
            string name = Guid.NewGuid().ToString().Substring(0, 8) + extension;

            // Build the full path inclunding the file name
            string link = Path.Combine(fileRoute, name);

            // Create directory if it does not exist.
            FileInfo dir = new FileInfo(fileRoute);
            dir.Directory.Create();

            // Basic validation on mime types and file extension
            string[] imageMimetypes = { "image/gif", "image/jpeg", "image/pjpeg", "image/x-png", "image/png", "image/svg+xml" };
            string[] imageExt = { ".gif", ".jpeg", ".jpg", ".png", ".svg", ".blob" };
            string[] videoMimetypes = { "video/mp4", "video/webm", "video/ogg" };
            string[] videoExt = { ".mp4", ".webm", ".ogg" };
            try
            {
                mimeType = mimeType.ToLower();
                extension = extension.ToLower();
                if (Array.IndexOf(imageMimetypes, mimeType) >= 0 && (Array.IndexOf(imageExt, extension) >= 0)
                || Array.IndexOf(videoMimetypes, mimeType) >= 0 && (Array.IndexOf(videoExt, extension) >= 0))
                {
                    // Copy contents to memory stream.
                    Stream stream;
                    stream = new MemoryStream();
                    theFile.CopyTo(stream);
                    stream.Position = 0;
                    String serverPath = link;

                    // Save the file
                    using (FileStream writerFileStream = System.IO.File.Create(serverPath))
                    {
                        await stream.CopyToAsync(writerFileStream);
                        writerFileStream.Dispose();
                    }



                    // Return the file path as json
                    Hashtable imageUrl = new Hashtable();
                    imageUrl.Add("link", sPathWeb + "UploadFile/TextEditor/" + name);

                    return Json(imageUrl);
                }
                throw new ArgumentException("The image did not pass the validation");
            }

            catch (ArgumentException ex)
            {
                return Json(ex.Message);
            }
        }

        //    [HttpPost]
        //    public void Save()
        //    {
        //        //Upload 1 file on server
        //        //Case Multi upload file => program will call this method n times (n = Number of files)

        //        IFormFileCollection formFile = HttpContext.Request.Form.Files;
        //        string Filename = formFile[0].FileName;

        //        string path = Path.Combine(_env.ContentRootPath, "ClientApp\\src\\UploadFile\\Temp");
        //        SysFunc.FolderCreate("Temp");
        //        #region
        //        //string[] arrfilename = (Filename + "").Split('.');
        //        //string sSysFileName = "";
        //        //if (!Directory.Exists(path))
        //        //{
        //        //    System.IO.Directory.CreateDirectory(path);
        //        //}
        //        //for (int j = 0; j < (arrfilename.Length - 1); j++)
        //        //{
        //        //    sSysFileName += arrfilename[j];
        //        //}


        //        //sSysFileName = sSysFileName + "_" + DateTime.Now.ToString("ddMMyyyyHHmmss") + "." + arrfilename[arrfilename.Length - 1];
        //        #endregion

        //        string filePath = Path.Combine(path, Filename);

        //        //Code for save path file to database ....
        //        //....

        //        if (System.IO.File.Exists(filePath))
        //        {
        //            System.IO.File.Delete(filePath);
        //        }

        //        using (FileStream stream = System.IO.File.Create(filePath))
        //        {
        //            formFile[0].CopyTo(stream);
        //        }
        //    }

        //    [HttpPost]
        //    public void Remove()
        //    {
        //        //Delete 1 file on server
        //        #region "Commented Code"
        //        //IFormFileCollection formFile = HttpContext.Request.Form.Files;
        //        //string Filename = formFile[0].FileName; ;
        //        //string PathSave = "F:\\TempUpload";

        //        //string filePath = Path.Combine(PathSave, Filename);

        //        //System.IO.File.Delete(filePath);
        //        #endregion
        //    }
    }







}
#region calss
public class GetOrdet_Pin
{
    public int nID { get; set; }
    public int nOrder { get; set; }
}
public class T_NewlstData : CResutlWebMethod
{
    public List<retlstData> lstData { get; set; }
}
public class GetnID : CResutlWebMethod
{
    public List<int?> nID { get; set; }
}
public class TNewsPinlstData
{
    public List<retlstData> lstData { get; set; }
}
public class T_PinDetailData : CResutlWebMethod
{
    public List<TNewsRetruntData> lstData { get; set; }
}
public class TNewsRetruntData
{
    public int? nID { get; set; }
    public int? nOrder { get; set; }
    public string sTitle { get; set; }
    public DateTime? dPost { get; set; }
}
public class T_NewDetailData : CResutlWebMethod
{
    public int nID { get; set; }
    public string DateStart { get; set; }
    public string TitleName { get; set; }
    public string sDesc { get; set; }
    public bool? isActive { get; set; }
    public string sContent { get; set; }
    public List<cArrFile> file { get; set; }
    public List<cArrFile> fileTNewsFile { get; set; }
}

public class Mode_Edit_id
{
    public int nID { get; set; }
}
public class retlstData : CResutlWebMethod
{
    public int nID { get; set; }
    public string sTitle { get; set; }
    public string sDesc { get; set; }
    public string sFileName { get; set; }
    public string sFileSize { get; set; }
    public string lstFile { get; set; }
    public string sSystemFileName { get; set; }
    public string FileToPath { get; set; }
    public string sFilePath_Cover { get; set; }
    public DateTime? dPost { get; set; }
    public string sPost { get; set; }
    public bool isActive { get; set; }
    public bool isPin { get; set; }
    public int? nUserID_Create { get; set; }
    public DateTime? dCreate { get; set; }
    public int? nUserID_Update { get; set; }
    public DateTime? dUpdate { get; set; }
    public int? nUserID_Delete { get; set; }
    public int? nOrder { get; set; }
    public DateTime? dDelete { get; set; }
    public List<lstFile> listFile { get; set; }
    public bool isDel { get; set; }
    public string sContent { get; set; }

    public List<lstFile> listTNewFile { get; set; }

}
public class lstFile
{
    public bool IsCompleted { get; set; }
    public bool IsDelete { get; set; }
    public bool IsNewFile { get; set; }
    public int nID { get; set; }
    public string sFileName { get; set; }
    public string sSize { get; set; }
    public string sMsg { get; set; }
    public string sSaveToFileName { get; set; }
    public string sSaveToPath { get; set; }
    public string sFileType { get; set; }
    public string sUrl { get; set; }
    public int nFileID { get; set; }


}

#endregion