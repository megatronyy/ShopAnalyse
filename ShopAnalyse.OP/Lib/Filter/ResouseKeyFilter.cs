using System.Web.Mvc;
using ShopAnalyse.OP.Lib.Secret;

namespace ShopAnalyse.OP.Lib.Filter
{
    /// <summary>
    /// 资源验证过滤器
    /// </summary>
    public class ResourceKey : ActionFilterAttribute, IActionFilter
    {
        private string _ResourceKey = "";
        private string _MenuKey = "";

        /// <summary>
        /// 设置资源Key和菜单Key
        /// </summary>
        /// <param name="resourceKey">资源Key</param>
        /// <param name="menuKey">菜单Key</param>
        public ResourceKey(string resourceKey, string menuKey = "")
        {
            _ResourceKey = resourceKey;

            //如果不设置菜单Key，则与ResourceKey相同
            if (string.IsNullOrWhiteSpace(menuKey))
            {
                menuKey = resourceKey;
            }

            _MenuKey = menuKey;
        }

        void IActionFilter.OnActionExecuted(ActionExecutedContext filterContext)
        {

        }

        void IActionFilter.OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!string.IsNullOrWhiteSpace(_ResourceKey))
            {
                if (!SessionUtils.HasResourceKey(_ResourceKey))
                {
                    //没有资源权限
                    //BUS.LoggerDefault.Debug("ResourceKey重定向");
                    if (!filterContext.HttpContext.Response.IsRequestBeingRedirected)//在跳转之前做判断,防止重复
                    {
                        filterContext.HttpContext.Response.Redirect("~/Base/NoAccess", false);
                        filterContext.HttpContext.Response.End();
                        filterContext.Result = new EmptyResult();
                    }
                    return;
                }
            }

            if (!string.IsNullOrWhiteSpace(_MenuKey))
            {
                filterContext.Controller.ViewBag.CurrentMenuKey = _MenuKey;
                filterContext.Controller.ViewBag.ShowBreadcrumb = true;
            }
        }
    }
}