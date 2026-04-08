// ===== NÚMERO DO WHATSAPP (altere aqui) =====
const WHATSAPP_NUMBER = '5583994155465';

// ===== ESTADO DO CARRINHO =====
let cart = [];

// ===== ADICIONAR AO CARRINHO =====
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  openCart();
}

// ===== ALTERAR QUANTIDADE =====
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.name !== name);
  }
  updateCartUI();
}

// ===== LIMPAR CARRINHO =====
function limparCarrinho() {
  cart = [];
  updateCartUI();
}

// ===== ATUALIZAR UI DO CARRINHO =====
function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = totalItems;
  document.getElementById('cartTotal').textContent = formatBRL(totalPrice);

  const btn = document.getElementById('btnFinalizar');
  btn.disabled = cart.length === 0;

  const itemsEl = document.getElementById('cartItems');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Nenhum item no carrinho.</p>';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${formatBRL(item.price * item.qty)}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

// ===== FORMATAR BRL =====
function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ===== ABRIR/FECHAR CARRINHO =====
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
}

// ===== FINALIZAR NO WHATSAPP =====
function finalizarNoWhatsApp() {
  if (cart.length === 0) return;

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = 'Olá! Gostaria de finalizar meu pedido:\n\n';
  cart.forEach(item => {
    msg += `• ${item.name} x${item.qty} — ${formatBRL(item.price * item.qty)}\n`;
  });
  msg += `\n*Total: ${formatBRL(total)}*`;
  msg += '\n\nPor favor, me informe as formas de pagamento. Obrigado!';

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ===== VIDEO =====
const video = () => document.getElementById('meuVideo');

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function playVideo() {
  document.getElementById('videoOverlay').style.display = 'none';
  video().play();
  updatePlayIcon(false);
}

function togglePlay() {
  if (video().paused) {
    video().play();
    updatePlayIcon(false);
  } else {
    video().pause();
    updatePlayIcon(true);
  }
}

function updatePlayIcon(paused) {
  document.getElementById('iconPlay').style.display  = paused  ? 'block' : 'none';
  document.getElementById('iconPause').style.display = paused  ? 'none'  : 'block';
}

function toggleMute() {
  video().muted = !video().muted;
  document.getElementById('iconVol').style.display  = video().muted ? 'none'  : 'block';
  document.getElementById('iconMute').style.display = video().muted ? 'block' : 'none';
}

function seekVideo(e) {
  const bar = document.getElementById('progressBar');
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  video().currentTime = pct * video().duration;
}

function toggleFullscreen() {
  const wrapper = document.getElementById('videoWrapper');
  if (!document.fullscreenElement) {
    wrapper.requestFullscreen && wrapper.requestFullscreen();
  } else {
    document.exitFullscreen && document.exitFullscreen();
  }
}

// Atualiza progresso e tempo
document.addEventListener('DOMContentLoaded', () => {
  const v = document.getElementById('meuVideo');
  if (!v) return;

  v.addEventListener('timeupdate', () => {
    if (!v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressThumb').style.left = pct + '%';
    const remaining = v.duration - v.currentTime;
    document.getElementById('ytTime').textContent =
      formatTime(v.currentTime) + ' / ' + formatTime(v.duration);
  });

  v.addEventListener('ended', () => {
    updatePlayIcon(true);
    document.getElementById('videoOverlay').style.display = 'flex';
  });
});

// ===== MENU MOBILE =====
function openMenu() {
  document.getElementById('mainNav').classList.add('open');
  document.getElementById('navClose').style.display = 'block';
}
function closeMenu() {
  document.getElementById('mainNav').classList.remove('open');
  document.getElementById('navClose').style.display = 'none';
}

// ===== FAQ =====
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  // Fecha todos
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  // Abre o clicado (se não estava aberto)
  if (!isOpen) item.classList.add('open');
}

// ===== SCROLL REVEAL =====
function revealOnScroll() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  els.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      setTimeout(() => el.classList.add('visible'), i * 60);
    }
  });
}
window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// ===== VOLTAR AO TOPO =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', () => {
  const fab = document.getElementById('fabTop');
  if (fab) fab.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
