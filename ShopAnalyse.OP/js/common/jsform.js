
/**
 * JS ��֧�������ı������Ŵ����
 */
function TextMagnifier(options) {

    this.config = {

        inputElem: '.inputElem',     // �����Ŀ��Ԫ��
        parentCls: '.floatleft',     // Ŀ��Ԫ�صĸ���
        align: 'right',            // ���뷽ʽ�� ['top','bottom','left','right']���� Ĭ��Ϊtop
        splitType: [3, 3, 3, 3],          // ��ֹ���
        delimiter: ',',              // �ָ������Զ���
        type: 1 //0Ϊ��ͨ��֣�1Ϊǧ��λ����
    };

    this.cache = {
        isFlag: false
    };
    this.init(options);
}

TextMagnifier.prototype = {

    constructor: TextMagnifier,

    init: function (options) {
        this.config = $.extend(this.config, options || {});
        var self = this,
			_config = self.config,
			_cache = self.cache;

        self._bindEnv();
    },
    /*
     * ��body��̬���HTML����
     * @method _appendHTML
     */
    _appendHTML: function ($this, value) {
        var self = this,
            _config = self.config,
            _cache = self.cache;

        var html = '',
            $parent = $($this).closest(_config.parentCls);

        if ($('.js-max-input', $parent).length == 0) {
            html += '<div class="js-max-input alert alert-warning"></div>';
            $($parent).append(html);
        }
        //var value = self._formatStr(value); 
        var val; 
        if (_config.type == 1) {
            val = value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            $('.js-max-input', $parent).html(val);
        } else if (_config.type == 0) {
            val = self._formatStr(value);
            $('.js-max-input', $parent).html(val);
        }
    },
    /*
     * ��Ŀ��Ԫ�ض�λ
     * @method _position
     * @param target
     */
    _position: function (target) {
        var self = this,
            _config = self.config;
        var elemWidth = $(target).outerWidth(),
            elemHeight = $(target).outerHeight(),
            elemParent = $(target).closest(_config.parentCls),
            containerHeight = $('.js-max-input', elemParent).outerHeight();

        $(elemParent).css({ "position": 'relative' });

        switch (true) {

            case _config.align == 'top':
                $('.js-max-input', elemParent).css({ 'position': 'absolute', 'top': -elemHeight + 4 + 'px' });
                break;

            case _config.align == 'left':

                $('.js-max-input', elemParent).css({ 'position': 'absolute', 'top': 0, 'left': 0 });
                break;

            case _config.align == 'bottom':

                $('.js-max-input', elemParent).css({ 'position': 'absolute', 'top': elemHeight + 4 + 'px', 'left': 0 });
                break;

            case _config.align == 'right':

                $('.js-max-input', elemParent).css({ 'position': 'absolute', 'top': 0, 'left': elemWidth + 2 + 'px' });
                break;
        }
    },
    /**
     * ���¼�
     * @method _bindEnv
     */
    _bindEnv: function () {
        var self = this,
            _config = self.config,
            _cache = self.cache;

        // ʵʱ���������ֵ�ı仯
        $(_config.inputElem).each(function (index, item) { 
            $(item).keyup(function (e) {
                var value = $.trim(e.target.value),
                    parent = $(this).closest(_config.parentCls);
                if (value == '') {
                    self._hide(parent);
                } else { 
                    var html = $.trim($('.js-max-input', parent).html()); 
                    if (html != '' ) {
                        self._show(parent);
                    }
                }
                self._appendHTML($(this), value);
                self._position($(this));
            });
            
            $(item).unbind('focusin');
            $(item).bind('focusin', function () {
                var parent = $(this).closest(_config.parentCls);
                
                if ($('.js-max-input', parent).length > 0) {
                    var html = $.trim($('.js-max-input', parent).html());
                    if (html != '') {
                        //self._show(parent);
                        $('.js-max-input', parent).show();
                    }
                } else {
                    var value = $.trim($(this).val()); 
                    if (value == '') { 
                    } else {
                        $(this).keyup();
                    } 
                }
            });

            $(item).unbind('focusout');
            $(item).bind('focusout', function () {
                var parent = $(this).closest(_config.parentCls);
                $('.js-max-input', parent).hide();
                //self._hide(parent);
            });
        });
        $(document).click();
    },
    /**
     * ��ʽ����
     * @method _formatStr
     */
    _formatStr: function (str) {
        var self = this,
            _config = self.config,
            _cache = self.cache;
        var count = 0,
            output = [];
        for (var i = 0, ilen = _config.splitType.length; i < ilen; i++) {
            var s = str.substr(count, _config.splitType[i]);
            if (s.length > 0) {
                output.push(s);
            }
            count += _config.splitType[i];
        }
        return output.join(_config.delimiter);
    },
    /**
    * ��ʽ���� ǧ��λ
    */
    _formatQf: function (num) {
        return str.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    },
    /*
     * ��ʾ �Ŵ�����
     * @method _show
     */
    _show: function (parent) {
        var self = this,
            _config = self.config,
            _cache = self.cache; 
        if (!_cache.isFlag) {
            $('.js-max-input', parent).show();
            _cache.isFlag = true;
        }
    },
    /*
     * ���� �Ŵ�����
     * @method hide
     * {public}
     */
    _hide: function (parent) {
        var self = this,
            _config = self.config,
            _cache = self.cache; 
        if (_cache.isFlag) {
            $('.js-max-input', parent).hide();
            _cache.isFlag = false;
        }
    }
};