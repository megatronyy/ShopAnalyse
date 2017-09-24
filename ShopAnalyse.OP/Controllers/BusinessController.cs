using MUI.Core.Model.Form;
using ShopAnalyse.OP.Lib.Filter;
using ShopAnalyse.OP.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WenBin.BLL.Crawler;

namespace ShopAnalyse.OP.Controllers
{
    public class BusinessController : BaseController
    {
        #region 列表页
        [PageSizeFilter("SearchForm_pagesize", 10)]
        [OrderByFilter("ShopID Desc")]
        public ActionResult List(ShopQueryEntity query)
        {
            #region 拼接查询条件
            ViewBag.Query = query;
            int businessId = string.IsNullOrEmpty(query.BusinessID) ? 0 : Convert.ToInt32(query.BusinessID);
            int shopID = string.IsNullOrEmpty(query.ShopID) ? 0 : Convert.ToInt32(query.ShopID);
            int modifyStatus = string.IsNullOrEmpty(query.ModifyStatus) ? 0 : Convert.ToInt32(query.ModifyStatus);
            #endregion

            int recordCount = 0;

            DataSet ds = ShopInfoBLL.GetInstance().GetShopInfoList(businessId, shopID, query.ShopName, modifyStatus, pageIndex, pageSize, out recordCount);

            ViewBag.Count = recordCount;
            ViewBag.modifyStatus = GetCouponStatus(query.ModifyStatus);
            ViewBag.businessType = GetBusinessType(query.BusinessID);

            return View(ds.Tables[0]);
        }

        private List<MUISelectListItem> GetCouponStatus(string modifyStatus)
        {

            return new List<MUISelectListItem>
            {
                 new MUISelectListItem
                {
                    Value = "0",
                    Text = "全部",
                     Selected=modifyStatus=="0"
                },
                new MUISelectListItem
                {
                    Value = "2",
                    Text = "已处理",
                    Selected=modifyStatus=="2"
                },
                new MUISelectListItem
                {
                    Value = "1",
                    Text = "未处理",
                     Selected=modifyStatus == "1"||string.IsNullOrEmpty(modifyStatus)
                }
            };

        }

        private List<MUISelectListItem> GetBusinessType(string businessId)
        {
            List<MUISelectListItem> list = new List<MUISelectListItem>();

            list.Add(new MUISelectListItem() { Value = "0", Text= "全部", Selected = businessId == "0" || string.IsNullOrEmpty(businessId) });

            var businessList = BusinessTypeBll.GetInstance().GetBusinessTypeList();
            foreach (var business in businessList)
            {
                list.Add(new MUISelectListItem() { Value = business.BusinessID.ToString(), Text = business.BusinessDes, Selected = businessId == business.BusinessID.ToString() });
            }

            return list;

        }
        #endregion

        #region 编辑页
        [ValidateInput(false)]
        public ActionResult Edit(BusinessModel businessModel)
        {
            if (businessModel.ShopID == 0)
            {
                businessModel = new BusinessModel();
                int shopId = Convert.ToInt32(Request.QueryString["id"]);
                var shopInfo = ShopInfoBLL.GetInstance().GetAdminSingle(shopId);
                businessModel.ShopID = shopId;
                businessModel.ShopTitle = shopInfo.ShopTilte;
                businessModel.ShopPrice = shopInfo.ShopPrice.ToString();
                businessModel.ShopDisc = shopInfo.ShopDisc;
                businessModel.ShopArea = shopInfo.ShopArea.ToString();
                businessModel.PublishTime = shopInfo.PublishTime.ToString();
                businessModel.BusinessID = shopInfo.BusinessID;

                var publisher = PublisherInfoBLL.GetInstance().GetAdminSingle(shopId);
                if (publisher != null)
                {
                    businessModel.UserName = publisher.UserName;
                    businessModel.Mobile = publisher.UserMobile;
                }
            }
            else
            {
                var shopInfo = ShopInfoBLL.GetInstance().GetAdminSingle(businessModel.ShopID);
                if (shopInfo != null)
                {
                    shopInfo.ShopTilte = businessModel.ShopTitle;
                    shopInfo.ShopDisc = businessModel.ShopDisc;
                    shopInfo.BusinessID = businessModel.BusinessID;
                    shopInfo.ModifyStatus = 2;
                    shopInfo.UpdateTime = DateTime.Now;
                    ShopInfoBLL.GetInstance().Update(shopInfo);
                }

                var publisher = PublisherInfoBLL.GetInstance().GetAdminSingle(businessModel.ShopID);
                if (publisher != null)
                {
                    publisher.UserName = businessModel.UserName;
                    publisher.UserMobile = businessModel.Mobile;
                    PublisherInfoBLL.GetInstance().Update(publisher);
                }

                return RedirectToAction("List", "Business");
            }

            return View(businessModel);
        }
        #endregion
    }
}