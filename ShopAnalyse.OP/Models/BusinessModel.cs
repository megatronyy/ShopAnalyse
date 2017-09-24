using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShopAnalyse.OP.Models
{
    public class BusinessModel
    {
        public int ShopID { get; set; }
        public string ShopTitle { get; set; }
        public string ShopPrice { get; set; }
        public string ShopArea { get; set; }
        public int BusinessID { get; set; }
        public string BusinessName { get; set; }
        public string CityName { get; set; }
        public string PublishTime { get; set; }
        public string UserName { get; set; }
        public string Mobile { get; set; }
        public string ShopDisc { get; set; }
    }
}