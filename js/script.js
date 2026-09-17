(function () {
  'use strict';

  const PRODUCT = {
    name: 'Ананасовый улун',
    variants: [
      { size: '100 г',   sku: '01306', price: 326.40, oldPrice: 349.20 },
      { size: '500 г',   sku: '01307', price: 1432.00, oldPrice: 1646.00 },
      { size: '1000 г',  sku: '01308', price: 2064.00, oldPrice: 2592.00 },
      { size: '5000 г',  sku: '01309', price: 6320.00, oldPrice: 8710.00 }
    ]
  };

  const variantsList = document.querySelector('.variants__list');
  const priceEl = document.getElementById('price');
  const oldPriceEl = document.getElementById('oldPrice');
  const skuEl = document.getElementById('sku');
  const cartBtn = document.getElementById('addToCart');
  const cartBtnText = cartBtn.querySelector('.product__cart-btn-text');
  const toast = document.getElementById('toast');
  const wishlistBtn = document.querySelector('.product__wishlist');

  let toastTimer = null;

  /** Форматирует число в рублёвую цену: "1 432 ₽" или "326,40 ₽" */
  const formatPrice = (value) =>
      new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2
      }).format(value) + ' ₽';

  /** Строит переключатели фасовки из PRODUCT.variants */
  function renderVariants() {
    variantsList.innerHTML = '';

    PRODUCT.variants.forEach((variant, index) => {
      const label = document.createElement('label');
      label.className = 'variant';
      label.dataset.variant = String(index);

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'variant';
      input.value = String(index);
      if (index === 0) input.checked = true;

      const span = document.createElement('span');
      span.className = 'variant__size';
      span.textContent = variant.size;

      label.appendChild(input);
      label.appendChild(span);
      variantsList.appendChild(label);

      input.addEventListener('change', () => {
        if (input.checked) selectVariant(index);
      });
    });
  }

  /** Обновляет цену, старую цену и артикул под выбранную фасовку */
  function selectVariant(index) {
    const variant = PRODUCT.variants[index];
    if (!variant) return;

    priceEl.textContent = formatPrice(variant.price);
    skuEl.textContent = variant.sku;

    if (variant.oldPrice && variant.oldPrice > variant.price) {
      oldPriceEl.textContent = formatPrice(variant.oldPrice);
      oldPriceEl.hidden = false;
    } else {
      oldPriceEl.textContent = '';
      oldPriceEl.hidden = true;
    }

    // сбрасываем состояние кнопки при смене фасовки
    cartBtn.classList.remove('is-added');
    cartBtnText.textContent = 'В корзину';
  }

  function getSelectedIndex() {
    const checked = variantsList.querySelector('input[name="variant"]:checked');
    return checked ? Number(checked.value) : 0;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function handleAddToCart() {
    const variant = PRODUCT.variants[getSelectedIndex()];
    cartBtn.classList.add('is-added');
    cartBtnText.textContent = 'Добавлено';
    showToast(`${PRODUCT.name}, ${variant.size} — добавлено в корзину`);

    setTimeout(() => {
      cartBtn.classList.remove('is-added');
      cartBtnText.textContent = 'В корзину';
    }, 1600);
  }

  function handleWishlist() {
    const pressed = wishlistBtn.getAttribute('aria-pressed') === 'true';
    wishlistBtn.setAttribute('aria-pressed', String(!pressed));
  }

  renderVariants();
  selectVariant(0);

  cartBtn.addEventListener('click', handleAddToCart);
  wishlistBtn.addEventListener('click', handleWishlist);
})();