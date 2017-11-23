// 点击更多进行切换
$(function () {
    $("#menu").on("click", ".row>div:nth-child(8)", function () {
        $("#menu>.row>div:nth-last-child(-n+4)").toggle();
        return false;
    })
    getMenuStyle();
    getRecommendStyle();


})

// 获取menu数据
function getMenuStyle() {
    $.ajax({
        url: url + "api/getindexmenu",
        success: function (data) {
            // console.log(data)
            var html = template("menuTpl", data);
            $("#menu .row").html(html);
        }
    })
}

function getRecommendStyle() {
    $.ajax({
        url: url + "api/getmoneyctrl",
        success: function (data) {
            var html = template("recommendTpl", data);
            $("#recommend .recommend_product").html(html);
        }
    })
}

