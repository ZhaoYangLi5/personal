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
        ]
    },
    shim: {
        'jquery-weui': {
            deps: ['jquery']
        }
    }

});
require(['jquery-weui'], function() {

});