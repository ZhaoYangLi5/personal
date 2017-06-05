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
require(['jquery', 'jquery-weui', 'datepicker', 'template', 'cookie'], function() {
    var oTxt = document.getElementById('project');
    var oList = document.getElementById('list');

    var fruits = ["桃子", "苹果", "梨子", "香蕉", "香瓜", "葡萄", "柠檬", "橘子", "草莓", "桃子桃子桃子桃子桃子", "桃子桃子", "桃子桃子桃子"];
    //点击事件
    // oBtn.addEventListener('click', function() {
    //     var keyWord = oTxt.value;
    //     // var fruitList = searchByIndexOf(keyWord,fruits);
    //     console.log(fruitList);
    //     var fruitList = searchByRegExp(keyWord, fruits);
    //     renderFruits(fruitList);
    // }, false);
    //回车查询
    oTxt.addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
            var keyWord = oTxt.value;
            // var fruitList = searchByIndexOf(keyWord,fruits);
            var fruitList = searchByRegExp(keyWord, fruits);
            renderFruits(fruitList);
        }
    }, false);
    oTxt.addEventListener('keyup', function(e) {
        var keyWord = oTxt.value;
        // var fruitList = searchByIndexOf(keyWord,fruits);
        var fruitList = searchByRegExp(keyWord, fruits);
        renderFruits(fruitList);
        document.getElementById('list').style.display = "block"
    }, false);
    oTxt.addEventListener('blur', function(e) {
        document.getElementById('list').style.display = "none"
    })

    function renderFruits(list) {
        if (!(list instanceof Array)) {
            return;
        }
        oList.innerHTML = '';
        var len = list.length;
        var item = null;
        for (var i = 0; i < len; i++) {
            item = document.createElement('li');
            item.innerHTML = list[i];
            oList.appendChild(item);
        }
    }

    //模糊查询1:利用字符串的indexOf方法
    function searchByIndexOf(keyWord, list) {
        if (!(list instanceof Array)) {
            return;
        }
        var len = list.length;
        var arr = [];
        for (var i = 0; i < len; i++) {
            //如果字符串中不包含目标字符会返回-1
            if (list[i].indexOf(keyWord) >= 0) {
                arr.push(list[i]);
            }
        }
        return arr;
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
            if (list[i].match(reg)) {
                arr.push(list[i]);
            }
        }
        return arr;
    }
    renderFruits(fruits);

    // 搜索栏的定位
    $('.project ul').css({
        top: $('.project input').position().top + $('.project input').height() + 4,
        left: $('.project input').offset().left
    })

    // 工作分类的切换
    var jobclass1 = ["需求对接", "需求分析", "规划评审", "产品设计", "设计评审", "界面交互设计", "数据验证", "详细用例", "交互设计评审", "项目会议", "技术支持", "工作汇报", "用户培训", "系统测试", "数据准备", "上线准备", "验收准备"];
    var jobclass2 = ["部门间工作协调", "应急工作", "内部会议", "日常管理", "项目跟踪检查", "部门内部工作协调", "项目评审及讨论", "工作汇报", "公司会议", "培训"]
    $(".weui-check").on("click", function() {
        var jobCls = $('.weui-check:checked').val();
        if ($('.weui-check:checked').val() == "1") {
            $("#jobType").find("select option").remove();
            addOption(jobclass1);
        } else {
            $("#jobType").find("select option").remove();
            addOption(jobclass2);
        }
    });

    function addOption(jobCls) {
        $.each(jobCls, function(i, item) {
            var opt = $("<option></option>").html(item);
            $("#jobType").find("select").append(opt);
        })
    }
    addOption(jobclass1);

    $('#slider1').slider(function(percent) {
        $("#sliderValue").text((percent / 100 * 15).toFixed(1));
    });
})



// $.ajax({
//     url: 'http://192.168.98.23/salienoa/index.php/home/api/persenaloa',
//     type: "get",
//     /*url写异域的请求地址*/
//     dataType: "jsonp",
//     data: { taskexem_id: 53555 },
//     /*加上datatype*/
//     callback: "flightHandler",
//     /*设置一个回调函数，名字随便取，和下面的函数里的名字相同就行*/
//     success: function(msg) {
//         console.log(msg);
//     }
// })