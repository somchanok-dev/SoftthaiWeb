using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_CustomerRequest_File
    {
        public int nID { get; set; }
        public int nFileID { get; set; }
        public string sFileName_Origin { get; set; }
        public string sFileName_System { get; set; }
        public string sFolderPath { get; set; }
    }
}
