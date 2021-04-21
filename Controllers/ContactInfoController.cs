using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysModalGlobal;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.SysGlobal;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ContactInfoController : ControllerBase
    {

        CultureInfo culture = new CultureInfo("th-TH");
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public ContactInfoController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }
        [HttpGet]
        public cListContact GetListContact(string txtSearch, string sIsActive)
        {
            var result = new cListContact();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstContact = db.T_ContactInfo.ToList();
                var ContactInfo = lstContact.Select(s => new lstContact
                {
                    nID = s.nID,
                    sLabel = s.sLabel,
                    sText = s.sText,
                    bStatus = s.isActive,
                    sStatus_Name = s.isActive ? "ใช้งาน" : "ไม่ใช้งาน",
                    dUpdate = s.dUpdate,
                    sUpdate = s.dUpdate.HasValue ? s.dUpdate.Value.ToString("dd/MM/yyyy", culture) : "-",
                }).ToList();

                if (!string.IsNullOrEmpty(txtSearch) && txtSearch != "none")
                {
                    ContactInfo = ContactInfo.Where(item => item.sLabel.Trim().ToLower().Contains(txtSearch.Trim().ToLower()) || item.sText.Trim().ToLower().Contains(txtSearch.Trim().ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(sIsActive))
                {
                    var isActive = sIsActive == "1";
                    ContactInfo = ContactInfo.Where(a => a.bStatus == isActive).ToList();
                }

                result.lstContact = ContactInfo.ToList();
            }

            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }

        [HttpPost]
        public SysModalGlobal.CResutlWebMethod SavetoDB([FromBody] T_ContactInfo data)
        {
            SoftthaiWebContext db = new SoftthaiWebContext();
            var result = new SysModalGlobal.CResutlWebMethod();
            UserAccount user = new UserAccount();
            try
            {
                user = _Auth.GetUserAccount();
                data.sLabel = data.sLabel.Trim();
                data.sText = data.sText.Trim();
                var ContactInfo = db.T_ContactInfo.ToList();
                // var nID = (ContactInfo.Any() ? ContactInfo.Max(m => m.nID) : 0) + 1;

                var oldnID = (from a in db.T_ContactInfo
                              where a.nID == data.nID
                              select a).FirstOrDefault();

                if (oldnID != null)
                {
                    oldnID.nID = data.nID;
                    oldnID.sLabel = data.sLabel;
                    oldnID.sText = data.sText;
                    oldnID.isActive = data.isActive;
                    oldnID.dUpdate = DateTime.Now;
                    oldnID.nUserID_Update = Systemfunction.ParseIntToZero(user.sUserID);

                    db.SaveChanges();
                }

                result.sStatus = SysFunc.process_Success;
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }

            return result;
        }

        [HttpGet]
        public IActionResult EditContactInfo(int nID)
        {
            var result = new cListContact();
            cT_ContactInfo EditContactInfo = new cT_ContactInfo();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstContactInfo = db.T_ContactInfo.Where(w => w.nID == nID).ToList();
                EditContactInfo = (from s in lstContactInfo
                                   select new cT_ContactInfo
                                   {
                                       nID = s.nID,
                                       sLabel = s.sLabel,
                                       sText = s.sText,
                                       bStatus = s.isActive,
                                       sStatus_Name = s.isActive ? "ใช้งาน" : "ไม่ใช้งาน",
                                       dUpdate = s.dUpdate
                                   }).FirstOrDefault();
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return Ok(EditContactInfo);
        }

        #region Class
        public class cListContact : SysModalGlobal.CResutlWebMethod
        {
            public List<lstContact> lstContact { get; set; }
        }
        public class lstContact
        {
            public int nID { get; set; }
            public string sLabel { get; set; }
            public string sText { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
            public DateTime? dUpdate { get; set; }
            public string sUpdate { get; set; }
        }
        public class cT_ContactInfo
        {
            public int nID { get; set; }
            public string sLabel { get; set; }
            public string sText { get; set; }
            public bool isActive { get; set; }
            public int? nUserID_Update { get; set; }
            public DateTime? dUpdate { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        #endregion
    }
}