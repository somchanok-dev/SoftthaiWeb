using System;
using System.Collections.Generic;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class T_CustomerRequest
    {
        public int nID { get; set; }
        public int nRequestTypeID { get; set; }
        public int? nRequestSubTypeID { get; set; }
        public int nChannelID { get; set; }
        public string sChannelOther { get; set; }
        public string sTopic { get; set; }
        public string sDescription { get; set; }
        public string sReply { get; set; }
        public int? nStatusID { get; set; }
        public DateTime? dRequest { get; set; }
        public int? nUserID_Reply { get; set; }
        public DateTime? dReply { get; set; }
        public string sRequester { get; set; }
        public string sMobile { get; set; }
        public string sEmail { get; set; }
        public bool? IsRead { get; set; }
        public string sReplyType { get; set; }
    }
}
