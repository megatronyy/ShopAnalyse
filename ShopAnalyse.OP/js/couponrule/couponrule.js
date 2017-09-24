var couponrule = couponrule || {};
couponrule.list = new function () {
    var _this = this;
    var appPath = window.AppPath || ''; //virtual path
    //打开编辑页面
    _this.edit = function (couponruleid) {
        var conditionStr = "couponruleid=" + couponruleid;
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 570;
        customAttribute.width = 650;

        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件

        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.editDialog("/CouponRule/edit/", conditionStr, customAttribute, options);
    }
    //打开品牌页面
    _this.ruleBrand = function (couponruleid) {
        var conditionStr = "id=" + couponruleid;
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 380;
        customAttribute.width = 650;

        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件

        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.detailDialog("/CouponRule/RuleBrand/", conditionStr, customAttribute, options);
    }
    //打开城市页面
    _this.ruleCity = function (couponruleid) {
        var conditionStr = "id=" + couponruleid;
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 380;
        customAttribute.width = 650;

        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件

        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.detailDialog("/CouponRule/RuleCity/", conditionStr, customAttribute, options);
    }
    //打开新建页面
    _this.new = function () {
        var customAttribute = new mui.options.DialogAttribute();
        customAttribute.height = 570;
        customAttribute.width = 650;
        var options = mui.options.dialogOptionDefault;
        options.saveHandle = mui.dialog.saveEntity2;//自定义保存事件
        mui.dialog.beforeSave = _this.newRuleCheck;
        mui.dialog.newDialog("/CouponRule/edit/", "", customAttribute, options);
    }

    _this.newRuleCheck = function () {
        var couponName = $("iframe").contents().find("#CouponName").val();
        var couponAmountType = $("iframe").contents().find("input[name=CouponAmountType]:checked").val();
        var baseAmount = $("iframe").contents().find("#BaseAmount").val();
        var maxAmount = $("iframe").contents().find("#MaxAmount").val();
        var validDateType = $("iframe").contents().find("input[name=ValidDateType]:checked").val();
        var validDays = $("iframe").contents().find("#ValidDays").val(); 
        var couponStartTime = $("iframe").contents().find("#CouponStartTime").val();
        var couponEndTime = $("iframe").contents().find("#CouponEndTime").val();
        var startTime = $("iframe").contents().find("#StartTime").val();
        var endTime = $("iframe").contents().find("#EndTime").val();
        var userMaxQuota = $("iframe").contents().find("#UserMaxQuota").val();
        var budgetAmount = $("iframe").contents().find("#BudgetAmount").val();
        var consumeAmount = $("iframe").contents().find("#ConsumeAmount").val();
        var AreaRule = $("iframe").contents().find("#AreaRule").val();
        if (couponName == '') {
            mui.dialog.alertDialog("提示", "请输入优惠劵名称！");
            return false;
        }
        if (baseAmount == '') {
            mui.dialog.alertDialog("提示", "请输入基础金额！");
            return false;
        }
        if (baseAmount < 1) {
            mui.dialog.alertDialog("提示", "请输入正确的基础金额！");
            return false;
        }
        if (maxAmount == '') {
            mui.dialog.alertDialog("提示", "请输入最大金额！");
            return false;
        }
        if (maxAmount < 1) {
            mui.dialog.alertDialog("提示", "请输入正确的最大金额！");
            return false;
        }
        if (userMaxQuota == '') {
            mui.dialog.alertDialog("提示", "请输入限领数量！");
            return false;
        }
        if (userMaxQuota < 1) {
            mui.dialog.alertDialog("提示", "请输入正确的限领数量！");
            return false;
        }
        if (validDateType == 1) {
            if (validDays == '') {
                mui.dialog.alertDialog("提示", "请输入有效天数！");
                return false;
            }
        } else if (validDateType == 2) {
            if (couponStartTime == '') {
                mui.dialog.alertDialog("提示", "请输入有效开始时间！");
                return false;
            }
            if (couponEndTime == '') {
                mui.dialog.alertDialog("提示", "请输入有效结束时间！");
                return false;
            }
        }
        if (startTime == '') {
            mui.dialog.alertDialog("提示", "请输入活动开始时间！");
            return false;
        }
        if (endTime == '') {
            mui.dialog.alertDialog("提示", "请输入活动结束时间！");
            return false;
        }

        if (budgetAmount == '') {
            mui.dialog.alertDialog("提示", "请输入活动预算金额！");
            return false;
        }
        if (budgetAmount < 0) {
            mui.dialog.alertDialog("提示", "活动预算金额不能小于0！");
            return false;
        }
        
        if (consumeAmount) {
            if (consumeAmount == '') {
                mui.dialog.alertDialog("提示", "请输入活动消耗金额！");
                return false;
            }
            if (consumeAmount < 0) {
                mui.dialog.alertDialog("提示", "活动消耗金额不能小于0！");
                return false;
            }
        } 
        if (AreaRule == '') {
            mui.dialog.alertDialog("提示", "请选择适用城市！");
            return false;
        }
        return true;
    }
}
couponrule.create = new function () {
    var _this = this;
    var appPath = window.AppPath || ''; //virtual path
    _this.selectCity = function () {
        var nowCity = $("#AreaRule").val();
        var conditionStr = "?cityIds=" + nowCity;
        var d = top.dialog({
            id: "cityDialog",
            width: 600,
            height: 450,
            title: '选择城市',
            okValue: "确定 ",
            cancelValue: '取消',
            url: AppPath + "/Common/SelectCity/" + conditionStr,
            data: $("#cityName").text(),
            ok: function () {
                var citys = $.trim($(this.iframeNode).contents().find("#CityList").val());
                var citynames = $.trim($(this.iframeNode).contents().find("#CityNames").val());
                $("#AreaRule").val(citys);
                $("#cityName").text(citynames);
                if (citynames.length === 0) {
                    $("#cityContainer").hide();
                } else {
                    $("#cityContainer").show();
                }
                return true;
            },
            cancel: {}
        });
        d.showModal();

    }
    _this.selectBrand = function () {
        var brands = $("#BrandRule").val();
        var conditionStr = "?brands=" + '';
        var d = top.dialog({
            id: "brandDialog",
            width: 600,
            height: 450,
            title: '选择品牌',
            okValue: "确定 ",
            cancelValue: '取消',
            url: AppPath + "/Common/SelectBrand/" + conditionStr,
            data: $("#BrandRule").val(),
            ok: function () {
                if (this.brandList) {
                    trueBrandList = $.grep(this.brandList, function (entity, index) {
                        return entity.mbid > 0;
                    });
                }
                var brandJsonStr = "";
                if (trueBrandList.length > 0) {
                    brandJsonStr = JSON.stringify(trueBrandList);
                    $("#nonBrand").html("您当前已选择 " + trueBrandList.length + " 个品牌！");
                } else {
                    $("#nonBrand").html("未选择品牌时默认为不限品牌！您当前还未选择任何品牌！").css("color", "teal");
                }
                $("#BrandRule").val(brandJsonStr);
                return true;
            },
            cancel: {}
        });
        d.showModal();
    }
}