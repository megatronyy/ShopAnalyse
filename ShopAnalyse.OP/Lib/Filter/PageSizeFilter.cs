using System.Web.Mvc;

namespace ShopAnalyse.OP.Lib.Filter
{
    /// <summary>
    /// <returns>pagesize数据被存储在 ViewBag.CurrPageSize中，可直接使用  ViewBag.CurrPageSize</returns>
    /// </summary>
    public class PageSizeFilterAttribute : ActionFilterAttribute, IActionFilter
    {
        private int _defaultPageSize = 0;
        private readonly string _defaultPageSizeParamName = string.Empty;
        public PageSizeFilterAttribute() { }

        /// <param name="defaultPageSizeParamName">传递分页数据的参数，通常为页面第一次加载时获取数据源时的排序，例：SearchForm_PageSize</param>
        /// <param name="defaultPageSize">每页的数据量</param>        
        /// <returns>ViewBag.CurrPageSize</returns>
        public PageSizeFilterAttribute(string defaultPageSizeParamName, int defaultPageSize)
        {
            _defaultPageSizeParamName = defaultPageSizeParamName;
            _defaultPageSize = defaultPageSize;
        }
        void IActionFilter.OnActionExecuted(ActionExecutedContext filterContext)
        {

        }
        void IActionFilter.OnActionExecuting(ActionExecutingContext filterContext)
        {
            var viewBag = filterContext.Controller.ViewBag;
            var fc = filterContext.HttpContext.Request.Params;

            viewBag.CurrPageSize = _defaultPageSize;
            if (!string.IsNullOrWhiteSpace(_defaultPageSizeParamName) && !string.IsNullOrWhiteSpace(fc[_defaultPageSizeParamName]))
            {
                int.TryParse(fc[_defaultPageSizeParamName], out _defaultPageSize);
                if (_defaultPageSize > 0)
                {
                    viewBag.CurrPageSize = _defaultPageSize;
                }
            }
        }

    }
}