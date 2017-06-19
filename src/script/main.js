require.config({
    paths: {
        'jquery': [
            'http://cdn.bootcss.com/jquery/1.11.0/jquery.min'
        ]
    },
});
require(['jquery'], function() {
    function setStorage(sdata) {
        var aUser = JSON.stringify(sdata); //把json数
        sessionStorage.setItem('aUser', aUser);
    }

    $("#login").on('click', function() {
        var $uid = $("#uid").val();
        var $pword = $("#pword").val();
        var winRef = window.open("", "_self");//打开一个新的页面
        $.ajax({
            type: "GET",
            async: false,
            url: "http://weixin.salien-jd.com/salienoa/index.php/home/api/login",
            dataType: "jsonp",
            data: 'uid=' + $uid + '&pword=' + $pword,
            jsonpCallback: "flightHandler",
            success: function(data) {
                if (data.res == false) {
                    return false;
                }
                setStorage(data);
                function loc(){
                winRef.location='././oa.html';
            }
            setTimeout(loc(),800);
            },
            error: function() {
                alert("fail");
            }
        })
    })
    $("#quit").on('click', function() {
        sessionStorage.removeItem('aUser');
        sessionStorage.aList?sessionStorage.removeItem('aList'): true
        sessionStorage.aList?sessionStorage.removeItem('aParam'): true
        var winRef1 = window.open("", "_self");//打开一个新的页面
        setTimeout(function() {
                    winRef1.location = '././index.html'
                }(), 800)
    })
});