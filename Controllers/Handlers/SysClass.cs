using System;
using System.Collections.Generic;
using SoftthaiWeb.Models.DB;
using System.Data;

namespace SoftthaiWeb.SysModalGlobal
{
    public class CResutlWebMethod
    {
        public string sStatus { get; set; }
        public string sMsg { get; set; }
        public string sContent { get; set; }
        public int nPermission { get; set; }

    }
    public class cItemOption
    {
        public string value { get; set; }
        public string label { get; set; }
    }

    public class TB_Parameter
    {
        public int nEmailTemplateID { get; set; }
        public int nUser_ID { get; set; }
        public string sTo { get; set; }
        public string sCC { get; set; }
        public string sCol0 { get; set; }
        public string sCol1 { get; set; }
        public string sCol2 { get; set; }
        public string sCol3 { get; set; }
        public string sCol4 { get; set; }
        public string sCol5 { get; set; }
        public string sCol6 { get; set; }
        public string sCol7 { get; set; }
        public string sCol8 { get; set; }
        public string sCol9 { get; set; }
        public string sCol10 { get; set; }
        public string sCol11 { get; set; }
        public string sCol12 { get; set; }
        public string sCol13 { get; set; }
        public string sCol14 { get; set; }
        public string sCol15 { get; set; }
        public string sFormat { get; set; }
        public string sSubject { get; set; }
        public string sSubjectCol0 { get; set; }
        public string sSubjectCol1 { get; set; }
        public string sSubjectCol2 { get; set; }
        public string sSubjectCol3 { get; set; }
        public string sSubjectCol4 { get; set; }
        public string sSubjectCol5 { get; set; }
        public string sLink { get; set; }
        public string sBCC { get; set; }
    }
}