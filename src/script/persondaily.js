require.config({
    paths: {
        'jquery': [
            'http://cdn.bootcss.com/jquery/1.11.0/jquery.min',
            '../../node_modules/jquery-weui/dist/lib/jquery-2.1.4'
        ],
        'jquery-weui': [
            'http://cdn.bootcss.com/jquery-weui/1.0.1/js/jquery-weui.min',
            '../../node_modules/jquery-weui/dist/js/jquery-weui.min'
        ],
        'fastclick': [
            '../../node_modules/jquery-weui/dist/lib/fastclick'
        ],
        'datepicker': ['./datapick'],
        // 'template': ['../script/template'],
        'cookie': ['./cookie']
    },
    shim: {
        'jquery-weui': {
            deps: ['jquery']
        }
    }

});
require(['jquery', 'jquery-weui', 'template', 'datepicker', 'cookie'], function($, weui, template) {
    // ajax后台获取数据，并用前端模板进行拼接显示
    $.ajax({
        type: "GET",
        async: false,
        url: "http://192.168.98.23/salienoa/index.php/home/api/persenalsearch",
        dataType: "jsonp",
        data: "date=2017-05-28&org=421&daytype=3",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            artTemp(personcontent, 'personContent', data);
        },
        error: function() {
            alert("fail");
        }
    });

    function artTemp(source, id, data) {
        var render = template.compile(source);
        var html = render({
            data: data
        });
        document.getElementById(id).innerHTML = html;
    }
    var personcontent = '{{each data.data as value i}}' +
        '<a href="viewdaily.html?taskexem_id={{value.TASKEXEM_ID}}" class="weui-media-box weui-media-box_appmsg">' +
        '<div class="weui-media-box__hd">' +
        '<p> {{value.TASKEXEM_DATE}}</p>' +
        '</div>' +
        '<div class="weui-media-box__bd">' +
        '<h4 class="weui-media-box__title">{{value.U_NAME_FULL}}-{{value.ORG_NAME_FULL}}-{{value.RYLB}}</h4>' +
        '<p class="weui-media-box__desc"><span>工作内容：</span>{{value.TASKEXEM_CONTENT}}</p>' +
        '</div>' +
        '<span class="weui-cell__ft" style="width:60px" data-href={{value.TASKEXEM_ID}}>' +
        '<i class="icon-edit" style="text-align:center;display:inline-block;padding-top:5px;font-size:0.8533rem"></i>' +
        '</span>' +
        '</a>' +
        '{{/each}}'





    $(".nav-search").on('click', '.weui-flex__item', function() {
        hideAll();
        select();
        $(this).find('ul').css('display', 'block');
        $(this).find('span').css('color', '#ccc');
        $(this).find('.down').css('display', 'inline-block');
        $(this).find('.up').css('display', 'none');
        return false;
    });

    function hideAll() {
        $('.weui-flex__item').each(function(i, item) {
            $('.weui-flex__item').find('ul').css('display', 'none');
            $('.weui-flex__item').find('span').css('color', '#000');
            $('.weui-flex__item').find('.up').css('display', 'inline-block');
            $('.weui-flex__item').find('.down').css('display', 'none');
        });
    }

    function select() {
        $('.weui-flex__item').on('click', 'li', function(i, item) {
            $(this).parent().parent().find('.select').html($(this).find('a').html());
            $(this).parent().css('display', 'none');
            $(this).parent().parent().find('.select').css('color', "#000");
            $(this).parent().parent().find('.up').css('display', 'inline-block');
            $(this).parent().parent().find('.down').css('display', 'none');
            return false;
        })
    }



    $('.weui-media-box').on('click', 'span', function() {
        var href = $(this)[0].dataset.href;
        window.open('../modifydaily.html?id=' + href, "_self");
        return false;
    });

    // 限制字符个数
    $(".weui-media-box__desc").each(function() {
        var maxwidth = 40;
        if ($(this).html().length > maxwidth) {
            $(this).html($(this).html().substring(0, maxwidth));
            $(this).html($(this).html() + '...');
        }
    });
    // 检测cookie的值
    function checkCookie(cname) {
        var cvalue = getCookie(cname);
        switch (cvalue) {
            case 0:
                return 0;
            case 1:
                return 1;
            case 2:
                return 2;
        }
    }
    // 获取cookie 的值
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

});