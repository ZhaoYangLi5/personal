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
                window.open('././oa.html', '_self');
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
        window.open('././index.html', '_self');
    })
});