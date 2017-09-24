var couponcommon = couponcommon || {};

couponcommon.dialogAttribute = function () {
    this.width = 600;
    this.height = 500;
    this.title = "";
    this.okValue = "";
    this.cancelValue = "";
}
couponcommon.common = new function () {
    var _this = this;
    var appPath = window.AppPath || ''; //virtual path

    //打开编辑页面
    _this.editDialog = function (handleUrl, conditionStr, customAttribute, options) {
        var targetUrl = AppPath + handleUrl;
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        if (!customAttribute) {
            customAttribute = new couponcommon.dialogAttribute();
        }
        var d = dialog({
            width: customAttribute.width,
            height: customAttribute.height,
            title: '详情',
            url: targetUrl,
            okValue: "确定 ",
            cancelValue: '取消',
            ok: function () {
                if (options && options.confirm) {
                    var dC = top.dialog({
                        width: 250,
                        height: 50,
                        title: "保存确认",
                        content: options.confirmText,
                        okValue: "确定 ",
                        cancelValue: '取消',
                        ok: function () {
                            _this.saveEntity(handleUrl, "update");
                            return true;
                        },
                        cancel: {}
                    });
                    dC.showModal();
                    return false;
                } else {
                    var saveSuccess = _this.saveEntity(handleUrl, "update");
                    return saveSuccess;
                }
            },
            cancel: {}
        });
        d.showModal();
    }
    _this.detailDialog = function (handleUrl, conditionStr, customAttribute) {
        var targetUrl = AppPath + handleUrl;
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        if (!customAttribute) {
            customAttribute = new couponcommon.dialogAttribute();
        }
        var d = dialog({
            width: customAttribute.width,
            height: customAttribute.height,
            title: '详细',
            cancelValue: '关闭',
            url: targetUrl,
            cancel: {}
        });
        d.showModal();
    }
    //打开缓存页面
    _this.cacheDialog = function (handleUrl, conditionStr) {
        var targetUrl = AppPath + handleUrl;
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        var d = dialog({
            width: 600,
            height: 500,
            title: '缓存',
            cancelValue: '关闭',
            url: targetUrl,
            cancel: {}
        });
        d.showModal();
    }

    _this.newDialog = function (handleUrl, customAttribute,options) {
        var params = "";
        if (!customAttribute) {
            customAttribute = new couponcommon.dialogAttribute();
        }
        var d = dialog({
            width: customAttribute.width,
            height: customAttribute.height,
            title: '添加',
            okValue: "确定 ",
            cancelValue: '取消',
            url: AppPath + handleUrl + params,
            ok: function () {
                if (options && options.confirm) {
                    var dC = top.dialog({
                        width: 250,
                        height: 50,
                        title: "保存确认",
                        content: options.confirmText,
                        okValue: "确定 ",
                        cancelValue: '取消',
                        ok: function () {
                            _this.saveEntity(handleUrl, "update");
                            return true;
                        },
                        cancel: {}
                    });
                    dC.showModal();
                    return false;
                } else {
                    var saveSuccess = _this.saveEntity(handleUrl, "add");
                    return saveSuccess;
                }
            },
            cancel: {}
        });
        d.showModal();
    }

    //通用提示框 
    _this.alertDialog = function (alterTitle, alterContent, refresh) {
        var d = dialog({
            width: 200,
            title: alterTitle,
            okValue: "确定 ",
            content: alterContent,
            ok: function () {
            },
            onclose: function () {
                if (refresh) {
                    window.location.href = window.location.href;
                }
            }
        });
        d.showModal();
    }

    //保存实体方法
    _this.saveEntity = function (saveUrl, saveType) {
        var saveSuccess = false;
        optools.replacePlaceholder(); //对不支持placeholder的浏览器进行兼容
        var before = _this.beforeSave();

        if (before) {

            var params = {};
            params.savetype = saveType;
            params.formdata = $("iframe").contents().find('#editForm').form2json();
            if ($("iframe").contents().find('#city')) {
                params.city = $("iframe").contents().find('#city').val();
            }
            if ($("iframe").contents().find('#userstate')) {
                params.userstate = $("iframe").contents().find('#userstate').val();
            }
            if ($("iframe").contents().find('#jsondata')) {
                params.jsonBrandData = $("iframe").contents().find('#jsondata').val();
            }
            var url = (window.AppPath || '') + saveUrl;
            $.ajax({ type: "POST", url: url, data: params }).done(function (result) {
                if (!result) return;
                if (result.status != 1) {
                    _this.alertDialog("保存失败", result.msg);
                }
                else {
                    _this.alertDialog("保存成功", "保存成功", true);
                    saveSuccess = true;
                }
            });
        }

        return saveSuccess;
    }

    //刷新缓存
    _this.resetCache = function (handleUrl, moduleid) {
        var params = {};
        if (moduleid) {
            params.moduleid = moduleid;
        }
        var url = (window.AppPath || '') + handleUrl;
        $.ajax({ type: "POST", url: url, data: params }).done(function (result) {
            if (!result) return;
            if (result.status != 1) {
                _this.alertDialog("更新失败", result.msg);
                return;
            }
            else {
                _this.alertDialog("更新成功", "更新成功，共" + result.count + "条!");
            }
        });
    }

    //重置查询条件（用，号分割控件ID）
    _this.resetQueryCondition = function (conditionList) {
        var clearForList = conditionList.split(",");
        for (var i = 0; i < clearForList.length; i++) {
            var target = $("#" + clearForList[i]);
            if (target) {
                target.val("");
                target.text("");
            }
        }
    }
    //重置查询条件（用，号分割控件ID，用于下拉列表）
    _this.resetQueryConditionForDDL = function (conditionList) {
        var clearForList = conditionList.split(",");
        for (var i = 0; i < clearForList.length; i++) {
            var target = document.getElementById(clearForList[i]);
            if (target) {
                target.options.selectedIndex = 0;
            }
        }
    }
    //重置查询条件（用于Select2风格下拉列表[单选]）
    _this.resetQueryConditionForSelect2me = function (v) {
        if (v) {
            $('.select2me').select2("val", v);
        } else {
            $('.select2me').select2("val", 0);
        }
    }
    //重置查询条件（用于Select2风格下拉列表）
    _this.resetQueryConditionForSelect2 = function (v) {
        if (v) {
            $('.select2').select2("val", v);
        } else {
            $('.select2').select2("val", null);
        }
    }
    //重置查询条件（用于Bootstrap风格下拉列表）
    _this.resetQueryConditionForBS = function () {
        $('.bs-st').selectpicker('val', '');
    }
    //重置查询条件（用于Spinner控件）
    _this.resetQueryConditionForSpinner = function (conditionList, value) {
        var clearForList = conditionList.split(",");
        for (var i = 0; i < clearForList.length; i++) {
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                $("#" + clearForList[i]).spinner("value", value);
            } else {
                $("#" + clearForList[i]).spinner("value", 0);
            }
        }
    }
    //检查所有页面上有必填属性的控件（class*=Required）
    _this.checkRequired = function () {

        alert($("[class=Required]").length);

    }
    _this.close = function () {
        try {
            var url = appPath + "/Home/LoginOut";
            $.ajax({ type: "POST", url: url });
        } catch (e) {
        } finally {
            top.window.close();
        }
    }

    _this.beforeSave = function (checkData) {
        //        alert("beforeSave");
        return true;
    }
}

couponcommon.data = new function () {
    var _this = this;
    _this.isInt = function (i) {
        var regInt = new RegExp("^[0-9]*$");
        return regInt.test(i);
    }
}
