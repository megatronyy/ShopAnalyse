namespace ShopAnalyse.OP.Lib.Secret
{
    public sealed class WebConfig
    {
        /// <summary>
        /// 是否为测试状态
        /// </summary>
        public static bool IsDebug
        {
            get
            {
                var val = ConfigHelper.GetConfigString("IsDebug", "0").ToLower();
                return (val == "1" || val == "true") ? true : false;

            }
        }

        /// <summary>
        /// 是否是线上正式环境
        /// </summary>
        public static bool IsOnline
        {
            get
            {
                var val = ConfigHelper.GetConfigString("IsOnline", "1").ToLower();
                return (val == "1" || val == "true") ? true : false;
            }
        }


        /// <summary>
        /// OP退出地址
        /// </summary>
        public static string OpLogoutUrl
        {
            get
            {
                return ConfigHelper.GetConfigString("Op.LogoutUrl", "http://op.bitauto.com/");
            }
        }
        /// <summary>
        /// 是否模拟OP后台用户登录
        /// </summary>
        public static bool IsSimulateLogin
        {
            get
            {
                return ConfigHelper.GetConfigBool("IsSimulateLogin");
            }
        }

        /// <summary>
        /// 密钥
        /// </summary>
        public static string SecurityKey
        {
            get
            {
                return ConfigHelper.GetConfigString("SecurityKey");
            }
        }
        /// <summary>
        /// 标题
        /// </summary>
        public static string WebSiteTitle
        {
            get
            {
                return "代金券管理";
            }
        }

        #region 平台接口设置
        /// <summary>
        /// 平台接口设置 AppKey
        /// </summary>
        public static string EP_AppKey
        {
            get
            {
                return ConfigHelper.GetConfigString("AppKey");
            }
        }
        #endregion



        #region GetSettings
        public static string GetAppSetting(string key)
        {
            return ConfigHelper.GetConfigString(key);
        }

        public static string GetConnectionString(string key)
        {
            return ConfigHelper.GetConnString(key);
        }
        #endregion
    }
}