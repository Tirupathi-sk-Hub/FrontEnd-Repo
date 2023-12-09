import {cart, removeFromCart, saveToStroage, updateCartQuantity, updateDeliveryOption} from "../../data/cart.js";
import { products } from "../../data/products.js";
import {hello} from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions, getDeliveryoption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";


export function renderOrderSummary() {
  let cartItemHTML = '';

  //Display cart-items on checkoutPage:
  cart.forEach((Item) => {
      const productId = Item.productId;

      const matchingProduct = getProduct(productId);

      const deliveryOptionId = Item.deliveryOptionId;

      const deliveryOption = getDeliveryoption(deliveryOptionId);

      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');


      cartItemHTML += `
      <div class="cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${(matchingProduct.priceCents / 100).toFixed(2)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${Item.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary
            js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>

            <input class="quantity-input js-quantity-input
            js-quantity-input-${matchingProduct.id}"
            data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary
            js-save-link" data-product-id="${matchingProduct.id}">Save</span>

            <span class="delete-quantity-link link-primary
            js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
            ${deliveryOptionsHTML(matchingProduct, Item)}

        </div>
      </div>
    </div>
      `;
  });

  function deliveryOptionsHTML (matchingProduct, Item) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${((deliveryOption.priceCents / 100).toFixed(2))} -` ;

      const isChecked = deliveryOption.id === Item.deliveryOptionId ;

      html += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `
    });
    return html;
  }

  document.querySelector('.js-return-to-home-link').innerHTML = updateCartQuantity() +' items';

  document.querySelector('.js-order-summary').innerHTML = cartItemHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
      link.addEventListener('click', () => {
          const productId = link.dataset.productId;

          removeFromCart(productId);

          // const container = document.querySelector(`.js-cart-item-container-${productId}`);
          // container.remove();
          renderOrderSummary();

          renderPaymentSummary();

          document.querySelector('.js-return-to-home-link').innerHTML = updateCartQuantity() + ' items';
      });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');

    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const inputElem = document.querySelector(`.js-quantity-input-${productId}`).value;

      const inputNum = Number(inputElem);

      cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          cartItem.quantity = inputNum;
        }
      });
      saveToStroage();

      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      quantityLabel.innerHTML = inputNum;

      //To disappear input & save elements using CSS:
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

      document.querySelector('.js-return-to-home-link').innerHTML = updateCartQuantity() + ' items';
    });
  });


    document.querySelectorAll('.js-quantity-input').forEach((link) => {
      link.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {

          const productId = link.dataset.productId;
          
          const inputElem = document.querySelector(`.js-quantity-input-${productId}`).value;

          const inputNum = Number(inputElem);

          cart.forEach((cartItem) => {
            if (productId === cartItem.productId) {
              cartItem.quantity = inputNum;
            }
          });
          saveToStroage();

          const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
          quantityLabel.innerHTML = inputNum;

          //To disappear input & save elements using CSS:
          const container = document.querySelector(`.js-cart-item-container-${productId}`);
          container.classList.remove('is-editing-quantity');

          document.querySelector('.js-return-to-home-link').innerHTML = updateCartQuantity() + ' items';
        }
      });
    })


    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        //Update deliveryOption-Id of the product in the cart:
        updateDeliveryOption(productId, deliveryOptionId);

        renderOrderSummary();
        renderPaymentSummary();
      })
    });
}