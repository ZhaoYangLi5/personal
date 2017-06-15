require.config({
    paths: {
        'jquery': [
            'http://cdn.bootcss.com/jquery/1.11.0/jquery.min',
            '../../node_modules/jquery-weui/dist/lib/jquery-2.1.4'
        ]
    },
});
require(['jquery'], function() {
    $("#login").on('click', function() {
        var $uid = $("#uid").val();
        var $pword = $("#pword").val();
        $.ajax({
            type: "GET",
            async: false,
            url: "http://192.168.98.23/salienoa/index.php/home/api/login",
            dataType: "jsonp",
            data: 'uid=' + $uid + '&pword=' + $pword,
            // jsonpCallback: "flightHandler",
            success: function(data) {
                console.log(data);
            },
            error: function() {
                alert("fail");
            }
        })
    })
});