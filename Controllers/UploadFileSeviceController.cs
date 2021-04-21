using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
namespace SoftthaiWeb.Controllers
{
    [ApiController]
    [Route("api/[action]")]
    public class UploadFileSeviceController : ControllerBase
    {
        private readonly IHostEnvironment _env;
        public UploadFileSeviceController(IHostEnvironment env)
        {
            _env = env;
        }
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
                            data.sSaveToFileName = sSysFileName;
                            data.sFileName = sFileName;
                            data.sSaveToPath = "Uploadfile/" + filepath;
                            data.sUrl = filepath + sSysFileName;
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

        [HttpGet("delete")]
        public IActionResult DeleteFile(string delfilename)
        {
            ItemData data = new ItemData();

            try
            {
                if (System.IO.File.Exists(MapCurrentPath(delfilename.Replace("../", "\\").Replace("/", "\\"))))
                {

                    System.IO.File.Delete(MapCurrentPath(delfilename.Replace("../", "\\").Replace("/", "\\")));
                }
                data.IsCompleted = true;
                return Ok(data);
            }
            catch (Exception error)
            {


                return StatusCode(500, new { result = "", message = error });
            }

        }
        [HttpPost]
        public IActionResult MoveFile(string sTempPath, string sNewPath, string sSysFileName)
        {
            ItemData data = new ItemData();

            try
            {
                if (!Directory.Exists(MapCurrentPath(sNewPath.Replace("../", "\\").Replace("/", "\\"))))
                {
                    Directory.CreateDirectory(MapCurrentPath(sNewPath.Replace("../", "\\").Replace("/", "\\")));
                }
                if (System.IO.File.Exists(MapCurrentPath(sTempPath.Replace("../", "\\").Replace("/", "\\") + sSysFileName)))
                {

                    System.IO.File.Move(MapCurrentPath(sTempPath.Replace("../", "\\").Replace("/", "\\") + sSysFileName), MapCurrentPath(sNewPath.Replace("../", "\\").Replace("/", "\\") + sSysFileName));
                }
                DeleteFile(MapCurrentPath(sTempPath.Replace("../", "\\").Replace("/", "\\") + sSysFileName));
                data.IsCompleted = true;

                return Ok(data);
            }
            catch (Exception error)
            {


                return StatusCode(500, new { result = "", message = error });
            }

        }
        public IActionResult DeleteFileNewPath(string sNewPath, string sSysFileName)
        {
            ItemData data = new ItemData();
            try
            {

                if (System.IO.File.Exists(MapCurrentPath(sNewPath.Replace("../", "\\").Replace("/", "\\") + sSysFileName)))
                {

                    System.IO.File.Delete(MapCurrentPath(sNewPath.Replace("../", "\\").Replace("/", "\\") + sSysFileName));
                }
                data.IsCompleted = true;

                return Ok(data);
            }
            catch (Exception error)
            {


                return StatusCode(500, new { result = "", message = error });
            }

        }

        public string MapCurrentPath(string path)
        {
            string webRootPath = _env.ContentRootPath;
            var fileRoute = Path.Combine(webRootPath, "ClientApp\\build\\UploadFile\\");

            var filePath = fileRoute + "\\" + path.Replace("../", "\\").Replace("/", "\\");
            return filePath;
        }
        public class ItemData
        {
            public int nID { get; set; }
            public string sSaveToFileName { get; set; }
            public string sFileName { get; set; }
            public string sSaveToPath { get; set; }
            public string sSize { get; set; }

            public string sUrl { get; set; }
            public bool IsNewFile { get; set; }
            public bool IsCompleted { get; set; }
            public string sMsg { get; set; }
            public bool IsDelete { get; set; }
            public string sFileType { get; set; }
        }
    }
}