var bussinesscouponrule = bussinesscouponrule || {};
bussinesscouponrule.list = {
    appPath: window.AppPath || '',
    _this : this,
    edit: function (id) {
        var conditionStr = "id=" + id;
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 320;
        customAttribute.width = 650;

        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件

        mui.dialog.beforeSave = this.Check;
        mui.dialog.editDialog("/BussinessCouponRule/edit/", conditionStr, customAttribute, options);
    },
    new : function (id) {
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 320;
        customAttribute.width = 650;
        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件
        mui.dialog.beforeSave = this.Check;
        mui.dialog.newDialog("/BussinessCouponRule/edit/", "", customAttribute, options);
    },
    Check : function () {
        var bussinessID = $.trim($("iframe").contents().find("#BussinessID").val());
        var couponType = $.trim($("iframe").contents().find("input[name=CouponType]:checked").val());
        var ruleID = $.trim($("iframe").contents().find("#RuleID").val());
        var amount = $.trim($("iframe").contents().find("#Amount").val());

        if (bussinessID == '') {
            mui.dialog.alertDialog("提示", "请输入业务活动ID！");
            return false;
        }
        if (ruleID == '') {
            mui.dialog.alertDialog("提示", "请输入创建规则ID！");
            return false;
        }
        if (amount == '') {
            mui.dialog.alertDialog("提示", "请输入创建数量！");
            return false;
        }
        return true;
    }
};