const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === 4){
//             if(xhr.status !== 200){
//                 console.log('error')
//             } else {
//                 cb(xhr.responseText)
//             }
//         }
//     }
// };
//
// let getRequestPromise = url =>{
//     return new Promise((resolve, reject) =>{
//         let xhr = new XMLHttpRequest();
//         xhr.open('GET', url, true);
//         xhr.onreadystatechange = () => {
//             if(xhr.readyState === 4){
//                 if(xhr.status !== 200){
//                     reject(console.log('error'));
//                 } else {
//                     resolve(xhr.responseText);
//                 }
//             }
//         }
//         xhr.send();
//     })
// }
// getRequestPromise(`${API}/catalogData.json`).
//     then(data => console.log(data));


class ProductsList {
    constructor(container = '.products'){
        this.data = [];
        this.container = container;
        this.productsAll = [];
        this._getProducts()
            .then(() => {
                this._render()
            });
    }
    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .then(data => {
                this.data = [...data];
            })
            .catch(error => console.log(error));
    }
    calcSum(){
        return this.productsAll.reduce((accum, item) => accum += item.price, 0);
    }
    _render(){
        const block = document.querySelector(this.container);
        for (let product of this.data){
            const prod = new ProductItem(product);
            this.productsAll.push(prod);
            block.insertAdjacentHTML('beforeend', prod.render());
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
                      <button class="buy-btn" value="${this.product_name}" onclick="addItem(this)" data-price=${this.price}>Купить</button>
                  </div>
              </div>`
    }
}

class Cart {
    constructor(){
        this.items = [];
    }
    getTotalCost(){
        return this.items.reduce((accum, item) => accum += item.price * item.count, 0);
    }
    removeItem(product_name){
        let item = this.items.find(x => x.product_name === product_name);
        if (item != undefined){
            item.count--;
            if (item.count === 0) {
                let index = this.items.indexOf(item);
                this.items.splice(index, 1);
            }
            this._render();
        }
    }
    addItem(product_name, price) {
        let item = this.items.find(x => x.product_name === product_name);
        if (item == undefined){
            item = new CartItem();
            item.product_name = product_name;
            item.price = price;
            item.count = 1;
            this.items.push(item);
        }
        else{
            item.count++;
        }
        this._render();
    }
    _render(){
        let div = document.querySelector('.div-cart');
        div.innerHTML = this.items.map(x => x.render()).join('')
            + this._renderTotal()
            + this._renderClearButton();
    }
    _renderTotal(){
        return `<span class="cart-total">
                    Итого: ${this.getTotalCost()}
                </span>`;
    }
    _renderClearButton(){
        return `<button class="btn-cart btn-clear" onclick="clearCart()">Очистить</button>`
    }
    clear(){
        this.items = [];
        this._render();
    }
}

class CartItem {
    constructor(){
        this.product_name = '';
        this.count = 0;
        this.price = 0;
    }
    render(){
        return `<div class="cart-item">
                    <div class="cart-item-title">${this.product_name}</div>
                    <div class="cart-item-count">
                        <button class="btn-change-count" onclick="removeItem('${this.product_name}')">-</button>
                        ${this.count}
                        <button class="btn-change-count" value="${this.product_name}" onclick="addItem(this)">+</button>
                    </div>
                    <div class="cart-item-cost">${this.count * this.price}</div>
                </div>`;
    }
}

const products = new ProductsList();
const cart = new Cart();

function addItem(element) {
    cart.addItem(element.value,  +element.dataset['price']);
}

function removeItem(product_name) {
    cart.removeItem(product_name);
}

function clearCart() {
    cart.clear();
}

function changeCartVisible() {
    let div = document.querySelector('.div-cart');
    if (div.style.display === 'none' || div.style.display == ''){
        div.style.display = 'inline-block';
    }
    else{
        div.style.display = 'none';
    }
}