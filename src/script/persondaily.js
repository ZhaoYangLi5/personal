require.config({
    paths: {
        'jquery': [
            'http://cdn.bootcss.com/jquery/1.11.0/jquery.min'
        ],
        'jquery-weui': [
            'http://cdn.bootcss.com/jquery-weui/1.0.1/js/jquery-weui.min'
        ],
        'datepicker': ['./datapick'],
        'template': ['../script/template']
    },
    shim: {
        'jquery-weui': {
            deps: ['jquery']
        }
    }

});

function skip(href) {
    event.preventDefault();
    window.open('././modifydaily.html?taskexem_id=' + href, "_self");
};
require(['jquery', 'jquery-weui', 'template', 'datepicker', 'cookie'], function($, weui, template) {
    // 权限管理
    function getAuthority() {
        var aUser = JSON.parse(sessionStorage.getItem('aUser'));
        var org_id = aUser.ORG_ID;
        var uid = aUser.USER_ID;
        var authority = aUser.authority;
        if (authority == "0") {
            $("#org").val(org_id);
            $("#uid").val(uid);
            $("#headerTitle h1").html("员工日报");
            getContent($(".ui-datepicker-curr-month").text().slice(0, 10), $("#org").val(), $("#dayType").val(), $("#uid").val(), 4);
        } else if (authority == "1") {
            $("#org").val(org_id);
            $("#uid").parent().show();
            $("#headerTitle h1").html("经理日报");
            $("#headerIcon").addClass("icon-Manager-daily");
            getContent($(".ui-datepicker-curr-month").text().slice(0, 10), $("#org").val(), $("#dayType").val(), $("#uid").val(), 1);
        } else if (authority == "2") {
            $("#uid").parent().show();
            $("#org").parent().show();
            $("#headerTitle h1").html("高管日报");
            getContent($(".ui-datepicker-curr-month").text().slice(0, 10), $("#org").val(), $("#dayType").val(), $("#uid").val(), 2);
        }
        
    }

    // ajax后台获取数据，并用前端模板进行拼接显示
    // data变化 org变化  uid变化  daytype变化  
    function getContent(date, org, daytype, uid, type) {
        $.ajax({
            type: "GET",
            async: false,
            url: "http://weixin.salien-jd.com/salienoa/index.php/home/api/persenalsearch",
            dataType: "jsonp",
            data: 'date=' + date + '&org=' + org + '&uid=' + uid + '&daytype=' + daytype,
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                if (type == 2) {
                    artTemp(allorg, 'org', data);
                    artTemp(alluid, 'uid', data);
                    artTemp(personcontent, 'personContent', data);
                } else if (type == 1) {
                    artTemp(alluid, 'uid', data);
                    artTemp(personcontent, 'personContent', data);
                } else if (type == 0) {
                    artTemp(personcontent, 'personContent', data);
                } else if (type == 3) {
                    artTemp(allorg, 'org', data);
                    artTemp(alluid, 'uid', data);
                    getAuthority();
                } else if (type == 4) {
                    artTemp(personcontent, 'personContent', data);
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
           $(".weui-media-box").each(function(){
	var a = $(this).find('h4').html().indexOf(JSON.parse(sessionStorage.getItem('aUser')).U_NAME_FULL);
	if(a!==0){$(this).find('i').remove()}
})
    }
    template.helper('formatContent', function(str, new_str) {
        if (str) {
            return str.replace(/<[^>]+>/g, "");
        }
    });
    template.helper('formatYear', function(str, new_str) {
        return str.substring(0, 4);
    });
    template.helper('formatMonth', function(str, new_str) {
        return str.substring(5);
    });

    var personcontent = '{{each data.data as value i}}' +
        '<a href="./viewdaily.html?taskexem_id={{value.TASKEXEM_ID}}" class="weui-media-box weui-media-box_appmsg">' +
        '<div class="weui-media-box__hd">' +
        '<p> {{value.TASKEXEM_DATE | formatYear:value.TASKEXEM_DATE}}</p>' + '<p> {{value.TASKEXEM_DATE | formatMonth:value.TASKEXEM_DATE}}</p>' +
        '</div>' +
        '<div class="weui-media-box__bd">' +
        '<h4 class="weui-media-box__title">{{value.U_NAME_FULL}}-{{value.ORG_NAME_FULL}}-{{value.RYLB}}</h4>' +
        '<div class="weui-media-box__desc">'+
        '<p><span>工作内容：</span>{{value.TASKEXEM_CONTENT | formatContent:value.TASKEXEM_CONTENT}}'+
        '<span class="weui-ft" style="width:60px" data-href={{value.TASKEXEM_ID}}>' +
        '<i class="icon-edit" style="text-align:center;display:inline-block;padding-top:5px;font-size:0.8533rem" onclick="skip({{value.TASKEXEM_ID}});"></i></span></p>'+
        '</div>' +
        '</div>' +             
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
                getContent(date, org, daytype, uid, 0);
            } else if (e.target.id == "org") {
                uid = "";
                getContent(date, org, daytype, uid, 1);
            } else {
                getContent(date, org, daytype, uid, 2);
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
        getContent(date, org, daytype, uid, "0");
    })

    // 限制字符个数
    $(".weui-media-box__desc").each(function() {
        var maxwidth = 10;
        if ($(this).html().length > maxwidth) {
            $(this).html($(this).html().substring(0, maxwidth));
            $(this).html($(this).html() + '...');
        }
    });
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
        var aUser = JSON.parse(sessionStorage.getItem('aUser'));

        var date = $(".ui-datepicker-curr-month").text().slice(0, 10);
        var org = $("#org").val() || "";
        var daytype = $("#dayType").val() || 0;
        var uid = $("#uid").val() || "";
        // listData用于保存列表数据
        // 页面加载时判断sessionStorage是否存有列表数据，有则赋值给listData，否则，listData取同步加载的第一页数据
        // window.listData = aList ? aList : '';
        if (aList != null) {
            // 加载列表
            artTemp(personcontent, 'personContent', aList);
            artTemp(alluid, 'uid', aList);
            artTemp(allorg, 'org', aList);
            // 滚动到对应位置，并清除sessionStorage
            document.body.scrollTop = aParam.top;
            $('.ui-datepicker-curr-month').text(aParam.date);
            $('#dayType').val(aParam.daytype);
            $('#org').val(aParam.org);
            $('#uid').val(aParam.uid);
        } else {
            getContent(date, org, daytype, uid, 3);
        }
        if (aUser != null) {
            if (aUser.authority == "0") {
                $("#headerTitle h1").html("员工日报");
                $("#headerIcon").addClass("icon-Employee-daily ");
            } else if (aUser.authority == "1") {
                $("#headerTitle h1").html("经理日报");
                $("#headerIcon").addClass("icon-Manager-daily");
                $("#uid").parent().show();
            } else if (aUser.authority == "2") {
                $("#headerTitle h1").html("高管日报");
                $("#org").parent().show();
                $("#uid").parent().show();
                $("#headerIcon").addClass("icon-Executives-daily");
            }
        }
    };
    backList();

});