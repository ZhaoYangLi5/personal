(function() {
    function Datepicker(id) {
        this.id = id;
        this.date = new Date().pattern("yyyy-MM-dd EE");
        this.doms = {
            date: document.getElementById(id),
            next: document.getElementsByClassName('ui-datepicker-next-btn'),
            prev: document.getElementsByClassName('ui-datepicker-prev-btn'),
            curr: document.getElementsByClassName('ui-datepicker-curr-month')
        }
    };
    Date.prototype.pattern = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "周" : "星期") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    Datepicker.prototype = {
        bindDom: function() {
            var str = '';
            str += '<div class="ui-datepicker-header">'
            str += '<span  class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</span>'
            str += '<span  class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</span>'
            str += '<span class="ui-datepicker-curr-month">' + this.date + '</span>'
            str += '</div>'
            this.doms.date.innerHTML = str;
        },
        bindEvents: function() {
            var that = this;
            this.doms.next[0].onclick = function() {
                var date = that.doms.curr[0].innerHTML.slice(0, 10);
                newDate = new Date(Date.parse(date) + 3600 * 24 * 1000);
                that.doms.curr[0].innerHTML = newDate.pattern("yyyy-MM-dd EE");
            };
            this.doms.prev[0].onclick = function() {
                var date = that.doms.curr[0].innerHTML.slice(0, 10);
                newDate = new Date(Date.parse(date) - 3600 * 24 * 1000);
                that.doms.curr[0].innerHTML = newDate.pattern("yyyy-MM-dd EE");
            }

        }
    }
    var datepicker = new Datepicker('ui-datepicker-wrapper');
    datepicker.bindDom();
    datepicker.bindEvents();
})(window)


// 赋值操作  $('.ui-datepicker-curr-month').html(new Date('2017-05-02').pattern("yyyy-MM-dd EE"))；