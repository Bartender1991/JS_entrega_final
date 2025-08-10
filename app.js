const LS_KEYS = { PRODUCTS: 'simu_products', CART: 'simu_cart' };

function formatMoney(num) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);
}

function showToast(msg, time = 2500) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.querySelector('.toast-body').textContent = msg;
  const toast = new bootstrap.Toast(t, { delay: time });
  toast.show();
}

class Cart {
  constructor(items = {}) {
    this.items = items;
  }
  add(productId, qty = 1) {
    this.items[productId] = (this.items[productId] || 0) + qty;
    if (this.items[productId] <= 0) delete this.items[productId];
    this.save();
  }
  remove(productId) {
    delete this.items[productId];
    this.save();
  }
  clear() {
    this.items = {};
    this.save();
  }
  totalItems() {
    return Object.values(this.items).reduce((a, b) => a + b, 0);
  }
  totalPrice(products) {
    return Object.entries(this.items).reduce((sum, [id, qty]) => {
      const prod = products.find(p => p.id === Number(id));
      return prod ? sum + prod.price * qty : sum;
    }, 0);
  }
  save() {
    localStorage.setItem(LS_KEYS.CART, JSON.stringify(this.items));
    updateCartCountUI();
  }
}

let PRODUCTS = [];
let cart = new Cart(JSON.parse(localStorage.getItem(LS_KEYS.CART)) || {});

const categoryFilter = document.getElementById('categoryFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const searchInput = document.getElementById('search');
const productsSection = document.getElementById('products');
const openCartBtn = document.getElementById('open-cart');
const cartModalEl = document.getElementById('cart-modal');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');
const cartCount = document.getElementById('cart-count');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const toggleDarkBtn = document.getElementById('toggle-dark');
const openHistoryBtn = document.getElementById('open-history');
const historyModalEl = document.getElementById('history-modal');
const historyContent = document.getElementById('history-content');

function cargarCategorias() {
  if (!categoryFilter) return;
  const categorias = [...new Set(PRODUCTS.map(p => p.category))];
  categoryFilter.innerHTML = `<option value="all">Todas las categorías</option>` +
    categorias.map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('');
}

function renderProducts(list = PRODUCTS) {
  if (!productsSection) return;
  if (!list.length) {
    productsSection.innerHTML = `<div class="col-12"><p class="text-center text-muted">No hay productos para mostrar.</p></div>`;
    return;
  }
  productsSection.innerHTML = list.map(prod => `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="${prod.img}" class="card-img-top" alt="${prod.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.title}</h5>
          <p class="card-text text-muted mb-1">${prod.description}</p>
          <span class="badge bg-secondary mb-2">${prod.category.charAt(0).toUpperCase() + prod.category.slice(1)}</span>
          <span class="badge bg-info mb-2">Stock: ${prod.stock}</span>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="fw-bold">${formatMoney(prod.price)}</span>
            <button class="btn btn-primary btn-sm add-to-cart" data-id="${prod.id}" ${prod.stock === 0 ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  productsSection.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(btn.getAttribute('data-id'));
      const prod = PRODUCTS.find(p => p.id === id);
      const qtyInCart = cart.items[id] || 0;
      if (prod && qtyInCart < prod.stock) {
        cart.add(id, 1);
        Toastify({
          text: 'Producto agregado al carrito con éxito',
          duration: 2500,
          gravity: 'bottom',
          position: 'right',
          style: {
            background: '#28a745',
            color: '#fff',
            borderRadius: '5px',
            padding: '10px'
          }
        }).showToast();
        updateCartCountUI();
      } else {
        Toastify({
          text: 'No hay suficiente stock disponible',
          duration: 2500,
          gravity: 'bottom',
          position: 'right',
          style: {
            background: '#dc3545',
            color: '#fff',
            borderRadius: '5px',
            padding: '10px'
          }
        }).showToast();
      }
      renderProducts(); 
    });
  });
}

function filtrarYRenderizar() {
  const term = searchInput.value.toLowerCase();
  const categoria = categoryFilter.value;
  const filtrados = PRODUCTS.filter(p => {
    const coincideCategoria = categoria === "all" || p.category === categoria;
    const coincideTexto =
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);
    return coincideCategoria && coincideTexto;
  });
  renderProducts(filtrados);
}

function renderCartModal() {
  if (!cartItemsDiv) return;
  const items = Object.entries(cart.items);
  if (!items.length) {
    cartItemsDiv.innerHTML = `<p class="text-center text-muted">El carrito está vacío.</p>`;
    cartTotal.textContent = formatMoney(0);
    return;
  }
  cartItemsDiv.innerHTML = items.map(([id, qty]) => {
    const prod = PRODUCTS.find(p => p.id === Number(id));
    if (!prod) return '';
    const maxReached = qty >= prod.stock;
    return `
      <div class="d-flex align-items-center border-bottom py-2">
        <img src="${prod.img}" alt="${prod.title}" width="60" class="me-2 rounded">
        <div class="flex-grow-1">
          <strong>${prod.title}</strong>
          <div class="small text-muted">${formatMoney(prod.price)} x ${qty} = <b>${formatMoney(prod.price * qty)}</b></div>
          <div class="small text-info mb-1">Stock disponible: ${prod.stock - qty}</div>
          <div class="btn-group btn-group-sm mt-1" role="group">
            <button class="btn btn-outline-primary cart-add" data-id="${prod.id}" ${maxReached ? 'disabled' : ''} title="${maxReached ? 'Sin stock disponible' : 'Agregar uno más'}"><i class="bi bi-plus"></i></button>
            <button class="btn btn-outline-primary cart-sub" data-id="${prod.id}"><i class="bi bi-dash"></i></button>
            <button class="btn btn-outline-danger cart-remove" data-id="${prod.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  cartTotal.textContent = formatMoney(cart.totalPrice(PRODUCTS));

  cartItemsDiv.querySelectorAll('.cart-add').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(btn.getAttribute('data-id'));
      const prod = PRODUCTS.find(p => p.id === id);
      const qtyInCart = cart.items[id] || 0;
      if (prod && qtyInCart < prod.stock) {
        cart.add(id, 1);
        renderCartModal();
      } else {
        Toastify({
          text: 'No hay suficiente stock disponible',
          duration: 2500,
          gravity: 'bottom',
          position: 'right',
          style: {
            background: '#dc3545',
            color: '#fff',
            borderRadius: '5px',
            padding: '10px'
          }
        }).showToast();
      }
    });
  });
  cartItemsDiv.querySelectorAll('.cart-sub').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(btn.getAttribute('data-id'));
      cart.add(id, -1);
      renderCartModal();
    });
  });
  cartItemsDiv.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(btn.getAttribute('data-id'));
      cart.remove(id);
      renderCartModal();
    });
  });
}

function updateCartCountUI() {
  if (cartCount) cartCount.textContent = cart.totalItems();
}

if (categoryFilter) categoryFilter.addEventListener('change', filtrarYRenderizar);
if (searchInput) searchInput.addEventListener('input', filtrarYRenderizar);
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    filtrarYRenderizar();
  });
}

let cartModalInstance = null;
if (cartModalEl) {
  cartModalInstance = bootstrap.Modal.getOrCreateInstance(cartModalEl);

  if (openCartBtn) {
    openCartBtn.addEventListener('click', () => {
      renderCartModal();
      cartModalInstance.show();
    });
  } 
}

const LS_HISTORY = 'simu_history';

function savePurchaseToHistory(cartItems, products) {
  const history = JSON.parse(localStorage.getItem(LS_HISTORY)) || [];
  const compra = {
    fecha: new Date().toLocaleString(),
    items: Object.entries(cartItems).map(([id, qty]) => {
      const prod = products.find(p => p.id === Number(id));
      return prod ? {
        id: prod.id,
        title: prod.title,
        img: prod.img,
        price: prod.price,
        qty: qty,
        total: prod.price * qty
      } : null;
    }).filter(Boolean)
  };
  history.push(compra);
  localStorage.setItem(LS_HISTORY, JSON.stringify(history));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem(LS_HISTORY)) || [];
  if (!history.length) {
    historyContent.innerHTML = `<p class="text-center text-muted">No hay compras registradas.</p>`;
    return;
  }
  historyContent.innerHTML = history.map((compra, idx) => `
    <div class="mb-4">
      <h5 class="mb-2">Compra #${idx + 1} <span class="text-secondary small">(${compra.fecha})</span></h5>
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Foto</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Valor unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${compra.items.map(item => `
              <tr>
                <td><img src="${item.img}" alt="${item.title}" width="60"></td>
                <td>${item.title}</td>
                <td>${item.qty}</td>
                <td>${formatMoney(item.price)}</td>
                <td>${formatMoney(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-end fw-bold">Total compra:</td>
              <td class="fw-bold">${formatMoney(compra.items.reduce((a, b) => a + b.total, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `).join('');
}

let historyModalInstance = null;
if (historyModalEl) {
  historyModalInstance = bootstrap.Modal.getOrCreateInstance(historyModalEl);
  if (openHistoryBtn) {
    openHistoryBtn.addEventListener('click', () => {
      renderHistory();
      historyModalInstance.show();
    });
  }
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const total = cart.totalPrice(PRODUCTS);
    if (total === 0) {
      Swal.fire('Carrito vacío', 'Agrega productos al carrito antes de proceder al pago.', 'info');
      renderCartModal();
      if (cartModalInstance) cartModalInstance.hide();
      return;
    }
    let sinStock = false;
    for (const [id, qty] of Object.entries(cart.items)) {
      const prod = PRODUCTS.find(p => p.id === Number(id));
      if (!prod || qty > prod.stock) {
        sinStock = true;
        break;
      }
    }
    if (sinStock) {
      Swal.fire('Sin stock', 'Uno o más productos no tienen suficiente stock.', 'error');
      return;
    }
    Swal.fire({
      title: 'Confirmar compra',
      text: `El total es ${formatMoney(total)}. ¿Deseas proceder al pago?`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sí, pagar',
    })
      .then((result) => {
        if (result.isConfirmed) {
          for (const [id, qty] of Object.entries(cart.items)) {
            const prod = PRODUCTS.find(p => p.id === Number(id));
            if (prod) prod.stock -= qty;
          }
          localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
          savePurchaseToHistory(cart.items, PRODUCTS);
          Swal.fire('¡Gracias por tu compra!', 'Tu pedido ha sido procesado.', 'success');
          cart.clear();
          renderCartModal();
          renderProducts(); 
          if (cartModalInstance) {
            if (openCartBtn) openCartBtn.focus();
            cartModalInstance.hide();
          }
          updateCartCountUI();
        }
      });
  });
}

function loadInitialData() {
  const local = localStorage.getItem(LS_KEYS.PRODUCTS);
  if (local) {
    PRODUCTS = JSON.parse(local);
    cargarCategorias();
    renderProducts();
    filtrarYRenderizar();
    updateCartCountUI();
  } else {
    fetch('data/products.json')
      .then(response => response.json())
      .then(data => {
        PRODUCTS = data.map((p, i) => ({
          id: i + 1,
          title: p.title || `Producto ${i + 1}`,
          description: p.description,
          category: p.category || 'General',
          price: p.price || 1000,
          stock: p.stock !== undefined ? p.stock : 10,
          img: p.img || 'https://via.placeholder.com/300x200?text=Producto'
        }));
        localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
        cargarCategorias();
        renderProducts();
        filtrarYRenderizar();
        updateCartCountUI();
      })
      .catch(err => {
        productsSection.innerHTML = `<div class="col-12"><p class="text-danger">Error al cargar productos.</p></div>`;
      });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadInitialData();
  updateCartCountUI();
  toggleDarkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? '1' : '0');
  });
  
  if (localStorage.getItem('darkMode') === '1') {
    document.body.classList.add('dark-mode');
  }
});

if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    if (cart.totalItems() === 0) {
      Swal.fire('Carrito vacío', 'No hay productos para eliminar.', 'info');
      return;
    }
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: '¿Estás seguro de que deseas eliminar todos los productos del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        cart.clear();
        renderCartModal();
        updateCartCountUI();
        Swal.fire('Carrito vaciado', '', 'success');
      }
    });
  });
}
