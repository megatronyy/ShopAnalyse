var mui = mui || {};
mui.version = "201601271558";

mui.options = new function () {
    var _this = this;
    _this.DialogAttribute = function () {
        this.width = 600;
        this.height = 500;
        this.title = "";
        this.okValue = "";
        this.cancelValue = "";
    };
    _this.tableOption = {};
    _this.dialogOptionDefault = {
        confirm: false,//是否有保存提示
        confirmText: "",
        refresh: true,//保存成功后是否刷新
        redirectUrl: "",//保存成功后跳转到的URL，为空则刷新当前页
        saveHandle: null//自定义保存事件
    };
    _this.defaultPopoverOption = { container: "body", html: "true" };
    _this.dateRangeOption = {
        opens: (Metronic.isRTL() ? 'left' : 'right'),
        startDate: moment().subtract('days', 29),
        endDate: moment(),
        minDate: '1990/01/01/',
        maxDate: '2020/12/31',
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            '今天': [moment(), moment()],
            '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
            '近7天': [moment().subtract('days', 6), moment()],
            '近30天': [moment().subtract('days', 29), moment()],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        buttonClasses: ['btn'],
        applyClass: 'green',
        cancelClass: 'default',
        format: 'YYYY/MM/DD',
        separator: ' to ',
        locale: {
            applyLabel: '应用',
            fromLabel: '从',
            toLabel: '至',
            customRangeLabel: '自定义日期',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 0
        }
    }
}

mui.dialog = new function () {
    var _this = this;
    var appPath = window.AppPath || ''; //virtual path
    var baseDialogAttribute = new mui.options.DialogAttribute();


    //打开编辑页面
    _this.editDialog = function (handleUrl, conditionStr, customAttribute, options) {
        var targetUrl = appPath + handleUrl;
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        if (!customAttribute) {
            customAttribute = baseDialogAttribute;
        }
        if (!options) {
            options = mui.options.dialogOptionDefault;
        }

        if (typeof options.saveHandle !== "function") {
            options.saveHandle = _this.saveEntity;
        }
        var d = dialog({
            width: customAttribute.width,
            height: customAttribute.height,
            title: '详情',
            url: targetUrl,
            okValue: "确定 ",
            cancelValue: '取消',
            ok: function () {
                if (options.confirm) {
                    var dC = top.dialog({
                        width: 250,
                        height: 50,
                        title: "保存确认",
                        content: options.confirmText,
                        okValue: "确定 ",
                        cancelValue: '取消',
                        ok: function () {
                            options.saveHandle(handleUrl, "update", options.refresh, options.redirectUrl);
                            return true;
                        },
                        cancel: {}
                    });
                    dC.showModal();
                    return false;
                } else {
                    var saveSuccess = options.saveHandle(handleUrl, "update", options.refresh, options.redirectUrl);
                    return saveSuccess;
                }
            },
            cancel: {}
        });
        d.showModal();
    }
    _this.detailDialog = function (handleUrl, conditionStr, customAttribute) {
        var targetUrl = appPath + handleUrl;
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        if (!customAttribute) {
            customAttribute = baseDialogAttribute;
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
    _this.cacheDialog = function (handleUrl, conditionStr, customAttribute) {
        var targetUrl = appPath + handleUrl;
        if (!customAttribute) {
            customAttribute = baseDialogAttribute;
        }
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        var d = dialog({
            width: customAttribute.width,
            height: customAttribute.height,
            title: '缓存',
            cancelValue: '关闭',
            url: targetUrl,
            cancel: {}
        });
        d.showModal();
    }

    _this.newDialog = function (handleUrl, conditionStr, customAttribute, options) {
        var targetUrl = appPath + handleUrl;
        if (conditionStr) {
            targetUrl = targetUrl + "?" + conditionStr;
        }
        if (!customAttribute) {
            customAttribute = baseDialogAttribute;
        }
        if (!options) {
            options = mui.options.dialogOptionDefault;
        }
        if (typeof options.saveHandle !== "function") {
            options.saveHandle = _this.saveEntity;
        }
        var d = dialog({
            width: customAttribute.width,
            height: customAttribute.height,
            title: '添加',
            okValue: "确定 ",
            cancelValue: '取消',
            url: targetUrl,
            ok: function () {
                if (options.confirm) {
                    var dC = top.dialog({
                        width: 250,
                        height: 50,
                        title: "保存确认",
                        content: options.confirmText,
                        okValue: "确定 ",
                        cancelValue: "取消",
                        ok: function () {
                            options.saveHandle(handleUrl, "add", options.refresh, options.redirectUrl);
                            return true;
                        },
                        cancel: {}
                    });
                    dC.showModal();
                    return false;
                } else {
                    var saveSuccess = options.saveHandle(handleUrl, "add", options.refresh, options.redirectUrl);
                    return saveSuccess;
                }
            },
            cancel: {}
        });
        d.showModal();
    }

    //通用提示框 
    _this.alertDialog = function (alterTitle, alterContent, refresh, redirectUrl) {
        var d = dialog({
            width: 200,
            title: alterTitle,
            okValue: "确定 ",
            content: alterContent,
            ok: function () {
            },
            onclose: function () {
                //先判断是否跳转
                if (redirectUrl && $.trim(redirectUrl) !== "") {
                    window.location.href = appPath + redirectUrl;
                }
                else if (refresh) {
                    window.location.href = window.location.href;
                }

            }
        });
        d.showModal();
    }
    //扩展表单外部要提交的数据
    _this.extendSaveOption = function () {
        // 例： return {a:"aaa",b:"bbb"};
    }
    //保存实体方法
    _this.saveEntity = function (saveUrl, saveType, refresh, redirectUrl) {
        var saveSuccess = false;
        mui.page.replacePlaceholder();
        var before = _this.beforeSave();

        if (before) {

            var params = {};
            params.savetype = saveType;

            params.formdata = $("iframe").contents().find('#editForm').form2json();

            //追加用户扩展的参数
            var extendParams = mui.dialog.extendSaveOption();
            $.extend(params, extendParams);

            var url = appPath + saveUrl;
            $.ajax({ type: "POST", url: url, data: params }).done(function (result) {
                if (!result) return;
                if (result.status != 1) {
                    _this.alertDialog("保存失败", result.msg);
                }
                else {
                    _this.alertDialog("保存成功", "保存成功", refresh, redirectUrl);
                    saveSuccess = true;
                }
            });
        }
        return saveSuccess;
    }


    _this.saveEntity2 = function (saveUrl, saveType, refresh, redirectUrl) {
        var saveSuccess = false;
        mui.page.replacePlaceholder();
        var before = _this.beforeSave();

        if (before) {

            var params = {};
            params.formdata = $("iframe").contents().find('#editForm').form2json();

            var b = eval('(' + params.formdata + ')');
            b.savetype = saveType;
            var url = appPath + saveUrl;
            $.ajax({ type: "POST", url: url, dataType: "json", data: b }).done(function (result) {
                if (!result) return;
                if (result.status != 1) {
                    _this.alertDialog("保存失败", result.msg);
                }
                else {
                    _this.alertDialog("保存成功", "保存成功", refresh, redirectUrl);
                    saveSuccess = true;
                }
            });
        }
        return saveSuccess;
    }

    _this.beforeSave = function () {
        return true;
    }
}


mui.page = new function () {
    var _this = this;
    var appPath = window.AppPath || ''; //virtual path
    _this.hideColumns = function (options) {
        if (!options || !options.domID || !options.dataDomID) return;

        var showAll = false;
        var shownames = $.trim($(options.dataDomID).val());
        if (shownames.length === 0) {
            showAll = true;
        }
        var array = shownames.toLowerCase().split(',');

        var tableid = options.domID;

        $("thead tr th", $(tableid)).each(function (i, v) {
            var $this = $(v);
            var colName = $this.attr("colname").toLowerCase();
            if (!showAll && $.inArray(colName, array) < 0) {
                $this.hide();
                $("tbody tr", $(tableid)).find("td:eq(" + i + ")").hide();
            } else {
                $this.show();
                $("tbody tr", $(tableid)).find("td:eq(" + i + ")").show();
            }
        });
    }
    _this.columlDetail = function (options) {
        if (!options || !options.domID || !options.dataDomID) return;

        var tb = $(options.domID);
        var baseColumn = [];//存储从表头抓取的数据
        var optColumn = [];//存储传递过来的自定义表头数据
        if (options.column && options.column.length > 0) {
            $.each(options.column, function (i, v) {
                optColumn[v.colname.toLowerCase()] = v.name;
            });
        }

        $("thead tr th", tb).each(function (i, v) {
            var showname = $(v).attr("coldesc");
            var colname = $(v).attr("colname").toLowerCase();
            if (optColumn[colname] && $.trim(optColumn[colname]).length > 0) {
                showname = $.trim(optColumn[colname]);
            }
            baseColumn.push({ colname: colname, name: showname });
        });

        if (baseColumn.length === 0) return;


        var cols = $(options.dataDomID).val();

        var d = dialog({
            width: 600,
            height: 180,
            padding: 0,
            title: "自定义显示列",
            url: appPath + "/tool/ColumnEdit",
            okValue: "确定 ",
            cancelValue: "取消",
            data: {
                coloumn: baseColumn,
                showCols: cols
            },
            ok: function () {
                $(options.dataDomID).val(this.data.showCols);

                _this.hideColumns({
                    domID: options.domID,
                    dataDomID: options.dataDomID
                });
                $.ajax({
                    type: "post",
                    url: appPath + "/tool/refreshCookie",
                    data: {
                        r: Math.random(),
                        Cols: this.data.showCols,
                        page: options.page
                    }
                });
            },
            cancel: {}
        });
        d.showModal();
    }
    //初始化表格列排序
    _this.initColumnOrder = function () {
        var tables = $("table.table");
        $.each(tables, function (i0, v0) {
            var _table = v0;
            //var tableid = $(_table).attr("tableid");
            //if (typeof tableid === "undefined" || $.trim(tableid) === '') {
            //    tableid = $(_table).attr("id");
            //}
            //if (typeof tableid === "undefined" || $.trim(tableid) === '') {
            //    return;
            //}
            var orderid = $(_table).attr("orderinfoid");
            if (typeof orderid === "undefined" || $.trim(orderid) === '') {
                return;
            }
            var formid = $(_table).attr("submitformid");
            if (typeof formid === "undefined" || $.trim(formid) === '') {
                return;
            }
            var orderStr = $(_table).attr("orderby");
            if (typeof orderStr === "undefined" || $.trim(orderStr) === "") {
                orderStr = "";
            }
            //构建隐藏域
            if ($("#" + formid).find("input[type='hidden'][name='" + orderid + "']").size() === 0) {
                $("<input type='hidden' id='" + orderid + "'  name='" + orderid + "' value=''/>").appendTo($("#" + formid));
            }

            //读取数据开始初始化
            var orderColList = new Array();
            if (orderStr.length > 0) {
                var list = orderStr.split("|");//多排序条件以|分隔
                $.each(list, function (i, v) {
                    if ($.trim(v) !== "") {
                        var orderdetial = v.replace(/\s+/g, " ").split(" ");
                        var orderby = orderdetial[0].toLowerCase();
                        orderColList[orderby] = {
                            orderby: orderdetial[0],
                            ordersort: "asc"
                        };
                        if (orderdetial.length > 1 && orderdetial[1] != '') {
                            orderColList[orderby].ordersort = orderdetial[1].toLowerCase();
                        }
                    }
                });
            }
            $("th", $(_table)).each(function (i, v) {
                var _th = $(this);
                if (typeof $(_th).attr("orderby") != 'undefined') {
                    var orderby = $.trim($(_th).attr("orderby")).toLowerCase();
                    if (orderby.length > 0) {

                        //-----进行默认排序方式设置
                        var thOrdersort = $(_th).attr("ordersort");
                        if (typeof thOrdersort === "undefined" || $.trim(thOrdersort) === "") {
                            $(_th).attr("ordersort", "desc"); //默认赋值为desc，那么点击时将按照asc进行排序
                        } else {
                            //此为用户自行设置的排序方式
                            thOrdersort = $.trim(thOrdersort).toLowerCase();
                            if (thOrdersort === "desc") {
                                $(_th).attr("ordersort", "asc");
                            } else {
                                $(_th).attr("ordersort", "desc");
                            }
                        }

                        //-----进行当前控制器返回的排序信息设置
                        if (typeof orderColList[orderby] != 'undefined') {
                            if (orderColList[orderby].ordersort.toLowerCase() === "desc") {
                                $(_th).removeClass("sorting sorting_asc sorting_desc").addClass("sorting_desc");
                                $(_th).attr("ordersort", "desc");
                            } else {
                                $(_th).removeClass("sorting sorting_desc sorting_asc").addClass("sorting_asc");
                                $(_th).attr("ordersort", "asc");
                            }
                        } else {
                            $(_th).removeClass("sorting sorting_asc sorting_desc").addClass("sorting");
                        }

                    }
                }
            });
            $("th", $(_table)).bind("click", function () {
                var _t = $(this);
                _t.orderby = $.trim($(_t).attr("orderby"));
                _t.ordersort = $.trim($(_t).attr("ordersort"));
                if (typeof _t.orderby != 'undefined' && _t.orderby.length > 0) {
                    if (typeof _t.ordersort != 'undefined' && _t.ordersort.toLowerCase() === "desc") {
                        _t.ordersort = "asc";
                    } else {
                        _t.ordersort = "desc";
                    }
                    $("#" + orderid).val(_t.orderby + " " + _t.ordersort);
                    $("#" + formid).submit();
                }
            });

        });
    }
    _this.blockUI=function(target,msg) {
        Metronic.blockUI({
            target: target,
            boxed: true,
            message: msg
        });
    }
    _this.unblockUI=function(target) {
        Metronic.unblockUI(target);
    }
    _this.initTable = function () {
        var table = $("table.table");
        //构建隐藏域
        table.find('thead>tr>th .group-checkable').each(function () {
            var th = jQuery(this).parents("th")[0];
            var to = $(th).attr("checkedValueField");
            if (to) {
                if ($("#" + to).size() === 0) {
                    $("<input type='hidden' id='" + to + "'  name='" + to + "' value=''/>").appendTo($('body'));
                }
            }
            //临时处理方法。
            var tdataset = $(th).attr("data-set");
            if (tdataset) {
                $(th).removeAttr("data-set");
                $(this).attr("data-set", tdataset);
            }
            //临时处理方法。end
        });
        table.find('thead>tr>th .group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            var groupIds = new Array();
            var selectappcnt = 0;
            var target = jQuery(set, jQuery(this).parentsUntil("table").siblings("tbody"));
            target.each(function () {
                if (checked) {
                    groupIds.push($(this).attr("value"));
                    selectappcnt += parseInt($(this).attr("cnt"));
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
            try {
                //根据是否选中，更新外层span+div
                jQuery.uniform.update(target);
            } catch (ex) {
                console.log("MuiError: " + ex);
            }
            var th = jQuery(this).parents("th")[0];
            var to = $(th).attr("checkedValueField");
            if (to) {
                var ids = groupIds.join(',');
                if ($("#" + to).size() === 0) {
                    $("<input type='hidden' id='" + to + "'  name='" + to + "' value=''/>").appendTo($('body'));
                }
                $("#" + to).val(ids);
            }
        });

        table.find('tbody>tr>td .group-checkable').change(function () {
            var groupIds = new Array();
            var cntSelected = 0, cntUnSelected = 0;
            var selfTbody = jQuery(this).parentsUntil("table").last();
            $("td input[type='checkbox'].group-checkable", selfTbody).each(function (i, v) {
                if ($(v).is(":checked")) {
                    groupIds.push($(v).attr("value"));
                    cntSelected++;
                } else {
                    cntUnSelected++;
                }
            });
            var topSelect = jQuery(this).parentsUntil("table").siblings("thead").find('tr>th .group-checkable')[0];
            if (topSelect) {
                if (cntUnSelected === 0) {
                    $(topSelect).attr("checked", true);
                    //$(topSelect).parent().addClass("checked");
                } else {
                    $(topSelect).attr("checked", false);
                    //$(topSelect).parent().removeClass("checked");
                }
            }
            try {
                //根据是否选中，更新外层span+div
                jQuery.uniform.update(topSelect);
            } catch (ex) {
                console.log("MuiError: " + ex);
            }
            var th = jQuery(topSelect).parents("th")[0];
            var to = $(th).attr("checkedValueField");
            if (to) {
                var ids = groupIds.join(',');
                if ($("#" + to).size() === 0) {
                    $("<input type='hidden' id='" + to + "'  name='" + to + "' value=''/>").appendTo($('body'));
                }
                $("#" + to).val(ids);
            }
        });
    }
    _this.setSelectedItems = function (tableid, ids) {
        var table = $("#" + tableid);
        var groupIds = ids.split(",");
        var cntSelected = 0, cntUnSelected = 0;
        var tbodyCheck = table.find('tbody>tr>td .group-checkable');
        tbodyCheck.each(function (i, v) {
            if ($.inArray($(v).val(), groupIds) >= 0) {
                $(v).attr("checked", true);
                cntSelected++;
            } else {
                cntUnSelected++;
            }
        });
        var topSelect = table.find('thead>tr>th .group-checkable')[0];
        if (topSelect) {
            if (cntUnSelected === 0) {
                $(topSelect).attr("checked", true);
            } else {
                $(topSelect).attr("checked", false);
            }
        }
        var to = $($(topSelect).parents("th")[0]).attr("checkedValueField");
        if (to) {
            var ids = groupIds.join(',');
            if ($("#" + to).size() === 0) {
                $("<input type='hidden' id='" + to + "'  name='" + to + "' value=''/>").appendTo($('body'));
            }
            $("#" + to).val(ids);
        }
        try {
            //根据是否选中，更新外层span+div
            jQuery.uniform.update(tbodyCheck);
            jQuery.uniform.update(topSelect);
        } catch (ex) {
            console.log("MuiError: " + ex);
        }
    }

    _this.hideSearchContainer = function (_t) {
        $(_t).next('div').first().slideToggle();
        $("i", _t).toggleClass("fa-angle-double-down").toggleClass("fa-angle-double-up");
    }
    _this.initCustomPopover = function (_t, option) {
        var element = $(_t);
        option = $.extend(mui.options.defaultPopoverOption, option);
        element.popover(option).on("mouseenter", function () {
            var _this = this;
            $(this).popover("show");
            $(".popover").on("mouseleave", function () {
                $(_this).popover('hide');
            });
        }).on("mouseleave", function () {
            var _this = this;
            setTimeout(function () {
                if (!$(".popover:hover").length) {
                    $(_this).popover("hide");
                }
            }, 100);
        });
    }
    _this.initSelect2 = function (ids, option) {
        var opt = {
            placeholder: "请选择",
            allowClear: true,
            formatNoMatches: '没有可选取的数据。',
            matcher: _this.matcher
        };
        //1.按照ID来渲染
        if (ids && $.trim(ids).length > 0) {
            ids = $.trim(ids);
            var idArr = ids.split(",");
            opt = $.extend(opt, option);
            $.each(idArr, function (i, v) {
                if (v != '') {
                    $("#" + v).select2(opt);
                }
            });
        } else {
            //2.按照类名来渲染
            $(".select2").select2(opt);
            return;
        }
    }
    _this.initMultiSelect = function () {
        var multioptions = {
            iconBase: 'fa',
            tickIcon: 'fa-check-circle',
            noneSelectedText: '请选择',
            noneResultsText: '没有可选取的数据：'
        };
        $('.bs-st').selectpicker(multioptions);
    }
    _this.initBootstrapSelect = function () {
        $('.bs-select').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
        });
    }
    _this.initDateTime = function () {
        $(".op_datetime").datetimepicker({
            startDate: "2016-01-01",
            endDate: "2016-12-27",
            autoclose: true,
            isRTL: false,
            minuteStep: 5,
            format: "yyyy/mm/dd hh:ii:ss",
            pickerPosition: "bottom-left",
            language: 'zh-CN',
            minView: 1,
            //initialDate: "2016-01-15", //默认选中的时间，不是文本框显示的时间
            todayBtn: 0,
            weekStart: 1,
            todayHighlight: true,
           // daysOfWeekDisabled: [0, 6],
            startView: 2,
            showMeridian: true
        }).on("changeDate", function (x) {
        });
    }
    _this.initDateRange = function () {
        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true,
                language: "zh-CN"
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
    }
    _this.initDateRange3 = function () {
        //mui.options.dateRangeOption
        var changeEvent = function (obj, start, end) {
            start = start.format('YYYY/MM/DD');
            end = end.format('YYYY/MM/DD');
            $(obj).find("input[data-role='from']").val(start);
            $(obj).find("input[data-role='to']").val(end);
            $(obj).find("button:eq(0)").html(start + '<br>' + end);
        };

        $(".op_reportrange").each(function (i, v) {
            $(v).daterangepicker(mui.options.dateRangeOption, function (start, end) {
                changeEvent(v, start, end);
            });
            var hidfrom = $(v).find("input[data-role='from']").first();
            var hidto = $(v).find("input[data-role='to']").first();
            if (typeof hidfrom !== 'undefined' && typeof hidto !== 'undefined') {
                $(v).find("button:eq(0)").html(hidfrom.val() + '<br>' + hidto.val());
            }
        });
    }
    _this.setMatchType = function (o, typedom, spandom, text, textdom) {
        var matchValue = $(o).attr("matchvalue");
        $("#" + typedom).val(matchValue);
        $("#" + spandom).text(text);
        if (typeof textdom !== 'undefined') {
            $("#" + textdom).attr("placeholder", text);
        }
    }
    _this.checkedBox = function (e, domid) {
        var pSpan = $(e).parent();
        if (pSpan.hasClass("checked")) {
            $("#" + domid).val("0");
        } else {
            $("#" + domid).val("1");
        }
    }
    //1.提交时替换placeholder值，避免将placeholder值提交到后台
    _this.replacePlaceholder = function () {
        var supportPlaceholder = 'placeholder' in document.createElement('input'); //判断浏览器是否支持placeholder
        if (!supportPlaceholder) {
            $("input[placeholder]").each(function (i, v) {
                var newValue = $(v).val().replace($(v).attr("placeholder"), "");
                $(v).val(newValue);
            });
            $("iframe").contents().find('input[placeholder]').each(function (i, v) {
                var newValue = $(v).val().replace($(v).attr("placeholder"), "");
                $(v).val(newValue);
            });
        }
        return true;
    }
    //为placeholder增加灰色样式
    _this.addPlaceholder = function () {
        var  supportPlaceholder = 'placeholder' in document.createElement('input'); //判断浏览器是否支持placeholder
        if (!supportPlaceholder) {
            $("input[placeholder]").addClass("placeholder");
        }
        return true;
    }
    //文本改变时，处理placeholder样式
    _this.checkPlaceholder = function (obj) {
        var supportPlaceholder = 'placeholder' in document.createElement('input'); //判断浏览器是否支持placeholder
        if (!supportPlaceholder) {
            var inputValue = "";
            var placeholderValue = "";

            $(obj).removeClass("placeholder");

            inputValue = $(obj).val();
            placeholderValue = $(obj).attr("placeholder");

            if (inputValue == placeholderValue || inputValue == "") {
                $(obj).addClass("placeholder");
            }
        }
        return true;
    }

    _this.setMultiValues = function (_t, t2, _v) {
        if (_v) {
            $("#" + t2).val(_v);
        } else {
            $("#" + t2).val($(_t).val());
        }
    }

    _this.submitForm = function (_t, _formid) {
        if ($("#" + _formid).size() === 0) {
            console.error("Can't find the form : ", _formid);
            return;
        }
        //初始化时不存在就会创建并赋值
        var hidName = _formid + "_pagesize";
        if ($("#" + _formid + " input[type='hidden'][name='" + hidName + "']").size() === 0) {
            $("<input type='hidden'  name='" + hidName + "' value='20'/>").appendTo($('#' + _formid));
        }
        $("#" + _formid + " input[type='hidden'][name='" + hidName + "']").val($(_t).val());

        $("#" + _formid)[0].submit();
    }
    _this.matcher = function (i, t, o) {
        var inputV = $.trim(i).toUpperCase();
        var text = $.trim(t).toUpperCase();
        if (inputV.length === 0) return true;
        if (text.indexOf(inputV) >= 0) return true;
        var flag = false;
        if (typeof o !== 'undefined') {
            $.each($(o).get(0).attributes, function (index, obj) {
                //console.log(flag + text);

                //如果某个option的某个属性已匹配成功，则跳出循环，不在匹配该option的其他属性。作用类似break(each循环中必须使用return false跳出循环。)
                if (flag) return false;
                //排除自带属性selected
                if (obj.name !== "selected") {
                    if (obj.name.toLowerCase() === "value") {
                        //value属性必须全匹配
                        if (obj.value.toUpperCase() === inputV) {
                            flag = true;
                        }
                    } else {
                        if (obj.value.toUpperCase().indexOf(inputV) >= 0) {
                            flag = true;
                        }
                    }
                }
            });
        }
        //console.log(text);
        return flag;
    }
    _this.keepSession = function () {
        //Session保持
        //setInterval(function () {
        //    try {
        //        var url = (window.AppPath || '') + "/Home/keepSession";
        //        $.ajax({
        //            type: "POST", url: url
        //        });
        //    } catch (e) {
        //    }
        //}, 3 * 60 * 1000);
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
    //重置查询条件（用于Select2风格下拉列表）
    _this.resetQueryConditionForSelect2 = function (v) {
        if (v) {
            $('.select2').select2("val", v);
        } else {
            $('.select2').select2("val", 0);
        }
    }
    //重置查询条件（用于Bootstrap风格下拉列表）
    _this.resetQueryConditionForBS = function () {
        $('.bs-st').each(function (i, v) {
            $(v).selectpicker('val', '');
            $(v).change();
        });

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
            $.ajax({
                type: "POST", url: url
            });
        } catch (e) {
        } finally {
            top.window.close();
        }
    }
    _this.initCookieColumn = function () {
        $("[data-role='coledit']").bind("click", function () {
            //Cols在hidden中存起来
            //mui.page.columlDetail({
            //    domID: "#sample_2",
            //    dataDomID: "#showCols",
            //    page: "demo_dialog"
            //});
            var $this = $(this);
            var domid = $this.attr("data-table");
            var page = $this.attr("data-cokname");
            var cokvalue = $this.attr("data-cokvalue");
            var datadomid = page + "_hiddenForCookieColumn";
            //初始化时不存在就会创建并赋值
            if ($("input[type='hidden'][id='" + datadomid + "']").size() === 0) {
                $("<input type='hidden'  id='" + datadomid + "' value='" + cokvalue + "'/>").appendTo($('body'));
            }

            mui.page.columlDetail({
                domID: "#" + domid,
                dataDomID: "#" + datadomid,
                page: page
            });

        });
    }
    _this.initPageSizeHidden = function () {
        $("div[data-role='pager']").each(function (i, v) {
            var formid = $(v).attr("data-formid"), value = $(v).attr("data-value");
            var hidName = formid + "_pagesize";
            if ($("#" + formid + " input[type='hidden'][name='" + hidName + "']").size() === 0) {
                $("<input type='hidden'  name='" + hidName + "' value='" + value + "'/>").appendTo($("#" + formid));
            }
            $("#" + formid + " input[type='hidden'][name='" + hidName + "']").val(value);
        });
    }
    _this.redirectForm = function (pageIndex, pageCount, action) {
        var selectedValue = $.trim(document.getElementById("pageIndexBox").value);
        if (selectedValue.length === 0) return false;
        selectedValue = Math.ceil(selectedValue);
        if (selectedValue == pageIndex) return false;
        if (parseInt(selectedValue) > parseInt(pageCount)) {
            mui.dialog.alertDialog("提示", "页码超出上限!");
            return false;
        }
        if (parseInt(selectedValue) <= 0) {
            mui.dialog.alertDialog("提示", "页码应大于0!");
            return false;
        }
        window.location.href = window.location.origin + window.AppPath + action + selectedValue + window.location.search;
    }
}

mui.dataHelper = new function () {
    var _this = this;
    _this.isInt = function (i) {
        var regInt = new RegExp("^[0-9]*$");
        return regInt.test(i);
    }
    //将剩余分数转化成天-小时-分钟
    _this.getLeftTime = function (_minutes) {
        var days = Math.floor(_minutes / (24 * 60));
        var hours = Math.floor((_minutes - days * 24 * 60) / 60);
        var minutes = _minutes - days * 24 * 60 - hours * 60;
        return '' + days + '天' + hours + '小时' + minutes + '分';
    }
    _this.getShortText=function (txt, len) {
        var currLen = txt.length;
        if (currLen===0 || currLen <= len) return txt;
        return txt.substr(0, len) + "<a class=\"fa fa-info-circle\" data-container=\"body\" data-content=\""+txt+"\" data-placement=\"right\" data-toggle=\"popover\" data-trigger=\"hover\" style=\"cursor: pointer; color: green\"></a>";
    }
}

mui.init = function () {
    Function.prototype.method = function (name, func) {
        this.prototype[name] = func;
        return this;
    };
    if (!String.prototype.trim) { //判断下浏览器是否自带有trim()方法
        String.method('trim', function () {
            return this.replace(/^\s+|\s+$/g, '');
        });
        String.method('ltrim', function () {
            return this.replace(/^\s+/g, '');
        });
        String.method('rtrim', function () {
            return this.replace(/\s+$/g, '');
        });
    }

    this.page.initSelect2();
    this.page.initBootstrapSelect();
    this.page.initMultiSelect();
    this.page.initDateTime();
    this.page.initDateRange();
    this.page.initDateRange3();

    $('[data-toggle="popover"]').each(function () {
        mui.page.initCustomPopover($(this), {
            trigger: 'manual', html: 'true'
        });
    });

    $("table.table > tbody > tr>td>a.action").each(function () {
        var target = $(this).attr("targetDiv");
        if (target && $.trim(target) !== '') {
            var option = {
                trigger: 'manual',
                content: $(target).html(),
                placement: 'left',
                html: 'true'
            };
            mui.page.initCustomPopover($(this), option);
        }
    });
    $("form").bind("submit", function () { return mui.page.replacePlaceholder(); });//对不支持placeholder的浏览器进行兼容
    mui.page.addPlaceholder();
    $("input[placeholder]").bind("change", function () { return mui.page.checkPlaceholder($(this)); });
    //初始化表格
    this.page.initTable();
    //初始化自定义显示列
    this.page.initCookieColumn();
    //表格排序初始化
    mui.page.initColumnOrder();
    this.page.initPageSizeHidden();
    this.page.keepSession();
}