using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_AdminGroup_Permission
    {
        public int nID_UserGroup { get; set; }
        public int nID_Menu { get; set; }
        public int nPermission { get; set; }
    }
}
