using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class TM_EmailTemplate
    {
        public int nEmailTemplateID { get; set; }
        public string sSubject { get; set; }
        public string sContent { get; set; }
        public string sEmailTemplate_Description { get; set; }
        public DateTime dUpdate { get; set; }
        public string sUpdateBy { get; set; }
    }
}
