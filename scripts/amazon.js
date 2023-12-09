import {cart, saveToStroage, addToCart, updateCartQuantity} from "../data/cart.js";
import { products } from "../data/products.js";

let productsHtml = '';

products.forEach((item) => {
    // console.log(item);

    productsHtml += `
    <div class="product-container">
        <div class="product-image-container">
        <img class="product-image"
            src="${item.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
        ${item.name}
        </div>

        <div class="product-rating-container">
        <img class="product-rating-stars"
            src="images/ratings/rating-${item.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
            ${item.rating.count}
        </div>
        </div>

        <div class="product-price">
        $${(item.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-quantity-container">
        <select class="js-selected-value-${item.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${item.id}">
        <img src="images/icons/checkmark.png">
        Added
        </div>

        <button class="add-to-cart-button button-primary 
        js-add-to-cart" data-product-id="${item.id}">
        Add to Cart
        </button>
    </div>
    `;
});

document.querySelector('.js-products-grid').innerHTML = productsHtml;

document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity();

document.querySelectorAll('.js-add-to-cart')
.forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        const quantityNum = document.querySelector(`.js-selected-value-${productId}`).value;
        const quantity = Number(quantityNum);

        const addMessage = document.querySelector(`.js-added-to-cart-${productId}`);
        addMessage.classList.add('added');

        setTimeout(() => {
            addMessage.classList.remove('added');
        }, 2000);

        addToCart(productId, quantity);

        document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity();
    });
});
