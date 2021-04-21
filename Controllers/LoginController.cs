using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SoftthaiWeb.App_Code;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using SoftthaiWeb.Properties.App_Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SoftthaiWeb.Extensions.Systemfunction;

namespace SoftthaiWeb.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class LoginController : ControllerBase
    {
        public IConfiguration _Configuration { get; }
        public readonly SoftthaiWebContext db;

        private readonly IAuthentication _Auth;
        public LoginController(IConfiguration Configuration, IAuthentication auth)
        {
            _Configuration = Configuration;
            _Auth = auth;
            db = new SoftthaiWebContext();
        }
        public async Task<IActionResult> CreateTokenLogin(LoginProps data)
        {
            try
            {
                TokenJWTSecret tokenJWT = new TokenJWTSecret();
                tokenJWT.sSecretKey = _Configuration["jwt:Key"];
                tokenJWT.sIssuer = _Configuration["jwt:Issuer"];
                tokenJWT.sAudience = _Configuration["jwt:Audience"];

                data.sUsername = data.sUsername.Trim().ToLower();

                var _Employee = await db.T_AdminUser.FirstOrDefaultAsync(w => w.sUsername == data.sUsername && w.sPassword == data.sPassword);

                if (_Employee != null)
                {
                    //set JWT
                    tokenJWT.sUserID = _Employee.nID.ToString();
                    tokenJWT.sLogonName = _Employee.sUsername;
                    tokenJWT.sName = _Employee.sName;
                    tokenJWT.UserGroup = _Employee.nGroupID + "";
                    tokenJWT.sFullname = _Employee.sName;
                    tokenJWT.dTimeout = DateTime.Now.AddHours(Convert.ToDouble(_Configuration["jwt:Expire"])); //set timeout

                    string token = _Auth.BuildToken(tokenJWT);

                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        code = StatusCodes.Status200OK,
                        //message = SystemMessageMethod.code_success,
                        token = token
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        code = StatusCodes.Status200OK,
                        token = "",
                        message = "Username not found in Employee Service"
                    });
                }
            }
            catch (Exception error)
            {

                return Ok(new { code = StatusCodes.Status404NotFound, message = error });
            }
        }
        [HttpPost]
        [Authorize]
        public IActionResult DataUserAppBar()
        {
            UserAccount user = new UserAccount();
            if (_Auth.IsHasExists())
            {
                user = _Auth.GetUserAccount();
                user.sUserID = "";
            }
            return StatusCode(StatusCodes.Status200OK, user);
        }
    }
    public class Logindata : CResutlWebMethod
    {
        public string sUsername { get; set; }
        public string sPassword { get; set; }
    }
}
