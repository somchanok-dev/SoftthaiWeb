using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_MainMenu_Panel_File
    {
        public int nMainMenuID { get; set; }
        public int nPanelID { get; set; }
        public int nFileID { get; set; }
        public string sFileName_Origin { get; set; }
        public string sFileName_System { get; set; }
        public string sFolderPath { get; set; }
    }
}
