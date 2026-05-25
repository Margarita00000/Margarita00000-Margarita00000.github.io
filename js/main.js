console.log('САЙТ БЫЛ УСПЕШНО ЗАПУЩЕН'+"✅✅✅")
document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. ГЛОБАЛЬНАЯ ЛОГИКА (Работает на всех страницах сайта)
    // =========================================================================
    
    // Пример для выпадающего меню каталога (если у тебя есть этот код)
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogDropdown = document.getElementById('catalogDropdown');
    
    if (catalogBtn && catalogDropdown) {
        catalogBtn.addEventListener('click', (e) => {
            e.preventDefault();
            catalogDropdown.classList.toggle('show');
        });
        
        // Закрытие каталога при клике в любое другое место экрана
        document.addEventListener('click', (e) => {
            if (!catalogBtn.contains(e.target) && !catalogDropdown.contains(e.target)) {
                catalogDropdown.classList.remove('show');
            }
        });
    }

// =========================================================================
    // 2. СТРАНИЦА КАТАЛОГА / ГЛАВНАЯ (Добавление товаров в корзину)
    // =========================================================================
    const buyButtons = document.querySelectorAll('.btn-buy');

    if (buyButtons.length > 0) {
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Собираем данные из data-атрибутов кнопки
                const bookId = button.getAttribute('data-id');
                const bookTitle = button.getAttribute('data-title');
                const bookAuthor = button.getAttribute('data-author');
                const bookPrice = parseInt(button.getAttribute('data-price')) || 0;
                const bookImg = button.getAttribute('data-img');

                const bookProduct = {
                    id: bookId,
                    title: bookTitle,
                    author: bookAuthor,
                    price: bookPrice,
                    img: bookImg
                };

                let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
                const isExist = cart.some(item => item.id === bookId);

                if (!isExist) {
                    cart.push(bookProduct);
                    localStorage.setItem('bookCart', JSON.stringify(cart));
                    
                    // Эффект на кнопке: меняем текст и красим в глубокий бирюзовый
                    const originalText = button.textContent;
                    button.textContent = '✓ Добавлено';
                    
                    // Запоминаем оригинальный цвет (оливковый в каталоге или серый на главной)
                    const originalBg = window.getComputedStyle(button).backgroundColor;
                    button.style.backgroundColor = '#2d7370';
                    button.style.color = '#ffffff';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = ''; // возвращает цвет из CSS-файла
                    }, 1500);
                } else {
                    alert('Эта книга уже находится в вашей корзине!');
                }
            });
        });
    }
    // =========================================================================
    // 3. СТРАНИЦА ЛИЧНОГО КАБИНЕТА (Настройки профиля и аватарка)
    // =========================================================================
    const profileForm = document.getElementById('profileForm');
    
    // Проверяем, что мы именно на странице профиля
    if (profileForm) {
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const profileName = document.getElementById('profileName');
        const sideName = document.getElementById('sideName');
        const profileEmail = document.getElementById('profileEmail');
        const profileBirth = document.getElementById('profileBirth');
        const profilePhone = document.getElementById('profilePhone');
        const profileAddress = document.getElementById('profileAddress');
        const subscribeNews = document.getElementById('subscribeNews');
        const confirmAge = document.getElementById('confirmAge');

        // Функция загрузки данных из LocalStorage
        function loadProfileData() {
            if (localStorage.getItem('profileName')) {
                profileName.value = localStorage.getItem('profileName');
                if (sideName) sideName.textContent = localStorage.getItem('profileName');
            }
            if (localStorage.getItem('profileEmail')) profileEmail.value = localStorage.getItem('profileEmail');
            if (localStorage.getItem('profileBirth')) profileBirth.value = localStorage.getItem('profileBirth');
            if (localStorage.getItem('profilePhone')) profilePhone.value = localStorage.getItem('profilePhone');
            if (localStorage.getItem('profileAddress')) profileAddress.value = localStorage.getItem('profileAddress');
            
            if (localStorage.getItem('subscribeNews')) {
                subscribeNews.checked = localStorage.getItem('subscribeNews') === 'true';
            }
            if (localStorage.getItem('confirmAge')) {
                confirmAge.checked = localStorage.getItem('confirmAge') === 'true';
            }
            if (localStorage.getItem('profileAvatar') && avatarPreview) {
                avatarPreview.setAttribute('src', localStorage.getItem('profileAvatar'));
            }
        }

        // Сохранение текстовых полей анкеты
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            localStorage.setItem('profileName', profileName.value);
            localStorage.setItem('profileEmail', profileEmail.value);
            localStorage.setItem('profileBirth', profileBirth.value);
            localStorage.setItem('profilePhone', profilePhone.value);
            localStorage.setItem('profileAddress', profileAddress.value);
            localStorage.setItem('subscribeNews', subscribeNews.checked);
            localStorage.setItem('confirmAge', confirmAge.checked);

            alert('🎉 Все изменения успешно сохранены в памяти браузера!');
        });

        // Обработка загрузки аватара
        if (avatarInput && avatarPreview) {
            avatarInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.addEventListener('load', function() {
                        avatarPreview.setAttribute('src', this.result);
                        localStorage.setItem('profileAvatar', this.result);
                    });
                    reader.readAsDataURL(file);
                }
            });
        }

        // Живая синхронизация имени в сайдбаре
        if (profileName && sideName) {
            profileName.addEventListener('input', function() {
                sideName.textContent = this.value || 'Читатель';
            });
        }

        // Автоматический вызов загрузки при старте страницы профиля
        loadProfileData();
    }


    // =========================================================================
    // 4. СТРАНИЦА КОРЗИНЫ И ОФОРМЛЕНИЯ ЗАКАЗА
    // =========================================================================
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    
    // Проверяем, что мы находимся на странице корзины
    if (cartItemsContainer || document.getElementById('emptyCartView')) {
        const emptyCartView = document.getElementById('emptyCartView');
        const activeCartView = document.getElementById('activeCartView');
        const totalItemsPrice = document.getElementById('totalItemsPrice');
        const finalOrderPrice = document.getElementById('finalOrderPrice');
        
        const checkoutModal = document.getElementById('checkoutModal');
        const openCheckoutBtn = document.getElementById('openCheckoutBtn');
        const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
        const deliveryMethod = document.getElementById('deliveryMethod');
        const addressFieldWrapper = document.getElementById('addressFieldWrapper');
        const orderAddress = document.getElementById('orderAddress');
        const checkoutForm = document.getElementById('checkoutForm');

        // Функция отрисовки товаров в корзине
        function renderCart() {
            let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

            if (cart.length === 0) {
                if (emptyCartView) emptyCartView.style.display = 'block';
                if (activeCartView) activeCartView.style.display = 'none';
                return;
            }

            if (emptyCartView) emptyCartView.style.display = 'none';
            if (activeCartView) activeCartView.style.display = 'grid';

            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;

            cart.forEach((book) => {
                totalPrice += book.price;

                const itemCard = document.createElement('div');
                itemCard.className = 'cart-item-card';
                itemCard.innerHTML = `
                    <img src="${book.img}" alt="${book.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${book.title}</h3>
                        <p class="cart-item-author">${book.author}</p>
                    </div>
                    <div class="cart-item-price">${book.price.toLocaleString()} ₽</div>
                    <button class="btn-remove-item" data-remove-id="${book.id}">✕</button>
                `;
                cartItemsContainer.appendChild(itemCard);
            });

            if (totalItemsPrice) totalItemsPrice.textContent = `${totalPrice.toLocaleString()} ₽`;
            if (finalOrderPrice) finalOrderPrice.textContent = `${totalPrice.toLocaleString()} ₽`;
            
            // Навешиваем слушатели на новые сгенерированные кнопки удаления
            initRemoveButtons();
        }

        // Функция инициализации кнопок удаления (вместо onclick в HTML)
        function initRemoveButtons() {
            const removeButtons = document.querySelectorAll('.btn-remove-item');
            removeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const idToRemove = btn.getAttribute('data-remove-id');
                    let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
                    cart = cart.filter(item => item.id !== idToRemove);
                    localStorage.setItem('bookCart', JSON.stringify(cart));
                    renderCart();
                });
            });
        }

        // Логика открытия модального окна
        if (openCheckoutBtn && checkoutModal) {
            openCheckoutBtn.addEventListener('click', () => checkoutModal.classList.add('active'));
        }
        if (closeCheckoutBtn && checkoutModal) {
            closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
        }
        if (checkoutModal) {
            checkoutModal.addEventListener('click', (e) => {
                if (e.target === checkoutModal) checkoutModal.classList.remove('active');
            });
        }

        // Показ поля адреса в зависимости от способа доставки
        if (deliveryMethod && addressFieldWrapper && orderAddress) {
            deliveryMethod.addEventListener('change', function() {
                const val = this.value;
                if (val === 'pickup_point' || val === 'courier' || val === 'russian_post') {
                    addressFieldWrapper.style.display = 'flex';
                    orderAddress.setAttribute('required', 'true');
                } else {
                    addressFieldWrapper.style.display = 'none';
                    orderAddress.removeAttribute('required');
                    orderAddress.value = '';
                }
            });
        }

        // Отчистка корзины при оформлении заказа
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault();
                alert('🎉 Заказ успешно оформлен! Спасибо за покупку в Книжном Доме!');
                localStorage.removeItem('bookCart');
                if (checkoutModal) checkoutModal.classList.remove('active');
                renderCart();
            });
        }

        // Запуск рендера при открытии корзины
        renderCart();
    }

});

// =========================================================================
    // 5. КАРУСЕЛЬКА "НАШИ АВТОРЫ" (Только для страниц с каруселью)
    // =========================================================================
    const track = document.getElementById('carouselTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Код выполнится только если на странице есть ВСЕ элементы карусели
    if (track && nextBtn && prevBtn) {
        const slides = Array.from(track.children);
        const slideWidth = 400; 
        const slideMargin = 10;
        const totalSlideWidth = slideWidth + (slideMargin * 2);

        let currentIndex = 0;

        function updateCarousel() {
            if (slides.length === 0) return;
            
            slides.forEach(slide => slide.classList.remove('active-slide'));
            slides[currentIndex].classList.add('active-slide');

            const viewport = document.querySelector('.carousel-viewport');
            if (viewport) {
                const viewportWidth = viewport.offsetWidth;
                const targetOffset = - (currentIndex * totalSlideWidth) + (viewportWidth / 2) - (totalSlideWidth / 2);
                // Исправлена синтаксическая ошибка — добавлены обратные кавычки ``
                track.style.transform = `translateX(${targetOffset}px)`;
            }
        }

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }
            updateCarousel();
        });

        // Первичная инициализация и адаптивность при изменении окна
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }


    // =========================================================================
    // 6. ЛАЙКИ И ДИЗЛАЙКИ К ОТЗЫВАМ (Только для страниц с отзывами)
    // =========================================================================
    const reviewCards = document.querySelectorAll('.review-card');

    if (reviewCards.length > 0) {
        reviewCards.forEach(card => {
            const likeBtn = card.querySelector('.like-btn');
            const dislikeBtn = card.querySelector('.dislike-btn');
            
            if (likeBtn && dislikeBtn) {
                const likeCount = likeBtn.querySelector('.count');
                const dislikeCount = dislikeBtn.querySelector('.count');

                let likes = parseInt(likeCount.innerText) || 0;
                let dislikes = parseInt(dislikeCount.innerText) || 0;

                likeBtn.addEventListener('click', () => {
                    if (likeBtn.classList.contains('active-like')) {
                        likeBtn.classList.remove('active-like');
                        likes--;
                    } else {
                        likeBtn.classList.add('active-like');
                        likes++;
                        if (dislikeBtn.classList.contains('active-dislike')) {
                            dislikeBtn.classList.remove('active-dislike');
                            dislikes--;
                            dislikeCount.innerText = dislikes;
                        }
                    }
                    likeCount.innerText = likes;
                });

                dislikeBtn.addEventListener('click', () => {
                    if (dislikeBtn.classList.contains('active-dislike')) {
                        dislikeBtn.classList.remove('active-dislike');
                        dislikes--;
                    } else {
                        dislikeBtn.classList.add('active-dislike');
                        dislikes++;
                        if (likeBtn.classList.contains('active-like')) {
                            likeBtn.classList.remove('active-like');
                            likes--;
                            likeCount.innerText = likes;
                        }
                    }
                    dislikeCount.innerText = dislikes;
                });
            }
        });
    }


    // =========================================================================
    // 7. СЕКЦИЯ ВОПРОС-ОТВЕТ / ДОСТАВКА (Только для страниц с FAQ)
    // =========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(item => {
            item.addEventListener('click', () => {
                const answer = item.nextElementSibling;
                const span = item.querySelector('span');
                
                if (answer) {
                    if (answer.style.display === 'block') {
                        answer.style.display = 'none';
                        if (span) span.textContent = '+';
                        item.style.color = '#1a1a1a';
                    } else {
                        answer.style.display = 'block';
                        if (span) span.textContent = '−';
                        item.style.color = '#2d7370';
                    }
                }
            });
        });
    }