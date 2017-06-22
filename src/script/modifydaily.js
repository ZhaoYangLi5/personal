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
    },
    shim: {
        'jquery-weui': {
            deps: ['jquery']
        }
    }

});
require(['jquery', 'jquery-weui', 'datepicker', 'template'], function() {
    // ajax的数据交互
    var href = location.search.split('=');
    var title = $("#title");
    var jobType = $("#jobType").find("select");
    var sdate = $(".ui-datepicker-curr-month");
    var project = $("#project");
    var jobContent = $("#jobContent").find("textarea");
    var jobResults = $("#jobResults").find("textarea");
    $.ajax({
        type: "GET",
        async: false,
        url: "http://47.93.186.65//salienoa/index.php/home/api/persenaloa",
        dataType: "jsonp",
        data: href[0].substring(1) + "=" + href[1],
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            getJobClass(data.DAYREPORTTYPE);
            getJson(data);
            getProject(data);
        },
        error: function() {
            alert("fail");
        }
    });

    // 所属项目
    function getProject(data) {
        var oTxt = $('#project');
        var oList = $('#list');
        var fruits = data.ALL_PROJECT;
        $("#project").on({
            'keyup': function() {
                var keyWord = $(this).val();
                var fruitList = searchByRegExp(keyWord, fruits);
                $(this).val().trim().length>0?$("#project").parent().find('span').removeClass():$("#project").parent().find('span').addClass('icon-work_project_search');
                renderFruits(fruitList);
                $("#list").css('display', "block");
            },'focus':function(){
                $(this).val().trim().length>0?$("#project").parent().find('span').removeClass():$("#project").parent().find('span').addClass('icon-work_project_search');
            },'blur':function(){  
                $(this).val().trim().length>0?$("#project").parent().find('span').removeClass():$("#project").parent().find('span').addClass('icon-work_project_search');
            }
            })
            // 搜索栏的定位
        $('.project ul').css({
            top: $('.project input').position().top + $('.project input').height() + 2,
            left: $('.project input').offset().left
        })

        function renderFruits(list) {
            if (!(list instanceof Array)) {
                return;
            }
            oList.html('');
            var len = list.length;
            var item = null;
            for (var i = 0; i < len; i++) {
                item = document.createElement('li');
                item.innerHTML = list[i].PROJECT_NAME_FULL;
                item.dataset.num = list[i].PROJECT_ID;
                oList.append(item);
            }
        }
        //正则匹配
        function searchByRegExp(keyWord, list) {
            if (!(list instanceof Array)) {
                return;
            }
            var len = list.length;
            var arr = [];
            var reg = new RegExp(keyWord);
            for (var i = 0; i < len; i++) {
                //如果字符串中不包含目标字符会返回-1
                if (list[i].PROJECT_NAME_FULL.match(reg)) {
                    arr.push(list[i]);
                }
            }
            return arr;
        };
        // renderFruits(fruits);
        $("#list").on('click', 'li', function() {
            $("#project").parent().find('span').removeClass();
            $("#project").val($(this).html());
            $("#project").data('num', $(this).data('num'));
            $("#list").hide();
        });
    };
    $(".weui-cells").on('click',function(){
        $("#list").hide();
    })
    // 工作类型
    function getJobClass(data) {
        var jobclass1 = data[1];
        var jobclass2 = data[2];
        var jobclass3 = data[3];

        function addOption(jobCls) {
            $.each(jobCls, function(i, item) {
                var opt = $("<option></option>").html(item.U_NAME).val(item.DAYREPORT_TYPE);
                $("#jobType").find("select").append(opt);
            })
        }
        // 工作分类的切换
        $(".weui-check").on("click", function() {
            if ($('.weui-check:checked').val() == "1") {
                $("#jobType").find("select option").remove();
                addOption(jobclass1);
            } else if ($('.weui-check:checked').val() == "2") {
                $("#jobType").find("select option").remove();
                addOption(jobclass2);
            } else if ($('.weui-check:checked').val() == "3") {
                $("#jobType").find("select option").remove();
                addOption(jobclass3);
            }
        });
        // 工作分类初始化
        if (data.TASKM_TYPE == 1) {
            $("input:radio[value='1']").attr('checked', 'true');
            addOption(jobclass1);
        } else if ((data.TASKM_TYPE == 2)) {
            $("input:radio[value='2']").attr('checked', 'true');
            addOption(jobclass2);
        } else {
            $("input:radio[value='3']").attr('checked', 'true');
            addOption(jobclass3);
        }
    };
    // slider的初始化与转化
    $('#jobTime').slider(function(percent) {
        var time = Math.floor((percent / 100 * 12).toFixed(1)* 2)/ 2;
        $("#sliderValue").text(time);
    });
    // 数据的填入
    function getJson(data) {
        var name = data.U_NAME_FULL + "-" + data.ORG_NAME_FULL + "-" + data.RYLB;
        title.html(name);
        var date = new Date(data.TASKEXEM_DATE).pattern("yyyy-MM-dd EE")
        sdate.text(date);
        project.val(data.PROJECT_NAME_FULL).data('num', data.PROJECT_ID);
        $("#sliderValue").html(data.TASKEXEM_HOUR);
        $("#sliderTrack").width((data.TASKEXEM_HOUR / 12 * 100).toFixed(1) + "%");
        $("#sliderHandler").css('left', (data.TASKEXEM_HOUR / 12 * 100).toFixed(1) + "%");
        if(data.TASKEXEM_CONTENT){
        jobContent.html(data.TASKEXEM_CONTENT.replace(/<[^>]+>/g, ""));
        }
        if (data.TASKM_CG) {
            var content = data.TASKM_CG.replace(/<[^>]+>/g, "");
            jobResults.html(content);
        }
    };

    function postJson() {
        $.ajax({
            type: "GET",
            async: false,
            url: "http://47.93.186.65//salienoa/index.php/home/api/personalupd",
            dataType: "jsonp",
            data: 'taskexem_id=' + href[1] + '&taskm_type=' + $('.weui-check').val() + '&tasktype_id=' + jobType.val() + '&taskexem_date=' + sdate.text().slice(0, 10) + '&project_id=' + $("#project").data('num') + '&taskexem_hour=' + $("#sliderValue").text() + '&taskexem_content=' + jobContent.val(),
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                $.toptip('操作成功', 'success');
            },
            error: function() {
                alert("fail");
            }
        });
    }
    $("#save").on('click', function() {
        postJson();
    })

})