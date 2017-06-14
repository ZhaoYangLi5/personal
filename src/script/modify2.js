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
        // document.getElementById('list').style.display = "none"
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
    // 搜索栏的定位
    $('.project ul').css({
        top: $('.project input').position().top + $('.project input').height() + 4,
        left: $('.project input').offset().left
    })
    renderFruits(fruits);
    $("#list").on('click', 'li', function() {
        $("#project").val($(this).html());
        console.log($(this).html());
        $("#list").hide();
    })
})