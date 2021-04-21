using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_Project
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
        public string sFileSize { get; set; }
        public bool isPin { get; set; }
        public int? nTypeId { get; set; }
    }
}
