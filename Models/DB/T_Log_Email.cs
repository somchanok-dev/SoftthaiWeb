using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_Log_Email
    {
        public long nLog_Email_ID { get; set; }
        public DateTime dLog_Email_Send { get; set; }
        public string sLog_Email_To { get; set; }
        public string sLog_Email_CC { get; set; }
        public string sLog_Email_Debug_To { get; set; }
        public string sLog_Email_Debug_CC { get; set; }
        public string sLog_Email_BCC { get; set; }
        public string sLog_Email_Subject { get; set; }
        public string sLog_Email_Content { get; set; }
        public bool IsLog_Email_Send { get; set; }
        public string sLog_Email_Exception { get; set; }
        public int nLog_Email_EmailTemplate_ID { get; set; }
        public int? nLog_Email_User_ID { get; set; }
    }
}
