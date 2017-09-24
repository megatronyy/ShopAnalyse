using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShopAnalyse.OP.Models
{
    public class ShopQueryEntity
    {
        public string ShopID { get; set; }
        public string ShopName { get; set; }
        public string ModifyStatus { get; set; }
        public string LocationID { get; set; }
        public string BusinessID { get; set; }
    }
}