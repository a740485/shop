$(document).ready(function () {
    console.log("cart.js ready");
    let user = login_system(true);

    // 測試資料
    cart_data = [
        // {
        //     img: "https://picsum.photos/188/188/?random=3",
        //     title:
        //         "7-11 海底撈 台灣製 懶人火鍋 自煮火鍋 火鍋            自熱火鍋 火鍋控 麻辣鍋 麻辣火鍋 火鍋湯底 小火鍋 懶人鍋",
        //     price: "200",
        // },
        // {
        //     img: "https://picsum.photos/188/188/?random=4",
        //     title:
        //         "現貨新升級摺疊收納椅 收納椅 收納凳 收納箱 儲物箱 沙發 超耐重",
        //     price: "500",
        // },
        // {
        //     img: "https://picsum.photos/188/188/?random=5",
        //     title:
        //         "【DIFF】韓版寬鬆可愛保暖毛毛絨小熊大學t 長袖上衣 長袖t恤 衣服 寬鬆上衣 素T 素色 冬天 帽t【W160】",
        //     price: "120",
        // },
    ];

    $.ajax({
        url: host + "/shopBackend/route.php/cart/" + user,
        success: function (res) {
            try {
                if (res.Status != 200) {
                    throw "not 200";
                }
                cart_data = res.Result;
                // 設定cartItem
                for (i = 0; i < cart_data.length; i++) {
                    let Item = new CartItem(i, cart_data[i]);
                    let data = Item.cartData;

                    $(".product-body").append(data);
                }

                // 數量減少按鈕
                $(".amount_dec").click(function () {
                    let id = $(this)[0].id.replace("cart_dec_", "");
                    let amount = $("#cart_amount_" + id).val();
                    let price = cart_data[id].price;
                    if (amount == 1) {
                        return;
                    }
                    amount--;
                    $("#cart_amount_" + id).val(amount);
                    $("#cart_list_total_" + id).html("$" + amount * price);
                    checkout_total(cart_data);
                });

                // 數量增加按鈕
                $(".amount_inc").click(function () {
                    console.log("inc click");
                    let id = $(this)[0].id.replace("cart_inc_", "");
                    let amount = $("#cart_amount_" + id).val();
                    let price = cart_data[id].price;
                    amount++;
                    $("#cart_amount_" + id).val(amount);
                    $("#cart_list_total_" + id).html("$" + amount * price);
                    checkout_total(cart_data);
                });

                $(".product-body .product-operation").click(function () {
                    // 刪除
                    let row = $(this)[0].id.replace("cart_delete_", "");

                    $.ajax({
                        type: "DELETE",
                        url:
                            host +
                            "/shopBackend/route.php/cart/" +
                            user +
                            "/" +
                            cart_data[row].id,
                        success: function (res) {
                            try {
                                if (res.Status != 200) {
                                    throw "not 200";
                                }

                                if (!res.Result.IsOK) {
                                    throw "not ok";
                                }

                                // 刪除畫面
                                $("#cart_delete_" + row)
                                    .parent()[0]
                                    .remove();
                            } catch (error) {
                                alert("帳號或密碼錯誤");
                                console.log(error);
                            }
                        },
                        error: function (res) {
                            //如果回傳格式不是Json格式也會錯誤
                            throw "伺服器發生錯誤: " + res;
                        },
                        done: function (res) {
                            console.log("done");
                        },
                    });
                });

                // 商品打勾鈕(全部)
                $("#cart_check_all").click(function () {
                    console.log(1);
                    let status = $("#cart_check_all").prop("checked");

                    for (let i = 0; i < cart_data.length; i++) {
                        $("#cart_checked_" + i).prop("checked", status);
                    }
                    checkout_total(cart_data);
                });

                $("input[name=cart_checkbox]").click(function () {
                    let flag = true;
                    for (
                        let i = 0;
                        i < $("input[name=cart_checkbox]").length;
                        i++
                    ) {
                        if (!$("#cart_checked_" + i).prop("checked")) {
                            console.log("no check: " + i);
                            flag = false;
                            break;
                        }
                    }
                    $("#cart_check_all").prop("checked", flag);
                    checkout_total(cart_data);
                });

                $("#cart_buy").click(function () {
                    for (let i = 0; i < data.length; i++) {
                        let check = $("#cart_checked_" + i).prop("checked");
                        if (check) {
                            console.log(i);
                            // let amount = $("#cart_amount_" + i).val();
                            // let price = data[i].price;
                            // total_price += amount * price;
                            // total_amount += 1;
                        }
                        console.log(total_price);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        },
    });
});

function test(test) {
    console.log(test);
}

// 購買總金額變動
function checkout_total(data) {
    let total_price = 0;
    let total_amount = 0;
    for (let i = 0; i < data.length; i++) {
        let check = $("#cart_checked_" + i).prop("checked");
        if (check) {
            let amount = $("#cart_amount_" + i).val();
            let price = data[i].price;
            total_price += amount * price;
            total_amount += 1;
        }
    }

    $("#checkout_total").text("$" + total_price);
}

class CartItem {
    ID = "";
    Data = {
        img: "",
        title: "",
        price: "",
    };
    constructor(id, data) {
        this.ID = id;
        this.Data = data;
        this.Box = this.product();
        this.CheckBox = this.checkbox();
        this.Product_detail = this.product_detail();
        this.Product_detail_img = this.product_detail_img();
        this.Product_detail_title = this.product_detail_title();
        this.Price = this.price();
        this.Amount_box = this.amount_box();
    }

    get cartData() {
        this.Delete_btn = this.delete_btn();
        this.Price_total = this.price_total();

        this.Amount_box.appendChild(this.amount_btn("dec"));
        this.Amount_box.appendChild(this.amount_input());
        this.Amount_box.appendChild(this.amount_btn("inc"));

        this.Product_detail.appendChild(this.Product_detail_img);
        this.Product_detail.appendChild(this.Product_detail_title);

        this.Box.appendChild(this.CheckBox);
        this.Box.appendChild(this.Product_detail);
        this.Box.appendChild(this.Price);
        this.Box.appendChild(this.Amount_box);
        this.Box.appendChild(this.Price_total);
        this.Box.appendChild(this.Delete_btn);
        return this.Box;
    }

    product() {
        let box = document.createElement("div");
        box.setAttribute("class", "product");
        return box;
    }

    checkbox() {
        let box = document.createElement("input");
        box.setAttribute("class", "product-check");
        box.setAttribute("type", "checkbox");
        box.setAttribute("id", "cart_checked_" + this.ID);
        box.setAttribute("name", "cart_checkbox");
        return box;
    }

    product_detail() {
        let box = document.createElement("div");
        box.setAttribute("class", "product-detail product-box");
        return box;
    }

    product_detail_img() {
        let box = document.createElement("img");
        box.setAttribute("src", this.Data.img);
        box.setAttribute("alt", "no");
        return box;
    }

    product_detail_title() {
        let box = document.createElement("h1");
        box.innerHTML = this.Data.title;
        return box;
    }

    price() {
        let box = document.createElement("h1");
        box.setAttribute("class", "product-price");
        box.setAttribute("id", "cart_price_" + this.ID);
        box.innerHTML = "$" + this.Data.price;
        return box;
    }

    amount_box() {
        let box = document.createElement("div");
        box.setAttribute("class", "product-amount-box");
        return box;
    }

    amount_btn(type) {
        let className = "amount_inc";
        let id = "cart_inc_" + this.ID;
        let text = "+";

        if (type == "dec") {
            className = "amount_dec";
            id = "cart_dec_" + this.ID;
            text = "-";
        }

        let box = document.createElement("button");
        box.setAttribute("class", className);
        box.setAttribute("id", id);
        box.innerHTML = text;
        return box;
    }

    amount_input() {
        let box = document.createElement("input");
        box.setAttribute("class", "product_amount");
        box.setAttribute("type", "text");
        box.setAttribute("id", "cart_amount_" + this.ID);
        box.setAttribute("value", "1");
        box.setAttribute("oninput", "value=value.replace(/[^d]/g,'')");
        return box;
    }

    price_total() {
        let box = document.createElement("h1");
        box.setAttribute("class", "product-total");
        box.setAttribute("id", "cart_list_total_" + this.ID);
        box.innerHTML = "$" + this.Data.price;
        return box;
    }

    delete_btn() {
        let box = document.createElement("p");
        box.setAttribute("class", "product-operation");
        box.setAttribute("id", "cart_delete_" + this.ID);
        box.innerHTML = "刪除";
        return box;
    }
}
