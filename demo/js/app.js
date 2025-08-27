const componentPath = window.location.pathname.includes('/src/pages/') ? '../components/' : 'components/';

async function loadComponent(name, selector) {
  const res = await fetch(`${componentPath}${name}.html`);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll('#cart-count').forEach(el => (el.textContent = count));
}

function renderCart() {
  const items = getCart();
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  container.innerHTML = items
    .map(
      (item, idx) => `<li class="flex justify-between border-b py-2">
        <span>${item.name}</span>
        <span>$${item.price.toFixed(2)}</span>
        <button class="text-red-600" data-index="${idx}">Remove</button>
      </li>`
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', '#header').then(updateCartCount);
  loadComponent('footer', '#footer');
  document.getElementById('add-to-cart')?.addEventListener('click', () => {
    addToCart({ id: 1, name: 'Sample Product', price: 19.99 });
  });
  renderCart();
  document.getElementById('cart-items')?.addEventListener('click', e => {
    if (e.target.matches('button[data-index]')) {
      const cart = getCart();
      cart.splice(e.target.dataset.index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    }
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
