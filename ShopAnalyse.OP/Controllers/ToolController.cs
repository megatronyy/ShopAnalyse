using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopAnalyse.OP.Lib.Secret;

namespace ShopAnalyse.OP.Controllers
{
    public class ToolController : Controller
    {
        // GET: Tool
        #region 自定义显示列相关

        public ActionResult ColumnEdit()
        {
            return View();
        }

        public void RefreshCookie()
        {
            var fc = Request.Form;
            //TODO:自定义显示列，需要引入Logger
            //_logger.Info("cols:{0},page:{1}", fc["Cols"], fc["page"]);
            if (fc["Cols"] != null && fc["page"] != null)
            {
                SetCookie(fc["page"], fc["Cols"]);
            }
        }

        public string GetCookie(string actionName)
        {
            var cookieName = FormatCookieName(actionName);
            if (string.IsNullOrWhiteSpace(cookieName)) return string.Empty;

            var cookie = System.Web.HttpContext.Current.Request.Cookies.Get(cookieName);
            if (cookie == null) return string.Empty;

            return HttpUtility.HtmlEncode(cookie.Value);
        }

        public List<string> GetCookieList(string actionName)
        {
            var cols = GetCookie(actionName);
            var colList = new List<string>();
            if (!string.IsNullOrWhiteSpace(cols))
            {
                colList = cols.Split(',').ToList();
            }
            return colList;
        }
        private void SetCookie(string actionName, string value)
        {
            var cookieName = FormatCookieName(actionName);
            if (string.IsNullOrWhiteSpace(cookieName)) return;

            HttpCookie opCookie = new HttpCookie(cookieName)
            {
                Value = value.ToLower(),
                Expires = DateTime.Now.AddMonths(1)
            };
            System.Web.HttpContext.Current.Response.Cookies.Add(opCookie);
        }

        private string FormatCookieName(string actionName)
        {
            string uname = string.Empty;
            /*var user = SessionUtils.GetOpUserFromSession();
            if (user == null && WebConfig.IsSimulateLogin)
            {
                uname = "test";
            }
            if (user != null)
            {
                uname = user.UserName;
            }*/
            if (string.IsNullOrWhiteSpace(uname)) return string.Empty;

            var cookieName = CommonKey.COOKIEKEY_OPUSER + "_" + actionName + "_" + uname;
            return cookieName;
        }
        #endregion
    }
}