namespace ShopAnalyse.OP.Lib.Secret
{
    public class CommonKey
    {
        #region COMMON KEY FOR SESSION OR COOKIE
        /// <summary>
        /// 当前账户SESSION KEY
        /// </summary>
        public static readonly string SESSIONKEY_AccountInfo = "couponcenter_coupon_OP_AccountInfo";

        /// <summary>
        /// OP后台session key
        /// </summary>
        public static readonly string SESSIONKEY_OPUSER = "OpUserSession_couponcenter_coupon_OP";


        /// <summary>
        /// OP后台cookie key
        /// </summary>
        public static readonly string COOKIEKEY_OPUSER = "opuser_couponcenter_coupon_OP";

        #endregion
    }
}