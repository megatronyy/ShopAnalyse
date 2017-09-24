var couponSpecialList = couponSpecialList || {};
couponSpecialList.list = new function () {
    var _this = this;
    var appPath = window.AppPath || ''; //virtual path
    //打开编辑页面
    _this.edit = function (ID) {
        var conditionStr = "id=" + ID;
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 420;
        customAttribute.width = 650;

        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件

        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.editDialog("/Coupon/EditSpecialList/", conditionStr, customAttribute, options);
    }
    _this.new = function () {
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 420;
        customAttribute.width = 650;
        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件
        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.newDialog("/Coupon/CreateSpecialList/", "", customAttribute, options);
    }

    _this.newRuleCheck = function () {
        var startTime = $("iframe").contents().find("#StartTime").val();
        var endTime = $("iframe").contents().find("#EndTime").val();
        var couponID = $("iframe").contents().find("#CoupouID").val();
        if (couponID == '') {
            mui.dialog.alertDialog("数据错误", "请输入优惠券ID！");
            return false;
        }
        if (startTime == '') {
            mui.dialog.alertDialog("数据错误", "请输入限制开始时间！");
            return false;
        }
        if (endTime == '') {
            mui.dialog.alertDialog("数据错误", "请输入限制结束时间！");
            return false;
        }
        return true;
    }

    _this.del = function (skuid) {
        if (!skuid) return;
        var cnf = dialog({
            width: 200,
            title: "删除确认",
            okValue: "确定 ",
            cancelValue: "取消",
            content: "你确定要删除该条数据吗？",
            cancel: function () { },
            ok: function () {
                if (skuid.length == 0) {
                    return;
                }
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: appPath + "/Coupon/DelSpecialListData",
                    data: { id: skuid },
                    success: function (data) {
                        var d = dialog({
                            width: 200,
                            title: "结果",
                            okValue: "确定 ",
                            content: data.msg,
                            ok: function () {
                            },
                            onclose: function () {
                                if (data.status === 1) {
                                    $("#SearchForm")[0].submit();
                                }
                            }
                        });
                        d.showModal();
                    }
                });
            }
        });
        cnf.showModal();
    }
}

