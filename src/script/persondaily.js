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
        'template': ['../script/template']
    },
    shim: {
        'jquery-weui': {
            deps: ['jquery']
        }
    }

});
require(['jquery', 'jquery-weui', 'datepicker', 'template'], function() {
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

    // ajax后台获取数据，并用前端模板进行拼接显示
    var data = {
        title: '基本例子',
        isAdmin: true,
        list: [{
            name: '李平2',
            daparment: '开发部',
            position: '经理',
            neirong: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
        }, {
            name: '李平',
            daparment: '企管部',
            position: '总监',
            neirong: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
        }, {
            name: '我今晚',
            daparment: '开发部',
            position: '开发人员',
            neirong: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
        }, {
            name: '李总监',
            daparment: '市场部',
            position: '总监',
            neirong: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
        }, {
            name: '李平总',
            daparment: '运营部',
            position: '总监',
            neirong: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
        }, ]
    };
    var html = template('artContent', data);
    document.getElementById('content').innerHTML = html;

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
    })

});