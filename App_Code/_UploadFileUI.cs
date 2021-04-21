using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoftthaiWeb.App_Code
{
    public class _UploadFileUI
    {
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        /// <summary>
        /// Structure for jquery
        /// </summary>
        public class DataFile
        {
            public string name { get; set; }

            /// <summary>
            /// unit Kb
            /// </summary>
            public decimal? size { get; set; }

            /// <summary>
            /// file type
            /// </summary>
            public string type { get; set; }

            /// <summary>
            /// for open file case not custom
            /// </summary>
            public string file { get; set; }

            /// <summary>
            /// for custom
            /// </summary>
            //public Rial.FuncFileUpload.ItemData data { get; set; }
        }

        public class ItemData
        {
            public int nID { get; set; }
            public int nFileID { get; set; }         
            public string SaveToFileName { get; set; }
            public string FileName { get; set; }
            public string SaveToPath { get; set; }
            public string sSize { get; set; }

            /// <summary>
            /// for open file
            /// </summary>
            public string url { get; set; }

            public bool IsNewFile { get; set; }
            public bool IsCompleted { get; set; }
            public bool IsNewChoose { get; set; }
            public string sMsg { get; set; }
            public bool IsDelete { get; set; }
            public string sFileType { get; set; }
            public int? nFileTypeID { get; set; }
            public string sOrderNo { get; set; }
            public string sUrlDelete { get; set; }
        }

        public class CResultEdit
        {
            public int? nID { get; set; }
            public string sPath { get; set; }
            public string sSystemFileName { get; set; }
            public string sFileName { get; set; }
            public bool IsDelete { get; set; }
            public bool IsNew { get; set; }
            public string sSize { get; set; }

        }
    }
}
