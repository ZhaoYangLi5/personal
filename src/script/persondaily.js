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
    window.open('../modifydaily.html?taskexem_id=' + href, "_self");
};
require(['jquery', 'jquery-weui', 'template', 'datepicker', 'cookie'], function($, weui, template) {


    // ajax后台获取数据，并用前端模板进行拼接显示
    // data变化 org变化  uid变化  daytype变化  
    function getContent(date, org, daytype, uid, type) {
        $.ajax({
            type: "GET",
            async: false,
            url: "http://192.168.98.23/salienoa/index.php/home/api/persenalsearch",
            dataType: "jsonp",
            data: 'date=' + date + '&org=' + org + '&uid=' + uid + '&daytype=' + daytype,
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                console.log(type);
                artTemp(personcontent, 'personContent', data);
                if (type == "0") {
                    artTemp(allorg, 'org', data);
                    artTemp(alluid, 'uid', data);
                } else if (type == "1") {
                    artTemp(alluid, 'uid', data);
                }
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
        return str.replace(/<[^>]+>/g, "");
    });

    var personcontent = '{{each data.data as value i}}' +
        '<a href="viewdaily.html?taskexem_id={{value.TASKEXEM_ID}}" class="weui-media-box weui-media-box_appmsg">' +
        '<div class="weui-media-box__hd">' +
        '<p> {{value.TASKEXEM_DATE}}</p>' +
        '</div>' +
        '<div class="weui-media-box__bd">' +
        '<h4 class="weui-media-box__title">{{value.U_NAME_FULL}}-{{value.ORG_NAME_FULL}}-{{value.RYLB}}</h4>' +
        '<p class="weui-media-box__desc"><span>工作内容：</span>{{value.TASKEXEM_CONTENT | formatContent:value.TASKEXEM_CONTENT}}</p>' +
        '</div>' +
        '<span class="weui-cell__ft" style="width:60px" data-href={{value.TASKEXEM_ID}}>' +
        // '{{if value.U_NAME_FULL==cname}}' +
        '<i class="icon-edit" style="text-align:center;display:inline-block;padding-top:5px;font-size:0.8533rem" onclick="skip({{value.TASKEXEM_ID}});"></i>' +
        // '{{/if}}' +
        '</a>' +
        '{{/each}}'

    var allorg = '<option value="">部门</option>' +
        '{{each data.selectorg as value i}}' +
        '<option value="{{value.ORG_ID}}">{{value.U_NAME_FULL}}</option>' +
        '{{/each}}'
    var alluid = '<option value="">姓名</option>' +
        '{{each data.selectuser as value i}}' +
        '<option value="{{value.USER_ID}}">{{value.U_NAME_FULL}}</option>' +
        '{{/each}}'

    function query() {
        $('.weui-flex__item').on('change', '.weui-select', function(e) {
            var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
            var org = $("#org").val() || "";
            var daytype = $("#dayType").val() || 0;
            var uid = $("#uid").val() || "";
            if (e.target.id == "dayType" || e.target.id == "uid") {
                getContent(date, org, daytype, uid, 2);
            } else if (e.target.id == "org") {
                uid = "";
                getContent(date, org, daytype, uid, 1);
            } else {
                getContent(date, org, daytype, uid, 0);
            }
        })
    }
    query();

    // 时间选择框进行更改显示内容
    $('.ui-datepicker-btn').on('click', function() {
        var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
        var org = $("#org").val() || "";
        var daytype = $("#dayType").val() || 0;
        var uid = $("#uid").val() || "";
        getContent(date, org, daytype, uid, 2);
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
    // function checkCookie(cname) {
    //     var cvalue = getCookie(cname);
    //     switch (cvalue) {
    //         case 0:
    //             return 0;
    //         case 1:
    //             return 1;
    //         case 2:
    //             return 2;
    //     }
    // }
    // 获取cookie 的值
    // function getCookie(cname) {
    //     var name = cname + "=";
    //     var ca = document.cookie.split(';');
    //     for (var i = 0; i < ca.length; i++) {
    //         var c = ca[i].trim();
    //         if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    //     }
    //     return "";
    // }

    // sessionstorage存储
    function setStorage(sdata) {
        var aList = JSON.stringify(sdata); //把json数据转为string字符串
        var aParam = {
            date: $('.ui-datepicker-curr-month').text(),
            top: $(window).scrollTop(),
            org: $("#org").val(),
            daytype: $("#dayType").val(),
            uid: $("#uid").val(),
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
            // artTemp(personcontent, 'personContent', aList);
            // artTemp(alldeparment, 'all-deparment', aList);
            artTemp(personcontent, 'personContent', aList);
            artTemp(alluid, 'uid', aList);
            artTemp(allorg, 'org', aList);
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
            $('#dayType').val(aParam.daytype);
            $('#org').val(aParam.org);
            $('#uid').val(aParam.uid);
            // sessionStorage.removeItem('aList');
            // sessionStorage.removeItem('aParam');
        } else {
            var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
            var org = $("#org").val() || "";
            var daytype = $("#dayType").val() || 0;
            var uid = $("#uid").val() || "";
            getContent(date, org, daytype, uid, 0);
        }
    };
    backList();

});