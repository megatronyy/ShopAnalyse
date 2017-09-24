using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using BitAuto.EP.MaiChe.Utils;
using ShopAnalyse.OP.Lib.Secret;
using ShopAnalyse.OP.Lib.Utils;
using ShopAnalyse.OP.Models;
using MUI.Core.Model.Form;

namespace ShopAnalyse.OP.Lib
{
    public class BUS
    {
        public static readonly string[] SplitArr = new string[] { ",", "，", ";", "；", " ", Environment.NewLine };
        public static readonly string ReplaceChar = ",";
        private static object syncObj2 = new object();

        #region 虚拟目录路径 AppPath
        private static object syncObj = new object();
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
                    lock (syncObj)
                    {
                        if (_AppPath == null)
                        {
                            string path = HttpRuntime.AppDomainAppVirtualPath;
                            _AppPath = path == "/" ? "" : path;
                        }
                    }
                }
                return _AppPath;
            }
        }
        #endregion

        public static string JsVersion
        {
            get
            {
                if (WebConfig.IsDebug)
                {
                    return DateTime.Now.ToString("yyyyMMddHHmmssfff");
                }
                else
                {
                    return ConfigInfo.JsVersion;
                }
            }
        }
        public static string CssVersion
        {
            get
            {
                if (WebConfig.IsDebug)
                {
                    return DateTime.Now.ToString("yyyyMMddHHmmssfff");
                }
                else
                {
                    return ConfigInfo.CssVersion;
                }
            }
        }

        public static ConfigEntity ConfigInfo
        {
            get
            {
                var _key = "ConfigInfo";
                ConfigEntity config = (ConfigEntity)HttpRuntime.Cache[_key];
                if (config == null)
                {
                    string file = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "Config.xml");
                    config = XmlHelper.FromXmlFile<ConfigEntity>(file);
                    if (config != null)
                    {
                        HttpRuntime.Cache.Insert(_key, config, new System.Web.Caching.CacheDependency(file));
                    }
                    else
                    {
                        config = new ConfigEntity();
                    }
                }
                return config;
            }
        }

        public enum EnumMsgStatus
        {
            未载入 = 0,
            已载入 = 1,
            消费中 = 2,
            消费成功 = 3,
            消费失败 = 4,
            已过期 = 5,
            重试次数超限 = 6,
            载入异常 = -99
        }
        /// <summary>
        /// 消息状态
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        public static List<MUISelectListItem> GetMsgStatus(string values)
        {
            var listValues = (values ?? string.Empty).Split(new[] { ',', '，' }, StringSplitOptions.RemoveEmptyEntries);
            List<MUISelectListItem> itemList = new List<MUISelectListItem>();
            itemList.Add(new MUISelectListItem
            {
                Value = "-1",
                Text = "请选择",
                Selected = listValues.Contains("-1")
            });

            foreach (var value in Enum.GetValues(typeof(EnumMsgStatus)))
            {
                itemList.Add(new MUISelectListItem
                {
                    Value = DataFormat.FormatInt32(value).ToString(),
                    Text = value.ToString(),
                    Selected = listValues.Contains(DataFormat.FormatInt32(value).ToString())
                });
            }
            return itemList;
        }
    }
}