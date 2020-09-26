$(document).ready(function () {
    console.log("index.js ready")

    let loginUser = getCookie("username");

    if(loginUser == "" || loginUser == null){
        console.log("沒登入");
        $("nav .wrap").append("<a class='link' href='/register'>註冊</a>");
        $("nav .wrap").append("<a class='link' href='/login'>登入</a>");
    }else{
        console.log("login seccess")
        $("nav .wrap").append("<p class='user'>"+ $.cookie('username') +"</p>");
        $("nav .wrap").append("<p class='link logout'>登出</p>");
    }

    $("nav .logout").click(function () { 
        console.log("logout clicked");
        console.log($.cookie('username'))
        $.cookie('username', "");
        window.location.replace('/');
    });
    
});

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}