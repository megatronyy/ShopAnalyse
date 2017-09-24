using System;
using System.Collections.Generic;
using System.Web.Mvc;
using BitAuto.EP.MaiChe.Utils;

namespace ShopAnalyse.OP.Lib.Bll
{
    public class CommonBll
    {
        #region 获取默认HTML属性
        public static IDictionary<string, object> DefaultHtmlAttribute(string name)
        {
            IDictionary<string, object> htmlAttribute = new Dictionary<string, object>();
            htmlAttribute.Add("class", "form-control");
            htmlAttribute.Add("autocomplete", "false");
            htmlAttribute.Add("placeholder", name);
            return htmlAttribute;
        }
        #endregion

        #region PageSize + IndexBox
        /// <summary>
        /// 获取常用PageSize
        /// </summary>
        /// <returns></returns>
        public static SelectList GetPageSize(string pagesize)
        {
            if (string.IsNullOrWhiteSpace(pagesize))
                pagesize = "20";
            List<int> pageSizeList = new List<int> {5, 10, 20, 50, 100};
            List<SelectListItem> itemList = new List<SelectListItem>();

            foreach (int size in pageSizeList)
            {
                itemList.Add(new SelectListItem { Text = size.ToString(), Value = size.ToString() });
            }
            if (!pageSizeList.Contains(DataFormat.FormatInt32(pagesize)))
            {
                pagesize = "20";
            }
            SelectList retList = new SelectList(itemList, "Value", "Text", pagesize);
            return retList;
        }

        /// <summary>
        /// 根据总页数和当前页码获取 IndexBox 
        /// </summary>
        /// <param name="num">总页数</param>
        /// <param name="selectedValue">当前页码</param>
        /// <returns></returns>
        public static SelectList GetPageIndexBox(int num = 0, int selectedValue = 1)
        {
            List<SelectListItem> itemList = new List<SelectListItem>();
            for (int i = 1; i <= num; i++)
            {
                itemList.Add(new SelectListItem { Text = i.ToString(), Value = i.ToString() });
            }
            SelectList retList = new SelectList(itemList, "Value", "Text", selectedValue);
            return retList;
        }

        #endregion


        

        

        

        

        

        

        

        

        

        
    }
}