using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoftthaiWeb.Controllers
{
    [Route("/api/[controller]/[action]")]
    [ApiController]
    public class _LayoutAdminController : Controller
    {
        public IConfiguration _Configuration { get; }
        public readonly SoftthaiWebContext db;

        private readonly IAuthentication _Auth;
        public _LayoutAdminController(IConfiguration Configuration, IAuthentication auth)
        {
            _Configuration = Configuration;
            _Auth = auth;
            db = new SoftthaiWebContext();

        }
        public IActionResult Getmanu(int nID)
        {
            List<LstMenuL2> lstMenuL2 = new List<LstMenuL2>();
            List<LstMenuL1> lstManu = new List<LstMenuL1>();
            List<LstMenuL1> lstMenuL1 = new List<LstMenuL1>();
            UserAccount user = new UserAccount();

            user = _Auth.GetUserAccount();
            var qUserMenu = (from AM in db.T_AdminMenu.Where(w => w.isActive == true && w.isDel == false)
                             join AP in db.T_AdminGroup_Permission
                             on AM.nID equals AP.nID_Menu
                             where AP.nID_UserGroup == Systemfunction.ParseIntToZero(user.UserGroup)
                             && AP.nPermission != 0
                             select new
                             {
                                 AM.nID,
                                 AM.nHeadID,
                                 AM.sIcon,
                                 AM.sName,
                                 AM.sURL,
                                 AM.isNewTab,
                                 AM.nOrder,
                                 AM.isActive,
                             }).ToList();

            var lstMenu = qUserMenu.Where(w => w.isActive == true && w.nHeadID == null).Select(s => s.nID).ToArray();

            foreach (var item in lstMenu)
            {
                //List<LstMenuL1> lstMenuL1 = new List<LstMenuL1>();
                var HeadMenul1 = qUserMenu.ToList();
                var allmenu = db.T_AdminMenu.Where(w => w.isActive == true && w.nID == item).ToList();
                var Chackpar = qUserMenu.Where(w => w.isActive == true && w.nID == item && w.sURL != null).ToList();

                foreach (var p in allmenu)
                {
                    var o = new LstMenuL1();
                    var l2 = HeadMenul1.Where(w => w.nHeadID == p.nID && w.sURL != "").Select(s => new LstMenuL2
                    {
                        nID = s.nID,
                        sIcon= s.sIcon,
                        sName = s.sName,
                        sURL = s.sURL,
                    }).ToList();

                    if (l2.Count > 0)
                    {
                        o.nID = p.nID;
                        o.sName = p.sName;
                        o.sURL = p.sURL;
                        o.nHeadID = p.nHeadID;
                        o.LstMenuL2 = l2;
                        lstMenuL1.Add(o);
                    }
                    foreach (var l11 in Chackpar)
                    {
                        var y = new LstMenuL1();
                        y.nID = l11.nID;
                        y.sName = l11.sName;
                        y.sURL = l11.sURL;
                        y.sIcon = l11.sIcon;
                        y.nHeadID = l11.nHeadID;
                        if (l11.nID == nID) y.bActive = true;
                        else y.bActive = false;
                        lstMenuL1.Add(y);
                    }
                }
            }
            return Json(new { lstMenuL1, user.sName });
        }
    }
    public class LstHeadMenu
    {
        public string sName { get; set; }
        public string sURL { get; set; }
        public int nID { get; set; }
        public int? nHeadID { get; set; }

        public List<LstMenuL1> LstMenuL1 { get; set; }
    }
    public class LstMenuL1
    {
        public string sName { get; set; }
        public string sURL { get; set; }
        public bool bActive { get; set; }
        public string sIcon { get; set; }

        public int nID { get; set; }
        public int? nHeadID { get; set; }

        public List<LstMenuL2> LstMenuL2 { get; set; }
    }
    public class LstMenuL2
    {
        public string sName { get; set; }
        public string sURL { get; set; }
        public int nID { get; set; }
        public string sIcon { get; set; }
    }
}
