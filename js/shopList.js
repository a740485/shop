class ShopListBox{

    Data = {
        "url":"",
        "img":"",
        "title":"",
        "price":"",
        "amount":""
    }

    constructor(data){
        this.Data = data;
        this.Box = this.box();
        this.Img = this.img();
        this.Detial = this.detial();
        this.Title = this.title();
        this.Info = this.info();
        this.Price = this.price();
        this.Amount = this.amount();
    }

    box(){
        let box = document.createElement('a');
        box.setAttribute('class', 'shop-box');
        box.setAttribute('href', this.Data.url);
        return box;
    }

    img(){
        let box = document.createElement('img');
        box.setAttribute('src', this.Data.img)
        return box;
    }

    detial(){
        let box = document.createElement('div');
        box.setAttribute('class', 'detail');
        return box;
    }

    title(){
        let box = document.createElement('div');
        box.setAttribute('class', 'title');
        box.innerHTML = this.Data.title;
        return box
    }

    info(){
        let box = document.createElement('div');
        box.setAttribute('class', 'info');
        return box;
    }

    price(){
        let box = document.createElement('p');
        box.innerHTML = "$"+this.Data.price;
        return box;
    }

    amount(){
        let box = document.createElement('p');
        box.innerHTML = "已售出"+this.Data.amount;
        return box
    }

    get shopbox(){
        this.Info.appendChild(this.Price);
        this.Info.appendChild(this.Amount);

        this.Detial.appendChild(this.Title);
        this.Detial.appendChild(this.Info);

        this.Box.appendChild(this.Img);
        this.Box.appendChild(this.Detial);
        return this.Box;
    }

}


data = {
    url:"#product",
    img:"https://picsum.photos/188/188/?random=1",
    title:"清新宣言 醫用口罩 醫療口罩 粉紫 50片/盒  現貨",
    price:"400",
    amount:"150"
}

$(document).ready(function () {
    console.log("shop.js ready")

    $.ajax({
        url: "http://localhost/shopBackend/route.php/product/all",
        success: function (response) {
            try {
                if(response.Status != 200){
                    throw "not 200";
                }
                for(item in response.Result){

                    let data = {
                        "url":response.Result[item].url,
                        "img":response.Result[item].img,
                        "title":response.Result[item].title,
                        "price":response.Result[item].price,
                        "amount":response.Result[item].amount
                    }

                    var shop = new ShopListBox(data);

                    $('.shopList .wrap').append(shop.shopbox)
                }
            } catch (error) {
                console.log(error);
            }
        }
    });

    // let shop = new ShopListBox(data);
    // console.log(shop.shopbox);

    // $('.shopList .wrap').append(shop.shopbox)
});


