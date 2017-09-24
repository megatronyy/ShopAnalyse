var HmcCouponAllottedRate = HmcCouponAllottedRate || {};
HmcCouponAllottedRate.list = new function () {
    var _this = this;
    //打开编辑页面
    _this.edit = function (ID) {
        var conditionStr = "id=" + ID;
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 420;
        customAttribute.width = 650;

        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件

        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.editDialog("/HmcCouponAllottedRate/Edit/", conditionStr, customAttribute, options);
    }
    _this.new = function () {
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 420;
        customAttribute.width = 650;
        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件
        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.newDialog("/HmcCouponAllottedRate/Create/", "", customAttribute, options);
    }

    _this.newRuleCheck = function () {
        var CouponAmount = $("iframe").contents().find("#CouponAmount").val();
        var bussinessID = $("iframe").contents().find("#BussinessID").val();
        var MaxAmount = $("iframe").contents().find("#MaxAmount").val();
        var AllottedDate = $("iframe").contents().find("#AllottedDate").val();

        if (bussinessID == '' || bussinessID > 2147483647) {
            mui.dialog.alertDialog("数据错误", "请输入正确的业务活动ID！");
            return false;
        }
        if (CouponAmount == '' || CouponAmount > 2147483647) {
            mui.dialog.alertDialog("数据错误", "请输入正确的优惠券额度！");
            return false;
        }
        if (MaxAmount == '' || MaxAmount > 2147483647) {
            mui.dialog.alertDialog("数据错误", "请输入正确的分配数量！");
            return false;
        }
        if (AllottedDate == '') {
            mui.dialog.alertDialog("数据错误", "请输入可分配日期！");
            return false;
        }
        return true;
    }


}