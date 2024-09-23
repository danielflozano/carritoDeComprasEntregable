const url = 'https://fakestoreapi.com/products';
const containerCards = document.querySelector('.container-cards');
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const contadorProductos = document.querySelector('#contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const rowProduct = document.querySelector('.row-product');


let allProducts = [];
let total = 0;
let countProducts = 0;


btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});


const createCard = (product) => {
    const { id, title, price, description, category, image } = product;

    const card = document.createElement('div');
    card.classList.add('card');
    card.id = id;

    const productName = document.createElement('h2');
    productName.classList.add('product-name');
    productName.textContent = title;

    const priceProduct = document.createElement('h3');
    priceProduct.classList.add('price');
    priceProduct.textContent = `Precio: $${price}`;

    const descriptionProduct = document.createElement('p');
    descriptionProduct.classList.add('description');
    descriptionProduct.textContent = description;

    const categoryProduct = document.createElement('p');
    categoryProduct.classList.add('category');
    categoryProduct.textContent = category;

    const imgCard = document.createElement('img');
    imgCard.classList.add('img-card');
    imgCard.src = image;
    imgCard.alt = title;

    const btnCard = document.createElement('button');
    btnCard.classList.add('btn-card');
    btnCard.innerText = 'Comprar';

    // Evento para agregar al carrito
    btnCard.addEventListener('click', () => addToCart(product));

    card.appendChild(productName);
    card.appendChild(imgCard);
    card.appendChild(priceProduct);
    card.appendChild(descriptionProduct);
    card.appendChild(categoryProduct);
    card.appendChild(btnCard);

    containerCards.appendChild(card);
};


const getProducts = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    renderCards(data);
};


const renderCards = (products) => {
    containerCards.innerHTML = '';
    products.forEach(product => {
        createCard(product);
    });
};


const addToCart = (product) => {
    const exists = allProducts.some(prod => prod.id === product.id);

    if (exists) {
        allProducts = allProducts.map(prod => {
            if (prod.id === product.id) {
                prod.quantity++;
                prod.priceTotal = prod.price * prod.quantity;
            }
            return prod;
        });
    } else {
        allProducts.push({
            ...product,
            quantity: 1,
            priceTotal: product.price
        });
    }

    countProducts++;
    total += product.price;

    renderCart();
};


const renderCart = () => {
    rowProduct.innerHTML = '';

    allProducts.forEach(product => {
        const cartProduct = document.createElement('div');
        cartProduct.classList.add('cart-product');

        const infoCartProduct = document.createElement('div');
        infoCartProduct.classList.add('info-cart-product');

        const quantity = document.createElement('span');
        quantity.classList.add('cantidad-producto-carrito');
        quantity.textContent = product.quantity;

        const title = document.createElement('p');
        title.classList.add('titulo-producto-carrito');
        title.textContent = product.title;

        const price = document.createElement('span');
        price.classList.add('precio-producto-carrito');
        price.textContent = `$${product.priceTotal.toFixed(2)}`;

        infoCartProduct.appendChild(quantity);
        infoCartProduct.appendChild(title);
        infoCartProduct.appendChild(price);

        const iconClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconClose.setAttribute("fill", "none");
        iconClose.setAttribute("viewBox", "0 0 24 24");
        iconClose.setAttribute("stroke-width", "1.5");
        iconClose.setAttribute("stroke", "currentColor");
        iconClose.classList.add('icon-close');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('d', 'M6 18L18 6M6 6l12 12');


        
        iconClose.addEventListener('click', () => removeProduct(product.id));

        cartProduct.appendChild(infoCartProduct);
        cartProduct.appendChild(iconClose);
        iconClose.appendChild(path);

        rowProduct.appendChild(cartProduct);
    });

    contadorProductos.textContent = countProducts;
    totalPagar.textContent = `$${total.toFixed(2)}`;
};


const removeProduct = (id) => {
    const product = allProducts.find(prod => prod.id === id);

    if (product) {
        total -= product.priceTotal;
        countProducts -= product.quantity;

        allProducts = allProducts.filter(prod => prod.id !== id);

        renderCart();
    }
};


window.addEventListener('DOMContentLoaded', () => getProducts(url));
