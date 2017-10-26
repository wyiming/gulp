//保存拍卖会相关的可变的数据  注意：竞价阶梯、起拍价都是可变的。
var PAGE_CONFERENCE_DATA = {
    current_price: 0, //当前价格
    available_price: 0, //可以出的最低价
    status: '即将开始' //拍卖状态
};
//页面控制器，负责与后台交互
var PAGE_CONFERENCE_CONTROLLER = {
    init: function() {
        //获取页面id
        var dataid = util.getQueryString('id');
        var getdata = { url: "/caa-search-ws/ws/0.1/auctionmeet/" + dataid };
        //拍卖会详情页
        util.getdata(getdata.url, "get", "json", false, false, function(data) {
            getdata.data = data;
        }, function(data) {

        });
        //渲染拍卖会内容
        $("body").pushAuctionmeet(getdata.data);

        $('.banners-img img').bind("error", function() {
            this.src = "/themes/images/nomeet.png";
        });

        var auctioner = { url: "/caa-search-ws/ws/0.1/auctioneer?meetId=" + dataid };
        util.getdata(auctioner.url, "get", "json", false, false, function(data) {
            auctioner.data = data;
        }, function(data) {

        });
        //AUCTIONNUMBER.createMeetinglist(dataid, $(".meeting-ul"),"","liststyle")
        //渲染拍卖师内容
        $("body").pushAuctioner(auctioner.data);
    },
    getLogInfo: function() {

    }
};
(function($) {
    //渲染拍卖会基本信息 拍品名称、开拍时间等
    $.fn.pushAuctionmeet = function(data) {
        var meetStatus = ["", "预计"]
        var startarr = ["开始", "结束"]
        var modearr = ["专业拍", "自由拍"]; // 0 是顺序拍
        var cname = (data.type == 1) ? 'back-org' : 'type-sign';
        var _timeType, _start, _meetTime;
        _timeType = meetStatus[data.type];
        if (!data.endTime) {
            data.endTime = ""
        }
        if (data.type == 0) { //顺序拍
            _start = startarr[0]
            if (data.status <= 1) {
                _meetTime = data.start
            } else {
                _meetTime = data.endTime
                _start = startarr[1]
            }
        } else {
            _meetTime = data.start
            _start = startarr[1]
            if (data.status >= 1) {
                _meetTime = data.endTime
            } else {
                _start = startarr[0]
            }
        }
        if (data.status >= 2) {
            _start = startarr[1]
        }
        this.find(".bidder_enter a").attr("href", "/pages/meeting/hall.html?meetId=" + data.id).end()
            .find(".type-comm").html(modearr[data.type]).addClass(cname).end()
            .find(".auction-bidder-name").html(data.name).end()
            .find(".companyName").html(data.companyName).end()
            .find(".tel").html(data.tel).end()
            .find(".start").html(util.tranferTime(_meetTime, true, '', true) + _start).end()
            .find(".banners-img img").attr("src", data.pic ? data.pic : "/themes/images/nomeet.png").end()
            .find('.nav-name').html(data.companyName).attr("href", "/pages/enterprises/companydetail.html?companyId=" + data.companyId).end()
            .find('.meet-title').html(data.name).end()
            .find('.lot_num').html(data.lotNum).end()
            .find('.apply_num').html(data.signInCount).end()
            .find('.onlooker_num').html(data.onLookerCount).end()
            .find('.focus-list-three p.label').html(_timeType);
        $(document).attr("title", data.name + '_中拍平台');
        if (data.type == 0 && data.status == 1) {
            this.find(".bidder_enter").show().click(function() {
                window.location.href = $(this).find('a').attr('href');
            });
        } else {
            this.find(".bidder_enter").hide();
            $('.other-focus-list').css('height', '268px');
            $('.change-height').css('padding-top', '30px');
            $('.other-focus .start').css('line-height', '85px')
        }
        if (data.status == '0') {
            this.find('.start').html(_timeType + util.tranferTime(_meetTime, true, '', true) + "开始")
        }
        if (data.status == '1' && data.type == '1') {
            this.find('.start').addClass('ing').html(_timeType + util.tranferTime(_meetTime, true, '', true) + "结束")
        }
        if (_meetTime == "") {
            $('.other-focus .start').css('visibility', 'hidden')
        }
    };
    //渲染拍卖师信息
    $.fn.pushAuctioner = function(data) {
        this.find(".auction-pic img").attr("src", data.photo).end()
            .find(".auctioneer-name").html(data.name).end()
            .find(".auctioneer-number em").html(data.idcard).end()
            .find(".auctioneer-card img").attr("src", data.idCardPhoto)
    };
})(jQuery);
$(document).ready(function() {
    PAGE_CONFERENCE_CONTROLLER.init();
    $(".J-container-title").headerStyle();
});