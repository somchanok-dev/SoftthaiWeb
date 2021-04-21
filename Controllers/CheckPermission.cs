using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.SystemModels;
using System;
using SoftthaiWeb.SysGlobal;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CheckPermissionController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public CheckPermissionController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }

        [HttpGet]
        public cReturnPermission GetPermission(int id)
        {
            var result = new cReturnPermission();
            UserAccount user = new UserAccount();
            try
            {
                user = _Auth.GetUserAccount();
                user.VerifyPermission(id);
            }
            catch (Exception e)
            {
                result.sStatus = SysFunc.process_Error;
                result.sMsg = e.Message;
            }
            return result;
        }

        #region  class
        public class cReturnPermission : SysModalGlobal.CResutlWebMethod
        {
            public int id { get; set; }
        }
        #endregion
    }
}