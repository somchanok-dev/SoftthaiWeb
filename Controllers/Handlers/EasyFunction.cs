using System;
using System.Web;
using System.Globalization;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using ClosedXML.Excel;

public class EasyFunction
{
    public static Func<string, string> ReplaceSpaceToNbsp = new Func<string, string>(s => s.Replace(" ", "&nbsp;"));

    public static TimeSpan? String_to_TimeSpan(string strTime)
    {
        try { return !string.IsNullOrEmpty(strTime) ? TimeSpan.Parse(strTime) : (TimeSpan?)null; } catch { return null; }
    }
    public static DateTime? String_to_DateTime(string strDate, string sFormat, CultureInfo ci)
    {
        try { return DateTime.ParseExact(strDate, sFormat, ci); } catch { return null; }
    }
    public static string DateTime_to_String(DateTime? d, string sFormat, CultureInfo ci, string sResultOnNullOrError)
    {
        try { return d.HasValue ? d.Value.ToString(sFormat, ci) : sResultOnNullOrError; }
        catch { return sResultOnNullOrError; }
    }
    public static string DateTime_to_StringEN(DateTime? d, string sFormat, string sResultOnNullOrError)
    {
        return DateTime_to_String(d, sFormat, new CultureInfo("en-US"), sResultOnNullOrError);
    }
    public static string DateTime_to_StringTH(DateTime? d, string sFormat, string sResultOnNullOrError)
    {
        return DateTime_to_String(d, sFormat, new CultureInfo("th-TH"), sResultOnNullOrError);
    }

    public static string THB_Read(Double nAmount)
    {
        string sAmount = nAmount.ToString("####.00"), cTemp, sBaht = "";
        string[] sNum = { "ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ" };
        string[] sRank = { "", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน" };
        string[] sTemp = sAmount.Split('.');
        string sInteger = sTemp[0];
        string sDecimal = sTemp[1];
        if (nAmount == 0)
            sBaht = "ศูนย์บาทถ้วน";
        else
        {
            int nLength_Interger = sInteger.Length;
            for (int i = 0; i < nLength_Interger; i++)
            {
                cTemp = sInteger.Substring(i, 1);
                if (cTemp != "0")
                {
                    if ((i == (nLength_Interger - 1)) && (cTemp == "1"))
                        sBaht += "เอ็ด";
                    else if ((i == (nLength_Interger - 2)) && (cTemp == "2"))
                        sBaht += "ยี่";
                    else if ((i == (nLength_Interger - 2)) && (cTemp == "1"))
                        sBaht += "";
                    else
                        sBaht += sNum[Convert.ToInt32(cTemp)];
                    sBaht += sRank[(nLength_Interger - i) - 1];
                }
            }
            sBaht += "บาท";
            if (sDecimal == "00") sBaht += "ถ้วน";
            else
            {
                int nLength_Decimal = sDecimal.Length;
                for (int i = 0; i < nLength_Decimal; i++)
                {
                    cTemp = sDecimal.Substring(i, 1);
                    if (cTemp != "0")
                    {
                        if ((i == nLength_Decimal - 1) && (cTemp == "1"))
                            sBaht += "เอ็ด";
                        else if ((i == (nLength_Decimal - 2)) && (cTemp == "2"))
                            sBaht += "ยี่";
                        else if ((i == (nLength_Decimal - 2)) && (cTemp == "1"))
                            sBaht += "";
                        else
                            sBaht += sNum[Convert.ToInt32(cTemp)];
                        sBaht += sRank[(nLength_Decimal - i) - 1];
                    }
                }
                sBaht += "สตางค์";
            }
        }
        return sBaht;
    }

    public static string EncryptParameter(string s)
    {
        return HttpUtility.UrlEncode(STCrypt.Encrypt(s));
    }
    public static string EncryptParameter(int n)
    {
        return EncryptParameter(n.ToString());
    }
    public static string EncryptParameter(long n)
    {
        return EncryptParameter(n.ToString());
    }

    public static string ExcelColumnName(int nCol)
    {
        string sColName = "";
        int nDivide = nCol, nMod = 0;

        while (nDivide > 0)
        {
            nMod = (nDivide - 1) % 26;
            sColName = Convert.ToChar(65 + nMod).ToString() + sColName;
            nDivide = (int)((nDivide - nMod) / 26);
        }

        return sColName;
    }

    /// <summary>
    /// แปลง List เป็น DataTable
    /// </summary>
    /// <typeparam name="T">ประเภทของตัวแปรในรูปแบบ List เช่น Class, String, Int32 เป็นต้น</typeparam>
    /// <param name="items">ตัวแปร List ที่ต้องการแปลง</param>
    /// <returns></returns>
    public static DataTable DataTable_FromList<T>(IList<T> items)
    {
        DataTable dataTable = new DataTable(typeof(T).Name);

        //Get all the properties
        PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (PropertyInfo prop in Props)
        {
            //Setting column names as Property names
            dataTable.Columns.Add(prop.Name);
        }
        foreach (T item in items)
        {
            var values = new object[Props.Length];
            for (int i = 0; i < Props.Length; i++)
            {
                //inserting property values to datatable rows
                values[i] = Props[i].GetValue(item, null);
            }
            dataTable.Rows.Add(values);
        }
        //put a breakpoint here and check datatable
        return dataTable;
    }

    public static DataTable DataTable_FromExcel(string sFilePath) { return DataTable_FromExcel(sFilePath, 1); }
    public static DataTable DataTable_FromExcel(string sFilePath, int nHeaderRow)
    {
        using (XLWorkbook wb = new XLWorkbook(sFilePath))
        {
            IXLWorksheet ws = wb.Worksheet(1);

            DataTable dt = new DataTable();

            int nRow = 0;
            foreach (IXLRow wr in ws.Rows())
            {
                nRow += 1;
                if (nRow <= nHeaderRow)
                {
                    if (nRow == nHeaderRow) foreach (IXLCell cell in wr.Cells()) dt.Columns.Add(cell.Value.ToString());
                }
                else
                {
                    var wc_first = wr.FirstCellUsed();
                    var wc_last = wr.LastCellUsed();
                    if (wc_first != null && wc_last != null)
                    {
                        int nCell_First = wc_first.Address.ColumnNumber;
                        int nCell_Last = wc_last.Address.ColumnNumber;
                        IXLCells wc_collection = wr.Cells(nCell_First, nCell_Last);

                        DataRow dr = dt.NewRow();
                        int i = 0;
                        foreach (IXLCell wc in wc_collection)
                        {
                            dr[i] = wc.Value.ToString();
                            i += 1;
                        }
                        dt.Rows.Add(dr);
                    }
                }
            }

            return dt;
        }
    }
}