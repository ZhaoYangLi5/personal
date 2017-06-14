 var href = location.search.split('=')
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

 template.helper('formatContent', function(str, new_str) {
     return str.replace(/<[^>]+>/g, "");
 });
 template.helper('formatclass', function(str, new_str) {
     if (str == 1) {
         return new_str = "项目";
     } else if (str == 2) {
         return new_str = "管理";
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
     '  <div class="weui-cell__hd">' +
     '        <i class="icon-project"></i>' +
     '    </div>' +
     '    <div class="weui-cell__bd">' +
     '        <h2>{{data.PROJECT_NAME_FULL}}</h2>' +
     '    </div>' +
     '</div>' +
     '<div class="weui-cell">' +
     '<div class="weui-cell__hd">' +
     '<i class="icon-content"></i>' +
     '</div>' +
     '<div class="weui-cell__bd ">' +
     '<p>工作内容：<span>{{data.TASKEXEM_CONTENT |  formatContent:data.TASKEXEM_CONTENT}}</span></p>' +
     '</div>' +
     '</div>' +
     '<div class="weui-cell">' +
     '<div class="weui-cell__hd">' +
     '<i class="icon-achievement"></i>' +
     '</div>' +
     '<div class="weui-cell__bd">' +
     '<p>工作结果：<span>{{data.TASKM_CG}}</span></p>' +
     '</div>' +
     '</div>' +
     '</div>'
 var viewbody = '<div class="weui-flex ">' +
     '<div class="weui-flex__item">' +
     '<h3>{{data.TASKM_TYPE | formatclass: data.TASKM_TYPE}}</h3>' +
     '<p>工作分类</p>' +
     '</div>' +
     '<div class="weui-flex__item">' +
     '<h3>{{data.DAYREPORT_TYPE }}</h3>' +
     '<p>工作类型</p>' +
     '</div>' +
     '<div class="weui-flex__item">' +
     '<h3>{{data.TASKEXEM_HOUR}}</h3>' +
     '<p>工时</p>' +
     '</div>' +
     '</div>'

 var viewtitle = '<div class="weui-flex__item name">' +
     '<h3>{{data.U_NAME_FULL}} <br>{{data.ORG_NAME_FULL}}-{{data.RYLB}}</h3>' +
     '</div>'