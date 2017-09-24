using System.Web.Mvc;

namespace ShopAnalyse.OP.Lib.Filter
{
    /// <summary>
    /// 默认的_defaultOrderParamName 为 OrderBy ，
    /// 排序数据被存储在 ViewBag.OrderBy中，可直接使用  ViewBag.OrderBy
    /// </summary>
    public class OrderByFilterAttribute : ActionFilterAttribute, IActionFilter
    {
        private readonly string _defaultOrderBy = string.Empty;
        private readonly string _defaultOrderParamName = "OrderBy";
        public OrderByFilterAttribute() { }

        /// <param name="defaultOrderBy">默认排序，通常为页面第一次加载时获取数据源时的排序，例：userid desc</param>
        public OrderByFilterAttribute(string defaultOrderBy)
        {
            _defaultOrderBy = defaultOrderBy;
        }

        /// <param name="defaultOrderBy">默认排序，通常为页面第一次加载时获取数据源时的排序，例：userid desc</param>
        /// <param name="defaultOrderParamName">存储排序信息的Http请求参数名称，例 排序信息存储在Request.Params["OrderBy"]中，即 defaultOrderParamName 为 “OrderBy”。默认值为 “OrderBy”</param>
        public OrderByFilterAttribute(string defaultOrderBy, string defaultOrderParamName)
            : this(defaultOrderBy)
        {
            _defaultOrderParamName = defaultOrderParamName;
        }

        void IActionFilter.OnActionExecuting(ActionExecutingContext filterContext)
        {
            var viewBag = filterContext.Controller.ViewBag;
            var fc = filterContext.HttpContext.Request.Params;

            viewBag.OrderBy = _defaultOrderBy;
            if (!string.IsNullOrWhiteSpace(fc[_defaultOrderParamName]))
            {
                viewBag.OrderBy = fc[_defaultOrderParamName];
            }
        }
    }
}