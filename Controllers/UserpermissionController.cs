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
    public class UserpermissionController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public UserpermissionController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }

        [HttpGet]
        public List<List_T_Group> GetUserGroup()
        {
            SoftthaiWebContext db = new SoftthaiWebContext();
            var lstGroup = db.T_AdminGroup.Where(w => !w.isDel && w.isActive).OrderBy(o => o.sName).ToList().Select(s => new List_T_Group
            {
                label = s.sName,
                value = s.nID + ""
            }).ToList();
            return lstGroup;
        }

        [HttpGet]
        public cListAdmin getListUserGroup(string txtSearch, string sIsActive)
        {
            var result = new cListAdmin();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstAdminGroup = db.T_AdminGroup.Where(w => !w.isDel).ToList();
                var lstAdminGroup_Permission = db.T_AdminGroup_Permission.ToList();
                var lstAdminUser = db.T_AdminUser.Where(w => !w.isDel).ToList();
                var lstAdmin_Group = (from g in lstAdminGroup
                                      select new lstAdminGroup
                                      {
                                          nID = g.nID,
                                          sName = g.sName,
                                          nMember = lstAdminUser.Count(c => !c.isDel && c.nGroupID == g.nID),
                                          bStatus = g.isActive,
                                          sStatus_Name = g.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                                      }).ToList();
                // var lstAdmin_Group1 = lstAdminGroup.Select(s => new lstAdminGroup
                // {
                //     nID = s.nID,
                //     sName = s.sName,
                //     nMember = lstAdminUser.Count(c => !c.isDel && c.nGroupID == s.nID),
                //     bStatus = s.isActive,
                //     sStatus_Name = s.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                // }).ToList();

                if (!string.IsNullOrEmpty(txtSearch) && txtSearch != "none")
                {
                    lstAdmin_Group = lstAdmin_Group.Where(item => item.sName.Trim().ToLower().Contains(txtSearch.Trim().ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(sIsActive))
                {
                    var isActive = sIsActive == "1";
                    lstAdmin_Group = lstAdmin_Group.Where(a => a.bStatus == isActive).ToList();
                }

                result.lstAdminGroup = lstAdmin_Group.ToList();
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }

        [HttpGet]
        public cListAdmin getListUserInfo(string txtSearch, string sIsActive, string txtGroupSearch)
        {
            var result = new cListAdmin();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstAdminGroup = db.T_AdminGroup.Where(w => !w.isDel).ToList();
                var lstAdminGroup_Permission = db.T_AdminGroup_Permission.ToList();
                var lstAdminUser = db.T_AdminUser.Where(w => !w.isDel).ToList();
                var lstAdminInfo = (from u in lstAdminUser
                                    from g in lstAdminGroup.Where(w => w.nID == u.nID)
                                    select new lstAdminInfo
                                    {
                                        nID = u.nID,
                                        nGroup = g.nID,
                                        sGroup = g.sName,
                                        sUsername = u.sUsername,
                                        sName = u.sName,
                                        bStatus = u.isActive,
                                        sStatus_Name = u.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                                    }).ToList();

                if (!string.IsNullOrEmpty(txtSearch) && txtSearch != "none")
                {
                    lstAdminInfo = lstAdminInfo.Where(item => item.sName.Trim().ToLower().Contains(txtSearch.Trim().ToLower())
                    || item.sUsername.Trim().ToLower().Contains(txtSearch.Trim().ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(txtGroupSearch) && txtGroupSearch != "none")
                {
                    lstAdminInfo = lstAdminInfo.Where(item => item.sGroup.Trim().ToLower().Contains(txtGroupSearch.Trim().ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(sIsActive))
                {
                    var isActive = sIsActive == "1";
                    lstAdminInfo = lstAdminInfo.Where(a => a.bStatus == isActive).ToList();
                }

                result.lstAdminInfo = lstAdminInfo.ToList();
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }

        [HttpGet]
        public cListAdmin getListUserMenu()
        {
            var result = new cListAdmin();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstAdminMenu = db.T_AdminMenu.Where(w => !w.isDel).ToList();
                var lstAdmin_Menu = lstAdminMenu.Select(s => new lstAdminMenu
                {
                    nID = s.nID,
                    sIcon = s.sIcon,
                    sName = s.sName,
                    sUrl = s.sURL,
                    bStatus = s.isActive,
                    sStatus_Name = s.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                }).ToList();

                result.lstAdminMenu = lstAdmin_Menu;
            }


            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }

        [HttpPost]
        public SysModalGlobal.CResutlWebMethod SaveAdminGroup([FromBody] lstSavedata data)
        {
            SoftthaiWebContext db = new SoftthaiWebContext();
            var result = new SysModalGlobal.CResutlWebMethod();
            UserAccount user = new UserAccount();
            try
            {
                user = _Auth.GetUserAccount();
                data.sName = data.sName.Trim();
                var admingroup = db.T_AdminGroup.ToList();
                var group_permission = db.T_AdminGroup_Permission.ToList();
                var duplicate = (from a in db.T_AdminGroup
                                 where a.isActive && !a.isDel && a.sName.Trim().ToLower() == data.sName.Trim().ToLower() && a.nID != data.nID
                                 select a).FirstOrDefault();
                if (duplicate != null)
                {
                    result.sStatus = SysGlobal.SysFunc.process_Duplicate;
                    result.sMsg = "ไม่สามารถบันทึกชื่อกลุ่มซ้ำกันได้";
                    return result;
                }


                if (data.nID == 0)
                {
                    var nID = (admingroup.Any() ? admingroup.Max(m => m.nID) : 0) + 1;

                    db.T_AdminGroup.Add(new T_AdminGroup
                    {
                        nID = nID,
                        sName = data.sName,
                        isActive = data.isActive,
                        isDel = false,
                        dCreate = DateTime.Now,
                        nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID),
                    });
                    db.SaveChanges();

                    foreach (var per in data.lstPermission)
                    {
                        var UpdatePermission = db.T_AdminGroup_Permission.FirstOrDefault(w => w.nID_UserGroup == per.nID_UserGroup && w.nID_Menu == per.nID_Menu);
                        if (UpdatePermission != null)
                        {
                            UpdatePermission.nPermission = per.nPermission;
                        }
                        else
                        {
                            T_AdminGroup_Permission s = new T_AdminGroup_Permission();
                            s.nID_Menu = per.nID_Menu;
                            s.nID_UserGroup = nID;
                            s.nPermission = per.nPermission;
                            db.T_AdminGroup_Permission.Add(s);
                        }
                        db.SaveChanges();
                    }
                }
                else
                {
                    var oldnID = (from a in db.T_AdminGroup where a.nID == data.nID select a).FirstOrDefault();

                    if (oldnID != null)
                    {
                        oldnID.nID = data.nID;
                        oldnID.sName = data.sName;
                        oldnID.isActive = data.isActive;
                        oldnID.isDel = false;
                        oldnID.dUpdate = DateTime.Now;
                        oldnID.dDelete = DateTime.Now;
                        oldnID.nUserID_Update = Systemfunction.ParseIntToNull(user.sUserID);
                        oldnID.nUserID_Delete = Systemfunction.ParseIntToNull(user.sUserID);

                        db.SaveChanges();
                        foreach (var per in data.lstPermission)
                        {
                            var UpdatePermission = db.T_AdminGroup_Permission.FirstOrDefault(w => w.nID_UserGroup == per.nID_UserGroup && w.nID_Menu == per.nID_Menu);
                            if (UpdatePermission != null)
                            {
                                UpdatePermission.nPermission = per.nPermission;
                            }
                            else
                            {
                                T_AdminGroup_Permission s = new T_AdminGroup_Permission();
                                s.nID_Menu = per.nID_Menu;
                                s.nID_UserGroup = oldnID.nID;
                                s.nPermission = per.nPermission;
                                db.T_AdminGroup_Permission.Add(s);
                            }
                            db.SaveChanges();
                        }
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

        [HttpPost]
        public SysModalGlobal.CResutlWebMethod SaveAdminInfo([FromBody] T_AdminUser data)
        {
            SoftthaiWebContext db = new SoftthaiWebContext();
            var result = new SysModalGlobal.CResutlWebMethod();
            UserAccount user = new UserAccount();
            try
            {
                user = _Auth.GetUserAccount();
                data.sName = data.sName.Trim();
                data.sUsername = data.sUsername.Trim();
                var admininfo = db.T_AdminUser.ToList();
                var duplicate = (from a in db.T_AdminUser
                                 where a.isActive && !a.isDel && a.sName.Trim().ToLower() == data.sName.Trim().ToLower() && a.sUsername.Trim().ToLower() == data.sUsername.Trim().ToLower() && a.nID != data.nID
                                 select a).FirstOrDefault();
                if (duplicate != null)
                {
                    result.sStatus = SysGlobal.SysFunc.process_Duplicate;
                    result.sMsg = "ชื่อผู้ใช้งานนี้ถูกใช้แล้ว";
                    return result;
                }

                var nID = (admininfo.Any() ? admininfo.Max(m => m.nID) : 0) + 1;
                if (data.nID == 0)
                {
                    db.T_AdminUser.Add(new T_AdminUser
                    {
                        nID = nID,
                        nGroupID = data.nGroupID,
                        sName = data.sName,
                        sEmail = data.sEmail,
                        sUsername = data.sUsername,
                        sPassword = data.sPassword,
                        isActive = data.isActive,
                        isDel = false,
                        dCreate = DateTime.Now,
                        nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID),
                    });
                    db.SaveChanges();
                }
                else
                {
                    var oldnID = (from a in db.T_AdminUser
                                  where a.nID == data.nID
                                  select a).FirstOrDefault();

                    if (oldnID != null)
                    {
                        oldnID.nID = data.nID;
                        oldnID.nGroupID = data.nGroupID;
                        oldnID.sName = data.sName;
                        oldnID.sEmail = data.sEmail;
                        oldnID.sUsername = data.sUsername;
                        oldnID.sPassword = data.sPassword;
                        oldnID.isActive = data.isActive;
                        oldnID.isDel = false;
                        oldnID.dUpdate = DateTime.Now;
                        oldnID.dDelete = DateTime.Now;
                        oldnID.nUserID_Update = Systemfunction.ParseIntToZero(user.sUserID);
                        oldnID.nUserID_Delete = Systemfunction.ParseIntToZero(user.sUserID);

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
        public IActionResult EditDataAdminGroup(int nID)
        {

            var result = new cListAdmin();
            LstDataeditPermission lst = new LstDataeditPermission();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstAdminGroup = db.T_AdminGroup.FirstOrDefault(w => !w.isDel && w.nID == nID);
                var lstAdminUser = db.T_AdminUser.Where(w => !w.isDel).ToList();
                //lst.lstdata = (from g in lstAdminGroup
                //               from u in lstAdminUser.Where(w => w.nGroupID == g.nID)
                //               select new cT_AdminGroup
                //               {
                //                   nID = g.nID,
                //                   sName = g.sName,
                //                   nMember = lstAdminUser.Count(c => !c.isDel && c.nGroupID == g.nID),
                //                   bStatus = g.isActive,
                //                   sStatus_Name = g.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                //               }).FirstOrDefault();
                cT_AdminGroup i = new cT_AdminGroup();
                if (lstAdminGroup != null)
                {
                    i.nID = lstAdminGroup.nID;
                    i.sName = lstAdminGroup.sName;
                    i.bStatus = lstAdminGroup.isActive;
                }

                lst.lstdata = i;

                var lstAdminMenu = db.T_AdminMenu.Where(w => w.isActive && !w.isDel).ToList();
                var lstAdminGroup_Permission = db.T_AdminGroup_Permission.Where(w => nID == 0 ? w.nID_UserGroup == 0 : w.nID_UserGroup == nID).ToList();

                var lst_Permission = (from AM in lstAdminMenu
                                      from AP in lstAdminGroup_Permission.Where(w => w.nID_Menu == AM.nID).DefaultIfEmpty()
                                      select new LstPermission
                                      {
                                          nID_Menu = AM.nID,
                                          sName = AM.sName,
                                          nPermission = AP == null ? 1 : AP.nPermission,
                                          nID_UserGroup = AP == null ? 0 : AP.nID_UserGroup
                                      }).Distinct().OrderBy(o => o.nOrder).ToList();

                if (lst_Permission.Count > 0)
                {
                    lst.lstPermission = lst_Permission;
                }
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return Ok(lst);
        }

        [HttpGet]
        public IActionResult EditDataAdminUser(int nID)
        {

            var result = new cListAdmin();
            cT_AdminInfo EditAdminInfo = new cT_AdminInfo();
            try
            {
                SoftthaiWebContext db = new SoftthaiWebContext();

                var lstAdminGroup = db.T_AdminGroup.Where(w => !w.isDel).ToList();
                var lstAdminGroup_Permission = db.T_AdminGroup_Permission.ToList();
                var lstAdminUser = db.T_AdminUser.Where(w => !w.isDel && w.nID == nID).ToList();
                EditAdminInfo = (from u in lstAdminUser
                                 from g in lstAdminGroup.Where(w => w.nID == u.nID)
                                 select new cT_AdminInfo
                                 {
                                     nID = u.nID,
                                     nGroup = g.nID,
                                     sGroup = g.sName,
                                     sUsername = u.sUsername,
                                     sEmail = u.sEmail,
                                     sPassword = u.sPassword,
                                     sConfirmPassword = u.sPassword,
                                     sName = u.sName,
                                     bStatus = u.isActive,
                                     sStatus_Name = u.isActive ? "ใช้งาน" : "ไม่ใช้งาน"
                                 }).FirstOrDefault();
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return Ok(EditAdminInfo);
        }

        [HttpPost]
        public SysModalGlobal.CResutlWebMethod DeleteAdminGroup(string str)
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
                    var lstnID = db.T_AdminGroup.Where(w => !w.isDel).ToList();
                    var lstData = lstnID.Where(w => data.Contains(w.nID)).ToList();
                    lstData.ForEach(f => f.isDel = true);
                    db.SaveChanges();
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

        [HttpPost]
        public SysModalGlobal.CResutlWebMethod DeleteAdminInfo(string str)
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
                    var lstnID = db.T_AdminUser.Where(w => !w.isDel).ToList();
                    var lstData = lstnID.Where(w => data.Contains(w.nID)).ToList();
                    lstData.ForEach(f => f.isDel = true);
                    db.SaveChanges();
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
        public class LstDataeditPermission
        {
            public cT_AdminGroup lstdata { get; set; }
            public List<LstPermission> lstPermission { get; set; }
        }
        public class LstPermission
        {
            public int nID { get; set; }
            public string sName { get; set; }
            public int nOrder { get; set; }
            public int nID_UserGroup { get; set; }
            public int nID_Menu { get; set; }
            public int nPermission { get; set; }
        }
        public class cReturnSearchData : SysModalGlobal.CResutlWebMethod
        {
            public List<cT_AdminUser> lstData { get; set; }
        }

        public class CResutlAdminGroup : SysModalGlobal.CResutlWebMethod
        {
            public cT_AdminGroup dataAdminGroup { get; set; }
        }

        public class cListAdmin : SysModalGlobal.CResutlWebMethod
        {
            public List<lstAdminGroup> lstAdminGroup { get; set; }
            public List<lstAdminInfo> lstAdminInfo { get; set; }
            public List<lstAdminMenu> lstAdminMenu { get; set; }

        }

        public class lstAdminInfo
        {
            public int nID { get; set; }
            public int nGroup { get; set; }
            public string sGroup { get; set; }
            public string sName { get; set; }
            public string sUsername { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        public class lstAdminGroup
        {
            public int nID { get; set; }
            public string sName { get; set; }
            public int nGroup_Name { get; set; }
            public string sGroup_Name { get; set; }
            public int nMember { get; set; }
            public string sMember { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        public class lstAdminMenu
        {
            public int nID { get; set; }
            public int nHeadID { get; set; }
            public string sIcon { get; set; }
            public string sName { get; set; }
            public string sUrl { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        public class cT_AdminUser : T_AdminUser
        {
            public bool bIsMapping { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }

        }

        public class cT_AdminGroup
        {
            public int nID { get; set; }
            public string sName { get; set; }
            public bool isActive { get; set; }
            public bool isDel { get; set; }
            public DateTime? dCreate { get; set; }
            public int? nUserID_Create { get; set; }
            public DateTime? dUpdate { get; set; }
            public int? nUserID_Update { get; set; }
            public DateTime? dDelete { get; set; }
            public int? nUserID_Delete { get; set; }

            public int nGroup_Name { get; set; }
            public int nMember { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        public class cT_AdminInfo
        {
            public int nID { get; set; }
            public int nGroupID { get; set; }
            public string sGroup { get; set; }

            public string sName { get; set; }
            public string sEmail { get; set; }
            public string sUsername { get; set; }
            public string sPassword { get; set; }
            public string sConfirmPassword { get; set; }
            public bool isActive { get; set; }
            public bool isDel { get; set; }
            public DateTime? dCreate { get; set; }
            public int? nUserID_Create { get; set; }
            public DateTime? dUpdate { get; set; }
            public int? nUserID_Update { get; set; }
            public DateTime? dDelete { get; set; }
            public int? nUserID_Delete { get; set; }

            public int nGroup { get; set; }
            public bool bStatus { get; set; }
            public string sStatus_Name { get; set; }
        }

        public class List_T_Group
        {
            public string value { get; set; }
            public string label { get; set; }
        }

        public class lstSavedata
        {
            public List<LstPermission> lstPermission { set; get; }
            public int nID { get; set; }
            public string sName { get; set; }
            public bool isActive { get; set; }
            public bool isDel { get; set; }
            public DateTime? dCreate { get; set; }
            public int? nUserID_Create { get; set; }
            public DateTime? dUpdate { get; set; }
            public int? nUserID_Update { get; set; }
            public DateTime? dDelete { get; set; }
            public int? nUserID_Delete { get; set; }
        }
        #endregion

    }
}