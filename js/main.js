const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList {
    constructor(cart, container = '.products'){
        this.cart = cart;
        this.data = [];
        this.container = container;
        this.productsAll = [];
        this._getProducts()
            .then(() => {
                this._render()
            });
        this._init();
    }
    _init() {
        $(this.container).on('click', '.buy-btn', evt =>
        {
            let id = evt.target.dataset['id'];
            let productItem = this._getProduct(id);
            this.cart.addItem(productItem);
        })
    }
    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .then(data => {
                this.data = [...data];
            })
            .catch(error => console.log(error));
    }
    _getProduct(id){
        return this.productsAll.find(x => x.id_product == id);
    }
    _render(){
        let $container = $(this.container);
        for (let product of this.data){
            const prod = new ProductItem(product);
            this.productsAll.push(prod);
            $container.append(prod.render());
        }
    }
}


class ProductItem {
    constructor(product, img = `https://placehold.it/200x150`) {
        this.product_name = product.product_name;
        this.price = product.price;
        this.id_product = product.id_product;
        this.img = img
    }
    render(){
        return `<div class="product-item">
                  <img src="${this.img}" alt="${this.product_name}">
                  <div class="desc">
                      <h3>${this.product_name}</h3>
                      <p>${this.price} руб</p>
                      <button class="buy-btn" data-id="${this.id_product}"}>Купить</button>
                  </div>
              </div>`
    }
}

class Cart {
    constructor(container = '.div-cart', cartButton = '.btn-cart'){
        this.container = container;
        this.cartButton = cartButton;
        this.items = [];
        this._init();
    }

    _init(){
        $(this.container).append(this._renderInit());
        $(this.container).on('click', '.btn-clear', () => this._clear());
        $(this.cartButton).click(() => $(this.container).toggle());
        $(this.container).on('click', '.btn-plus', (evt) => {
            let id = evt.target.dataset['id'];
            this._plusItem(id);
        });
        $(this.container).on('click', '.btn-minus', (evt) => {
            let id = evt.target.dataset['id'];
            this._minusItem(id);
        });
    }
    _getTotalCost(){
        return this.items.reduce((accum, item) => accum += item.price * item.count, 0);
    }
    addItem(productItem) {
        let item = this.items.find(x => x.id_product === productItem.id_product);
        if (item == undefined){
            item = new CartItem(productItem);
            item.count = 1;
            this.items.push(item);
            $('.cart-items').append(item.render());
        }
        else{
            item.count++;
            item.update();
        }
        this._updateTotal();
    }
    _plusItem(id_product){
        let item = this.items.find(x => x.id_product == id_product);
        item.count++;
        item.update();
        this._updateTotal();
    }
    _minusItem(id_product){
        let item = this.items.find(x => x.id_product == id_product);
        item.count--;
        if (item.count > 0){
            item.update();
        }
        else{
            item.delete();
            let index = this.items.indexOf(item);
            this.items.splice(index, 1);
        }
        this._updateTotal();
    }
    _renderInit() {
        return `<div class="cart-items"></div>
                <span class="cart-total">Итого:${this._getTotalCost()}</span>
               <button class="btn-cart btn-clear">Очистить</button>`;
    }
    _updateTotal(){
        $('.cart-total').text(`Итого:${this._getTotalCost()}`);
    }
    _clear(){
        this.items = [];
        $('.cart-items').empty();
        this._updateTotal();
    }
}

class CartItem {
    constructor(item){
        this.id_product = item.id_product;
        this.product_name = item.product_name;
        this.count = 0;
        this.price = item.price;
    }
    update(){
        let block = $(`.cart-item[data-id="${this.id_product}"]`);
        block.find('.cart-item-count-span').text(this.count);
        block.find('.cart-item-cost').text(this.count * this.price);
    }
    delete(){
        let block = $(`.cart-item[data-id="${this.id_product}"]`);
        block.remove();
    }
    render(){
        return `<div class="cart-item" data-id="${this.id_product}">
                    <div class="cart-item-title">${this.product_name}</div>
                    <div class="cart-item-count">
                        <button class="btn-change-count btn-minus" data-id="${this.id_product}">-</button>
                        <span class="cart-item-count-span">${this.count}</span>
                        <button class="btn-change-count btn-plus" data-id="${this.id_product}">+</button>
                    </div>
                    <div class="cart-item-cost">${this.count * this.price}</div>
                </div>`;
    }
}


const cart = new Cart();
const products = new ProductsList(cart);
