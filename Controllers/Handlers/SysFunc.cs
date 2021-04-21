using System;
using System.Globalization;
using System.Text;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using SoftthaiWeb.Models.DB;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Web;
using Microsoft.Extensions.Hosting;

namespace SoftthaiWeb.SysGlobal
{
    public class SysFunc
    {
        private readonly string _env = Directory.GetCurrentDirectory();
        private readonly IHostEnvironment _env_Host;
        public static string FolderUploadFile { get { return "UploadFile"; } }

        public static string SessionExpire { get { return "SSEXP"; } }
        public static string process_Duplicate { get { return "DUP"; } }
        public static string process_Success { get { return "Success"; } }
        public static string process_Error { get { return "Error"; } }
        public static string sMsgDup { get { return "Duplicate Data"; } }

        public static void CallEntity(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
             .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
             .AddJsonFile("appsettings.json")
             .Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("SoftthaiWeb"));
            //Scaffold-DbContext "Your connection string here" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Tables tblEmployee, tblCities
            // optionsBuilder.UseSqlServer("Server=DESKTOP-57PSUV4;Initial Catalog=GCME_VMS;User ID=sa;Password=dewis1234;Persist Security Info=False;");
        }



        #region UploadFile
        /// <summary>
        /// ใช้สำหรับการ Create Folder
        /// </summary>
        /// <param name="sVal">Path ที่ต้องการ  Create</param>
        public static void FolderCreate(string sPath)
        {
            var path = MapPath(sPath);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public static string MapPath(string path)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory() + "\\ClientApp\\build\\UploadFile\\" + path.Replace("/", "\\"));
            return filePath;
        }
        #endregion

    }
}

