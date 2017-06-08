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
        'template': ['../script/template'],
        'cookie': ['./cookie']
    },
    shim: {
        'jquery-weui': {
            deps: ['jquery']
        }
    }

});

function skip(href) {
    event.preventDefault();
    // alert(1);
    window.open('../modifydaily.html?taskexem_id=' + href, "_self");
};
require(['jquery', 'jquery-weui', 'template', 'datepicker', 'cookie'], function($, weui, template) {
    var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
    var org = $("#select-deparment").data('org');
    var daytype = $("#select-day").data('daytype');
    var uid = $("#select-name").data('uid');

    // ajax后台获取数据，并用前端模板进行拼接显示
    // data变化 org变化  uid变化  daytype变化  
    function getContent(date, org, daytype, uid) {
        $.ajax({
            type: "GET",
            async: false,
            url: "http://192.168.98.23/salienoa/index.php/home/api/persenalsearch",
            dataType: "jsonp",
            // data: "date=2017-05-22&org=421&daytype=3",
            data: 'date=' + date + '&org=' + org + '&uid=' + uid + '&daytype=' + daytype,
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                artTemp(personcontent, 'personContent', data);
                artTemp(alldeparment, 'all-deparment', data);
                setStorage(data);
            },
            error: function() {
                alert("fail");
            }
        });
    }


    function artTemp(source, id, data) {
        var render = template.compile(source);
        var html = render({
            data: data
        });
        document.getElementById(id).innerHTML = html;
    }
    template.helper('formatContent', function(str, new_str) {
        var pattern = /(\<(\w+|\/\w+)\>)/g;
        return str.replace(pattern, '');
    })
    var personcontent = '{{each data.data as value i}}' +
        '<a href="viewdaily.html?taskexem_id={{value.TASKEXEM_ID}}" class="weui-media-box                           weui-media-box_appmsg">' +
        '<div class="weui-media-box__hd">' +
        '<p> {{value.TASKEXEM_DATE}}</p>' +
        '</div>' +
        '<div class="weui-media-box__bd">' +
        '<h4 class="weui-media-box__title">{{value.U_NAME_FULL}}-{{value.ORG_NAME_FULL}}-{{value.RYLB}}</h4>' +
        '<p class="weui-media-box__desc"><span>工作内容：</span>{{value.TASKEXEM_CONTENT | formatContent:value.TASKEXEM_CONTENT}}</p>' +
        '</div>' +
        '<span class="weui-cell__ft" style="width:60px" data-href={{value.TASKEXEM_ID}}>' +
        '<i class="icon-edit" style="text-align:center;display:inline-block;padding-top:5px;font-size:0.8533rem" onclick="skip({{value.TASKEXEM_ID}});"></i>' +
        '</a>' +
        '{{/each}}'


    var alldeparment = '<li><a href="javascript:void(0); data-org=" ">部门</a></li>' +
        '{{each data.selectorg as value i}}' +
        '<li><a href="javascript:void(0);" data-org="{{value.ORG_ID}}">{{value.U_NAME_FULL}}</a></li>' +
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
            $(this).parent().parent().find('.select').html($(this).find('a').html()).data('daytype', $(this).find('a').data("daytype")).data('org', $(this).find('a').data("org"));
            var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
            var org = $("#select-deparment").data('org');
            var daytype = $("#select-day").data('daytype');
            var uid = $("#select-name").data('uid');
            getContent(date, org, daytype, uid);
            $(this).parent().css('display', 'none');
            $(this).parent().parent().find('.select').css('color', "#000");
            $(this).parent().parent().find('.up').css('display', 'inline-block');
            $(this).parent().parent().find('.down').css('display', 'none');
            return false;
        })
    }
    // 时间选择框进行更改显示内容
    $('.ui-datepicker-btn').on('click', function() {
        var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
        var org = $("#select-deparment").data('org');
        var daytype = $("#select-day").data('daytype');
        var uid = $("#select-name").data('uid');
        getContent(date, org, daytype, uid);
    })




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

    // sessionstorage存储
    function setStorage(sdata) {
        var aList = JSON.stringify(sdata); //把json数据转为string字符串
        var aParam = {
            // page: conf.page, //当前页码
            date: $('.ui-datepicker-curr-month').text(),
            top: $(window).scrollTop(),
            org: $("#select-deparment").data('org'),
            horg: $("#select-deparment").text(),
            daytype: $("#select-day").data('daytype'),
            hdaytype: $("#select-day").html(),
            uid: $("#select-name").data('uid'),
            huid: $("#select-name").html()
                // nomore: !$('#J_noMore').hasClass('hide')
        };
        aParam = JSON.stringify(aParam);
        sessionStorage.setItem('aList', aList); //sessionStorage只能存储string字符串
        sessionStorage.setItem('aParam', aParam);
    }

    function backList() {
        var aList = JSON.parse(sessionStorage.getItem('aList'));
        var aParam = JSON.parse(sessionStorage.getItem('aParam'));

        // listData用于保存列表数据
        // 页面加载时判断sessionStorage是否存有列表数据，有则赋值给listData，否则，listData取同步加载的第一页数据
        // window.listData = aList ? aList : '';
        if (aList != null) {
            // 加载列表
            artTemp(personcontent, 'personContent', aList);
            artTemp(alldeparment, 'all-deparment', aList);
            // 更新加载状态
            // if (aParam.nomore) {
            //     $('#auditin').addClass('nomore');
            //     $('#J_noMore').removeClass('hide');
            // } else {
            //     $('#auditin').removeClass('nomore');
            //     $('#J_noMore').addClass('hide');
            // }

            // 滚动到对应位置，并清除sessionStorage
            document.body.scrollTop = aParam.top;
            // conf.page = aParam.page;
            $('.ui-datepicker-curr-month').text(aParam.date);
            $('#select-day').data('daytype', aParam.daytype).html(aParam.hdaytype);
            $('#select-deparment').data('org', aParam.org).html(aParam.horg);
            $('#select-name').data('uid', aParam.uid).html(aParam.huid);
            // sessionStorage.removeItem('aList');
            // sessionStorage.removeItem('aParam');
        } else {
            getContent(date, org, daytype, uid);
        }
    };
    backList()

});