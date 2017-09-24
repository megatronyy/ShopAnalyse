using System;
using System.Configuration;

namespace ShopAnalyse.OP.Lib.Secret
{
    public class ConfigHelper
    {
        #region 得到AppSettings中的配置字符串信息
        /// <summary>
        /// 得到AppSettings中的配置字符串信息
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetConfigString(string key)
        {
            return GetConfigString(key, "");
        }
        public static string GetConfigString(string key, string DefaultValue)
        {
            if (ConfigurationSettings.AppSettings[key] != null && ConfigurationSettings.AppSettings[key].ToString().Length != 0)
            {
                return ConfigurationSettings.AppSettings[key].ToString();
            }
            else
            {
                return DefaultValue;
            }
        }
        #endregion

        #region 得到AppSettings中的配置bool信息
        /// <summary>
        /// 得到AppSettings中的配置bool信息
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool GetConfigBool(string key)
        {
            bool result = false;
            string cfgVal = GetConfigString(key);
            if (null != cfgVal && string.Empty != cfgVal)
            {
                try
                {
                    result = bool.Parse(cfgVal);
                }
                catch (FormatException)
                {
                    // Ignore format exceptions.
                }
            }

            return result;
        }
        #endregion

        #region 得到AppSettings中的配置decimal信息
        /// <summary>
        /// 得到AppSettings中的配置decimal信息
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal GetConfigDecimal(string key)
        {
            decimal result = 0;
            string cfgVal = GetConfigString(key);
            if (null != cfgVal && string.Empty != cfgVal)
            {
                try
                {
                    result = decimal.Parse(cfgVal);
                }
                catch (FormatException)
                {
                    // Ignore format exceptions.
                }
            }

            return result;
        }
        #endregion

        #region 得到AppSettings中的配置int信息
        /// <summary>
        /// 得到AppSettings中的配置int信息
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int GetConfigInt(string key)
        {
            return GetConfigInt(key, 0);
        }
        public static int GetConfigInt(string key, int defaultValue)
        {
            int result = defaultValue;
            string cfgVal = GetConfigString(key);
            if (!string.IsNullOrEmpty(cfgVal))
            {
                try
                {
                    result = int.Parse(cfgVal);
                }
                catch (FormatException)
                {
                    // Ignore format exceptions.
                    return defaultValue;
                }
            }

            return result;
        }
        #endregion

        #region ConnectionString
        private static string GetConnectionString(string connName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[connName].ConnectionString;
            return connectionString;
        }

        /// <summary>
        /// 获取链接字符串
        /// </summary>
        /// <param name="connName"></param>
        /// <returns></returns>
        public static string GetConnString(string connName)
        {
            return GetConnectionString(connName);
        }
        #endregion
    }
}