var HmcCouponBussiness = HmcCouponBussiness || {};
HmcCouponBussiness.list = new function () {
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
        mui.dialog.editDialog("/HmcCouponBussiess/Edit/", conditionStr, customAttribute, options);
    }
    _this.new = function () {
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 420;
        customAttribute.width = 650;
        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件
        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.newDialog("/HmcCouponBussiess/Create/", "", customAttribute, options);
    }

    _this.newRuleCheck = function () {
        var bussinessTitle = $("iframe").contents().find("#BussinessTitle").val();
        var bussinessID = $("iframe").contents().find("#BussinessID").val();
       
        if (bussinessID == '') {
            mui.dialog.alertDialog("数据错误", "请输入业务活动ID！");
            return false;
        }
        if (bussinessTitle == '') {
            mui.dialog.alertDialog("数据错误", "请输入业务活动名称！");
            return false;
        }
       
        return true;
    }


}