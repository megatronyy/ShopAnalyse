using System.Web.Mvc;

namespace ShopAnalyse.OP.Lib.Common
{
    public class MUIRazorViewEngine : RazorViewEngine
    {
        public MUIRazorViewEngine()
        {
            ViewLocationFormats = new[]
            {
                "~/Views/{1}/{0}.cshtml",
                "~/Views/Shared/{0}.cshtml",
                "~/Views/Common/{0}.cshtml" //MUI公用的控件路径
            };
        }
    }
}