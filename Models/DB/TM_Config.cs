using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class TM_Config
    {
        public int nConfig_ID { get; set; }
        public string sConfig_Name { get; set; }
        public DateTime? dConfig_Datetime { get; set; }
        public string sConfig_Varchar { get; set; }
        public int? nConfig_Int { get; set; }
        public bool? IsConfig_Bit { get; set; }
        public string sConfig_Description { get; set; }
    }
}
