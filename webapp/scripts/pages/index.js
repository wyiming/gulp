$(function() {
    //测试提交
    $(".J-container-title").headerStyle();
    //首页轮播图
    var index = 0,
        $circle,
        $banner,
        timerId;

    //设置轮播图图片
    $.ajax({
        url: '/caa-web-ws/ws/0.1/web/advs/images?belong=2',
        type: 'get',
        dataType: 'json',
        cache: false,
        async: true,
        success: function(data) {
            if (data.totalCount == 0) {
                return false;
            }
            $('.J-banner-img').html('');
            $.each(data.items, function(id, item) {
                if (id > 4) return false;
                if (item.imgUrl) {
                    var link = '',
                        ac = '';
                    if (item.link.indexOf('http') == '-1') {
                        link = 'http://' + item.link;
                    } else {
                        link = item.link;
                    }
                    if (id == 0) {
                        ac = 'active';
                    }
                    $('.J-banner-img').append('<div class="banner-list ' + ac + '">' +
                        '<a href="' + link + '" target="_blank">' +
                        '<img src="' + item.imgUrl + '" alt="' + item.remark + '">' + //javascript:this.src="images/nobanner.png"
                        '</a>' +
                        '</div>');
                }
            });

            $('.main-banner img').bind("error", function() {
                this.src = "/themes/images/nobanner.png";
            });

            if (data.items.length == 1) {
                $('.J-circle').html('<li class="active"></li>');
            } else if (data.items.length > 5) {
                $('.J-circle').html('<li class="active"></li><li></li><li></li><li></li><li></li>');
            } else {
                var li = '';
                for (var i = 0; i < data.items.length; i++) {
                    if (i == 0) {
                        li += '<li class="active">';
                    } else {
                        li += '<li></li>';
                    }
                }
                $('.circle').html(li);
            }

            var deleft = $('.J-circle').width() / 2;
            $('.J-circle').css('margin-left', -deleft);
            $circle = $('.J-banner>.circle>li');
            $banner = $('.J-banner>.J-banner-img>.banner-list');
            reset();
        }
    });

    function reset() {
        $('.J-banner').hover(function() {
            $('.J-tab-btn').css('display', 'block');
        }, function() {
            $('.J-tab-btn').css('display', 'none');
        });
        var lunbo = function() {
            index++;
            if (index == $banner.length) {
                index = 0;
            }
            $banner.removeClass('active').eq(index).addClass('active');
            $circle.removeClass('active').eq(index).addClass('active');

        };
        timerId = setInterval(lunbo, 3000);
        $circle.each(function(i) {
            $(this).data('index', i);
        });
        $circle.hover(function() {
            clearInterval(timerId);
            $circle.removeClass('active');
            $(this).addClass('active');
            var i = $(this).data('index');
            index = i;
            $banner.removeClass('active').eq(index).addClass('active');
        }, function() {
            clearInterval(timerId);
            timerId = setInterval(lunbo, 3000);
        });

        $('.to-left').click(function() {
            clearInterval(timerId);
            index--;
            if (index == -1) {
                index = $banner.length - 1;
            }
            $banner.removeClass('active').eq(index).addClass('active');
            $circle.removeClass('active').eq(index).addClass('active');
            timerId = setInterval(lunbo, 3000);
        });
        $('.J-to-right').click(function() {
            clearInterval(timerId);
            index++;
            if (index == $banner.length) {
                index = 0;
            }
            $banner.removeClass('active').eq(index).addClass('active');
            $circle.removeClass('active').eq(index).addClass('active');
            timerId = setInterval(lunbo, 3000);
        });
    }

    //获取标的物分类及所在地
    util.getdata('/personal-ws/ws/0.1/auction/lots/type', 'get', 'json', false, true, function(data) {
        var typestr = '';
        $.each(data, function(id, item) {
            if (id < 9) {
                var isred = 'hover-red';
                if (item.weight == 1 || item.weight == '1') {
                    isred = 'red';
                }
                if (item.standardName.length > 4) {
                    item.standardName = item.standardName.substring(0, 4) + '...';
                }
                typestr += '<li><a href="/pages/lots/list.html?standardType=' + item.standardNum + '" class="' + isred + '">' + item.standardName + '</a></li>';
            }
        });
        $('.J-type-list ul').html(typestr);
    });


    util.getdata('/caa-web-ws/ws/0.1/authorize/provinces', 'get', 'json', false, true, function(data) {
        var locstr = '';
        $.each(data, function(id, item) {
            if (id < 32) {
                var isred = 'hover-red';
                if (item.level == 1 || item.level == '1') {
                    isred = 'red';
                }
                locstr += '<li><a href="/pages/lots/list.html?province=' + item.id + '" class="' + isred + '">' + item.shortName + '</a></li>';
            }
        });
        $('.location-list ul').html(locstr);
    });

    util.getdata('/caa-search-ws/ws/0.1/lots/today?count=8&scope=1', 'get', 'json', false, true, function(data) {
        $(".today-list").lot({
            data: data
        });
        if (data.length == 0) {
            $(".auction-today").hide();
        }
    });
    util.getdata("/caa-search-ws/ws/0.1/lots/recent?count=8&scope=1", "get", "json", false, true, function(data) {
        if (data.length == 0) {
            $(".J-next-preview").hide();
        }
        $(".J-recent-list").lot({
            data: data
        });
        var time = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
        $('.J-next-preview .main-tit').find('a').attr('href', '/pages/lots/list.html?startTimeStamp=' + time);
    });
    //拍卖企业
    // util.getdata("/caa-search-ws/ws/0.1/companies?count=16", "get", "json", false, true, function(data) {
    var data = [
        { "id": 5363, "name": "山东齐鲁瑞丰拍卖有限公司" },
        { "id": 6773, "name": "齐齐哈尔鑫鼎拍卖有限责任公司" },
        { "id": 9819, "name": "宁夏嘉德拍卖行（有限公司）" },
        { "id": 7807, "name": "金诺国际拍卖有限公司" },
        { "id": 5850, "name": "江苏广聚源拍卖有限公司" },
        { "id": 8700, "name": "济宁天和拍卖有限公司" },
        { "id": 5542, "name": "吉林省金石拍卖有限责任公司" },
        { "id": 8046, "name": "黑龙江信达拍卖有限责任公司" },
        { "id": 5323, "name": "黑龙江农垦北大荒佳兴拍卖有限公司" },
        { "id": 7995, "name": "河北价信拍卖有限责任公司" },
        { "id": 6781, "name": "河北华信拍卖有限公司" },
        { "id": 5772, "name": "海南冠亚拍卖有限公司" },
        { "id": 5169, "name": "赣州市拍卖行" },
        { "id": 9044, "name": "佛山市公联拍卖有限公司" },
        { "id": 5520, "name": "北京嘉禾国际拍卖有限公司" },
        { "id": 5942, "name": "安徽盘龙企业拍卖集团有限公司" }
    ]
    if (data.length == 0) {
        $(".J-enterprises-wrap").hide();
    }

    $.each(data, function(id, item) {
            // var logo = item.logoPath ? item.logoPath : '/themes/images/nocompany.png';
            // var isactive = id <= 3 ? "color-red" : "";
            var temp = '<li class="enterprises-li">' +
                '<a href="/pages/enterprises/companydetail.html?companyId=' + item.id + '" target="_blank">' +
                // '<div class="enterprises-img">' +
                // '<img src="' + logo + '">'+
                // '</div>' +
                '<div class="enterprises-info"><p class="enterprises-name ellipsis">' + item.name + '</p>' +
                // '<p class="enterprises-num">' + item.meetCount + '场</p>'+
                '</div>' +
                '</a>' +
                '</li>';
            $('.J-enterprises-list').append(temp);
        })
        // });
    $('.enterprises-img img').bind("error", function() {
        this.src = "/themes/images/nocompany.png";
    });
    //拍卖公告
    util.getdata('/caa-search-ws/ws/0.1/notices?start=0&count=5', 'get', 'json', false, true, function(data) {
        if (data.totalCount == 0) {
            $(".J-notice-auction").hide();
        } else {
            var temp = createnotice(data.items);
            $(".J-notice-auction ul").html(temp);
        }
    });
    //获取系统公告
    // util.getdata('/caa-web-ws/ws/0.1/web/sys/announces?start=0&count=1&sortname=null&sortorder=null', 'get', 'json', false, true, function(data) {
    //     if (data.totalCount > 0) {
    //         $('.index-announce-wrap').show();
    //         var dat = data.items[0];
    //         $('.announce-content h1 em').html(dat.title);
    //         $('.announce-content p').html(dat.content);
    //         var time = dat.publishTime.split(' ')[0].split('-');
    //         $('.announce-content .announce-time').html(time[0] + '年' + time[1] + '月' + time[2] + '日');
    //     }
    // });

    // $('.close-announce').click(function() {
    //     $('.index-announce-wrap').hide();
    // });

    function createnotice(data) {
        var temp = '';
        $.each(data, function(id, item) {
            temp += '<li>' +
                '<p class="notice-content ellipsis mb8"><a class="f14" href="/pages/notice/item.html?id=' + item.id + '" target="_blank">' + item.name + '</a></p>' +
                '<p class="notice-other"><a class="notice-other-a hover-red" href="/pages/enterprises/companydetail.html?companyId=' + item.companyId + '" target="_blank">' + item.source + '</a>' + util.tranferTime2(item.publishDate, '', 'isyear') + '</p>' +
                '</li>';
        })
        return temp;
    }
    //拍卖会
    AUCTIONNUMBER.createMeetinglist("", $('.meeting-ul'));
    //时间轴
    var auctionnumberdata = {};
    util.getdata("/caa-search-ws/ws/0.1/auctionmeet/count", "get", "json", false, false, function(data) {
        auctionnumberdata.data = data;
        auctionnumberdata.url = "/caa-search-ws/ws/0.1/auctionmeet/count";
    });
    $(".J-time-content").auctionnumber(auctionnumberdata);
})