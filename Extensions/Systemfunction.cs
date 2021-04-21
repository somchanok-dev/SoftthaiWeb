using HtmlAgilityPack;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SoftthaiWeb.Models.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Web;

namespace SoftthaiWeb.Extensions
{
    public class Systemfunction
    {
        public static DataTable QryToDataToTabel(string _QRY, string _CONN)
        {
            DataTable _dt = new DataTable();
            string _Connect = _CONN;
            if (string.IsNullOrEmpty(_CONN))
            {
                _Connect = GetConnectionString();
            }

            if (!string.IsNullOrEmpty(_QRY))
            {
                using (SqlConnection _conn = new SqlConnection(_Connect))
                {

                    if (_conn.State == ConnectionState.Closed)
                    {
                        _conn.Open();
                    }

                    SqlCommand com = new SqlCommand(_QRY, _conn);
                    com.CommandTimeout = 6000;
                    new SqlDataAdapter(com).Fill(_dt);
                }
            }
            return _dt;
        }

        public static string GetAppSettingJson(string GetParameter)
        {
            string Result = "";
            var builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", false);
            IConfigurationRoot configuration = builder.Build();
            IConfigurationSection section = configuration.GetSection(GetParameter);
            Result = section.Value;
            return Result;
        }
        public static int? GetIntNull(string sVal)
        {
            int? nTemp = null;
            int nCheck = 0;
            if (!string.IsNullOrEmpty(sVal))
            {
                sVal = ConvertExponentialToString(sVal);
                bool cCheck = int.TryParse(sVal, out nCheck);
                if (cCheck)
                {
                    nTemp = int.Parse(sVal);
                }
            }

            return nTemp;
        }
        public static string ConvertExponentialToString(string sVal)
        {
            string sRsult = "";
            try
            {
                decimal nTemp = 0;
                bool check = Decimal.TryParse((sVal + "").Replace(",", ""), System.Globalization.NumberStyles.Float, null, out nTemp);
                if (check)
                {
                    decimal d = Decimal.Parse((sVal + "").Replace(",", ""), System.Globalization.NumberStyles.Float);
                    sRsult = (d + "").Replace(",", "");
                }
                else
                {
                    sRsult = sVal;
                }
            }
            catch
            {
                sRsult = sVal;
            }

            return sRsult != null ? (sRsult.Length < 50 ? sRsult : sRsult.Remove(50)) : ""; //เพื่อไม่ให้ตอน Save Error หากค่าที่เกิดจากผลการคำนวนเกิน Type ใน DB (varchar(50))
        }
        public static string GetConnectionString()
        {
            return GetAppSettingJson("ConnectionStrings:Softthai_Intranet_2021_ConnectionStrings");
        }
        public static string GetConnectionStringPIS()
        {
            return GetAppSettingJson("ConnectionStrings:PIS");
        }
        public static string GetUrlSite()
        {
            return GetAppSettingJson("Url");
        }
        public static DataTable Get_Data(string _sql)
        {
            DataTable _dt = new DataTable();
            if (!string.IsNullOrEmpty(_sql))
            {
                using (SqlConnection _conn = new SqlConnection(GetConnectionString()))
                {

                    if (_conn.State == ConnectionState.Closed)
                    {

                    }

                    SqlCommand com = new SqlCommand(_sql, _conn);
                    com.CommandTimeout = 6000;
                    new SqlDataAdapter(com).Fill(_dt);

                    return _dt;
                }
            }
            else
            {
                return _dt;
            }
        }
        public string ExecuteSql(string pStrSql)
        {
            try
            {
                using (SqlConnection _conn = new SqlConnection(GetConnectionString()))
                {
                    SqlCommand Cmd = new SqlCommand(pStrSql, _conn);

                    object result = Cmd.ExecuteScalar();
                    string oresult = "1";

                    if (result != null)
                    {
                        oresult = result.ToString();
                    }

                    _conn.Close();

                    return oresult;
                }
            }
            catch
            {
                return "";
            }
        }
        public static string process_SessionExpired()
        {
            return "SSEXP";
        }
        public static string process_Success()
        {
            return "Success";
        }
        public static string process_Failed()
        {
            return "Failed";
        }
        public static string process_Warning()
        {
            return "Warning";
        }
        public static string process_FileOversize()
        {
            return "OverSize";
        }
        public static string process_FileInvalidType()
        {
            return "InvalidType";
        }
        public static string process_Duplicate()
        {
            return "DUP";
        }
        public static int[] FixStatusBySSC()
        {
            int[] ArrData = { 8, 9, 10, 11, 12 };
            return ArrData;
        }
        public static string[] FixStatusByCopyRef()
        {
            string[] ArrData = { "8", "9", "11", "12", "13" };
            return ArrData;
        }
        public class CResutlWebMethod
        {
            public string Status { get; set; }
            public string Msg { get; set; }
            public string Content { get; set; }
        }
        #region Convert Format
        public static string StringToFix2Digit(string Value)
        {
            string result = "0";

            if (!string.IsNullOrEmpty(Value))
            {
                result = string.Format("{0:f2}", decimal.Parse(Value));
            }

            return result;
        }
        public static string SubstringText(string sVal, int Num)
        {
            return (sVal.Length > Num) ? sVal.Substring(0, Num) + "..." : sVal;
        }
        public static string SQL_String(string sVal)
        {
            return !string.IsNullOrEmpty(sVal) ? "'" + ReplaceInjection(sVal) + "'" : "null";
        }
        public static string SQL_String(DateTime? sVal)
        {
            string Result = "";
            if (sVal.HasValue)
            {
                string sDate = sVal.Value.ToString("yyyy-MM-dd");
                Result = "'" + ReplaceInjection(sDate) + "'";
            }
            else
            {
                Result = "null";
            }
            return Result;
        }

        public static string SQL_Array_To_StringIn(string sVal)
        {
            string Result = "";
            if (!string.IsNullOrEmpty(sVal))
            {
                string[] Arr = sVal.Split(',');
                foreach (var _Item in Arr)
                {
                    Result += ",'" + ReplaceInjection(_Item) + "'";
                }
                Result = Result.Length > 0 ? Result.Remove(0, 1) : "''";

            }
            else
            {
                Result = "''";
            }
            return Result;
        }
        public static string ReplaceInjection(string str)
        {
            string[] blacklist = new string[] { "'", "\\", "\"", "*/", ";", "--", "<script", "/*", "</script>" };
            string strRep = str;
            if (strRep == null || strRep.Trim().Equals(String.Empty))
                return strRep;
            foreach (string blk in blacklist) { strRep = strRep.Replace(blk, ""); }

            return strRep;
        }
        public static string ConvertDatTimeToString(string sDate, string Mode)
        {
            string result = "";
            DateTime dtTemp;
            switch (Mode)
            {
                case "EN":
                    result = DateTime.TryParse(ReplaceInjection(sDate), out dtTemp) ? dtTemp.ToString("yyyy-MM-dd", new CultureInfo("en-US")) : "";
                    break;
                case "TH":
                    result = DateTime.TryParse(ReplaceInjection(sDate), out dtTemp) ? dtTemp.ToString("dd/MM/yyyy", new CultureInfo("th-th")) : "";
                    break;
                case "TH2":
                    result = DateTime.TryParse(ReplaceInjection(sDate), out dtTemp) ? dtTemp.ToString("D", new CultureInfo("th-th")) : "";
                    break;
                case "TH3":
                    result = DateTime.TryParse(ReplaceInjection(sDate), out dtTemp) ? dtTemp.ToString("dd/MM/yyyy HH:mm", new CultureInfo("th-th")) : "";
                    break;
                case "EN1":
                    result = DateTime.TryParse(ReplaceInjection(sDate), out dtTemp) ? dtTemp.ToString("dd-MMM-yyyy", new CultureInfo("en-US")) : "";
                    break;
                case "EN2":
                    result = DateTime.TryParse(ReplaceInjection(sDate), out dtTemp) ? dtTemp.ToString("dd-MMM-yy", new CultureInfo("en-US")) : "";
                    break;
            }
            return result;
        }
        public static string ConvertMonthName(string sMonth)
        {
            string result = "";

            DateTime date = Convert.ToDateTime(sMonth + " 01, 1900");
            result = date.ToString("MMMM", CultureInfo.CreateSpecificCulture("th-TH"));
            return result;
        }

        public static string ConvertMonthName_US(string sMonth)
        {
            string result = "";

            DateTime date = Convert.ToDateTime(sMonth + " 01, 1900");
            result = date.ToString("MMM", CultureInfo.CreateSpecificCulture("en-US"));
            return result;
        }
        #endregion
        #region Parse Variable

        public static string StringTrim(string sVal)
        {
            string Result = "";
            if (!string.IsNullOrEmpty(sVal))
            {
                Result = (sVal + "").Trim();
            }
            else
            {
                Result = null;
            }

            return Result;
        }

        public static string StringTrimWhiteSpace(string sVal)
        {
            string Result = "";
            if (!string.IsNullOrEmpty(sVal))
            {
                Result = (sVal + "").Trim().Replace(" ", "");
            }
            else
            {
                Result = "";
            }

            return Result;
        }

        public static DateTime? ParseDateTimeToNull(string sVal)
        {
            DateTime nTemp;
            CultureInfo EN = new CultureInfo("en-US");
            CultureInfo TH = new CultureInfo("th-TH");
            DateTime? Result = (DateTime?)null;
            if (!string.IsNullOrEmpty(sVal))
            {
                string cutVal = sVal.Length > 10 ? sVal.Substring(0, 10) : sVal;
                if (DateTime.TryParseExact(cutVal, "dd/MM/yyyy", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "dd/MM/yyyy", EN, DateTimeStyles.None);
                }
                else if (DateTime.TryParseExact(cutVal, "yyyy-MM-dd", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "yyyy-MM-dd", EN, DateTimeStyles.None);
                }
                else if (DateTime.TryParseExact(cutVal, "d/MM/yyyy", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "d/MM/yyyy", EN, DateTimeStyles.None);
                }
                else if (DateTime.TryParseExact(cutVal, "d/M/yyyy", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "d/M/yyyy", EN, DateTimeStyles.None);
                }
                else
                {
                    if (!string.IsNullOrEmpty(sVal))
                    {
                        try
                        {
                            Result = Convert.ToDateTime(sVal);

                        }
                        catch (Exception)
                        {
                            Result = null;
                        }
                    }
                }
            }
            return Result;
        }

        public static DateTime ParseDateTimeToDateTimeNow(string sVal)
        {
            DateTime nTemp;
            CultureInfo EN = new CultureInfo("en-US");
            CultureInfo TH = new CultureInfo("th-TH");
            DateTime Result = DateTime.Now;
            if (!string.IsNullOrEmpty(sVal))
            {
                string cutVal = sVal.Length > 10 ? sVal.Substring(0, 10) : sVal;
                if (DateTime.TryParseExact(cutVal, "dd/MM/yyyy", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "dd/MM/yyyy", EN, DateTimeStyles.None);
                }
                else if (DateTime.TryParseExact(cutVal, "yyyy-MM-dd", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "yyyy-MM-dd", EN, DateTimeStyles.None);
                }
                else if (DateTime.TryParseExact(cutVal, "d/MM/yyyy", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "d/MM/yyyy", EN, DateTimeStyles.None);
                }
                else if (DateTime.TryParseExact(cutVal, "d/M/yyyy", EN, DateTimeStyles.None, out nTemp))
                {
                    Result = DateTime.ParseExact(cutVal, "d/M/yyyy", EN, DateTimeStyles.None);
                }
                else
                {
                    if (!string.IsNullOrEmpty(sVal))
                    {
                        try
                        {
                            Result = Convert.ToDateTime(sVal);

                        }
                        catch (Exception)
                        {
                            Result = DateTime.Now;
                        }
                    }
                }
            }
            return Result;
        }

        public static DateTime? ParseExactDateTimeToNull(string sVal)
        {
            DateTime? Result = !string.IsNullOrEmpty(sVal) ? DateTime.ParseExact(sVal, "dd/MM/yyyy", null) : (DateTime?)null;
            return Result;
        }

        public static string ParseDateTimeToString(DateTime? dDate, string sMode, string sFormat)
        {
            string result = "";
            sMode = !string.IsNullOrEmpty(sMode) ? sMode.ToLower() : "en";
            string sCultureInfo = "";
            switch (sMode)
            {
                case "th":
                    sCultureInfo = "th-TH";
                    break;
                case "en":
                    sCultureInfo = "en-US";
                    break;
            }

            if (dDate.HasValue)
            {
                result = dDate.Value.ToString(sFormat, new CultureInfo(sCultureInfo));
            }

            return result;
        }

        public static int? ParseIntToNull(string sVal)
        {
            int nTemp;
            int? Result = int.TryParse(sVal, out nTemp) ? nTemp : (int?)null;
            return Result;
        }

        public static int ParseIntToZero(string sVal)
        {
            int nTemp;
            int Result = int.TryParse(sVal, out nTemp) ? nTemp : 0;
            return Result;
        }

        public static int ParseIntToZeroByFormatDouble(string sVal)
        {
            Double temp;
            Boolean isOk = Double.TryParse(sVal, out temp);
            int Result = isOk ? (int)temp : 0;
            //int nTemp;
            //int Result = int.TryParse(sVal, out nTemp) ? nTemp : 0;
            return Result;
        }

        public static decimal? ParseDecimalToNull(string sVal)
        {
            decimal nTemp;
            decimal? Result = decimal.TryParse(sVal, out nTemp) ? nTemp : (decimal?)null;
            return Result;
        }

        public static decimal? ParseDecimalToZero(string sVal)
        {
            decimal nTemp;
            decimal? Result = decimal.TryParse(sVal, out nTemp) ? nTemp : 0;
            return Result;
        }

        public static double? ParseDoubleToNull(string sVal)
        {
            double nTemp;
            double? Result = double.TryParse(sVal, out nTemp) ? nTemp : (double?)null;
            return Result;
        }

        public static double? ParseDoubleToNull(decimal? sVal)
        {
            double nTemp;

            string sValue = sVal.HasValue ? sVal.Value + "" : "";

            double? Result = double.TryParse(sValue, out nTemp) ? nTemp : (double?)null;
            return Result;
        }

        public static float? ParseFloatToZero(string sVal)
        {
            float nTemp;
            float? Result = float.TryParse(sVal, out nTemp) ? nTemp : 0;
            return Result;
        }
        public static string CheckDataToSAP_STR(string sVal, int MaxLength)
        {
            string Result = "";
            if (!string.IsNullOrEmpty(sVal))
            {
                Result = sVal.Length > MaxLength ? sVal.Substring(0, MaxLength) : sVal;
            }
            return Result;
        }

        public static TimeSpan? ParseTimeSpanToNull(string sVal)
        {
            TimeSpan nTemp;
            TimeSpan? Result = (TimeSpan?)null;
            if (!string.IsNullOrEmpty(sVal))
            {
                Result = TimeSpan.TryParse(sVal, out nTemp) ? TimeSpan.Parse(sVal) : (TimeSpan?)null;
            }
            return Result;
        }
        #endregion


        public int RandomNumber(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }
        public string RandomString(int size, bool lowerCase)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            if (lowerCase)
                return builder.ToString().ToLower();
            return builder.ToString();
        }
        public string RandomPassword(int size = 0)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(RandomString(4, true));
            builder.Append(RandomNumber(1000, 9999));
            builder.Append(RandomString(2, false));
            return builder.ToString();
        }

        public static SysModalGlobal.CResutlWebMethod SendMail(SysModalGlobal.TB_Parameter arrEmail)
        {
            SysModalGlobal.CResutlWebMethod result = new SysModalGlobal.CResutlWebMethod();
            var o = arrEmail;
            SoftthaiWebContext db = new SoftthaiWebContext();
            var tmConfig = db.TM_Config.ToList();
            bool IsDebugMode = tmConfig.FirstOrDefault(w => w.nConfig_ID == 3).IsConfig_Bit.Value;
            string sSystemMail = tmConfig.FirstOrDefault(w => w.nConfig_ID == 4).sConfig_Varchar;
            string sDemoMailSend = tmConfig.FirstOrDefault(w => w.nConfig_ID == 5).sConfig_Varchar;
            string sSMTP_Mail = tmConfig.FirstOrDefault(w => w.nConfig_ID == 6).sConfig_Varchar;
            var objTemplate = db.TM_EmailTemplate.FirstOrDefault(w => w.nEmailTemplateID == o.nEmailTemplateID);
            string sFormat = objTemplate.sContent;
            string sSubject = string.Format(objTemplate.sSubject, arrEmail.sSubjectCol0, arrEmail.sSubjectCol1, arrEmail.sSubjectCol2, arrEmail.sSubjectCol3, arrEmail.sSubjectCol4, arrEmail.sSubjectCol5);
            string sSubjectSent = "";
            string sCSSFont = "font-size:14pt !important;font-family:Cordia New,Geneva,sans-serif !important;";

            string sMsg = "";
            string sFrom = sSystemMail, sTo = o.sTo, sCC = o.sCC, sBCC = o.sBCC;
            string sToTemp = "", sCCTemp = "";
            System.Net.Mail.MailMessage oMsg = new System.Net.Mail.MailMessage();
            string sException = "";
            bool _cSend = false;
            try
            {
                sToTemp = sTo;
                sCCTemp = sCC;
                string[] Arrsto = sTo.Split(';');
                // if (Arrsto.Length > 10)
                // {
                //     sFormat = "";
                // }
                // if (!string.IsNullOrEmpty(sCC))
                // {
                //     string[] Arrscc = sCC.Split(',');
                //     if (Arrscc.Length > 10)
                //     {
                //         sFormat = "";
                //     }
                // }
                if (!string.IsNullOrEmpty(sFormat))
                {
                    sMsg = string.Format(HttpUtility.HtmlDecode(sFormat), o.sCol0 ?? "", o.sCol1, o.sCol2, o.sCol3, o.sCol4, o.sCol5, o.sCol6, o.sCol7, o.sCol8, o.sCol9, o.sCol10, o.sCol11, o.sCol12, o.sCol13, o.sCol14, o.sCol15);

                    if (IsDebugMode)
                    {
                        sMsg += @"<br><br><br>------------------------------- DebugMode --------------------------------";
                        sMsg += @"<br>จาก : " + sFrom + " (เมล์ที่ส่งจริง)<br>";
                        sMsg += @"<br>ถึง : " + sTo + " (เมล์ที่ออกจริง)<br>";
                        sMsg += @"<br>cc : " + sCC + " (เมล์ที่ccจริง)<br>";
                        sMsg += @"<br>Bcc : " + sBCC + " (เมล์ที่Bccจริง)<br>";
                        sTo = sDemoMailSend;
                        sCC = "";
                        sBCC = "";
                    }

                    oMsg.From = new System.Net.Mail.MailAddress(sFrom, "Softthal Web");

                    // TODO: Replace with recipient e-mail address.
                    Arrsto = sTo.Split(';');
                    for (int i = 0; i < Arrsto.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(Arrsto[i]))
                        {
                            oMsg.To.Add(Arrsto[i]);
                            //oMsg.To.Add(new System.Net.Mail.MailAddress(sTo, "Vendor Management System (VMS)"));
                            // if (true)
                            // {
                            //     oMsg.To.Add(new System.Net.Mail.MailAddress(sTo, "Vendor Management System (VMS)"));
                            // }
                            // else
                            // {
                            //     oMsg.To.Add(Arrsto[i]);
                            // }

                        }
                    }
                    if (!string.IsNullOrEmpty(sCC))
                    {
                        string[] Arrscc = sCC.Split(',');
                        for (int i = 0; i < Arrscc.Length; i++)
                        {
                            if (!string.IsNullOrEmpty(Arrscc[i]))
                            {
                                oMsg.CC.Add(Arrscc[i]);
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(sBCC))
                    {
                        string[] ArrsBCC = sBCC.Split(',');
                        for (int i = 0; i < ArrsBCC.Length; i++)
                        {
                            if (!string.IsNullOrEmpty(ArrsBCC[i]))
                            {
                                oMsg.Bcc.Add(ArrsBCC[i]);
                            }
                        }
                    }
                    oMsg.Subject = sSubject.Replace("\r", String.Empty).Replace("\n", String.Empty).Replace("\t", String.Empty);
                    sSubjectSent = oMsg.Subject;
                    oMsg.IsBodyHtml = true;
                    try
                    {
                        var doc = new HtmlDocument();
                        sMsg = "<HTML><head><BODY  style='" + sCSSFont + @"'><font face='Cordia New'>" + sMsg + "</font></BODY></HTML>";
                        doc.LoadHtml(sMsg);
                        string outputHtmlContent = string.Empty;
                        var myResources = new List<System.Net.Mail.LinkedResource>();
                        string inputHtmlContent = sMsg;
                        //HtmlNodeCollection nodes = doc.DocumentNode.SelectNodes("//img");
                        //if (nodes != null)
                        //{
                            //string sPathWeb = db.TM_Config.Where(w => w.nConfig_ID == 6).Select(s => s.sConfig_Varchar).FirstOrDefault();
                            //if (o.IsDev == true)
                            //{
                            //    sPathWeb = "https://localhost:5001/";
                            //}
                            //foreach (HtmlNode node in nodes)
                            //{
                            //    if (node.Attributes.Contains("src"))
                            //    {
                            //        string data = node.Attributes["src"].Value;
                            //        data = data.Replace(sPathWeb + "UploadFile/", "");
                            //        string imgPath = MapPath(data);
                            //        if (File.Exists(imgPath))
                            //        {

                            //            var imgLogo = new System.Net.Mail.LinkedResource(imgPath);
                            //            imgLogo.ContentId = Guid.NewGuid().ToString();
                            //            imgLogo.ContentType = new System.Net.Mime.ContentType("image/jpeg");
                            //            myResources.Add(imgLogo);
                            //            node.Attributes["src"].Value = string.Format("cid:{0}", imgLogo.ContentId);
                            //            outputHtmlContent = doc.DocumentNode.OuterHtml;
                            //        }
                            //        else
                            //        {
                            //            // data = data.Replace(sPathWeb + "Images/", "");
                            //            imgPath = MapPathNoUpload(data);
                            //            if (File.Exists(imgPath))
                            //            {

                            //                var imgLogo = new System.Net.Mail.LinkedResource(imgPath);
                            //                imgLogo.ContentId = Guid.NewGuid().ToString();
                            //                imgLogo.ContentType = new System.Net.Mime.ContentType("image/jpeg");
                            //                myResources.Add(imgLogo);
                            //                node.Attributes["src"].Value = string.Format("cid:{0}", imgLogo.ContentId);
                            //                outputHtmlContent = doc.DocumentNode.OuterHtml;
                            //            }
                            //            else
                            //            {
                            //                outputHtmlContent = inputHtmlContent;
                            //            }
                            //        }
                            //    }
                            //}
                        //}
                        //else
                        //{
                            outputHtmlContent = inputHtmlContent;
                        //}
                        AlternateView av2 = AlternateView.CreateAlternateViewFromString(outputHtmlContent, null, System.Net.Mime.MediaTypeNames.Text.Html);
                        foreach (LinkedResource linkedResource in myResources)
                        {
                            av2.LinkedResources.Add(linkedResource);
                        }
                        System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                        oMsg.AlternateViews.Add(av2);
                        oMsg.Body = outputHtmlContent;
                        oMsg.BodyEncoding = System.Text.Encoding.UTF8;
                        smtp.Host = sSMTP_Mail;

                        smtp.Send(oMsg);
                        _cSend = true;
                        //Test push
                    }
                    catch (Exception ex)
                    {
                        _cSend = false;
                        result.sStatus = Systemfunction.process_Failed();
                        result.sMsg = ex.Message.ToString();
                        sException = ex.Message;
                    }
                }

            }
            catch (Exception e)
            {
                //result.Status = SystemFunction.process_Error;
                //result.Msg = e.Message;
                //result.bDebugMode = SystemFunction.sDebug() == "Y";
                result.sStatus = Systemfunction.process_Failed();
                result.sMsg = e.Message.ToString();
                sException = e.Message.ToString();
                sMsg = "ไม่ถึงส่งเมล";
            }

            T_Log_Email lm = new T_Log_Email();
            lm.dLog_Email_Send = DateTime.Now;
            lm.sLog_Email_To = sToTemp;
            lm.sLog_Email_CC = sCCTemp;
            lm.sLog_Email_Debug_To = sTo;
            lm.sLog_Email_Debug_CC = sCC;
            lm.sLog_Email_BCC = "";
            lm.sLog_Email_Subject = "Subject : " + sSubjectSent + "<br/><br/>" + sMsg;
            lm.sLog_Email_Content = "Subject : " + sSubjectSent + "<br/><br/>" + sMsg;
            //lm.sLog_Email_Content = "Subject : " + sSubjectSent + "<br/><br/>" + sMsg;
            lm.IsLog_Email_Send = _cSend;
            lm.sLog_Email_Exception = sException;
            lm.nLog_Email_EmailTemplate_ID = arrEmail.nEmailTemplateID;
            db.T_Log_Email.Add(lm);
            db.SaveChanges();
            oMsg = null;
            result.sMsg = sException;
            result.sStatus = _cSend ? Systemfunction.process_Success() : Systemfunction.process_Failed();
            return result;
        }

    }
}
