using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using SoftthaiWeb.Controllers;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysGlobal;
using SoftthaiWeb.SysModalGlobal;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using static SoftthaiWeb.App_Code._UploadFileUI;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CustomerCareController : ControllerBase
    {
        public SoftthaiWebContext db = new SoftthaiWebContext();
        CultureInfo culture = new CultureInfo("en-US");
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public CustomerCareController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }

        public List<cCustomerRequest> GetCustomerCare(DateTime? dsStartDate = null, DateTime? dsEndDate = null)
        {
            var tCustomerRequest = db.T_CustomerRequest.ToList();
            var tMasterData = db.T_MasterData.ToList();
            List<cCustomerRequest> data = (from a in tCustomerRequest
                                           join b in tMasterData on a.nRequestTypeID equals b.nID into tb
                                           from b in tb.DefaultIfEmpty()
                                           join c in tMasterData on a.nChannelID equals c.nID into tc
                                           from c in tc.DefaultIfEmpty()
                                           join d in tMasterData on a.nStatusID equals d.nID into td
                                           from d in td.DefaultIfEmpty()
                                           orderby a.nID
                                           select new cCustomerRequest
                                           {
                                               nRequestID = a.nID.ToString(),
                                               sReqDate = a.dRequest.HasValue ? a.dRequest.Value.ToString("dd/MM/yyyy") : "-",
                                               sReqTime = a.dRequest.HasValue ? a.dRequest.Value.ToString("HH:mm") : "-",
                                               sType = b == null ? "-" : b.sName,
                                               sTopic = a.sTopic ?? "",
                                               sReplyDate = a.dReply.HasValue ? a.dReply.Value.ToString("dd/MM/yyyy HH:mm") : "-",
                                               dRequestDate = a.dRequest,
                                               dReplyDate = a.dReply,
                                           }).ToList();
            if (dsStartDate.HasValue && dsEndDate.HasValue)
            {
                DateTime stDate = Convert.ToDateTime(dsStartDate);
                DateTime enDate = Convert.ToDateTime(dsEndDate);
                data = data.Where(b => (b.dRequestDate ?? DateTime.Now) == DateTime.Now || ((b.dRequestDate ?? DateTime.Now) >= stDate && (b.dRequestDate ?? DateTime.Now) <= enDate)).ToList();
            }
            else
            {
                if (dsStartDate.HasValue)
                {
                    DateTime stDate = Convert.ToDateTime(dsStartDate);
                    data = data.Where(b => (b.dRequestDate ?? DateTime.Now) == DateTime.Now || (b.dRequestDate ?? DateTime.Now) >= stDate).ToList();
                }
                if (dsEndDate.HasValue)
                {
                    DateTime enDate = Convert.ToDateTime(dsEndDate);
                    data = data.Where(b => (b.dRequestDate ?? DateTime.Now) == DateTime.Now || (b.dRequestDate ?? DateTime.Now) <= enDate).ToList();
                }
            }
            return data;
        }

        public List<lstDropdown> GetRequestType()
        {
            var tMasterData = db.T_MasterData.ToList();
            List<lstDropdown> data = (from a in tMasterData
                                      where a.nTypeID == 2 && a.isActive && !a.isDel
                                      orderby a.nID
                                      select new lstDropdown
                                      {
                                          label = a.sName,
                                          value = a.nID.ToString()
                                      }).ToList();
            return data;
        }

        [HttpPost]
        public CResutlWebMethod SaveDataForm(cRequestForm data)
        {
            UserAccount user = new UserAccount();
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            result.sStatus = Systemfunction.process_Success();
            try
            {
                user = _Auth.GetUserAccount();
                List<T_CustomerRequest> cusData = db.T_CustomerRequest.ToList();
                int nId = (cusData.Any() ? cusData.Max(m => m.nID) : 0) + 1;
                T_CustomerRequest newData = new T_CustomerRequest();
                newData.nID = nId;
                newData.nRequestTypeID = Convert.ToInt32(data.requestType);
                newData.nRequestSubTypeID = null;
                newData.nChannelID = 1; //default website
                newData.sChannelOther = "";
                newData.sTopic = "แจ้งจากทาง Web Softthai - New Customer Service";
                newData.sDescription = data.description;
                newData.dRequest = null;
                newData.nStatusID = 9;
                newData.dRequest = DateTime.Now;
                newData.nUserID_Reply = null;
                newData.dReply = null;
                newData.sRequester = data.name.Substring(0, 100);
                newData.sMobile = data.tel;
                newData.sEmail = data.email;
                newData.IsRead = false;
                newData.sReplyType = data.replyType;

                db.T_CustomerRequest.Add(newData);
                db.SaveChanges();

                //send e-mail to admin
                TB_Parameter objEmail = new TB_Parameter();
                objEmail.sTo = "rachata.j@softthai.com";
                objEmail.nEmailTemplateID = 1;
                objEmail.nUser_ID = 0;
                objEmail.sCol0 = "0";
                objEmail.sCol1 = "1";
                objEmail.sCol2 = "2";
                objEmail.sCol3 = "3";
                objEmail.sCol4 = "4";
                objEmail.sCol5 = "5";
                result =  Systemfunction.SendMail(objEmail);

            }
            catch (Exception e)
            {
                result.sStatus = Systemfunction.process_Failed();
                result.sMsg = e.ToString();
            }
            return result;

        }


    }

    public class cCustomerRequest
    {
        public string sReqDate { get; set; }
        public string sReqTime { get; set; }
        public string sType { get; set; }
        public string sTopic { get; set; }
        public string sReplyDate { get; set; }
        public string nRequestID { get; set; }
        public DateTime? dRequestDate { get; set; }
        public DateTime? dReplyDate { get; set; }
    }

    public class lstDropdown
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class cRequestForm
    {
        public int nID { get; set; }
        public string requestType { get; set; }
        public string description { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string tel { get; set; }
        public string replyType { get; set; }
    }
}
