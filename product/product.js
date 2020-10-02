$(document).ready(function () {
    console.log("product.js ready");

    let loginUser = getCookie("username");

    if (loginUser == "" || loginUser == null) {
        console.log("沒登入");
        $("nav .wrap").append("<a class='link' href='/register'>註冊</a>");
        $("nav .wrap").append("<a class='link' href='/login'>登入</a>");
    } else {
        console.log("login seccess");
        $("nav .wrap").append(
            "<p class='user'>" + $.cookie("username") + "</p>"
        );
        $("nav .wrap").append("<p class='link logout'>登出</p>");
    }

    $("nav .logout").click(function () {
        console.log("logout clicked");
        console.log($.cookie("username"));
        $.cookie("username", "");
        window.location.replace("/");
    });

    // product init
    productData();

    $(".amount_dec").click(function () {
        let amount = $("#product_amount").val();
        if (amount > 0) {
            $("#product_amount").val(--amount);
        }
    });

    $(".amount_inc").click(function () {
        let amount = $("#product_amount").val();
        $("#product_amount").val(++amount);
    });
});

function productData() {
    let origin_url = window.location.search;
    let url_arr = origin_url.split("?")[1].split("&").reverse();

    let product = {};
    for (let i of url_arr) {
        product[i.split("=")[0]] = i.split("=")[1];
    }

    $.ajax({
        url: host + "/shopBackend/route.php/product/" + product.product,
        success: function (response) {
            try {
                if (response.Status != 200) {
                    throw "not 200";
                }
                let result = response.Result;

                $("#product_title").text(result.title);
                $("#product_img").attr("src", result.img);
                $("#product_price").text(result.price);

                console.log(result);
            } catch (error) {
                console.log(error);
            }
        },
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
