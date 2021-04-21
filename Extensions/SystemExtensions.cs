using System;
using System.Text;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace SoftthaiIntranet.Extensions
{
    public static class SystemExtensions
    {

        public static bool IsNumber(this string instance)
        {
            foreach (char ch in instance)
            {
                if (!char.IsNumber(ch)) return false;
            }
            return true;
        }

        public static bool In(this object instance, IEnumerable collections)
        {
            foreach (var item in collections)
            {
                if (item.Equals(instance)) return true;
            }
            return false;
        }

        /// <summary>
        /// Equals Value
        /// </summary>
        /// <param name="instance"></param>
        /// <param name="sval">format : "1,2,3" or "x,y,z"</param>
        /// <returns></returns>
        public static bool In(this object instance, string sval)
        {
            string[] arr = (sval + "").Split(',');
            foreach (var item in arr)
            {
                if (item.Equals(instance)) return true;
            }
            return false;
        }


        /// <summary>
        /// Spill data to format 'value','value'
        /// </summary>
        /// <param name="collections"></param>
        /// <returns>case null value return ''</returns>
        public static string SplitToInSQL(this IEnumerable instance)
        {
            string result = "";
            foreach (var item in instance)
            {
                result += ",'" + item + "'";
            }
            result = result.Length > 1 ? result.Remove(0, 1) : "''";
            return result;
        }

        public static string DecimalString(this decimal? instance, int nDigit)
        {
            return instance != null ? instance.Value.ToString("n" + nDigit) : "";
        }

        /// <summary>
        /// convert string to datetime with culture
        /// </summary>
        /// <param name="s">this value</param>
        /// <param name="format">format datetime</param>
        /// <param name="culture">CultureInfo</param>
        /// <returns>DateTime?</returns>
        public static DateTime? ToDateTimeNullCulture(this string s, string format, CultureInfo culture)
        {
            try
            {
                DateTime result = DateTime.ParseExact(s: s, format: format, provider: culture);
                return result;
            }
            catch (FormatException)
            {
                return null;
                throw;
            }
            catch (CultureNotFoundException)
            {
                return null;
                throw; // Given Culture is not supported culture
            }

        }
        /// <summary>
        /// check datetime not overflow in SQL 
        /// </summary>
        /// <param name="instance">this value of datetime</param>
        /// <returns></returns>


        /// <summary>
        /// Date format dd/MM/yyyy
        /// </summary>
        /// <param name="instance"></param>
        /// <returns></returns>
        public static string DateString(this DateTime? instance)
        {
            return instance != null ? instance.Value.ToString("dd/MM/yyyy", new CultureInfo("en-US")) : "";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="instance"></param>
        /// <param name="sCulture">Default en-US</param>
        /// <returns></returns>
        public static string DateStringCulture(this DateTime? instance, string sCulture)
        {
            sCulture = string.IsNullOrEmpty(sCulture) ? "en-US" : "";
            return instance != null ? instance.Value.ToString("dd/MM/yyyy", new CultureInfo(sCulture)) : "";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="instance"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static string DateString(this DateTime? instance, string format)
        {
            return instance != null ? instance.Value.ToString(format) : "";
        }

        /// <summary>
        /// Date Time format dd/MM/yyyy HH:mm
        /// </summary>
        /// <param name="instance"></param>
        /// <returns></returns>
        public static string DateTimeString(this DateTime? instance)
        {
            return instance != null ? instance.Value.ToString("dd/MM/yyyy HH:mm", new CultureInfo("en-US")) : "";
        }

        /// <summary>
        /// Date Time format dd/MM/yyyy HH:mm tt
        /// </summary>
        /// <param name="instance"></param>
        /// <returns></returns>
        public static string DateTime12HrString(this DateTime? instance)
        {
            return instance != null ? instance.Value.ToString("dd/MM/yyyy HH:mm tt", new CultureInfo("en-US")) : "";
        }

        public static string DateTime12HrString(this DateTime instance)
        {
            return instance != null ? instance.ToString("dd/MM/yyyy HH:mm tt", new CultureInfo("en-US")) : "";
        }

        public static string IntString(this int? instance)
        {
            return instance != null ? instance.Value.ToString("n0") : "";
        }

        public static string SplitEmailToName(this object instance)
        {
            return instance != null ? (instance + "").Split('@')[0] + "" : "";
        }

        public static decimal? ToDecimal(this decimal? instance, int nDigit)
        {
            if (instance.HasValue)
            {
                return Math.Round(instance.Value, nDigit);
            }
            else
            {
                return null;
            }
        }

        public static string SubString(this string instance, int nStartIndex, int nLength)
        {
            if (!string.IsNullOrEmpty(instance))
            {
                if (instance.Length <= (nStartIndex + nLength))
                {
                    return instance.Substring(nStartIndex, instance.Length);
                }
                else
                {
                    return instance.Substring(nStartIndex, nLength);
                }
            }
            else
                return "";
        }

        public static string MaxLengthText(this string instance, int nLength)
        {
            if (!string.IsNullOrEmpty(instance))
            {
                if (instance.Length <= nLength)
                {
                    return instance;
                }
                else
                {
                    return instance.Substring(0, nLength);
                }
            }
            else
                return "";
        }

        public static bool AllowMaxLength(this string instance, int nLength)
        {
            if (!string.IsNullOrEmpty(instance))
            {
                if (instance.Length <= nLength)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
                return false;
        }

        public static string Trims(this string instance)
        {
            return (instance + "").Trim();
        }

        // Anti SQL Injection
        public static string ReplaceInjection(this string str)
        {
            string[] _blacklist = new string[] { "'", "\\", "\"", "*/", ";", "--", "<script", "/*", "</script>" };
            string strRep = str;
            if (strRep == null || strRep.Trim().Equals(String.Empty))
                return strRep;
            foreach (string _blk in _blacklist) { strRep = strRep.Replace(_blk, ""); }

            return strRep;
        }

        // public static string STCDecrypt(this string instance)
        // {
        //     if (!string.IsNullOrEmpty(instance))
        //         return STCrypt.Decrypt(instance);
        //     else
        //         return "";
        // }

        public static int toIntNullToZero(this string instance)
        {
            int nTemp = 0;
            nTemp = int.TryParse(instance, out nTemp) ? nTemp : 0;
            return nTemp;
        }

        public static decimal? toDecimal(this string instance)
        {
            decimal nTemp = 0;
            nTemp = decimal.TryParse(instance, out nTemp) ? nTemp : 0;
            return nTemp;
        }

        public static decimal? toDecimalNull(this string instance)
        {
            decimal? nTemp = null;
            decimal nCheck = 0;
            if (!string.IsNullOrEmpty(instance))
            {
                instance = ConvertExponentialToString(instance);
                bool cCheck = decimal.TryParse(instance, out nCheck);
                if (cCheck)
                {
                    nTemp = decimal.Parse(instance);
                }
            }

            return nTemp;
        }

        public static double? toDoble(this string instance)
        {
            double nTemp = 0;
            nTemp = double.TryParse(instance, out nTemp) ? nTemp : 0;
            return nTemp;
        }

        public static int? toIntNull(this string instance)
        {
            int? nTemp = null;
            int nCheck = 0;
            if (!string.IsNullOrEmpty(instance))
            {
                instance = ConvertExponentialToString(instance);
                bool cCheck = int.TryParse(instance, out nCheck);
                if (cCheck)
                {
                    nTemp = int.Parse(instance);
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
                bool check = Decimal.TryParse((sVal + "").Replace(",", ""), NumberStyles.Float, null, out nTemp);
                if (check)
                {
                    decimal d = Decimal.Parse((sVal + "").Replace(",", ""), NumberStyles.Float);
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

        public static DateTime? ConvertStringToDateTimeNull(this string strDate, string strTime)
        {
            DateTime dTemp;
            bool IsNull = false;
            bool checkDate = DateTime.TryParseExact(strDate + " " + ((strTime) != "" ? strTime : "00.00"), "dd/MM/yyyy HH.mm", new CultureInfo("en-US"), DateTimeStyles.None, out dTemp);
            if (!checkDate)
            {
                if (strTime.Length < 5)
                {
                    if (!DateTime.TryParseExact(strDate + " " + ((strTime) != "" ? "0" + strTime : "00.00"), "dd/MM/yyyy HH.mm", new CultureInfo("en-US"), DateTimeStyles.None, out dTemp))
                        IsNull = true;
                }
            }
            else
            {
                if (!DateTime.TryParseExact(strDate + " " + ((strTime) != "" ? strTime : "00.00"), "dd/MM/yyyy HH.mm", new CultureInfo("en-US"), DateTimeStyles.None, out dTemp))
                    IsNull = true;
            }

            if (IsNull)
            {
                return null;
            }
            else
            {
                return dTemp;
            }
        }
        public static string ToLolower(string sVal)
        {
            sVal = sVal != "" ? sVal.ToLower().Trims() : "";
            return sVal;
        }
    }
}