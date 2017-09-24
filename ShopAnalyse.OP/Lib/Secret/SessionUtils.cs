using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShopAnalyse.OP.Lib.Secret
{
    public class SessionUtils
    {
        #region 从session获取OP用户信息
        /// <summary>
        /// 从session获取OP用户信息
        /// </summary>
        /// <returns></returns>
        /*public static UserInfo GetOpUserFromSession()
        {
            UserInfo opuser = (UserInfo)HttpContext.Current.Session[CommonKey.SESSIONKEY_OPUSER];
            if (opuser == null)
            {
                UserSystemClient userAct = new UserSystemClient();
                opuser = userAct.LoginValidate();
                if (opuser != null)
                {
                    HttpContext.Current.Session[CommonKey.SESSIONKEY_OPUSER] = opuser;
                }
            }
            return opuser;
        }*/
        #endregion

        #region 退出/注销OP用户
        /// <summary>
        /// 退出/注销OP用户
        /// </summary>
        public static void OpUserLogout()
        {
            //UserSystemClient userAct = new UserSystemClient();
            HttpContext.Current.Session.Remove(CommonKey.SESSIONKEY_OPUSER);
        }
        #endregion

        #region  获取用户资源
        /// <summary>
        /// 获取用户资源
        /// </summary>
        /// <param name="opuser"></param>
        /// <returns></returns>
        /*public static string GetOpUserResourceKeys(UserInfo opuser)
        {
            if (WebConfig.IsSimulateLogin)
            {
                return "$coupon$coupon_couponrule$coupon_coupon$data$coupon_couponuser$coupon_speciallist$log$log_usercoupondatarecord$log_usercouponback$log_usercouponcost$log_usercouponusedrecord$log_usercouponServicecost$log_ExceptionCoupon$";
            }
            if (opuser == null) return "";
            //从数据库查询该用户的ResourceKey
            List<Resource> list = SecurityContext.GetAllowedResource(opuser.UserName);
            //暂时忽略本地数据
            //list = OpAccessRightsExtBll.Instance.GetAllowedResource(opuser.UserName, ref list);//添加本地数据库数据
            string str = "";
            if (list != null && list.Count > 0)
            {
                str = string.Format("${0}$", string.Join("$", list.Select(o => o.Key)));
            }
            return str.ToLower();
        }
        /// <summary>
        /// 获取当前登录用户资源
        /// </summary>
        /// <returns></returns>
        public static string GetOpUserResourceKeys()
        {
            return GetOpUserResourceKeys(GetOpUserFromSession());
        }


        /// <summary>
        /// 获取当前key下的操作权限
        /// </summary>
        /// <param name="opuser"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetOpUserOperationsByResourceKey(UserInfo opuser, string key)
        {
            if (WebConfig.IsSimulateLogin)
            {
                return "$$$";
            }
            if (opuser == null) return "";

            //从数据库查询该用户的当前ResourceKey下当前页面的权限
            List<Resource> list = SecurityContext.GetAllowedResource(opuser.UserName);
            //list = OpAccessRightsExtBll.Instance.GetAllowedResource(opuser.UserName, ref list);//添加本地数据库数据(暂时忽略)\
            if (list != null && list.Count > 0)
            {
                foreach (Resource resource in list)
                {
                    if (resource.Key == key)
                        return resource.Operations;
                }
            }
            return "";
        }
        public static string GetOpUserOperationsByResourceKey(string key)
        {
            return GetOpUserOperationsByResourceKey(GetOpUserFromSession(), key);
        }*/

        /// <summary>
        /// 当前用户权限中是否包含指定的权限
        /// </summary>
        /// <param name="opUserOperations">当前用户操作权限</param>
        /// <param name="checkingOperation">当前指定操作</param>
        /// <returns></returns>
        public static bool HasRight(string opUserOperations, string checkingOperation)
        {
            if (WebConfig.IsSimulateLogin)
            {
                return true;
            }
            if (string.IsNullOrEmpty(opUserOperations) || string.IsNullOrEmpty(checkingOperation))
            {
                return false;
            }
            opUserOperations = opUserOperations.Replace(",", "$");
            opUserOperations = opUserOperations.StartsWith("$") ? opUserOperations : "$" + opUserOperations;
            opUserOperations = opUserOperations.EndsWith("$") ? opUserOperations : opUserOperations + "$";

            return opUserOperations.Contains("$" + checkingOperation + "$");
        }

        /// <summary>
        /// 验证是否有使用权限（不适合批量验证）
        /// </summary>
        /// <param name="key"></param>
        /// <param name="checkingOperation"></param>
        /// <returns></returns>
        public static bool HasRightByResourceKey(string key, string checkingOperation)
        {
            //string str = GetOpUserOperationsByResourceKey(key);
            string str = string.Empty;
            return HasRight(str, checkingOperation);
        }
        #endregion
        /// <summary>
        /// 判断当前用户是否包含资源Key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool HasResourceKey(string key)
        {
            if (WebConfig.IsSimulateLogin)
            {
                return true;
            }
            if (string.IsNullOrWhiteSpace(key))
            {
                return false;
            }
            key = key.ToLower();
            //var keys = GetOpUserResourceKeys();
            string keys = string.Empty;
            if (string.IsNullOrWhiteSpace(keys))
            {
                return false;
            }
            keys = keys.ToLower();
            return keys.Contains(string.Format("${0}$", key));
        }
    }
}