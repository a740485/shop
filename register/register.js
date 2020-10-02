$(document).ready(function () {
    console.log("ready")

    // $(".content input[name='username']").keyup(function(){
    //     console.log("username")
    // })
    // $(".content input[name='password']").keyup(function(){
    //     console.log("password")
    // })
    // $(".content input[name='phone']").keyup(function(){
    //     console.log("phone")
    // })
    // $(".content input[name='email']").keyup(function(){
    //     console.log("email")
    // })
    // $(".content input[name='address']").keyup(function(){
    //     console.log("address")
    // })
    
    $('.form-btn').click(function(){

        
        // $(".content input").removeClass("checkErr");
        // err.removeClass("checkErr");
        // console.log(err)
        let data = {
            "username": $("input[name='username']").val(),
            "password": $("input[name='password']").val(),
            "phone": $("input[name='phone']").val(),
            "email": $("input[name='email']").val(),
            "address": $("input[name='address']").val()
        }
        let checkOK = check(data);
        if(checkOK){
            $.ajax({
                type: "POST",
                url: host+"/shopBackend/route.php/user/create",
                data: data,
                header:{
                    'Authorization': ""
                },
                success: function (response) {
                    console.log(response)

                    try {
                        if(response.Status != 200){
                            throw "not 200";
                        }

                        if(!response.Result.IsOK){
                            alert("帳號已存在");
                            throw response.Message
                        }

                        document.cookie="username="+ data.username+";path=/";

                        alert("註冊成功");
                        window.location.replace("/");
                        // console.log(response.Message)
                       
                    } catch (error) {
                        console.log(error);
                    }

                },error: function(res){
                    alert("伺服器發生錯誤")
                    throw "伺服器發生錯誤: "+res;
                }
            });

        }
    })
})


function check(data){
    
    for(name in data){
        let hadClass = $(".content input[name="+ name +"]").hasClass('checkErr');
        if(hadClass){
            $(".content input[name="+ name +"]").removeClass("checkErr");
        }
    }

    try {
        // console.log(data)
        if(!data.username || !data.password){
            if(!data.username){
                errElert("username")
            }
            if(!data.password){
                errElert("password")
            }
            throw "username or password id empty"
        }
        return true
    } catch (error) {
        console.log("error: "+error)
        return false
    }
}

function errElert(name){
    $("input[name="+ name +"]").addClass('checkErr');
    // console.log($("input[name="+ name +"]").next().text("錯誤"))
}