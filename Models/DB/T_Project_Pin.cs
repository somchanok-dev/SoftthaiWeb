using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_Project_Pin
    {
        public int nID { get; set; }
        public int? nOrder { get; set; }
        public int? nUserID_Create { get; set; }
        public DateTime? dCreate { get; set; }
    }
}
