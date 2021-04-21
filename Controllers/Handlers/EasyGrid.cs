using System;

public class EasyGrid
{
    [Serializable]
    public class GridOption
    {
        private class SortingDirection
        {
            public static string ASCENDING { get { return "asc"; } }
            public static string DESCENDING { get { return "desc"; } }
        }

        public int nPageSize { get; set; }
        public int nPageNo { get; set; }
        public string sSortExpression { get; set; }
        public string sSortDirection { get; set; }

        public bool isASC { get { return sSortDirection == SortingDirection.ASCENDING;  } }
        public bool isDESC { get { return sSortDirection == SortingDirection.DESCENDING; } }
    }
}