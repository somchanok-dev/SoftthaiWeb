using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_ContactInfo
    {
        public int nID { get; set; }
        public string sLabel { get; set; }
        public string sText { get; set; }
        public bool isActive { get; set; }
        public int? nUserID_Update { get; set; }
        public DateTime? dUpdate { get; set; }
    }
}
