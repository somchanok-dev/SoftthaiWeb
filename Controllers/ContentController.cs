using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SoftthaiWeb.Extensions.Systemfunction;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        public SoftthaiWebContext db = new SoftthaiWebContext();
        public lstContent lstContentdata()
        {
            db = new SoftthaiWebContext();
            lstContent result = new lstContent();
            List<lstContent_Menu> Main = new List<lstContent_Menu>();
            List<lstContent_Panel> Panel = new List<lstContent_Panel>();
            var qMainmanu = db.T_MainMenu.Where(w => w.isFixed && !w.isDel).ToList();
            int nRow_m = 1;
            foreach (var i in qMainmanu)
            {
                lstContent_Menu m = new lstContent_Menu();
                m.nRunning = nRow_m;
                m.sName = i.sName;
                m.nPanel = db.T_MainMenu_Panel.Where(w => w.nMainMenuID == i.nMainMenuID).Count();
                m.isActive = i.isActive;
                nRow_m++;
                Main.Add(m);
                result.lstMenu = Main;
            }
            int nMainMenuID = 1;
            var qPanel = db.T_MainMenu_Panel.Where(w => w.isActive && w.nMainMenuID == nMainMenuID).OrderBy(o => o.nOrder).ToList();

            int nRow_p = 1;
            foreach (var i in qPanel)
            {
                lstContent_Panel p = new lstContent_Panel();
                p.nRunning = nRow_p;
                p.sName = i.sName;
                p.nOrder = i.nOrder;
                p.nMainMenuID = i.nMainMenuID;
                p.nPanelID = i.nPanelID;
                p.sURL_AdjustPage = i.sURL_AdjustPage;
                p.nPanel = db.T_MainMenu_Panel.Where(w => w.nMainMenuID == i.nMainMenuID).Count();
                p.isActive = i.isActive;
                p.dUpdate = p.dUpdate;
                nRow_p++;
                Panel.Add(p);
                result.lstPanel = Panel;
            }
            return result;
        }
        public List<lstOrder> SetOrder()
        {
            List<lstOrder> result = new List<lstOrder>();
            db = new SoftthaiWebContext();
            //var lstPins = db.T_News_Pin.Where(w => w.isDel == false).ToList();

            result = (from p in db.T_MainMenu_Panel
                           from n in db.T_MainMenu.Where(w => w.nMainMenuID == p.nMainMenuID)
                           select new lstOrder
                           {
                               nPanelID = p.nPanelID,
                               nMainMenuID = p.nMainMenuID,
                               nOrder = p.nOrder,
                               sName = p.sName,

                           }).ToList();

            return result;
        }
    }
    #region Class
    public class lstContent : CResutlWebMethod
    {
        public List<lstContent_Menu> lstMenu { get; set; }
        public List<lstContent_Panel> lstPanel { get; set; }
    }
    public class lstContent_Menu
    {
        public int nRunning { get; set; }
        public string sName { get; set; }
        public int nPanel { get; set; }
        public bool isActive { get; set; }
    }
    public class lstContent_Panel
    {
        public int nRunning { get; set; }
        public int nMainMenuID { get; set; }
        public int nPanelID { get; set; }
        public string sName { get; set; }
        public string sURL_AdjustPage { get; set; }
        public int nPanel { get; set; }
        public int nOrder { get; set; }
        public bool isActive { get; set; }
        public DateTime? dUpdate { get; set; }
    }
    public class lstOrder
    {
        public int nMainMenuID { get; set; }
        public int nPanelID { get; set; }
        public string sName { get; set; }
        public int nOrder { get; set; }
    }

    #endregion
}
