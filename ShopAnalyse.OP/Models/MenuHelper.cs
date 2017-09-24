using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;
using ShopAnalyse.OP.Lib.Secret;

namespace ShopAnalyse.OP.Models
{
    public class MenuHelper
    {
        private readonly static string KEY_MenuCache = "ALL_MENU_DATA";

        private MenuHelper()
        {
        }
        #region 虚拟目录路径
        private static string _AppPath = null;
        /// <summary>
        /// 虚拟目录路径
        /// </summary>
        public static string AppPath
        {
            get
            {
                if (_AppPath == null)
                {
                    string path = HttpRuntime.AppDomainAppVirtualPath;
                    _AppPath = path == "/" ? "" : path;
                }
                return _AppPath;
            }
        }
        #endregion
        private static object _lock = new object();
        private static Dictionary<string, MenuItem> dictMenu = new Dictionary<string, MenuItem>();

        public static string DefaultUserUrl = string.Empty;

        #region 获取所有菜单

        private static List<MenuItem> GetAllMenu()
        {
            var cache = HttpRuntime.Cache[KEY_MenuCache];
            if (cache == null)
            {
                lock (_lock)
                {
                    if (HttpRuntime.Cache[KEY_MenuCache] == null)
                    {
                        //读取
                        var menuxmlPath = HttpContext.Current.Server.MapPath("~/Menu.xml");
                        XmlDocument doc = new XmlDocument();
                        doc.Load(menuxmlPath);
                        var nodes = doc.SelectNodes("/Menus/Menu");

                        //填充
                        var dictTemp = new Dictionary<string, MenuItem>();
                        var list = LoadNode(null, nodes, dictTemp);
                        dictMenu = dictTemp;

                        cache = list;

                        if (cache != null)
                        {
                            string file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "Menu.xml");
                            HttpRuntime.Cache.Insert(KEY_MenuCache, list, new System.Web.Caching.CacheDependency(file));
                        }
                    }
                }
            }

            return (List<MenuItem>)cache;
        }

        #endregion

        #region 获取用户有权限的菜单
        /// <summary>
        /// 获取用户有权限的菜单
        /// </summary>
        /// <returns></returns>
        public static List<MenuItem> GetUserMenu()
        {
            //TODO:获取用户资源Key
            string userResource = string.Empty;
                //userResource = SessionUtils.GetOpUserResourceKeys();

            var listAllMenu = GetAllMenu();
            var listUserMenu = GetUserMenu_Loop(null, listAllMenu, userResource);

            return listUserMenu;
        }
        public static string GetParentMenuKey(string menuKey)
        {
            List<MenuItem> menuList = GetAllMenu();
            MenuItem item = menuList.FirstOrDefault(m => m.MenuKey == menuKey);
            if (item == null)
            {
                menuList.ForEach(a => 
                {
                    if (item == null && a.SubMenu != null)
                    {
                        item = a.SubMenu.FirstOrDefault(m => m.MenuKey == menuKey);
                    }
                });
            }
            if (item == null) return "";
            return item.ParentMenuKey;
        }
        private static List<MenuItem> GetUserMenu_Loop(MenuItem parentMenu, List<MenuItem> listAllMenu, string userResource)
        {
            if (listAllMenu == null || listAllMenu.Count <= 0)
            {
                return null;
            }

            List<MenuItem> list = new List<MenuItem>();

            foreach (var item in listAllMenu)
            {
                //if (!string.IsNullOrWhiteSpace(item.ResourceKey))
                //{
                //    if (!userResource.Contains(string.Format("${0}$", item.ResourceKey)))
                //    {
                //        continue;
                //    }
                //}

                MenuItem model = new MenuItem();
                model.LinkUrl = item.LinkUrl;
                model.MenuKey = item.MenuKey;
                model.ResourceKey = item.ResourceKey;
                model.Text = item.Text;
                model.IconClass = item.IconClass;
                model.Target = item.Target;
                model.RightIconClass = item.RightIconClass;
                model.RightInfo = item.RightInfo;
                model.ParentMenuKey = item.ParentMenuKey;
                model.ItemClass = item.ItemClass;
                model.ParentMenu = parentMenu;
                list.Add(model);
                if (string.IsNullOrWhiteSpace(DefaultUserUrl) && !string.IsNullOrWhiteSpace(item.LinkUrl))
                {
                    DefaultUserUrl = item.LinkUrl;
                }
                model.SubMenu = GetUserMenu_Loop(model, item.SubMenu, userResource);
            }

            return list;
        }

        #endregion

        #region 从XML加载Menu
        /// <summary>
        /// 递归遍历菜单Xml，填充到List
        /// </summary>
        private static List<MenuItem> LoadNode(MenuItem parentNode, XmlNodeList nodeList, Dictionary<string, MenuItem> dict)
        {
            if (nodeList == null || nodeList.Count <= 0)
            {
                return null;
            }
            List<MenuItem> list = new List<MenuItem>();
            foreach (XmlNode item in nodeList)
            {
                MenuItem model = new MenuItem();
                if (item.Attributes["LinkUrl"] != null)
                {
                    var linkUrl = item.Attributes["LinkUrl"].InnerText;
                    //TODO:更新路径
                    linkUrl = string.IsNullOrWhiteSpace(linkUrl) ? "" : (AppPath + linkUrl);
                    model.LinkUrl = linkUrl;
                }
                model.ParentMenu = parentNode;
                if (item.Attributes["ResourceKey"] != null)
                {
                    model.ResourceKey = item.Attributes["ResourceKey"].InnerText;
                }
                if (item.Attributes["MenuKey"] != null)
                {
                    model.MenuKey = item.Attributes["MenuKey"].InnerText;
                }
                if(parentNode == null)
                {
                    model.ParentMenuKey = model.MenuKey;
                }
                else
                {
                    model.ParentMenuKey = parentNode.ParentMenuKey;
                }
                if (item.Attributes["Text"] != null)
                {
                    model.Text = item.Attributes["Text"].InnerText;
                }
                if (item.Attributes["IconClass"] != null)
                {
                    model.IconClass = item.Attributes["IconClass"].InnerText;
                }
                if (item.Attributes["ItemClass"] != null)
                {
                    model.ItemClass = item.Attributes["ItemClass"].InnerText;
                }
                model.Target = "_self";
                if (item.Attributes["Target"] != null)
                {
                    model.Target = item.Attributes["Target"].InnerText;
                }
                if (item.Attributes["RightIconClass"] != null)
                {
                    model.RightIconClass = item.Attributes["RightIconClass"].InnerText;
                }
                if (item.Attributes["RightInfo"] != null)
                {
                    model.RightInfo = item.Attributes["RightInfo"].InnerText;
                }
                model.SubMenu = LoadNode(model, item.SelectNodes("Menu"), dict);
                list.Add(model);
                if (!string.IsNullOrWhiteSpace(model.MenuKey))
                {
                    if (!dict.ContainsKey(model.MenuKey))
                    {
                        dict.Add(model.MenuKey, model);
                    }
                }
            }
            return list;
        }

        #endregion

        ///// <summary>
        ///// 根据资源Key获取菜单ID列表
        ///// </summary>
        //public static List<string> GetMenuByResource(string resourceKey)
        //{
        //    List<string> listMenuID = new List<string>();
        //    if (dictMenu.ContainsKey(resourceKey))
        //    {
        //        var menu = dictMenu[resourceKey];
        //        while (true)
        //        {
        //            if (menu == null)
        //            {
        //                break;
        //            }
        //            listMenuID.Add(menu.ID);
        //            menu = menu.ParentMenu;
        //        }
        //    }

        //    return listMenuID;
        //}

        /// <summary>
        /// 根据菜单Key获取面包屑
        /// </summary>
        /// <param name="resourceKey"></param>
        /// <returns></returns>
        public static List<string> GetBreadcrumb(string menuKey)
        {
            List<string> listMenuText = new List<string>();
            if (dictMenu.ContainsKey(menuKey))
            {
                var menu = dictMenu[menuKey];
                while (true)
                {
                    if (menu == null)
                    {
                        break;
                    }
                    listMenuText.Add(menu.Text);
                    menu = menu.ParentMenu;
                }
            }

            return listMenuText;
        }
    }

    /// <summary>
    /// 菜单实体
    /// </summary>
    public class MenuItem
    {
        /// <summary>
        /// 菜单Key(必须唯一)
        /// </summary>
        public string MenuKey { get; set; }
        /// <summary>
        /// 顶级Key(暂定为两级)
        /// </summary>
        public string ParentMenuKey { get; set; }
        /// <summary>
        /// 资源Key
        /// </summary>
        public string ResourceKey { get; set; }

        /// <summary>
        /// 链接地址
        /// </summary>
        public string LinkUrl { get; set; }

        /// <summary>
        /// 显示文本
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// class属性内容
        /// </summary>
        public string IconClass { get; set; }
        /// <summary>
        /// 目标窗口位置
        /// </summary>
        public string Target { get; set; }
        /// <summary>
        /// 菜单右侧信息样式
        /// </summary>
        public string RightIconClass { get; set; }
        public string RightInfo { get; set; }
        /// <summary>
        /// 元素li的样式
        /// </summary>
        public string ItemClass { get; set; }

        private List<MenuItem> _SubMenu = null;
        /// <summary>
        /// 子菜单
        /// </summary>
        public List<MenuItem> SubMenu
        {
            get
            {
                return _SubMenu;
            }
            set
            {
                _SubMenu = value;
            }
        }

        private MenuItem _ParentMenu = null;
        /// <summary>
        /// 上级菜单
        /// </summary>
        public MenuItem ParentMenu
        {
            get
            {
                return _ParentMenu;
            }
            set
            {
                _ParentMenu = value;
            }
        }
    }
}