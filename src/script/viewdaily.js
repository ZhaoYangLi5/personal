 require.config({
     paths: {
         'jquery': [
             'http://cdn.bootcss.com/jquery/1.11.0/jquery.min'
         ],
         'jquery-weui': [
             'http://cdn.bootcss.com/jquery-weui/1.0.1/js/jquery-weui.min'
         ],
         'template': ['../script/template']
     },
     shim: {
         'jquery-weui': {
             deps: ['jquery']
         }
     }

 });
 require(['jquery', 'jquery-weui', 'template'], function($, weui, template) {
     var href = location.search.split('=');
     template.helper('formatContent', function(str, new_str) {
         if(str){str=str.replace(/<[^>]+>/g, "")}
         return str
     });
     template.helper('formatclass', function(str, new_str) {
         if (str == 1) {
             return new_str = "实施";
         } else if (str == 2) {
             return new_str = "管理";
         } else if (str == 3) {
             return new_str = "开发";
         }
     });

     function artTemp(source, id, data) {
         var render = template.compile(source);
         var html = render({
             data: data
         });
         document.getElementById(id).innerHTML = html;
     }

     var viewcontent = '<div class="weui-cells">' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd">' +
         '<span class="icon-work_content"></span> </div>' +
         '<div class="weui-cell__bd">' +
         '<p>工作内容</p>' +
         '</div>' +
         '<div class="weui-cell__ft"><textarea class="weui-textarea" rows="4" readonly>{{data.TASKEXEM_CONTENT |  formatContent:data.TASKEXEM_CONTENT}}</textarea></div>' +
         '</div>' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd">' +
         '<span class="icon-work_result"></span> </div>' +
         '<div class="weui-cell__bd">' +
         '<p>工作结果</p>' +
         '</div>' +
         '<div class="weui-cell__ft"><textarea class="weui-textarea" rows="4" readonly>{{data.TASKM_CG}}</textarea></div>' +
         '</div>' +
         '</div>'
     var viewbody = '<div class="weui-cells">' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd">' +
         '<span class="icon-time"></span> </div>' +
         '<div class="weui-cell__bd">' +
         '<p>日期</p>' +
         '</div>' +
         '<div class="weui-cell__ft">{{data.TASKEXEM_SUBMITDATE}}</div>' +
         '</div>' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd"><span class="icon-work_class"></span></div>' +
         '<div class="weui-cell__bd">' +
         '<p>工作分类</p>' +
         '</div>' +
         '<div class="weui-cell__ft">{{data.TASKM_TYPE | formatclass: data.TASKM_TYPE}}</div>' +
         '</div>' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd">' +
         '<span class="icon-work_type"></span> </div>' +
         '<div class="weui-cell__bd">' +
         '<p>工作类型</p>' +
         '</div>' +
         '<div class="weui-cell__ft">{{data.DAYREPORT_TYPE }}</div>' +
         '</div>' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd">' +
         '<span class="icon-work_project"></span> </div>' +
         '<div class="weui-cell__bd">' +
         '<p>所属项目</p>' +
         '</div>' +
         '<div class="weui-cell__ft">{{data.PROJECT_NAME_FULL}}</div>' +
         '</div>' +
         '<div class="weui-cell">' +
         '<div class="weui-cell__hd">' +
         '<span class="icon-work_time"></span> </div>' +
         '<div class="weui-cell__bd">' +
         '<p>工时</p>' +
         '</div>' +
         '<div class="weui-cell__ft">{{data.TASKEXEM_HOUR}}</div>' +
         '</div>' +
         '</div>'

     var viewtitle = '<div class="weui-cell">' +
         '<div class="weui-cell__hd"><span class="icon-see_title"></span>   </div>' +
         '<div class="weui-cell__ft">' +
         '  {{data.U_NAME_FULL}}-{{data.ORG_NAME_FULL}}-{{data.RYLB}}' +
         '</div>' +
         '</div>'
     $.ajax({
         type: "GET",
         async: false,
         url: "http://weixin.salien-jd.com/salienoa/index.php/home/api/persenaloa",
         dataType: "jsonp",
         data: href[0].substring(1) + "=" + href[1],
         jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
         jsonpCallback: "flightHandler", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
         success: function(data) {
             artTemp(viewtitle, 'viewTitle', data);
             artTemp(viewbody, 'viewBody', data);
             artTemp(viewcontent, 'viewContent', data);
         },
         error: function() {
             alert("fail");
         }
     });

 })