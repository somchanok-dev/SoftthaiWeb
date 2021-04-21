using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_MainMenu_Panel
    {
        public int nMainMenuID { get; set; }
        public int nPanelID { get; set; }
        public string sName { get; set; }
        public int nOrder { get; set; }
        public string sURL_AdjustPage { get; set; }
        public bool isActive { get; set; }
        public int? nUserID_Update { get; set; }
        public DateTime? dUpdate { get; set; }
    }
}
