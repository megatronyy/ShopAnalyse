using System.Web.Mvc;
using ShopAnalyse.OP.Lib.Secret;

namespace ShopAnalyse.OP.Lib.Filter
{
    public class AuthFilter : ActionFilterAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationContext filterContext)
        {
            #region 检查是否含有忽略特性
            //object[] actionFilter = filterContext.ActionDescriptor.GetCustomAttributes(typeof(IgnoreAuthFilter), false);
            //object[] controllerFilter = filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(IgnoreAuthFilter), false);
            //if (controllerFilter.Length == 1 || actionFilter.Length == 1)
            //{
            //    return;
            //}
            #endregion

            //获取用户信息
            /*var userInfo = SessionUtils.GetOpUserFromSession();
            if (userInfo == null)
            {
                //BUS.LoggerDefault.Debug("AuthFilter重定向");
                if (!filterContext.HttpContext.Response.IsRequestBeingRedirected)//在跳转之前做判断,防止重复
                {
                    filterContext.HttpContext.Response.Redirect(WebConfig.OpLogoutUrl, false);
                    filterContext.HttpContext.Response.End();
                    filterContext.Result = new EmptyResult();
                }
                return;
            }
            filterContext.Controller.ViewBag.OPLoginUserName = userInfo.TrueName;*/
        }
    }
}