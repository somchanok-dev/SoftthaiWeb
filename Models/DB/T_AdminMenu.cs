using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_AdminMenu
    {
        public int nID { get; set; }
        public int? nHeadID { get; set; }
        public string sIcon { get; set; }
        public string sName { get; set; }
        public string sURL { get; set; }
        public bool isNewTab { get; set; }
        public int nOrder { get; set; }
        public bool isActive { get; set; }
        public bool isDel { get; set; }
    }
}
