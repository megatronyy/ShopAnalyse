using ShopAnalyse.OP.Lib.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ShopAnalyse.OP
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new MUIRazorViewEngine());
            ViewEngines.Engines.Add(new WebFormViewEngine());
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var ex = Server.GetLastError();
            //TODO:全局错误记录

            //Logger _logger = LoggerPool.Instance.DefaultLogger;
            //_logger.Error("【Global捕获异常】" + ex);
        }
    }
}
