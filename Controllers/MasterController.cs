using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoftthaiWeb.Extensions;
using SoftthaiWeb.Interfaces;
using SoftthaiWeb.Models.DB;
using SoftthaiWeb.Models.SystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SoftthaiWeb.Extensions.Systemfunction;

namespace SoftthaiWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        public SoftthaiWebContext db = new SoftthaiWebContext();
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAuthentication _Auth;
        public MasterController(IWebHostEnvironment hostingEnvironment, IAuthentication auth)
        {
            _hostingEnvironment = hostingEnvironment;
            _Auth = auth;
        }
        public GetMas_dataEdit GetData_List(int nID)
        {
            db = new SoftthaiWebContext();
            GetMas_dataEdit result = new GetMas_dataEdit();
            List<Get_DataBytable> lst = new List<Get_DataBytable>();
            if (nID != 0)
            {
                var qGetMasData = db.T_MasterData.Where(w => !w.isDel && w.nTypeID == nID);
                var qGetType = db.T_MasterType.FirstOrDefault(w => w.isActive && w.nID == nID);
                int Count = 1;
                foreach (var i in qGetMasData)
                {
                    Get_DataBytable s = new Get_DataBytable();
                    s.nNo = Count;
                    s.nID = i.nID;
                    s.nTypeID = i.nTypeID;
                    s.nOrder = i.nOrder;
                    s.sName = i.sName;
                    s.isActive = i.isActive;
                    lst.Add(s);
                    Count++;
                }
                if (qGetType != null)
                {
                    result.sName_Type = qGetType.sName;
                }
                result.lstData = lst;
            }
            else
            {
                result.Msg = "ข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
                result.Status = Systemfunction.process_Failed();
            }

            return result;
        }
        public GetMas_dataEdit GetData_Edit(GetdataEdit data)
        {
            db = new SoftthaiWebContext();
            GetMas_dataEdit result = new GetMas_dataEdit();
            List<Get_DataBytable> lst = new List<Get_DataBytable>();
            if (data.nID != 0)
            {
                var qGetMasData = db.T_MasterData.FirstOrDefault(w => !w.isDel && w.nID == data.nID);
                var qGetType = db.T_MasterType.FirstOrDefault(w => w.isActive && w.nID == qGetMasData.nTypeID);
                if (qGetType != null) result.sName_Type = qGetType.sName;
                if (qGetMasData != null)
                {
                    Get_DataBytable s = new Get_DataBytable();
                    s.nID = qGetMasData.nID;
                    s.nTypeID = qGetMasData.nTypeID;
                    s.nOrder = qGetMasData.nOrder;
                    s.sName = qGetMasData.sName;
                    s.isActive = qGetMasData.isActive;
                    lst.Add(s);
                }
                result.lstData = lst;
            }
            else
            {
                var qGetType = db.T_MasterType.FirstOrDefault(w => w.isActive && w.nID == data.PnID_Type);
                if (qGetType != null) result.sName_Type = qGetType.sName;
            }


            return result;
        }
        public CResutlWebMethod Savedata(Save_DataBytable data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            if (data != null)
            {
                UserAccount user = new UserAccount();
                user = _Auth.GetUserAccount();
                int nID = Systemfunction.ParseIntToZero(data.nID);
                var qSaveData = db.T_MasterData.FirstOrDefault(f => f.nID == nID);
                if (qSaveData != null)
                {
                    qSaveData.isActive = data.isActive;
                    qSaveData.sName = data.sName;
                    qSaveData.nUserID_Update = Systemfunction.ParseIntToNull(user.sUserID);
                    qSaveData.dUpdate = DateTime.Now;
                }
                else
                {
                    int nMaxID = db.T_MasterData.Any() ? db.T_MasterData.Max(m => m.nID) + 1 : 1;
                    T_MasterData s = new T_MasterData();
                    s.isActive = data.isActive;
                    s.sName = data.sName;
                    s.nUserID_Create = Systemfunction.ParseIntToNull(user.sUserID);
                    s.dCreate = DateTime.Now;
                    s.nTypeID = Systemfunction.ParseIntToZero(data.nTypeID);
                    s.nID = nMaxID;
                    db.T_MasterData.Add(s);
                }
                db.SaveChanges();
                result.Status = Systemfunction.process_Success();
            }

            return result;
        }
        public CResutlWebMethod Del_datarow(GetnID data)
        {
            CResutlWebMethod result = new CResutlWebMethod();
            db = new SoftthaiWebContext();
            UserAccount user = new UserAccount();
            if (data.nID.Count > 0)
            {
                user = _Auth.GetUserAccount();
                var qData = db.T_MasterData.Where(w => data.nID.Contains(w.nID)).ToList();
                foreach (var i in qData)
                {
                    i.isDel = true;
                    i.nUserID_Delete = Systemfunction.ParseIntToNull(user.sUserID);

                    db.SaveChanges();
                }

                result.Status = Systemfunction.process_Success();
            }
            else
            {
                result.Status = Systemfunction.process_Warning();
            }
            return result;
        }
        public GetMas_dataEdit Search_data(Search_Data data)
        {
            GetMas_dataEdit result = new GetMas_dataEdit();
            List<Get_DataBytable> lst = new List<Get_DataBytable>();
            db = new SoftthaiWebContext();
            if (data != null)
            {
                bool? IsActive = null;
                int nTypeID = Systemfunction.ParseIntToZero(data.nTypeID);
                if (data.IsActive != "")
                    if (data.IsActive == "2")
                    {
                        IsActive = false;
                    }
                    else
                    {
                        IsActive = true;
                    }
                var qGetMasData = db.T_MasterData.Where(w => !w.isDel
                && w.nTypeID == nTypeID
                && (IsActive.HasValue ? w.isActive == IsActive : true)
                && (data.txtSearch != "" ? w.sName.ToLower().Contains(data.txtSearch.ToLower().Trim()) : true)).ToList();
                int Count = 1;
                foreach (var i in qGetMasData)
                {
                    Get_DataBytable s = new Get_DataBytable();
                    s.nNo = Count;
                    s.nID = i.nID;
                    s.nTypeID = i.nTypeID;
                    s.nOrder = i.nOrder;
                    s.sName = i.sName;
                    s.isActive = i.isActive;
                    lst.Add(s);
                    Count++;
                }
                result.lstData = lst;
                result.Status = Systemfunction.process_Success();
            }
            else
            {
                result.Msg = "ข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
                result.Status = Systemfunction.process_Failed();
            }

            return result;
        }
    }
    public class GetMas_dataEdit : CResutlWebMethod
    {
        public string sName_Type { get; set; }
        public List<Get_DataBytable> lstData { get; set; }
    }
    public class Get_DataBytable
    {
        public int? nNo { get; set; }
        public int? nID { get; set; }
        public int? nTypeID { get; set; }
        public int? nOrder { get; set; }
        public string sName { get; set; }
        public bool isActive { get; set; }

    }
    public class Save_DataBytable
    {
        public string nID { get; set; }
        public string nTypeID { get; set; }
        public string sName { get; set; }
        public bool isActive { get; set; }

    }
    public class Search_Data
    {
        public string txtSearch { get; set; }
        public string IsActive { get; set; }
        public string nTypeID { get; set; }
    }
    public class GetdataEdit
    {
        public int nID { get; set; }
        public int PnID_Type { get; set; }
    }
}
