using Microsoft.AspNetCore.Http;
using SoftthaiWeb.App_Code;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SoftthaiWeb.Extensions.Systemfunction;

namespace SoftthaiWeb.Properties.App_Code
{

    public class UserAcc
    {
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserFullName { get; set; }
        public string EmpCode { get; set; }
        public string GroupName { get; set; }
        public int GroupID { get; set; }
        public int UserID { get; set; }

        private static string sSession = "MSUserLogin";
        public UserAcc()
        {

        }
        public static CResutlWebMethod Login(ISession session, string sUserName, string sPassword, string sMode)
        {
            CResutlWebMethod result = new CResutlWebMethod();

            return result;
        }

    }

}
