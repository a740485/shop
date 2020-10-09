$(document).ready(function () {
    console.log("product.js ready");

    let loginUser = login_system(true);
    // product init
    let product_id = productData();

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

    // 新增購物車
    $(".content .add-cart").click(function () {
        if (loginUser == "" || loginUser == null || !loginUser) {
            alert("尚未登入,請先登入");
            return;
        }

        let data = {
            user_id: loginUser,
            product_id: product_id,
        };

        $.ajax({
            type: "POST",
            url: host + "/shopBackend/route.php/cart",
            data: data,
            success: function (res) {
                try {
                    if (res.Status != 200) {
                        throw "not 200";
                    }

                    console.log(res.Result.IsOK);
                    if (!res.Result.IsOK) {
                        throw "not ok";
                    }
                    alert("新增成功");
                } catch (error) {
                    console.log(error);
                    alert("新增失敗或購物車已擁有");
                }
            },
            error: function (res) {
                console.log("add cart error");
                throw "伺服器發生錯誤: " + res;
            },
        });
    });
});

function productData() {
    let origin_url = window.location.search;
    let url_arr = origin_url.split("?")[1].split("&").reverse();

    let product = {};
    for (let i of url_arr) {
        product[i.split("=")[0]] = i.split("=")[1];
    }
    var id = product.product;

    $.ajax({
        url: host + "/shopBackend/route.php/product/" + id,
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

    return id;
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

function login_system() {
    let loginUser = getCookie("username");
    console.log(loginUser);
    console.log("登入狀態：" + loginUser);
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
        document.cookie = "username=" + "" + ";path=/";
        // window.location.replace("/");
    });

    return loginUser;
}
