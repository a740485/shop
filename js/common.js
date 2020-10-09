function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function login_system(status) {
    let loginUser = getCookie("username");
    console.log("登入狀態：" + loginUser);
    if (loginUser == "" || loginUser == null) {
        console.log("沒登入");
        $("nav .wrap").append("<a class='link' href='/register'>註冊</a>");
        $("nav .wrap").append("<a class='link' href='/login'>登入</a>");

        if (status) {
            window.location.replace("/login");
        }
    } else {
        console.log("login seccess");
        $("nav .wrap").append(
            "<a href='/backstage' class='user'>" + $.cookie("username") + "</a>"
        );
        $("nav .wrap").append("<p class='link logout'>登出</p>");
    }

    $("nav .logout").click(function () {
        console.log("logout clicked");
        console.log($.cookie("username"));
        document.cookie = "username=" + "" + ";path=/";
        window.location.replace("/");
    });

    return loginUser;
}
