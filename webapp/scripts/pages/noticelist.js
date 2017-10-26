$(function() {
    $(".J-container-title").headerStyle();
    PAGE_NOTICE_CONTROLLER.init();

    $('.search-form').submit(function() {
        PAGE_NOTICE_DATA.name = $('.search-input').val();
        PAGE_NOTICE_CONTROLLER.init();
        return false;
    })
})
var PAGE_NOTICE_DATA = {
    name: util.getQueryString('name') || ''
};
var PAGE_NOTICE_CONTROLLER = {
    init: function() {
        $('.page-wrap .pagination').remove()
        util.getdata("/caa-search-ws/ws/0.1/notices?start=0&count=10&name=" + PAGE_NOTICE_DATA.name, "get", "json", false, false, function(data) {
            if (data.totalCount == 0 || data.items.length == 0) {
                $('.notice-contents').append('<dv class="no-notice color-999">抱歉，暂无公告！</div>');
                $('.notice-term').html('');
                return;
            }
            $('.no-notice').remove();
            var auctionnumberdata = {};
            auctionnumberdata.data = data;
            auctionnumberdata.url = "/caa-search-ws/ws/0.1/notices?start=0&count=10&name=" + PAGE_NOTICE_DATA.name;
            $(".notice-term").notice(auctionnumberdata);
        }, function(data) {
            $('.notice-contents').append('<dv class="no-notice color-999">抱歉，暂无公告！</div>');
            $('.notice-term').html('');
        });
    }
};