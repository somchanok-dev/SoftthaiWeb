using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_MainMenu
    {
        public int nMainMenuID { get; set; }
        public int? nMainMenuID_Head { get; set; }
        public string sName { get; set; }
        public string cType { get; set; }
        public string sURL { get; set; }
        public string sHTMLContent { get; set; }
        public bool openNewTab { get; set; }
        public int? nOrder { get; set; }
        public bool isActive { get; set; }
        public bool isDel { get; set; }
        public bool isFixed { get; set; }
        public int? nUserID_Update { get; set; }
        public DateTime? dUpdate { get; set; }
        public int? nUserID_Create { get; set; }
        public DateTime? dCreate { get; set; }
        public int? nUserID_Delete { get; set; }
        public DateTime? dDelete { get; set; }
    }
}
