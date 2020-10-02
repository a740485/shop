$(document).ready(function () {
    console.log("ready")

    function doCookieSetup(name, value) {
        var expires = new Date();
        //有效時間保存 2 天 2*24*60*60*1000
        expires.setTime(expires.getTime() + 172800000);
        document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString()
    }

    $('.form-btn').click(function(){
        try {
            let data = {
                "username": $("input[name='username']").val(),
                "password": $("input[name='password']").val(),
            }

            if((data.username == "") || (data.password == "")){
                throw "username or password is empty";
            }

            var params = { 
                username:data.username, 
                password:data.password 
            };
            var urlParam = jQuery.param(params);

            $.ajax({
                type: "get",
                url: host+"/shopBackend/route.php/user/login?"+ urlParam,
                success: function (response) {
                    try {

                        if(response.Status == 400){
                            throw response.Message;
                        }

                        if(!response.Result.IsOK){
                            throw "login isOK: false";
                        }

                        document.cookie="username="+ data.username+";path=/";

                        window.location.replace("/");


                    } catch (error) {
                        alert("帳號或密碼錯誤")
                        console.log(error)
                    }
                    
                },
                error: function(res){
                    alert("伺服器發生錯誤")
                    throw "伺服器發生錯誤: "+res;
                }
            });
            

        } catch (error) {
            alert("請輸入帳號密碼")
            console.log(error);
        }

        
        


    })
})