/// <reference path="./package/jquery1.11.1/jquery-1.11.0-vsdoc.js" />

//prototype start
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
//prototype end


var bus = bus || new function () {
    var _this = this;
    _this.ajax = new function () {
        var _self = this;
        _self.ajaxurl = (window.AppPath || '') + "/ajax/index";

        _self.LoadingPage_Show = function (loadingText) {
        };

        _self.LoadingPage_Close = function () {
        }

        _self.Loading_Show = function (container, loadingText) {
            var message = '';
            if (loadingText) {
                message = loadingText;
            }
            else {
                message = '正在加载中...';
            }
            $(container).append('<div class="ui active inverted dimmer"><div class="ui text loader">' + message + '</div></div>');
        };

        _self.Loading_Close = function (container, loadingText) {
            $(container).find('.ui.active.inverted.dimmer').remove();
        };

        _self.CommonErrorCheck = function (result, errorTipMsg) {
            if (!result) {
                return false;
            }
            if (result.HasException) {
                _this.tools.appendLog("异常信息:" + result.ExceptionMsg);
                if (!errorTipMsg) { errorTipMsg = "系统发生错误"; }
                _this.tips.alert(errorTipMsg);
                return false;
            }
            if (result.HasError) {
                if (result.Code == 101) {
                    _this.tips.confirm("登录状态已失效，需要重新登录，确定关闭当前页面？", function () {
                        bus.tools.close();
                    });
                }
                else {
                    _this.tips.alert(result.ErrorMsg);
                }
                return false;
            }

            return true;
        };
    };

    _this.tools = new function () {
        var _self = this;

        _self.gotoUrl = function (url) {
            /// <summary>
            /// 跳转到执行URL
            /// </summary>
            /// <param name="url">url</param>
            window.location = url;
            if (window.event) {
                window.event.returnValue = false;
            }
        };

        _self.refresh = function () {
            window.location = window.location;
            if (window.event) {
                window.event.returnValue = false;
            }
        }

        _self.close = function () {
            window.close();
        }

        _self.appendLog = function (log) {
            $('<div style="display:none"></div>').text(log).appendTo("body");
        };

        _self.nullValue = function (obj, nullValue) {
            /// <summary>
            /// 空值显示
            /// </summary>
            var result = obj;
            if (!result) {
                if (!nullValue) {
                    nullValue = "";
                }
                result = nullValue;
            }
            return result;
        }
    };

    _this.tips = new function () {
        var _self = this;

        _self.alert = function (msg, callback) {
            alert(msg);
            if (callback != null && typeof callback === "function") {
                callback();
            }
        };

        _self.confirm = function (msg, funcOK) {
            if (window.confirm(msg)) {
                if (funcOK != null && typeof funcOK === "function") {
                    funcOK();
                }
            }
        }

        _self.showError = function (err, focusError) {
            if (!$ || !err) return;
            var firstErrorKey = null;
            for (var key in err) {
                var element = $('[name=' + key + ']:first');
                if (element && err[key]) {
                    var error = $(errorDiv(key, err[key]));
                    if (firstErrorKey == null) firstErrorKey = key;
                    //error.addClass("ui red pointing prompt label transition visible");
                    if (element.hasClass('error-parent-3')) {
                        element.parent().parent().parent().append(error);
                    } else if (element.hasClass('error-parent-2')) {
                        element.parent().parent().append(error);
                    } else {
                        element.removeClass("error").parent().append(error).addClass("error");
                    }
                }
            }

            if (focusError && firstErrorKey) {
                var topNum = $('#' + firstErrorKey + '-error').offset().top - 120;
                $('html,body').animate({ scrollTop: topNum }, 'fast');
            }

        }

        _self.hideError = function (formID, options) {
            $('div[id$=-error]').each(function (i) {
                var exists = true;
                var name = $(this).prop('id').replace('-error', '');
                if (options && options.length > 0) {
                    exists = false;
                    for (var i = 0; i < options.length; i++) {
                        if (options[i] == name) {
                            exists = true;
                            break;
                        }
                    }
                }
                if (exists) {
                    var element = $('[name=' + name + ']:first');
                    element.removeClass("error").parent().removeClass("error");
                    $(this).remove();
                }
            });
        }

        var errorDiv = function (name, msg) {
            return '<div id="' + name + '-error" class="invalid ui red pointing prompt label transition visible">' + msg + '</div>';
        }
    };

    _this.validator = new function () {
        var _self = this;

        _self.setDefaults = function () {
            if ($ && $.validator) {
                $.validator.setDefaults({
                    errorPlacement: function (error, element) {
                        /*
                        //$(element).removeClass("error").parent().append(error.addClass("ui red pointing prompt label transition visible")).addClass("error");
                        //error.addClass("ui red pointing prompt label transition visible").appendTo(element.parent());
                        //error.parent().addClass("error");
                        //if (element.is(':radio') || element.is(':checkbox') || element.is(':hidden')) { }
                         */
                        error.addClass("ui red pointing prompt label transition visible");
                        if (element.hasClass('error-parent-3')) {
                            element.parent().parent().parent().append(error);
                        } else if (element.hasClass('error-parent-2')) {
                            element.parent().parent().append(error);
                        } else {
                            element.removeClass("error").parent().append(error).addClass("error");
                        }
                    },
                    errorClass: "invalid",
                    errorElement: "div",
                    success: function (label) {
                        $(label).parent().removeClass('error');
                        $(label).remove();
                    },
                    ignore: "hidden"
                });
            }
        };
    };

    _this.form = new function () {
        var _self = this;

        _self.bindDropdown = function (containerID, data, options) {
            containerID = '#' + containerID;
            var defaultOptions = { valueFieldName: 'value', textFieldName: 'text', defaultVal: '', selectedIndex: 0, firstOptionVal: '0', firstOptionText: '-请选择-', onChange: function (value, text) { }, hiddenOnChange: function () { } };
            if (options) {
                for (var p in options)
                    defaultOptions[p] = options[p];
            }
            if (!$(containerID) || !data) return;
            var menu = $(containerID).find('div.menu:first');
            menu.empty();
            $('<div class="item" data-value="' + defaultOptions.firstOptionVal + '">' + defaultOptions.firstOptionText + '</div>').appendTo(menu);
            for (var i in data) {
                $('<div class="item" data-value="' + data[i][defaultOptions.valueFieldName] + '">' + data[i][defaultOptions.textFieldName] + '</div>').appendTo(menu);
            }
            if (defaultOptions.defaultVal != null)
                $(containerID).dropdown('set value', defaultOptions.defaultVal);
            //else
            $(containerID).dropdown('set selected', defaultOptions.selectedIndex);
            $(containerID).dropdown({ onChange: defaultOptions.onChange });
        }

    };

    _this.checkbox = new function () {
        var _self = this;

        _self.selectAll = function (container, attributeExpression, handlerId, selectedFun) {
            /*初始默认值 开始*/
            if (!container) container = 'table[wcid=table]';
            if (!attributeExpression) attributeExpression = 'id*=objID_';
            if (!handlerId) handlerId = 'checkall';
            /*初始默认值 结束*/
            container = container ? container + ' ' : '';
            if ($('#' + handlerId).prop('checked')) {
                $(container + ':checkbox[' + attributeExpression + ']').prop('checked', 'checked');
                //$(container + 'tr').addClass('selected');
            } else {
                $(container + ':checkbox[' + attributeExpression + ']').prop('checked', '');
                //$(container + 'tr').removeClass('selected');
            }
            _self.setButtons();
        }
        _self.bind = function (container, attributeExpression, handlerId, selectedFun) {
            /*初始默认值 开始*/
            if (!container) container = 'table[wcid=table]';
            if (!attributeExpression) attributeExpression = 'id*=objID_';
            if (!handlerId) handlerId = 'checkall';
            /*初始默认值 结束*/
            container = container ? container + ' ' : '';
            $(container + ':checkbox[' + attributeExpression + ']').each(function () {
                $(this).click(function () {
                    var i = $(container + ':checkbox[' + attributeExpression + ']').size();
                    var j = $(container + ':checkbox[' + attributeExpression + ']:checked').size()
                    if (i == j) { $('#' + handlerId).prop('checked', 'checked') }
                    else { $('#' + handlerId).prop('checked', '') }
                    if ($(this).prop('checked')) { /*$(this).parents('tr:first').addClass('selected');*/ }
                    else { /*$(this).parents('tr:first').removeClass('selected');*/ }
                    _self.setButtons();
                });
            });
            /*
             * 
            $(container + ' tr').mouseover(function () {
                $(this).addClass('hover');
            }).mouseout(function () {
                $(this).removeClass('hover');
            });
                  */
        }
        _self.getSelectedIds = function (container, attributeExpression) {
            /*初始默认值 开始*/
            if (!container) container = 'table[wcid=table]';
            if (!attributeExpression) attributeExpression = 'id*=objID_';
            /*初始默认值 结束*/
            container = container ? container + ' ' : '';
            var ids = '';
            $(container + ':checkbox[' + attributeExpression + ']:checked').each(function (i) {
                var id = $(this).val();
                if (id) {
                    ids = ids ? ids + ',' + id : ids + id;
                }
            });
            return ids;
        }
        _self.setButtons = function (container, attributeExpression) {
            $('[wcid=buttons] [bindevent=1]').each(function () {
                var ids = _self.getSelectedIds(container, attributeExpression);
                if (ids) { $(this).removeClass('disabled') }
                else { $(this).addClass('disabled') }
            });
        }
    };

    $(function() {
        var autoBindCheckbox = window.AutoBindCheckbox || 1;
        if (!autoBindCheckbox) return;
        bus.checkbox.bind('table[wcid=table]', 'id*=objID_', 'checkall');
        $('#checkall').click(function() {
            bus.checkbox.selectAll('table[wcid=table]', 'id*=objID_', 'checkall');
        });
        bus.checkbox.setButtons();
    });

    //ajax默认设置
    $.ajaxSetup({
        url: _this.ajax.ajaxurl,
        type: 'post',
        cache: false
    });
};


$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

function paramString2obj(serializedParams) {
    var obj = {};
    function evalThem(str) {
        var attributeName = str.split("=")[0];
        var attributeValue = str.split("=")[1];
        if (!attributeValue) {
            return;
        }
        var array = attributeName.split(".");
        for (var i = 1; i < array.length; i++) {
            var tmpArray = Array();
            tmpArray.push("obj");
            for (var j = 0; j < i; j++) {
                tmpArray.push(array[j]);
            };
            var evalString = tmpArray.join(".");
            // alert(evalString);
            if (!eval(evalString)) {
                eval(evalString + "={};");
            }
        };
        eval("obj." + attributeName + "='" + attributeValue + "';");
    };
    var properties = serializedParams.split("&");
    for (var i = 0; i < properties.length; i++) {
        evalThem(properties[i]);
    };
    return obj;
}

$.fn.form2json = function () {
    var serializedParams = this.serialize();
    var obj = paramString2obj(serializedParams);
    return JSON.stringify(obj);
}

function IsURL(str_url) {
    var re = /^(https?|s?ftp|weixin):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}

function uuid() {
    return 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function pageID() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



