/**
 * Created by lxj on 2017/6/3.
 */
;
//渲染公告详情页信息等{"id":1,"name":"拍卖公告name","content":"<p>shahshahsahsahs</p>\n","publishDate":null,"source":null,"pic":null,"lotCount":0}
$.fn.noticeDetail = function(data) {
    if (typeof data == "undefined") {
        return;
    }
    $(document).attr("title", data.name + '_中拍平台');
    this.find(".noticename").html(data.name).end()
        .find(".sourcename").html(data.source).attr('href', '/pages/enterprises/companydetail.html?companyId=' + data.companyId).end()
        .find("h1").html(data.name).end()
        .find(".textAlign").append($(data.content)).find("h3").html("公告来源：" + util.transformNull(data.source) + "&emsp;&emsp;发布时间：" + util.tranferTime2(data.publishDate, true, false));
    if (null != data.annexeList && data.annexeList.length > 0) {
        // $(".notice-detail-value").eq(0).append("<br><h2>附件下载：</h2><p>");
        var annexeList = '';
        $.each(data.annexeList, function(id, item) {
            // debugger
            annexeList += '<li><a href="/caa-search-ws/ws/0.1/web/enclosure/download/' + item.id + '">' + item.fileName + '</a></li>';
        });
        this.find('.annexeList').show().find('ul').html(annexeList);
    }


};
$(document).ready(function() {
    PAGE_NOTICEDETAIL_CONTROLLER.init();
});
//页面控制器，负责与后台交互
var PAGE_NOTICEDETAIL_CONTROLLER = {
    init: function() {
        var noticeId = util.getQueryString("id");
        var noticedata = { url: "/caa-search-ws/ws/0.1/auctionmeets?start=0&count=6&noticeId=" + noticeId };
        util.getdata(noticedata.url, "get", "json", false, false, function(data) {
            noticedata.data = data;
        }, function(data) {

        });
        // $("#auctionlist").auctionmeetlist(noticedata);
        var noticedetaildata = { url: "/caa-search-ws/ws/0.1/notice/" + noticeId };
        util.getdata(noticedetaildata.url, "get", "json", false, false, function(data) {
            noticedetaildata.data = data;
        }, function(data) {
            //TODO
        });
        AUCTIONNUMBER.createMeetinglist("&noticeId=" + noticeId, $("#auctionlist"), $(".time-content .active"), "liststyle");
        //添加收藏,取消拍卖会功能
        AUCTIONNUMBER.auctionstore();

        $(".notice-detail-wrap").noticeDetail(noticedetaildata.data);
        $(".J-container-title").headerStyle();
    }
}