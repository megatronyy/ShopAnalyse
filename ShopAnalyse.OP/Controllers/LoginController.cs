using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WenBin.Common;

namespace ShopAnalyse.OP.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index(UserInfo user)
        {
            if (!string.IsNullOrEmpty(CookieUtility.GetCookie("loginuser")))
                return RedirectToAction("list", "business");

            if (user != null && user.UserName != null)
            {
                string userName = ConfigurationManager.AppSettings["UserName"];
                string password = ConfigurationManager.AppSettings["Password"];
                if (user.UserName.Trim() == userName && user.Password.Trim() == password)
                {
                    CookieUtility.SetCookie("loginuser", userName, true);

                    return RedirectToAction("list", "business");
                }
            }
            return View();
        }
    }


    public class UserInfo
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}