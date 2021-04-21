using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_News_File
    {
        public int nFileID { get; set; }
        public int nID { get; set; }
        public string sFileName_Origin { get; set; }
        public string sFileName_System { get; set; }
        public string sFolderPath { get; set; }
        public bool isDel { get; set; }
        public string sFileSize { get; set; }
    }
}
