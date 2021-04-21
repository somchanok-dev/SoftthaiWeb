using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_MasterData
    {
        public int nID { get; set; }
        public int nTypeID { get; set; }
        public string sName { get; set; }
        public int nOrder { get; set; }
        public bool isActive { get; set; }
        public bool isDel { get; set; }
        public int? nUserID_Update { get; set; }
        public DateTime? dUpdate { get; set; }
        public int? nUserID_Create { get; set; }
        public DateTime? dCreate { get; set; }
        public int? nUserID_Delete { get; set; }
        public DateTime? dDelete { get; set; }
    }
}
