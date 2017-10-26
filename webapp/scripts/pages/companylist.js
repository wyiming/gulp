$(document).ready(function() {
    PAGE_ENTERPRISELIST_CONTROLLER.init();
    $(".J-container-title").headerStyle();
});
var initClick = function() {
    var $companyfilter = $(".company-filter");
    var $companycontentwrap = $(".company-content-wrap"),
        len = $companycontentwrap.length,
        $indexletter = $(".index-letter");
    var fnaddClass = function(classname, n, $dom) {
        $dom.find("." + classname).removeClass(classname).end().find("a").eq(n).addClass(classname);
    }
    $indexletter.find("li:eq(0) a").addClass("active");
    $(window).on("scroll click", function(e) {
        var that;
        if (e.type == "scroll") {
            var $scrolltop = $(window).scrollTop();
            if ($scrolltop > 120) {
                $companyfilter.addClass("fixed").next("div").css("padding-top", "88px");
            } else {
                $companyfilter.removeClass("fixed").next("div").css("padding-top", "0px");
            }
            for (var i = 0; i < len; i++) {
                that = $companycontentwrap.eq(i);
                if ($scrolltop >= that.offset().top - 60 && $scrolltop < that.offset().top - 60 + that.height()) {
                    that.css("padding-top", "60px").prev(".company-letter-btn").addClass("fixed2");
                    fnaddClass("active", i, $indexletter);
                    return;
                } else {
                    that.css("padding-top", "0px").prev(".company-letter-btn").removeClass("fixed2");
                }
            }
        } else if (e.type == "click") {
            that = $(e.target);
            if (!that.attr("data-index")) {
                return;
            }
            var dataindex = that.attr("data-index") - 1;
            var $top = $companycontentwrap.eq(dataindex).offset().top;
            fnaddClass("active", dataindex, $indexletter);
            $(window).scrollTop($top - 90);
        }
    });
}

//页面控制器，负责与后台交互，获取数据
var PAGE_ENTERPRISELIST_CONTROLLER = {
    init: function() {
        util.getdata('/caa-search-ws/ws/0.1/company/rank', 'get', 'json', false, true, function(data) {
            if (data.length == 0) {
                $('.company-filter').remove();
                $('.company-content').html('<dv class="no-notice color-999">抱歉，暂无企业！</div>');
                return;
            }
            var arr = [],
                arrini = [],
                arrprov = [],
                arrprovlength = '';
            $.each(data, function(id, items) {
                util.changeToEmpty(items, '#');
                if (jQuery.inArray(items.provinceIni, arrini) != -1) {
                    if (jQuery.inArray(items.provinceId, arrprov) != -1) {
                        arrprovlength = arr[arr.length - 1].province.length;
                        arr[arr.length - 1].province[arrprovlength - 1].company.push({
                            "companyName": items.companyName,
                            "companyId": items.id,
                            "companyLogo": items.companyLogo,
                            "meetCount": items.meetCount
                        })
                    } else {
                        arrprov.push(items.provinceId)
                        arr[arr.length - 1].province.push({
                            "provinceId": items.provinceId,
                            "provinceName": items.provinceName,
                            "company": [{
                                "companyName": items.companyName,
                                "companyId": items.id,
                                "companyLogo": items.companyLogo,
                                "meetCount": items.meetCount
                            }]
                        });
                    }
                } else {
                    arrini.push(items.provinceIni);
                    arrprov.push(items.provinceId)
                    arr.push({
                        "id": items.id,
                        "provinceIni": items.provinceIni,
                        "province": [{
                            "provinceId": items.provinceId,
                            "provinceName": items.provinceName,
                            "company": [{
                                "companyName": items.companyName,
                                "companyId": items.id,
                                "companyLogo": items.companyLogo,
                                "meetCount": items.meetCount
                            }]
                        }]
                    })
                }

            })

            $(".enterpriselist").enterpriselist(arr);
            $('.index-letter').enterpriseini(arrini);
        });
    }
};


//渲染服务
;
(function($) {
    $.fn.enterpriselist = function(items) {
        var bcb = '',
            province = '',
            company = '',
            liclass = '';
        $.each(items, function(index, item) {
            province = '';
            $.each(item.province, function(index2, item2) {
                company = '';
                $.each(item2.company, function(index3, item3) {
                    company += '<li>' +
                        '<a href="/pages/enterprises/companydetail.html?companyId=' + item3.companyId + '" target="_blank" class="clearfix c666" class="company-a">' +
                        '<img class="company-logo" src="' + ((item3.companyLogo) ? item3.companyLogo : '/themes/images/nocompany.png') + '" />' +
                        '<div class="txt_box">' +
                        '<p class="ptit comname">' + item3.companyName + '</p>' +
                        '<p class="ptxt">' + item3.meetCount + '场拍卖会</p>' +
                        '</div>' +
                        '</a>' +
                        '</li>';
                })

                province += '<div class="company_wrap">' +
                    '<div class="company-province">' +
                    '<span><a class="c333" href="javascript:void(0)" target="_blank" data-provincename="' + item2.provinceName + '" data-provinceid="' + item2.provinceId + '">' + item2.provinceName + '</a></span>' +
                    '</div>' +
                    '<ul class="company_list clearfix">' + company + '</ul>' +
                    '</div>';

            });
            if (index == 0) {
                liclass = '';
            } else {
                liclass = 'pt50';
            }

            bcb += '<li class="' + liclass + '">' +
                '<div class="company-letter-btn"><span>' + item.provinceIni + '</span></div>' +
                '<div class="company-content-wrap">' + province + '</div>' +
                '</li>';

        })
        this.html(bcb);
        $('.company-logo').bind("error", function() {
            this.src = "/themes/images/nocompany.png";
        });
        initClick();
        return this;
    };

    $.fn.enterpriseini = function(items) {
        var bcb = '',
            classname = '';
        var letwidth = $('#index-letter').width() / items.length;
        $.each(items, function(index, item) {
            classname = (index == 0) ? 'active' : '';
            bcb += ' <li style="width:' + letwidth + 'px;"><a href="javascript:void(0);" class="' + classname + '" data-index="' + (index + 1) + '">' + item + '</a></li>';

        })
        this.html(bcb);
        return this;
    };
})(jQuery);