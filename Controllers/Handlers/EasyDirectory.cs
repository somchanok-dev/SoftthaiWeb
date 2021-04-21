using System.IO;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Hosting;

public class EasyDirectory
{
    private static readonly IWebHostEnvironment HostingEnvironment;

    public static string MapPath(string sPath)
    {
        if (!sPath.StartsWith("/")) sPath = "/" + sPath;
        return  HostingEnvironment.WebRootPath + sPath.Replace("/", "\\");
    }

    /// <summary>
    /// สร้าง Folder ตาม Path ที่กำหนด
    /// </summary>
    /// <param name="sPath">Example : ~/UploadFiles/Temp/</param>
    public static void CreateDirectory(string sPath)
    {
        if (!string.IsNullOrEmpty(sPath))
        {
            string sMapPath = MapPath(sPath);
            if (!Directory.Exists(sMapPath)) Directory.CreateDirectory(sMapPath);
        }
    }

    /// <summary>
    /// ลบ File
    /// </summary>
    /// <param name="sPath">Example : ~/UploadFiles/Temp/</param>
    /// <param name="sFileName">Example : image.jpg</param>
    public static void DeleteFile(string sPath, string sFileName)
    {
        if (!string.IsNullOrEmpty(sPath) && !string.IsNullOrEmpty(sFileName))
        {
            string sDestinationFile = MapPath(sPath) + sFileName;
            if (File.Exists(sDestinationFile))
                try { File.Delete(sDestinationFile); }
                catch { }
        }
    }

    /// <summary>
    /// ย้าย File
    /// </summary>
    /// <param name="sMapPath_FROM">Path ต้นทาง ที่ทำการ Mapping แล้ว (Example : E:\\Folder\Folder1\example-file.ext)</param>
    /// <param name="sMapPath_TO">Path ปลายทาง ที่ทำการ Mapping แล้ว (Example : E:\\Folder\Folder2\example-file.ext)</param>
    public static void MoveFile(string sMapPath_FROM, string sMapPath_TO)
    {
        if (File.Exists(sMapPath_FROM) && !File.Exists(sMapPath_TO)) File.Move(sMapPath_FROM, sMapPath_TO);
    }

    /// <summary>
    /// คัดลอก File
    /// </summary>
    /// <param name="sMapPath_FROM">Path ต้นทาง ที่ทำการ Mapping แล้ว (Example : E:\\Folder\Folder1\example-file.ext)</param>
    /// <param name="sMapPath_TO">Path ปลายทาง ที่ทำการ Mapping แล้ว (Example : E:\\Folder\Folder2\example-file.ext)</param>
    public static void CopyFile(string sMapPath_FROM, string sMapPath_TO)
    {
        if (File.Exists(sMapPath_FROM) && !File.Exists(sMapPath_TO)) File.Copy(sMapPath_FROM, sMapPath_TO);
    }

    /// <summary>
    /// ตรวจสอบว่า File นี้เป็นรูปภาพหรือไม่
    /// </summary>
    /// <param name="sFileName">ชื่อ File</param>
    /// <returns></returns>
    public static bool IsImage(string sFileName)
    {
        List<string> lstIamgeExt = new List<string>() { ".jpg", ".jpeg", ".png", ".gif" };
        sFileName = sFileName.ToLower();
        return lstIamgeExt.Any(ext => sFileName.EndsWith(ext));
    }

    public static bool IsFileExists(string sFilePath)
    {
        return !string.IsNullOrEmpty(sFilePath) ? File.Exists(MapPath(sFilePath)) : false;
    }

    public class UploadedFile
    {
        public string sDocName { get; set; }
        public string sFileName { get; set; }
        public string sFileSysName { get; set; }
        public string sFilePath { get; set; }
    }
}