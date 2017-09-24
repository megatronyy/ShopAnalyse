using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WenBin.Common;

namespace ShopAnalyse.OP.Controllers
{
    public class BaseController : Controller
    {
        /// <summary>
        /// 分页当前页码
        /// author:于军建
        /// date:2016-03-09
        /// </summary>  
        protected int pageIndex
        {
            get
            {
                var id = System.Web.HttpContext.Current.Request.QueryString["id"];//取页码
                int pageIndex = 1;
                if (id != null)
                {
                    int.TryParse(id.ToString(), out pageIndex);
                    pageIndex = pageIndex > 0 ? pageIndex : 1;
                    ViewBag.PageIndex = pageIndex;
                }
                return pageIndex;
            }
        }
        /// <summary>
        /// 分页大小
        /// author:于军建
        /// date:2016-03-09
        /// </summary>  
        protected int pageSize
        {
            get
            {
                return ViewBag.CurrPageSize == null ? 20 : ViewBag.CurrPageSize;
            }
        }
        /// <summary>
        /// 排序字段
        /// author:于军建
        /// date:2016-03-09
        /// </summary>  
        protected string orderBy
        {
            get
            {
                return ViewBag.OrderBy;
            }
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            if (string.IsNullOrEmpty(CookieUtility.GetCookie("loginuser")))
                Response.Redirect("~/login/index"); 

            base.OnActionExecuting(filterContext);
        }
    }
}