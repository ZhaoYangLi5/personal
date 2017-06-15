require.config({
    paths: {
        'jquery': [
            'http://cdn.bootcss.com/jquery/1.11.0/jquery.min',
            '../../node_modules/jquery-weui/dist/lib/jquery-2.1.4'
        ]
    },
});
require(['jquery'], function() {
    function setStorage(sdata) {
        var aUser = JSON.stringify(sdata); //把json数据转为string字符串
        // var aParam = {
        //     org_id: aList.ORG_ID,
        //     rylb: aList.RYLB,
        //     user_id: aList.USER_ID,
        //     u_name: aList.U_NAME,
        //     u_name_full: aList.U_NAME_FULL,
        //     authority: aList.authority,
        //     org:aList.org
        // };
        // sessionStorage.setItem('aList', aList); //sessionStorage只能存储string字符串
        sessionStorage.setItem('aUser', aUser);
    }

    $("#login").on('click', function() {
        var $uid = $("#uid").val();
        var $pword = $("#pword").val();
        $.ajax({
            type: "GET",
            async: false,
            url: "http://192.168.98.23/salienoa/index.php/home/api/login",
            dataType: "jsonp",
            data: 'uid=' + $uid + '&pword=' + $pword,
            jsonpCallback: "flightHandler",
            success: function(data) {
                setStorage(data);
                console.log(data);
                window.open('../oa.html', '_self');
            },
            error: function() {
                alert("fail");
            }
        })
    })
});