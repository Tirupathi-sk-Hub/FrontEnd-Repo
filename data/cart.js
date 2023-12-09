export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
    cart = [{
    productId : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity : 2,
    deliveryOptionId: "1"
}, {
    productId : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity : 1,
    deliveryOptionId: "2"
}];
}

export function addToCart(productId, quantity) {
    let matchingproduct;

        cart.forEach((product) => {
            if(productId === product.productId) {
                matchingproduct = product;
            }
        })

        if(matchingproduct) {
            matchingproduct.quantity++;
        }   else {
            cart.push({
                productId : productId,
                quantity : quantity,
                deliveryOptionId: "1"
            });
        }
        saveToStroage();
}

export function updateCartQuantity() {
    let cartQuantity = 0;

        cart.forEach((item) => {
            cartQuantity += item.quantity;
        })
        saveToStroage();
        return cartQuantity;
}

export function removeFromCart(productId) {
    const newCart = [];
        cart.forEach((cartItem) => {
            if(cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        })
        cart = newCart;
        saveToStroage();
}

export function saveToStroage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingProduct;

    cart.forEach((product) => {
        if (productId === product.productId) {
            matchingProduct = product;
        }
    });

    matchingProduct.deliveryOptionId = deliveryOptionId;

    saveToStroage();
}