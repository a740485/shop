$(document).ready(function () {
    console.log("backstage.js ready");
    let user = login_system();

    $.ajax({
        type: "get",
        url: "http://localhost/shopBackend/route.php/backstage/" + user,
        success: function (res) {
            try {
                if (res.Status != 200) {
                    throw "not 200";
                }

                console.log(res.Result);
                for (let i = 0; i < res.Result.length; i++) {
                    let product = new ProductList(user, res.Result[i]);
                    $(".product-list").append(product.getList);
                }
            } catch (err) {
                console.log(err);
            }
        },
        error: function (res) {
            console.log("get error: ");
            console.log(res);
        },
    });

    let tesData = {
        img: "",
        title: "title",
        price: "price",
        amount: "amount",
    };
});

function reqListener() {
    console.log(this.responseText);
}

function revice(id) {
    console.log("revice click: " + id);
    $("#product_img_input_" + id).removeAttr("disabled");
    $("#product_title_" + id).removeAttr("disabled");
    $("#product_price_" + id).removeAttr("disabled");
    $("#product_amount_" + id).removeAttr("disabled");
    $("#product_button_" + id).attr("onclick", "save(" + id + ")");
    $("#product_button_" + id + " p").html("儲存");
}

function save(id) {
    console.log("save click: " + id);

    let img_file = $("#product_img_input_" + id)[0].files[0];
    let title = $("#product_title_" + id).val();
    let price = $("#product_price_" + id).val();
    let amount = $("#product_amount_" + id).val();

    let data = {
        id: id,
        title: title,
        price: price,
        amount: amount,
    };

    $.ajax({
        url: host + "/shopBackend/route.php/backstage",
        type: "PATCH",
        data: data,
        error: function (res) {
            alert("Ajax request 發生錯誤");
            console.log(res);
        },
        success: function (res) {
            console.log("succcess");
            console.log(res);

            // 儲存成功後變更畫面
            $("#product_img_input_" + id).attr("disabled", "disabled");
            $("#product_title_" + id).attr("disabled", "disabled");
            $("#product_price_" + id).attr("disabled", "disabled");
            $("#product_amount_" + id).attr("disabled", "disabled");
            $("#product_button_" + id).attr("onclick", "revice(" + id + ")");
            $("#product_button_" + id + " p").html("修改");
        },
        complete: function (json) {
            console.log("complete");
        },
    });
}

function change_img(data, id) {
    console.log("on change img: " + id);

    if (data.files && data.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#product_img_" + id).attr("src", e.target.result);
        };
    }
}

class ProductList {
    ID = ""; // User ID
    Data = {
        id: "", // product ID
        img: "",
        title: "",
        price: "",
        amount: "",
    };
    constructor(id, data) {
        this.ID = id;
        this.Data = data;
        this.Product = this.product();
        this.Img_box = this.img_box();
        this.Img_box_img = this.img_box_img();
        this.Img_box_input = this.img_box_input();
        this.Title = this.title();
        this.Price = this.price();
        this.Amount = this.amount();
        this.ReviceBtn = this.reviceBtn();
    }

    get getList() {
        this.Img_box.appendChild(this.Img_box_img);
        this.Img_box.appendChild(this.Img_box_input);

        this.Product.appendChild(this.Img_box);
        this.Product.appendChild(this.Title);
        this.Product.appendChild(this.Price);
        this.Product.appendChild(this.Amount);
        this.Product.appendChild(this.ReviceBtn);
        return this.Product;
    }

    product() {
        let box = document.createElement("div");
        box.setAttribute("class", "product");
        return box;
    }

    img_box() {
        let box = document.createElement("div");
        box.setAttribute("class", "img_box img_weight");
        return box;
    }

    img_box_img() {
        let box = document.createElement("img");
        box.setAttribute("src", this.Data.img);
        return box;
    }

    img_box_input() {
        let box = document.createElement("input");
        box.setAttribute("id", "product_img_input_" + this.Data.id);
        box.setAttribute("type", "file");
        box.setAttribute("accept", "image/*");
        box.setAttribute("disabled", "disabled");
        box.setAttribute("onchange", "change_img(this," + this.Data.id + ")");
        return box;
    }

    title() {
        let box = document.createElement("textarea");
        box.setAttribute("class", "title title_weight");
        box.setAttribute("id", "product_title_" + this.Data.id);
        box.setAttribute("row", "2");
        box.setAttribute("placeholder", "商品標題");
        box.setAttribute("disabled", "disabled");
        box.innerText = this.Data.title;
        return box;
    }

    price() {
        let box = document.createElement("input");
        box.setAttribute("type", "text");
        box.setAttribute("class", "price price_weight");
        box.setAttribute("id", "product_price_" + this.Data.id);
        box.setAttribute("value", this.Data.price);
        box.setAttribute("placeholder", "商品價格");
        box.setAttribute("disabled", "disabled");
        return box;
    }

    amount() {
        let box = document.createElement("input");
        box.setAttribute("type", "text");
        box.setAttribute("class", "price price_weight");
        box.setAttribute("id", "product_amount_" + this.Data.id);
        box.setAttribute("value", this.Data.amount);
        box.setAttribute("placeholder", "商品數量");
        box.setAttribute("disabled", "disabled");
        return box;
    }

    reviceBtn() {
        let box = document.createElement("div");
        box.setAttribute("class", "button btn_weight");
        box.setAttribute("id", "product_button_" + this.Data.id);
        box.setAttribute("onclick", "revice(" + this.Data.id + ")");
        let text = document.createElement("p");
        text.innerHTML = "修改";
        box.appendChild(text);
        return box;
    }
}
