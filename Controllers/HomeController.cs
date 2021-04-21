using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Interfaces;

namespace SoftthaiWeb.Controllers
{
    [Route("/api/[controller]/[action]")]
    [ApiController]
    public class HomeController : Controller
    {
        public IConfiguration conf { get; }
        private readonly IAuthentication au;
        public readonly SoftthaiWebContext db;
        public HomeController(IConfiguration _conf, IAuthentication _auth)
        {
            conf = _conf;
            au = _auth;
            db = new SoftthaiWebContext();
        }
        public IActionResult ListNews()
        {
            int nItem_Display = 5;
            DateTime dMin = new DateTime(1753, 1, 1);

            var lstNews_Pin = db.T_News_Pin.Select(s => new { s.nID, s.nOrder }).ToList();
            var lstNewsID_Pin = lstNews_Pin.Select(s => s.nID).ToList();

            var lstNews = db.T_News.Where(w => !w.isDel && w.isActive)
                .Select(s => new { s.nID, s.sTitle, s.sDesc, s.sFilePath, s.dPost })
                .OrderBy(o => lstNewsID_Pin.Contains(o.nID) ? dMin : o.dPost).Take(nItem_Display).ToList();

            #region List<DATA_NewsItem> lstData = new List<DATA_NewsItem>();
            List<DATA_NewsItem> lstData = new List<DATA_NewsItem>();

            lstNews_Pin.OrderBy(o => o.nOrder).ToList().ForEach(p =>
            {
                var news = lstNews.FirstOrDefault(w => w.nID == p.nID);
                if (news != null) lstData.Add(new DATA_NewsItem()
                {
                    sTitle = news.sTitle,
                    sDescription = news.sDesc,
                    sImageSrc = news.sFilePath
                });
            });

            if (lstData.Count < nItem_Display)
            {
                var lstNews_Other = lstNews.Where(w => !lstNewsID_Pin.Contains(w.nID)).OrderBy(o => o.dPost).ToList();
                lstNews_Other.ForEach(news =>
                {
                    lstData.Add(new DATA_NewsItem()
                    {
                        sTitle = news.sTitle,
                        sDescription = news.sDesc,
                        sImageSrc = news.sFilePath
                    });
                });
            }
            #endregion

            return Json(new { lstData });
        }

        public class DATA_NewsItem
        {
            public string sTitle { get; set; }
            public string sDescription { get; set; }
            public string sImageSrc { get; set; }
        }
    }
}