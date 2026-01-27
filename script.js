// Sama Restaurant JavaScript
class SamaRestaurant {
  // Menu Page Functionality
  constructor() {
    this.meals = [];
    this.sliderMeals = [];
    this.allMeals = [];
    this.currentPage = 1;
    this.mealsPerPage = 12;
    this.currentCategory = 'all';
    this.currentSort = 'default';
    this.selectedMealForModal = null;
    this.mealToDelete = null;
    
    // Initialize cart first
    this.cart = [];
    
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
    
    this.categories = [
  { id: 'all', name: 'all', displayName: 'All' },
  { id: 'chicken', name: 'Chicken', displayName: 'Chicken' },
  { id: 'beef', name: 'Beef', displayName: 'Beef' },
  { id: 'pasta', name: 'Pasta', displayName: 'Pasta' },
  { id: 'seafood', name: 'Seafood', displayName: 'Seafood' },
  { id: 'vegetarian', name: 'Vegetarian', displayName: 'Vegetarian' },
  { id: 'pizza', name: 'Pizza', displayName: 'Pizza' },
];
    
    // Initialize from parent constructor
    this.apiEndpoint = null; // Will be configured when API is ready
    this.currentSlide = 0;
    this.init();
  }

  // Cart Persistence Methods
  loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem('samaRestaurantCart');
    console.log('Loading cart from storage:', savedCart);  // ADD THIS
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      console.log('Parsed cart:', this.cart);  // ADD THIS
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    this.cart = [];
  }
}

  saveCartToStorage() {
    try {
      localStorage.setItem('samaRestaurantCart', JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
init() {
  this.loadCartFromStorage();
  this.setupEventListeners();
  this.loadTheme();
  this.updateCartUI();
  this.initializeSlider();
  this.loadContent();

    // Global event delegation for remove buttons
  document.addEventListener('click', (e) => {
    console.log('Click detected on:', e.target); // Test all clicks
    if (e.target.classList.contains('remove-item')) {
            console.log('Remove button clicked globally for item:', e.target.dataset.itemId, 'Type:', typeof e.target.dataset.itemId);
      console.log('Current cart items:', this.cart.map(item => ({ id: item.id, type: typeof item.id, name: item.name })));
      e.preventDefault();
      e.stopPropagation();
      const itemId = e.target.dataset.itemId;
      
      // Remove the item
      this.cart = this.cart.filter(item => item.id != itemId);
      this.updateCartUI();
      this.saveCartToStorage();
      
      // Re-render cart
      this.renderCartItems();
      this.updateCartSummary();
      
      console.log('Item removed via global delegation');
    }
  });
        // Add event delegation to cart modal specifically
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    console.log('Cart modal found, adding event listener');
    cartModal.addEventListener('click', (e) => {
      console.log('Modal click detected on:', e.target.tagName, e.target.className);
      if (e.target.classList.contains('remove-item')) {
        alert('Remove button clicked! Item ID: ' + e.target.dataset.itemId);
        console.log('Remove button clicked in modal for item:', e.target.dataset.itemId, 'Type:', typeof e.target.dataset.itemId);
        console.log('Current cart items BEFORE removal:', this.cart.map(item => ({ id: item.id, type: typeof item.id, name: item.name })));
        e.preventDefault();
        e.stopPropagation();
        const itemId = e.target.dataset.itemId;
        
        // Remove the item
        this.cart = this.cart.filter(item => item.id != itemId);
        console.log('Cart items AFTER removal:', this.cart.map(item => ({ id: item.id, type: typeof item.id, name: item.name })));
        
        this.updateCartUI();
        this.saveCartToStorage();
        
        // Re-render cart
        this.renderCartItems();
        this.updateCartSummary();
        
        console.log('Item removed via modal delegation');
      }
    });
  } else {
    console.log('Cart modal NOT found!');
  }
  // Initialize product details page if on product-details.html
  if (window.location.pathname.includes('product-details.html')) {
    this.loadProductDetails();
  }
  
  // Initialize menu page if on menu.html
  if (window.location.pathname.includes('menu.html')) {
    this.initializeMenuPage();
  }
}

updateCartItemDisplay(itemId) {
  const cartItem = this.cart.find(item => item.id == itemId);
  if (cartItem) {
    // Find the cart item container
    const cartItemContainer = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItemContainer) {
      // Update the quantity display
      const quantitySpan = cartItemContainer.querySelector('.cart-counter-value');
      if (quantitySpan) {
        quantitySpan.textContent = cartItem.quantity;
      }
      
      // Update the total display
      const totalDiv = cartItemContainer.querySelector('.cart-item-total');
      if (totalDiv) {
        totalDiv.textContent = `$${(parseFloat(cartItem.price) * cartItem.quantity).toFixed(2)}`;
      }
    }
  }
}

  // Theme Management
  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.showCartModal());
    }

    // Cart modal close
    const cartModalClose = document.getElementById('cart-modal-close');
    if (cartModalClose) {
      cartModalClose.addEventListener('click', () => this.hideCartModal());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }

    // Checkout modal close
    const checkoutModalClose = document.getElementById('checkout-modal-close');
    if (checkoutModalClose) {
      checkoutModalClose.addEventListener('click', () => this.hideCheckoutModal());
    }

    // Cancel checkout
    const cancelCheckout = document.getElementById('cancel-checkout');
    if (cancelCheckout) {
      cancelCheckout.addEventListener('click', () => this.hideCheckoutModal());
    }

    // Submit order
    const submitOrder = document.getElementById('submit-order');
    if (submitOrder) {
      submitOrder.addEventListener('click', () => this.processCheckout());
    }

    // Success modal OK
    const successOk = document.getElementById('success-ok');
    if (successOk) {
      successOk.addEventListener('click', () => {
        this.hideSuccessModal();
        window.location.href = 'index.html';
      });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processCheckout();
      });
    }

    // Modal backdrop clicks
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Delete modal
    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
      confirmDelete.addEventListener('click', () => this.confirmDeleteMeal());
    }

    const cancelDelete = document.getElementById('cancel-delete');
    if (cancelDelete) {
      cancelDelete.addEventListener('click', () => this.closeDeleteModal());
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Slider controls
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    if (sliderPrev) {
      sliderPrev.addEventListener('click', () => this.prevSlide());
    }
    if (sliderNext) {
      sliderNext.addEventListener('click', () => this.nextSlide());
    }
  }

  toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (themeIcon) themeIcon.textContent = '☀️';
    }
  }

  // Cart Functionality
  toggleCart() {
    // Basic cart toggle - can be expanded with modal
    alert(`Cart has ${this.cart.length} items`);
  }

  addToCart(mealOrId) {
  // Handle both meal object and mealId
  let meal;
  let mealId;
  
  if (typeof mealOrId === 'object') {
    meal = mealOrId;  // Slider items
    mealId = meal.id;
  } else {
    mealId = mealOrId;  // Menu items
    meal = this.allMeals.find(m => m.id === mealId.toString()) || 
           this.meals.find(m => m.id === mealId.toString());
  }
  
  if (!meal) return;
  
  const existingItem = this.cart.find(item => item.id === meal.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    this.cart.push({ ...meal, quantity: 1 });
  }
  
  this.updateCartUI();
  this.saveCartToStorage();
  this.showNotification(`${meal.name} added to cart!`);
  
  // Update meal card if it exists (for menu page items)
  this.updateMealCard(mealId);
}

  removeFromCart(mealId) {
  // Simplified ID handling for both slider and menu items
  this.cart = this.cart.filter(item => item.id != mealId);
  this.updateCartUI();
  this.saveCartToStorage();
  
  // Update meal card if it exists
  this.updateMealCard(mealId);
  
  // Re-render cart modal if it's open
  const cartModal = document.getElementById('cart-modal');
  if (cartModal && cartModal.classList.contains('active')) {
    this.renderCartItems();
    this.updateCartSummary();
  }
}

  updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
    }
    this.saveCartToStorage();
  }

  // Slider Functionality
  async initializeSlider() {
    // Always try to load meals from API for the slider
    await this.loadMealsFromAPI();
    
    // If API fails, use placeholder data
    if (this.sliderMeals.length === 0) {
      this.loadPlaceholderMeals();
    }
    
    this.renderSlider();
  }

  async loadMealsFromAPI() {
  try {
    // Use TheMealDB API (no CORS issues)
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
    const data = await response.json();
    
    this.sliderMeals = data.meals.slice(0, 3).map((meal, index) => ({
      id: index + 1,
      name: meal.strMeal,
      image: meal.strMealThumb,
      price: this.generateRandomPrice(),
      priceBefore: this.generateRandomPrice() * 1.5
    }));
    
  } catch (error) {
    console.error('Error loading meals from API:', error);
    this.sliderMeals = [];
  }
}

  loadPlaceholderMeals() {
    // Placeholder meals for demo when API is not available
    this.sliderMeals = [
      {
        id: 1,
        name: "Grilled Chicken Platter",
        image: "assets/meal1.jpg",
        price: 12.99,
        priceBefore: 18.99
      },
      {
        id: 2,
        name: "Beef Kebab Special",
        image: "assets/meal2.jpg", 
        price: 15.99,
        priceBefore: 22.99
      },
      {
        id: 3,
        name: "Vegetarian Delight",
        image: "assets/meal3.jpg",
        price: 10.99,
        priceBefore: 14.99
      }
    ];
  }

  renderSlider() {
    const slider = document.querySelector('.slider');
    if (!slider || this.sliderMeals.length === 0) return;

    slider.innerHTML = this.sliderMeals.map(meal => `
      <div class="meal-slide">
        <img src="${meal.image}" alt="${meal.name}" class="meal-image">
        <h3 class="meal-name">${meal.name}</h3>
        <div class="meal-prices">
          <span class="meal-price">$${meal.price}</span>
          <span class="meal-price-before">$${meal.priceBefore}</span>
        </div>
        <button class="cta-btn" onclick="restaurant.addToCart(${JSON.stringify(meal).replace(/"/g, '&quot;')})">Add to Cart</button>
      </div>
    `).join('');

    this.updateSliderPosition();
  }

  updateSliderPosition() {
    const slider = document.querySelector('.slider');
    if (slider) {
      slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }

  nextSlide() {
    if (this.sliderMeals.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.sliderMeals.length;
    this.updateSliderPosition();
  }

  prevSlide() {
    if (this.sliderMeals.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.sliderMeals.length) % this.sliderMeals.length;
    this.updateSliderPosition();
  }

  // API Configuration
  configureAPI(endpoint) {
    this.apiEndpoint = endpoint;
    this.initializeSlider(); // Reload with new API
  }

  // Utility Functions
  showNotification(message) {
    // Create a simple notification (can be enhanced with a proper notification system)
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Content Loading
  loadContent() {
    // Check if content object exists
    if (typeof content === 'undefined') {
      console.error('Content object not found. Make sure content.js is loaded.');
      return;
    }

    try {
      // Header content
      const logoAlt = document.getElementById('logo-alt');
      if (logoAlt) logoAlt.alt = content.header.logoAlt;
      
      const headerOrderNow = document.getElementById('header-order-now');
      if (headerOrderNow) headerOrderNow.textContent = content.header.orderNow;

      // Hero section
      const heroHeadline = document.getElementById('hero-headline');
      if (heroHeadline) heroHeadline.textContent = content.hero.headline;
      
      const heroSubheadline = document.getElementById('hero-subheadline');
      if (heroSubheadline) heroSubheadline.textContent = content.hero.subheadline;
      
      const heroCta = document.getElementById('hero-cta');
      if (heroCta) heroCta.textContent = content.hero.cta;

      // Navigation
      const navHome = document.getElementById('nav-home');
      if (navHome) navHome.textContent = content.navigation.home;
      
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) navMenu.textContent = content.navigation.menu;
      
      const navAbout = document.getElementById('nav-about');
      if (navAbout) navAbout.textContent = content.navigation.about;
      
      const navContact = document.getElementById('nav-contact');
      if (navContact) navContact.textContent = content.navigation.contact;

      // Special Offers
      const specialOffersTitle = document.getElementById('special-offers-title');
      if (specialOffersTitle) specialOffersTitle.textContent = content.specialOffers.title;

      // Trust Badges
      const trustTitle = document.getElementById('trust-title');
      if (trustTitle) trustTitle.textContent = content.trust.title;
      
      const trustBadge1 = document.getElementById('trust-badge-1');
      if (trustBadge1) trustBadge1.textContent = content.trust.badges[0];
      
      const trustBadge2 = document.getElementById('trust-badge-2');
      if (trustBadge2) trustBadge2.textContent = content.trust.badges[1];
      
      const trustBadge3 = document.getElementById('trust-badge-3');
      if (trustBadge3) trustBadge3.textContent = content.trust.badges[2];
      
      const trustBadge4 = document.getElementById('trust-badge-4');
      if (trustBadge4) trustBadge4.textContent = content.trust.badges[3];

      // Horizontal Card
      const horizontalCardReady = document.getElementById('horizontal-card-ready');
      if (horizontalCardReady) horizontalCardReady.textContent = content.horizontalCard.ready;
      
      const horizontalCardDescription = document.getElementById('horizontal-card-description');
      if (horizontalCardDescription) horizontalCardDescription.textContent = content.horizontalCard.description;
      
      const horizontalCardCta = document.getElementById('horizontal-card-cta');
      if (horizontalCardCta) horizontalCardCta.textContent = content.horizontalCard.cta;

      // Footer
      const footerPoliciesTitle = document.getElementById('footer-policies-title');
      if (footerPoliciesTitle) footerPoliciesTitle.textContent = content.footer.policies.title;
      
      const footerPrivacy = document.getElementById('footer-privacy');
      if (footerPrivacy) footerPrivacy.textContent = content.footer.policies.links.privacy;
      
      const footerTerms = document.getElementById('footer-terms');
      if (footerTerms) footerTerms.textContent = content.footer.policies.links.terms;
      
      const footerReturns = document.getElementById('footer-returns');
      if (footerReturns) footerReturns.textContent = content.footer.policies.links.returns;

      const footerContactTitle = document.getElementById('footer-contact-title');
      if (footerContactTitle) footerContactTitle.textContent = content.footer.contact.title;
      
      const footerPhone = document.getElementById('footer-phone');
      if (footerPhone) footerPhone.textContent = content.footer.contact.phone;
      
      const footerEmail = document.getElementById('footer-email');
      if (footerEmail) footerEmail.textContent = content.footer.contact.email;
      
      const footerLocation = document.getElementById('footer-location');
      if (footerLocation) footerLocation.textContent = content.footer.contact.location;

      const footerSocialTitle = document.getElementById('footer-social-title');
      if (footerSocialTitle) footerSocialTitle.textContent = content.footer.social.title;
      
      const footerInstagram = document.getElementById('footer-instagram');
      if (footerInstagram) {
        footerInstagram.textContent = '📷';
        footerInstagram.setAttribute('aria-label', content.footer.social.platforms.instagram);
      }
      
      const footerTwitter = document.getElementById('footer-twitter');
      if (footerTwitter) {
        footerTwitter.textContent = '𝕏';
        footerTwitter.setAttribute('aria-label', content.footer.social.platforms.twitter);
      }
      
      const footerFacebook = document.getElementById('footer-facebook');
      if (footerFacebook) {
        footerFacebook.textContent = '📘';
        footerFacebook.setAttribute('aria-label', content.footer.social.platforms.facebook);
      }

      const footerHoursTitle = document.getElementById('footer-hours-title');
      if (footerHoursTitle) footerHoursTitle.textContent = content.footer.hours.title;
      
      const footerHoursList = document.getElementById('footer-hours-list');
      if (footerHoursList) {
        footerHoursList.innerHTML = content.footer.hours.schedule
          .map(hour => `<li>${hour}</li>`)
          .join('');
      }

      const footerCopyright = document.getElementById('footer-copyright');
      if (footerCopyright) footerCopyright.textContent = content.footer.copyright;

      console.log('Content loaded successfully');
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  // Menu Page Methods
  async initializeMenuPage() {
    console.log('Initializing menu page...');
    await this.loadMenuMeals();
    this.renderCategories();
    this.setupMenuEventListeners();
    this.attachMealCardListeners();
    this.hideLoadingState();
  }

  async loadMenuMeals() {
    this.showLoadingState();
    
    try {
      // Load meals from all categories
      const categoryPromises = this.categories
        .filter(cat => cat.id !== 'all')
        .map(category => this.loadMealsFromCategory(category.name));
      
      const categoryResults = await Promise.all(categoryPromises);
      this.allMeals = categoryResults.flat();
      
      // Add unique IDs and ensure all required fields
      this.allMeals = this.allMeals.map((meal, index) => ({
        id: meal.idMeal || index + 1,
        name: meal.strMeal || 'Unknown Meal',
        description: meal.strInstructions || 'Delicious meal prepared with fresh ingredients.',
        image: meal.strMealThumb || 'https://picsum.photos/seed/meal/400/300',
        price: this.generateRandomPrice(),
        category: this.getMealCategory(meal)
      }));
      console.log('Sample meal IDs:', this.allMeals.slice(0, 5).map(m => ({ id: m.id, name: m.name })));
      
      // Sort and filter meals
      this.filterAndSortMeals();
      this.renderMeals();
      this.renderPagination();
      
    } catch (error) {
      console.error('Error loading menu meals:', error);
      this.loadFallbackMeals();
    }
  }

  async loadMealsFromCategory(category) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error(`Error loading ${category} meals:`, error);
      return [];
    }
  }

  getMealCategory(meal) {
    // Try to determine category from meal data
    const categories = ['chicken', 'beef', 'pasta', 'seafood', 'vegetarian', 'dessert', 'pizza', 'sandwich', 'bread', 'burger'];
    const mealName = (meal.strMeal || '').toLowerCase();
    
    for (const category of categories) {
      if (mealName.includes(category)) {
        return category;
      }
    }
    
    return 'other';
  }

  generateRandomPrice() {
    return (Math.random() * 25 + 8).toFixed(2);
  }

  loadFallbackMeals() {
    // Fallback meals if API fails
    this.allMeals = [
      { id: 1, name: 'Grilled Chicken', description: 'Tender grilled chicken with herbs', image: 'https://picsum.photos/seed/chicken/400/300', price: '12.99', category: 'chicken' },
      { id: 2, name: 'Beef Burger', description: 'Juicy beef burger with fresh vegetables', image: 'https://picsum.photos/seed/burger/400/300', price: '10.99', category: 'burgers' },
      { id: 3, name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and parmesan', image: 'https://picsum.photos/seed/pasta/400/300', price: '11.99', category: 'pasta' },
      // Add more fallback meals as needed
    ];
    
    this.filterAndSortMeals();
    this.renderMeals();
    this.renderPagination();
  }

  renderCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = this.categories.map(category => `
      <button class="category-btn ${category.id === this.currentCategory ? 'active' : ''}" 
              data-category="${category.id}">
        ${category.displayName}
      </button>
    `).join('');
  }

  setupMenuEventListeners() {
    // Category buttons - use event delegation for dynamic content
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-btn')) {
        this.currentCategory = e.target.dataset.category;
        this.currentPage = 1;
        this.filterAndSortMeals();
        this.renderMeals();
        this.renderPagination();
        this.renderCategories();
      }
    });

    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.filterAndSortMeals();
        this.renderMeals();
      });
    }

    // Modal close buttons
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeMealModal());
    }

    // Toast close button
    const toastClose = document.getElementById('toast-close');
    if (toastClose) {
      toastClose.addEventListener('click', () => this.hideToast());
    }

    // Delete confirmation modal
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
    
    if (cancelDelete) {
      cancelDelete.addEventListener('click', () => this.closeDeleteModal());
    }
    
    if (confirmDelete) {
      confirmDelete.addEventListener('click', () => this.confirmDeleteMeal());
    }

    // Modal backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  filterAndSortMeals() {
    // Filter by category
    this.meals = this.currentCategory === 'all' 
      ? [...this.allMeals]
      : this.allMeals.filter(meal => meal.category === this.currentCategory);
    
    // Sort meals
    switch (this.currentSort) {
      case 'low-to-high':
        this.meals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'high-to-low':
        this.meals.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        // Keep original order
        break;
    }
  }

  renderMeals() {
    const mealsGrid = document.getElementById('meals-grid');
    if (!mealsGrid) return;
    
    const startIndex = (this.currentPage - 1) * this.mealsPerPage;
    const endIndex = startIndex + this.mealsPerPage;
    const pageMeals = this.meals.slice(startIndex, endIndex);
    
    if (pageMeals.length === 0) {
      mealsGrid.innerHTML = '<p class="no-meals">No meals found in this category.</p>';
      return;
    }
    
    mealsGrid.innerHTML = pageMeals.map(meal => this.createMealCard(meal)).join('');
  }

  createMealCard(meal) {
    const cartItem = this.cart.find(item => item.id === meal.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    return `
      <div class="meal-card" data-meal-id="${meal.id}">
        <div class="meal-clickable-area" onclick="window.location.href='product-details.html?id=${meal.id}'">
          <img src="${meal.image}" alt="${meal.name}" class="meal-image">
          <div class="meal-content">
            <h3 class="meal-name">${meal.name}</h3>
            <p class="meal-price">$${meal.price}</p>
            <p class="meal-description expandable" data-meal-id="${meal.id}">
              ${this.truncateDescription(meal.description)}
            </p>
          </div>
        </div>
        <div class="meal-actions">
          ${quantity > 0 ? this.createMealCounter(meal, quantity) : this.createAddToCartButton(meal)}
        </div>
      </div>
    `;
  }

  truncateDescription(description) {
    if (!description) return 'Delicious meal prepared with fresh ingredients.';
    
    const words = description.split(' ');
    if (words.length <= 15) return description;
    
    return words.slice(0, 15).join(' ') + '...';
  }

  createAddToCartButton(meal) {
    return `
      <button class="add-to-cart-btn" data-meal-id="${meal.id}">
        Add to Cart
      </button>
    `;
  }

  createMealCounter(meal, quantity) {
    return `
      <div class="meal-counter">
        <button class="counter-btn decrement" data-meal-id="${meal.id}"></button>
        <span class="counter-value">${quantity}</span>
        <button class="counter-btn increment" data-meal-id="${meal.id}"></button>
      </div>
    `;
  }

  attachMealCardListeners() {
  // Use event delegation for dynamically created elements
  document.addEventListener('click', (e) => {
    // Description click for modal - prevent navigation
    if (e.target.classList.contains('meal-description') && e.target.classList.contains('expandable')) {
      e.preventDefault();
      e.stopPropagation();
      const mealId = parseInt(e.target.dataset.mealId);
      this.showMealModal(mealId);
    }
    
    // Add to cart buttons
    if (e.target.classList.contains('add-to-cart-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const mealId = parseInt(e.target.dataset.mealId);
      this.addToCart(mealId);
    }
    
    // Counter buttons
    if (e.target.classList.contains('counter-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const mealId = e.target.dataset.mealId;
      const action = e.target.classList.contains('increment') ? 'increment' : 'decrement';
      this.updateCartItemQuantity(mealId, action);
    }
  });
}

  showMealModal(mealId) {
    const meal = this.allMeals.find(m => m.id === mealId);
    if (!meal) return;
    
    this.selectedMealForModal = meal;
    
    const modal = document.getElementById('meal-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalAddToCart = document.getElementById('modal-add-to-cart');
    
    if (modal && modalTitle && modalDescription && modalPrice && modalAddToCart) {
      modalTitle.textContent = meal.name;
      modalDescription.textContent = meal.description;
      modalPrice.textContent = `$${meal.price}`;
      
      // Check if item is already in cart
      const cartItem = this.cart.find(item => item.id === mealId);
      modalAddToCart.textContent = cartItem ? 'Update Cart' : 'Add to Cart';
      
      modal.classList.add('active');
    }
  }

  closeMealModal() {
    const modal = document.getElementById('meal-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.selectedMealForModal = null;
  }

  renderPagination() {
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!paginationNumbers || !prevBtn || !nextBtn) return;
    
    // Limit to maximum 5 pages
    const totalPages = Math.min(Math.ceil(this.meals.length / this.mealsPerPage), 5);
    
    // Render page numbers
    paginationNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => this.goToPage(i));
      paginationNumbers.appendChild(pageBtn);
    }
    
    // Update prev/next buttons
    prevBtn.disabled = this.currentPage === 1;
    nextBtn.disabled = this.currentPage === totalPages;
    
    // Remove existing listeners and add new ones
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newPrevBtn.addEventListener('click', () => this.previousPage());
    newNextBtn.addEventListener('click', () => this.nextPage());
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderMeals();
    this.renderPagination();
  }

  nextPage() {
    const totalPages = Math.min(Math.ceil(this.meals.length / this.mealsPerPage), 5);
    if (this.currentPage < totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  updateCartItemQuantity(mealId, action) {
    const meal = this.allMeals.find(m => m.id === mealId.toString()) || 
                 this.meals.find(m => m.id === mealId.toString()) ||
                 this.sliderMeals.find(m => m.id === mealId);
    if (!meal) return;
    
    const cartItem = this.cart.find(item => item.id === mealId.toString());
    if (action === 'increment') {
      if (cartItem) {
        cartItem.quantity++;
        this.updateCartUI();
        this.updateMealCard(mealId);
      } else {
        this.addToCart(mealId);
      }
    }
    else {
      if (cartItem) {
        cartItem.quantity--;
        if (cartItem.quantity === 0) {
          this.updateMealCard(mealId);
          this.mealToDelete = cartItem;
          this.showDeleteModal();
        } else {
          this.updateCartUI();
          this.updateMealCard(mealId);
        }
      }
    }
    
    // Update cart modal if it's open
    const cartModal = document.getElementById('cart-modal');
    if (cartModal && cartModal.classList.contains('active')) {
      this.renderCartItems();
      this.updateCartSummary();
    }
  }

  showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.mealToDelete = null;
  }

  confirmDeleteMeal() {
    if (this.mealToDelete) {
      this.removeFromCart(this.mealToDelete.id);
      this.closeDeleteModal();
    }
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.hideToast();
      }, 3000);
    }
  }

  hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.remove('show');
    }
  }

  showLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
      loadingState.classList.add('active');
    }
  }

  hideLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
      loadingState.classList.remove('active');
    }
  }

  // Enhanced addToCart for menu page


updateMealCard(mealId) {
  const mealCard = document.querySelector(`[data-meal-id="${mealId}"]`);
  if (!mealCard) return;
  
  const meal = this.allMeals.find(m => m.id === mealId.toString());
  if (!meal) return;
  
  const cartItem = this.cart.find(item => item.id === mealId.toString());
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const buttonContainer = mealCard.querySelector('.meal-actions');
  if (buttonContainer) {
    buttonContainer.innerHTML = quantity > 0 ? this.createMealCounter(meal, quantity) : this.createAddToCartButton(meal);
  }
}

// Cart Modal Methods
showCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.add('active');
    this.renderCartItems();
    this.updateCartSummary();
  }
}

hideCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;

  if (this.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Add some delicious meals to get started!</p>
        <button class="cta-btn" onclick="restaurant.hideCartModal(); window.location.href='menu.html'">
          Browse Menu
        </button>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = this.cart.map(item => `
    <div class="cart-item" data-item-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">$${parseFloat(item.price).toFixed(2)} each</p>
      </div>
      <div class="cart-item-controls">
        <div class="cart-counter">
          <button class="cart-counter-btn decrement" data-item-id="${item.id}">-</button>
          <span class="cart-counter-value">${item.quantity}</span>
          <button class="cart-counter-btn increment" data-item-id="${item.id}">+</button>
        </div>
        <div class="cart-item-total">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
        <button class="remove-item" data-item-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');
this.bindCartButtonEvents();
}

attachCartEventListeners() {
  // This method is now empty - we use direct binding in bindCartButtonEvents()
}

bindCartButtonEvents() {
  console.log('Binding cart button events...');
  console.log('Current cart items:', this.cart);
  // Check if buttons exist
  const incrementButtons = document.querySelectorAll('.cart-counter-btn.increment');
  const decrementButtons = document.querySelectorAll('.cart-counter-btn.decrement');
  const removeButtons = document.querySelectorAll('.remove-item');
  
  console.log('Found increment buttons:', incrementButtons.length);
  console.log('Found decrement buttons:', decrementButtons.length);
  console.log('Found remove buttons:', removeButtons.length);
  incrementButtons.forEach(btn => {
    console.log('Increment button data-item-id:', btn.dataset.itemId, 'Type:', typeof btn.dataset.itemId);
  });
  decrementButtons.forEach(btn => {
    console.log('Decrement button data-item-id:', btn.dataset.itemId, 'Type:', typeof btn.dataset.itemId);
  });
  removeButtons.forEach(btn => {
    console.log('Remove button data-item-id:', btn.dataset.itemId, 'Type:', typeof btn.dataset.itemId);
  });
  

  
        // Bind increment buttons
    incrementButtons.forEach(btn => {
      btn.onclick = (e) => {
        console.log('Increment button clicked for item:', btn.dataset.itemId);
        e.preventDefault();
        e.stopPropagation();
        const itemId = btn.dataset.itemId;
        
        // ADD THIS DEBUGGING:
        console.log('Looking for item with ID:', itemId, 'Type:', typeof itemId);
        console.log('Cart items:', this.cart.map(item => ({ id: item.id, type: typeof item.id })));
        
        const cartItem = this.cart.find(item => item.id == itemId);
        console.log('Found cart item:', cartItem);
        
        if (cartItem) {
          cartItem.quantity++;
          this.updateCartUI();
          this.saveCartToStorage();
          this.updateCartItemDisplay(itemId);
          this.updateCartSummary();
        } else {
          console.log('Cart item NOT found!');
        }
      };
    });

  // Bind decrement buttons
  decrementButtons.forEach(btn => {
    console.log('Binding decrement button for item:', btn.dataset.itemId);
    btn.onclick = (e) => {
      console.log('Decrement button clicked for item:', btn.dataset.itemId);
      e.preventDefault();
      e.stopPropagation();
      const itemId = btn.dataset.itemId;
      const cartItem = this.cart.find(item => item.id == itemId);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
        this.updateCartUI();
        this.saveCartToStorage();
        // Update just the quantity display and summary
        this.updateCartItemDisplay(itemId);
        this.updateCartSummary();
      }
    };
  });
  

  console.log('About to bind remove buttons. Found:', removeButtons.length, 'remove buttons');
  // Bind remove buttons - test approach
          
  removeButtons.forEach(btn => {
    console.log('Binding remove button:', btn);
    btn.onclick = (e) => {
      alert('CLICK WORKS! Item ID: ' + btn.dataset.itemId);
      console.log('Remove button clicked for item:', btn.dataset.itemId);
      e.preventDefault();
      e.stopPropagation();
      const itemId = btn.dataset.itemId;
      const cartItem = this.cart.find(item => item.id == itemId);
      if (cartItem) {
        this.removeFromCart(itemId);
        this.renderCartItems();
        this.updateCartSummary();
      } else {
        console.log('Cart item NOT found for removal!');
      }
    };
  });
  }

updateCartItemDisplay(itemId) {
  const cartItem = this.cart.find(item => item.id == itemId);
  if (cartItem) {
    // Find the cart item container
    const cartItemContainer = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItemContainer) {
      // Update the quantity display
      const quantitySpan = cartItemContainer.querySelector('.cart-counter-value');
      if (quantitySpan) {
        quantitySpan.textContent = cartItem.quantity;
      }
      
      // Update the total display
      const totalDiv = cartItemContainer.querySelector('.cart-item-total');
      if (totalDiv) {
        totalDiv.textContent = `$${(parseFloat(cartItem.price) * cartItem.quantity).toFixed(2)}`;
      }
    }
  }
}

updateCartSummary() {
  const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const delivery = this.cart.length > 0 ? 5.00 : 0;
  const total = subtotal + tax + delivery;

  const subtotalElement = document.getElementById('cart-subtotal');
  const taxElement = document.getElementById('cart-tax');
  const deliveryElement = document.getElementById('cart-delivery');
  const totalElement = document.getElementById('cart-total');

  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
  if (deliveryElement) deliveryElement.textContent = `$${delivery.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

removeFromCart(itemId) {
  this.cart = this.cart.filter(item => item.id !== itemId);
  this.updateCartUI();
  this.renderCartItems();
  this.updateCartSummary();
  this.saveCartToStorage();
  this.showToast('Item removed from cart');
}

checkout() {
  if (this.cart.length === 0) {
    this.showToast('Your cart is empty');
    return;
  }

  this.hideCartModal();
  this.showCheckoutModal();
}

showCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    this.renderCheckoutOrderItems();
    this.updateCheckoutSummary();
    modal.classList.add('active');
  }
}

hideCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

renderCheckoutOrderItems() {
  const container = document.getElementById('checkout-order-items');
  if (!container) return;

  if (this.cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  container.innerHTML = this.cart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-info">
        <span class="checkout-item-name">${item.name}</span>
        <span class="checkout-item-quantity">x${item.quantity}</span>
      </div>
      <span class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');
}

updateCheckoutSummary() {
  const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const delivery = this.cart.length > 0 ? 5.00 : 0;
  const total = subtotal + tax + delivery;

  const subtotalElement = document.getElementById('checkout-subtotal');
  const taxElement = document.getElementById('checkout-tax');
  const deliveryElement = document.getElementById('checkout-delivery');
  const totalElement = document.getElementById('checkout-total');

  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
  if (deliveryElement) deliveryElement.textContent = `$${delivery.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

validateCheckoutForm() {
  const name = document.getElementById('customer-name');
  const phone = document.getElementById('customer-phone');
  const city = document.getElementById('customer-city');
  const street = document.getElementById('customer-street');
  const building = document.getElementById('customer-building');
  const payment = document.querySelector('input[name="payment"]:checked');

  let isValid = true;

  // Reset error messages
  document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

  // Validate name (text only)
  if (!name.value.trim() || !/^[A-Za-z\s]+$/.test(name.value.trim())) {
    document.getElementById('name-error').style.display = 'block';
    isValid = false;
  }

  // Validate phone (Jordanian format: 9 digits starting with 7)
  if (!phone.value.trim() || !/^7[0-9]{8}$/.test(phone.value.trim())) {
    document.getElementById('phone-error').style.display = 'block';
    isValid = false;
  }

  // Validate address
  if (!city.value.trim() || !street.value.trim() || !building.value.trim()) {
    document.getElementById('address-error').style.display = 'block';
    isValid = false;
  }

  // Validate payment method
  if (!payment) {
    document.getElementById('payment-error').style.display = 'block';
    isValid = false;
  }

  return isValid;
}

async submitOrderToGoogleSheets(orderData) {
  try {
    const response = await fetch('YOUR_GOOGLE_SCRIPT_WEB_APP_URL', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    // Since we're using no-cors, we won't get detailed response info
    // but we assume success if no network error
    return { success: true };
  } catch (error) {
    console.error('Error submitting order to Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

async processCheckout() {
  if (!this.validateCheckoutForm()) {
    return;
  }

  const submitBtn = document.getElementById('submit-order');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // Show loading state
  btnText.style.display = 'none';
  btnLoading.style.display = 'flex';
  submitBtn.disabled = true;

  try {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const city = document.getElementById('customer-city').value;
    const street = document.getElementById('customer-street').value;
    const building = document.getElementById('customer-building').value;
    const notes = document.getElementById('customer-notes').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const delivery = 5.00;
    const total = subtotal + tax + delivery;

    const orderData = {
      customer: {
        name: name,
        phone: phone,
        address: `${city}, ${street}, ${building}`,
        notes: notes,
        paymentMethod: payment
      },
      items: this.cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      totals: {
        subtotal: subtotal,
        tax: tax,
        delivery: delivery,
        total: total
      },
      timestamp: new Date().toISOString()
    };

    // Submit to Google Sheets
    const result = await this.submitOrderToGoogleSheets(orderData);

    if (result.success) {
      // Clear cart and show success
      this.cart = [];
      this.updateCartUI();
      this.saveCartToStorage();
      this.hideCheckoutModal();
      this.showSuccessModal();
    } else {
      throw new Error('Failed to submit order');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    this.showToast('Something went wrong, please try again');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  }
}

showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

hideSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Product Details Page Methods
async loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get('id');

  if (!mealId) {
    this.showProductError();
    return;
  }

  try {
    this.showLoadingState();
    
    // Fetch from TheMealDB API
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();

    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      this.displayProductDetails(meal);
    } else {
      this.showProductError();
    }
  } catch (error) {
    console.error('Error loading product details:', error);
    this.showProductError();
  }
}

showLoadingState() {
  const loadingState = document.getElementById('loading-state');
  const productDetails = document.getElementById('product-details');
  const errorState = document.getElementById('error-state');

  if (loadingState) loadingState.style.display = 'block';
  if (productDetails) productDetails.style.display = 'none';
  if (errorState) errorState.style.display = 'none';
}

showProductError() {
  const loadingState = document.getElementById('loading-state');
  const productDetails = document.getElementById('product-details');
  const errorState = document.getElementById('error-state');

  if (loadingState) loadingState.style.display = 'none';
  if (productDetails) productDetails.style.display = 'none';
  if (errorState) errorState.style.display = 'block';
}

displayProductDetails(meal) {
  const loadingState = document.getElementById('loading-state');
  const productDetails = document.getElementById('product-details');
  const errorState = document.getElementById('error-state');

  if (loadingState) loadingState.style.display = 'none';
  if (errorState) errorState.style.display = 'none';

  if (productDetails) {
    productDetails.style.display = 'block';

    // Update product information
    const productImage = document.getElementById('product-image');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productCategory = document.getElementById('product-category');
    const productDescription = document.getElementById('product-description');

    if (productImage) {
      productImage.src = meal.strMealThumb || 'assets/placeholder-meal.jpg';
      productImage.alt = meal.strMeal || 'Product Image';
    }

    if (productTitle) {
      productTitle.textContent = meal.strMeal || 'Unknown Meal';
    }

    if (productPrice) {
      // Generate a price based on the meal ID for demo purposes
      const price = (Math.abs(parseInt(meal.idMeal)) % 20 + 10) + 0.99;
      productPrice.textContent = `$${price.toFixed(2)}`;
    }

    if (productCategory) {
      productCategory.textContent = meal.strCategory || 'Special';
    }

    if (productDescription) {
      productDescription.textContent = meal.strInstructions || 'Delicious meal prepared with fresh ingredients and authentic spices.';
    }

    // Setup quantity controls
    this.setupProductQuantityControls(meal);
  }
}

setupProductQuantityControls(meal) {
  const decrementBtn = document.getElementById('decrement-btn');
  const incrementBtn = document.getElementById('increment-btn');
  const quantityValue = document.getElementById('quantity-value');
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  let quantity = 1;

  const updateQuantityDisplay = () => {
    if (quantityValue) {
      quantityValue.textContent = quantity;
    }
  };

  if (decrementBtn) {
    decrementBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        updateQuantityDisplay();
      }
    });
  }

  if (incrementBtn) {
    incrementBtn.addEventListener('click', () => {
      quantity++;
      updateQuantityDisplay();
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const price = (Math.abs(parseInt(meal.idMeal)) % 20 + 10) + 0.99;
      const cartItem = {
        id: meal.idMeal,
        name: meal.strMeal,
        price: price,
        image: meal.strMealThumb || 'assets/placeholder-meal.jpg',
        quantity: quantity
      };

      this.addToCart(cartItem);
      
      // Reset quantity
      quantity = 1;
      updateQuantityDisplay();
    });
  }
}

  // Navigation
  navigateToPage(page) {
    window.location.href = page;
  }
}

// Initialize the restaurant app
const restaurant = new SamaRestaurant();

// Add slide-in animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Export for external access if needed
window.restaurant = restaurant;
restaurant.configureAPI('https://foodish-api.herokuapp.com/api/');