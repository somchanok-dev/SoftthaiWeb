using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using static SoftthaiWeb.App_Code._UploadFileUI;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly IHostEnvironment _hostingEnvironment;
        public UploadFileController(IHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="path">Ex. >> /Path</param>
        /// <returns></returns>
        public string MapCurrentPath(string path)
        {
            string webRootPath = _hostingEnvironment.ContentRootPath;
            var fileRoute = Path.Combine(webRootPath, "ClientApp\\build\\UploadFile");

            var filePath = fileRoute + "\\" + path.Replace("../", "\\").Replace("/", "\\");
            return filePath;
        }

        [HttpPost, DisableRequestSizeLimit]

        public IActionResult UploadFileToTemp()
        {
            try
            {
                var data = new ItemData();
                string savetopath = HttpContext.Request.Query["savetopath"].ToString();
                //IHostingEnvironment env = new HostingEnvironment();
                //if (HttpContext.Request.Form.Files.Count > 0)
                //var xx = System.IO.Directory.GetDirectoryRoot();
                //var x = Path.GetPathRoot;
                var files = HttpContext.Request.Form.Files;
                //if (HttpContext.Request.Form.Files.Count > 0)
                if (HttpContext.Request.Form.Files.Count > 0)
                {
                    string filepath = "Temp";
                    if (!string.IsNullOrEmpty(savetopath))
                    {
                        filepath = savetopath + "";
                    }
                    string sFileName = "";
                    string sSysFileName = "";
                    string sFileType = "";
                    for (int i = 0; i < HttpContext.Request.Form.Files.Count; i++)
                    {
                        var file = HttpContext.Request.Form.Files[i];
                        sFileName = file.FileName;
                        string[] arrfilename = (sFileName + "").Split('.');
                        sFileType = file.ContentType;
                        if (string.IsNullOrEmpty(sSysFileName))
                        {
                            for (int j = 0; j < (arrfilename.Length - 1); j++)
                            {
                                sSysFileName += arrfilename[j];
                            }

                            sSysFileName = DateTime.Now.ToString("ddMMyyyyHHmmssff") + "." + arrfilename[arrfilename.Length - 1];
                        }
                        else
                        {
                            sSysFileName = sSysFileName + "." + arrfilename[arrfilename.Length - 1];

                        }
                        if (!System.IO.Directory.Exists(MapCurrentPath(filepath)))
                        {

                            System.IO.Directory.CreateDirectory(MapCurrentPath(filepath));
                        }

                        if (System.IO.Directory.Exists(MapCurrentPath(filepath)))
                        {


                            using (var stream = new FileStream(MapCurrentPath(filepath + "/" + sSysFileName), FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }
                            filepath = filepath.Replace("../", "");
                            data.nID = 0;
                            data.IsCompleted = true;
                            data.SaveToFileName = sSysFileName;
                            data.FileName = sFileName;
                            data.SaveToPath = "Uploadfile/" + filepath;
                            data.url = filepath + sSysFileName;
                            data.IsNewFile = true;
                            data.IsDelete = false;
                            data.sFileType = sFileType;
                            data.sMsg = "";
                        }
                        else
                        {
                            data.IsCompleted = false;
                            data.sMsg = "Error: Cannot create directory !";
                        }


                    }
                }


                return Ok(data);
            }
            catch (Exception error)
            {


                return StatusCode(500, new { result = "", message = error }); //return BadRequest();
            }
        }
        public IActionResult Upload()
        {
            try
            {
                List<ItemData> lstData = new List<ItemData>();
                var file = Request.Form.Files;
                var sfolder = Request.Form["sfolder"];
                var folderName = MapCurrentPath(sfolder);

                var pathToSave = folderName;
                var sSysFileName = "";
                var data = new ItemData();

                if (!System.IO.Directory.Exists(folderName))
                {
                    System.IO.Directory.CreateDirectory(folderName);
                }

                if (file.Count > 0)
                {
                    var nID = 0;
                    for (int i = 0; i < file.Count; i++)
                    {
                        var fileName = ContentDispositionHeaderValue.Parse(file[i].ContentDisposition).FileName.Trim('"');
                        string[] arrfilename = (fileName + "").Split('.');
                        sSysFileName = DateTime.Now.ToString("ddMMyyyyHHmmssff") + "." + arrfilename[arrfilename.Length - 1];
                        var fullPath = Path.Combine(pathToSave, sSysFileName);
                        var dbPath = Path.Combine(folderName, sSysFileName);
                        var sFileType = file[i].ContentType;
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file[i].CopyTo(stream);
                        }
                        data.IsCompleted = true;
                        data.SaveToFileName = sSysFileName;
                        data.FileName = fileName;
                        data.SaveToPath = "/UploadFile/" + sfolder;
                        data.url = fullPath;
                        data.IsNewFile = true;
                        data.IsNewChoose = true;
                        data.IsDelete = false;
                        data.sFileType = sFileType;
                        lstData.Add(data);
                        nID++;
                    }

                    return Ok(new { lstData });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpGet("deletefile")]
        public IActionResult DeleteFile(string delfilename, string sfolderName)
        {
            ItemData data = new ItemData();
            try
            {
                var folderName = MapCurrentPath("/FileUpload/" + sfolderName); //Path.Combine("FileUpload", sfolder);
                var pathToSave = folderName;
                var fullPath = Path.Combine(pathToSave, delfilename);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
                data.IsCompleted = true;
                return Ok(data);
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        [HttpGet("downloadFile")]
        public IActionResult DownloadFile(string sfilename, string sfolderName)
        {
            var folderName = MapCurrentPath("/FileUpload/" + sfolderName); //Path.Combine("FileUpload", sfolder);
            var pathToSave = folderName;
            var fullPath = Path.Combine(pathToSave, sfilename);
            if (System.IO.File.Exists(fullPath))
            {
                return Ok(fullPath);
            }
            else
            {
                return Ok("");
            }
        }
        [HttpGet("downloadFile")]
        [HttpPost("MoveFiles")]
        public IActionResult MoveFiles(string sTempPath, string sNewPath, string sSysFileName)
        {
            ItemData data = new ItemData();
            try
            {
                if (!Directory.Exists(MapCurrentPath(sNewPath.Replace("/", "\\"))))
                {
                    Directory.CreateDirectory(MapCurrentPath(sNewPath.Replace("/", "\\")));
                }
                if (System.IO.File.Exists(MapCurrentPath(sTempPath.Replace("/", "\\") + sSysFileName)))
                {
                    string OldTemp = MapCurrentPath(sTempPath.Replace("/", "\\") + sSysFileName);
                    string NewTemp = MapCurrentPath(sNewPath.Replace("/", "\\") + sSysFileName);
                    //System.IO.File.Move(OldTemp, NewTemp, true);
                    System.IO.File.Move(OldTemp, NewTemp);
                }
                DeleteFile(MapCurrentPath(sTempPath.Replace("/", "\\") + sSysFileName));
                data.IsCompleted = true;

                return Ok(data);
            }
            catch (Exception error)
            {
                return StatusCode(500, new
                {
                    result = "",
                    message = error
                });
            }
        }

        [HttpGet("delete")]
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
    }
}