class Good {
    constructor(name, price, count) {
        this.name = name;
        this.price = price;
        this.count = count;
    }
};

function outputSimple() {
    let current = 2;
    let end = 100;
    while (current <= end) {
        let divisor = 2;
        let isSimple = true;
        while (divisor < current) {
            if (current % divisor == 0) {
                isSimple = false;
                break;
            }
            divisor++;
        }
        if (isSimple) {
            console.log(current);
        }
        current++;
    }
}

function outputBasket() {
    let goods = [];
    goods.push(new Good('Milk', 68, 2));
    goods.push(new Good('Bread', 30, 1));
    goods.push(new Good('Apple', 150, 3));
    console.log(goods);
    console.log('Basket price: ' + countBasketPrice(goods));
}

function countBasketPrice(goods) {
    let sum = 0;
    for (let i = 0; i < goods.length; i++) {
        sum += goods[i].price * goods[i].count;
    }
    return sum;
}

function outputFor() {
    for(let i = 0; i < 10; console.log(i++)){}
}




function GetRandom(min, max) {
    let rnd = Math.round(Math.random() * (max - min) + min);
    return rnd;
}

function outputPyramid(countBase)
{
    let ouput = '';
    for(let i = 1; i <= countBase; i++)
        {
            ouput += '*';
            console.log(ouput);
        }
}



var a = GetRandom(-15, 15);
var b = GetRandom(-15, 15);
