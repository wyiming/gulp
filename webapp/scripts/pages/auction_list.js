//保存拍卖会相关的可变的数据
var PAGE_AUCTIONLIST_DATA = {
    isLogin: user.islogin() //用户是否登录
};
//页面控制器，负责与后台交互
var PAGE_AUCTIONLIST_CONTROLLER = {
    init: function() {
        $(".J-container-title").headerStyle();
        AUCTIONNUMBER.createMeetinglist("", $("#auctionlist"), $(".time-content .active"), "liststyle");
        this.getAuctionmeets($(".auction-type"));
    },
    getAuctionmeets: function($auctiontype) {
        //选择条件 获取拍卖会
        $(document).on("click", ".auction-type a", function(e) {
            if (!e) { e = window.event };
            var $this = $(this);
            if ($this.parent().hasClass('item') || $this.hasClass('selectBtn')) {
                return;
            }
            var urlstrings = "";
            $this.parents(".auction-filter-value").find("a").removeClass("active").end().end().addClass("active");
            $auctiontype.find(".active").each(function(i) {
                //var isHasW = urlstrings.indexOf("?")>-1;
                switch (i) {
                    case 0:
                        urlstrings += typeof $(this).data("type") != "undefined" ? ("&type=" + $(this).data("type")) : "&type=";
                        urlstrings += typeof $(this).data("mode") != "undefined" ? ("&mode=" + $(this).data("mode")) : "&mode=";
                        break;
                    case 1:
                        urlstrings += typeof $(this).data("attribute") != "undefined" ? ("&attribute=" + $(this).data("attribute")) : "&attribute=";
                        break;
                    case 2:
                        urlstrings += typeof $(this).data("status") != "undefined" ? ("&status=" + $(this).data("status")) : "&status=";
                        break;
                    case 3:
                        $('.time-btn').hide();

                        var termtext = $(this).data("term");
                        var year = new Date().getFullYear(),
                            month = new Date().getMonth() + 1,
                            day = new Date().getDate();
                        month = (month < 10) ? '0' + month : month;
                        day = (day < 10) ? '0' + day : day;
                        var today = year + '-' + month + '-' + day;
                        var endtext;
                        if (termtext == '1') {
                            $('.starttime').val(today);
                            endtext = util.addDate(today, 0);
                            $('.endtime').val(endtext);
                        } else if (termtext == '3') {
                            $('.starttime').val(today);
                            endtext = util.addDate(today, 2);
                            $('.endtime').val(endtext);
                        } else if (termtext == '7') {
                            $('.starttime').val(today);
                            endtext = util.addDate(today, 6);
                            $('.endtime').val(endtext);
                        } else if (termtext == 'all') {
                            $('.starttime').val('');
                            $('.endtime').val('');
                            termtext = '';
                        }
                        urlstrings += typeof termtext != "undefined" ? ("&term=" + termtext) : "&term=";
                        break;
                }
            });
            if ($this.hasClass('time-btn')) {
                var start = $('.starttime').val() ? new Date($('.starttime').val()).getTime() : '',
                    end = $('.endtime').val() ? new Date($('.endtime').val()).getTime() : '';
                urlstrings += "&startTimeStamp=" + start;
                urlstrings += "&endTimeStamp=" + end;
            }
            AUCTIONNUMBER.createMeetinglist(urlstrings, $("#auctionlist"), $this, "liststyle");
        })
    }
}
$(document).ready(function() {
    PAGE_AUCTIONLIST_CONTROLLER.init();
    $('.doubledate').kuiDate({
        className: 'doubledate',
        isDisabled: "0"
    });

    $('.starttime').click(function() {
        $('.time-btn').css('display', 'inline-block').addClass('active');
    })
    $('.endtime').click(function() {
        $('.time-btn').css('display', 'inline-block').addClass('active');
    })

});