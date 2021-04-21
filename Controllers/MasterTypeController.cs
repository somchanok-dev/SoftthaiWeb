using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.SysModalGlobal;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using static SoftthaiWeb.App_Code._UploadFileUI;

namespace SoftthaiWeb.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MasterTypeController : ControllerBase
    {



        public List<T_MasterType> GetTMasterType()
        {
            List<T_MasterType> tbMasterType = new List<T_MasterType>();
            SoftthaiWebContext db = new SoftthaiWebContext();
            tbMasterType = db.T_MasterType.Where(w => w.isActive == true).ToList();
            return tbMasterType;
        }




    }
}
