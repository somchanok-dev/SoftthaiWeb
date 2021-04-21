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
    public class SupportTypeController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public SupportTypeController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }

        [HttpGet]
        public cListSupport GetListSupport(string txtSearch, string sIsActive)
        {
            var result = new cListSupport();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstSupportType = db.T_SupportType.Where(w => !w.isDel).ToList();
                var lstSupport = (from a in lstSupportType.Where(w => !w.isDel)
                                  select new lstSupportType
                                  {
                                      nID = a.nID,
                                      sName = a.sName,
                                      bStatus = a.isActive,
                                      sStatus_Name = a.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                                  }).ToList();

                if (!string.IsNullOrEmpty(txtSearch) && txtSearch != "none")
                {
                    lstSupport = lstSupport.Where(item => item.sName.Trim().ToLower().Contains(txtSearch.Trim().ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(sIsActive))
                {
                    var isActive = sIsActive == "1";
                    lstSupport = lstSupport.Where(a => a.bStatus == isActive).ToList();
                }

                result.lstSupportType = lstSupport.ToList();
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }
        [HttpPost]
        public SysModalGlobal.CResutlWebMethod SavetoDB([FromBody] T_SupportType data)
        {
            SoftthaiWebContext db = new SoftthaiWebContext();
            var result = new SysModalGlobal.CResutlWebMethod();
            UserAccount user = new UserAccount();
            try
            {
                user = _Auth.GetUserAccount();
                data.sName = data.sName.Trim();
                var supportType = db.T_SupportType.ToList();
                // var duplicate = (from a in db.T_SupportType
                //                  where a.isActive && !a.isDel && a.sName.Trim().ToLower() == data.sName.Trim().ToLower() && a.nID != data.nID
                //                  select a).FirstOrDefault();
                // if (duplicate != null)
                // {
                //     result.sStatus = SysGlobal.SysFunc.process_Duplicate;
                //     result.sMsg = "ประเภทเรื่องนี้มีอยู่แล้ว";
                //     return result;
                // }
                var nID = (supportType.Any() ? supportType.Max(m => m.nID) : 0) + 1;
                if (data.nID == 0)
                {
                    db.T_SupportType.Add(new T_SupportType
                    {
                        nID = nID,
                        sName = data.sName,
                        isActive = data.isActive,
                        isDel = false,
                        dCreate = DateTime.Now,
                        dUpdate = DateTime.Now,
                        nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID),
                    });
                    db.SaveChanges();
                }
                else
                {
                    var oldnID = (from a in db.T_SupportType
                                  where a.nID == data.nID
                                  select a).FirstOrDefault();

                    if (oldnID != null)
                    {
                        oldnID.nID = data.nID;
                        oldnID.sName = data.sName;
                        oldnID.isActive = data.isActive;
                        oldnID.isDel = false;
                        oldnID.dUpdate = DateTime.Now;
                        oldnID.nUserID_Update = Systemfunction.ParseIntToZero(user.sUserID);

                        db.SaveChanges();

                    }

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
        public IActionResult EditSupportType(int nID)
        {
            var result = new cListSupport();
            cT_SupportType EditSupportType = new cT_SupportType();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstSupportType = db.T_SupportType.Where(w => !w.isDel && w.nID == nID).ToList();
                EditSupportType = (from a in lstSupportType.Where(w => !w.isDel)
                                   select new cT_SupportType
                                   {
                                       nID = a.nID,
                                       sName = a.sName,
                                       bStatus = a.isActive,
                                       sStatus_Name = a.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                                   }).FirstOrDefault();

            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }

            return Ok(EditSupportType);
        }

        [HttpPost]
        public SysModalGlobal.CResutlWebMethod DeleteData(string str)
        {
            SoftthaiWebContext db = new SoftthaiWebContext();
            SysModalGlobal.CResutlWebMethod result = new SysModalGlobal.CResutlWebMethod();
            UserAccount user = new UserAccount();
            try
            {
                user = _Auth.GetUserAccount();
                if (!String.IsNullOrEmpty(str))
                {
                    var data = str.Split(',').Select(Int32.Parse).ToList();
                    var lstnID = db.T_SupportType.Where(w => !w.isDel).ToList();
                    var lstData = lstnID.Where(w => data.Contains(w.nID)).ToList();
                    lstData.ForEach(f => f.isDel = true);
                    db.SaveChanges();

                    // int nOrder = 1;
                    // lstnID = db.T_SupportType.Where(w => !w.isDel).ToList();
                    // lstnID.Where(w => w.isDel == false).OrderBy(o => o.nID).ToList().
                    //ForEach(f =>
                    //{
                    //    f.nID = nOrder;
                    //    nOrder++;
                    //});

                    // db.SaveChanges();
                    result.sStatus = SysFunc.process_Success;

                }

            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }


        #region Class
        public class cListSupport : SysModalGlobal.CResutlWebMethod
        {
            public List<lstSupportType> lstSupportType { get; set; }
        }
        public class lstSupportType
        {
            public int nID { get; set; }
            public string sName { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        public class cT_SupportType
        {
            public int nID { get; set; }
            public string sName { get; set; }
            public bool isActive { get; set; }
            public bool isDel { get; set; }
            public DateTime? dCreate { get; set; }
            public int? nUserID_Create { get; set; }
            public DateTime? dUpdate { get; set; }
            public int nUserID_Update { get; set; }
            public DateTime? dDelete { get; set; }
            public int? nUserID_Delete { get; set; }

            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }
        #endregion
    }
}