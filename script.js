// Sama Restaurant JavaScript
class SamaRestaurant {
  constructor() {
    this.cart = [];
    this.currentSlide = 0;
    this.meals = [];
    this.apiEndpoint = null; // Will be configured when API is ready
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.updateCartUI();
    this.initializeSlider();
    this.loadContent(); // Add content loading
  }

  // Theme Management
  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.toggleCart());
    }

    // Slider controls
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Auto-play slider
    setInterval(() => this.nextSlide(), 5000);
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

  addToCart(meal) {
    const existingItem = this.cart.find(item => item.id === meal.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...meal, quantity: 1 });
    }
    
    this.updateCartUI();
    this.showNotification(`${meal.name} added to cart!`);
  }

  removeFromCart(mealId) {
    this.cart = this.cart.filter(item => item.id !== mealId);
    this.updateCartUI();
  }

  updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
    }
  }

  // Slider Functionality
  async initializeSlider() {
    // Try to load meals from API if available
    if (this.apiEndpoint) {
      await this.loadMealsFromAPI();
    } else {
      // Use placeholder data for demo
    }
    
    this.renderSlider();
  }

  async loadMealsFromAPI() {
  try {
    // Use TheMealDB API (no CORS issues)
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
    const data = await response.json();
    
    this.meals = data.meals.slice(0, 3).map((meal, index) => ({
      id: index + 1,
      name: meal.strMeal,
      image: meal.strMealThumb,
      price: (Math.random() * 20 + 10).toFixed(2),
      priceBefore: (Math.random() * 10 + 25).toFixed(2)
    }));
    
  } catch (error) {
    console.error('Error loading meals from API:', error);
    this.meals = [];
  }
}

  loadPlaceholderMeals() {
    // Placeholder meals for demo when API is not available
    this.meals = [
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
  console.log('renderSlider called, meals:', this.meals);
console.log('Image URLs:', JSON.stringify(this.meals.map(m => m.image), null, 2));  const slider = document.querySelector('.slider');
  if (!slider || this.meals.length === 0) return;

    slider.innerHTML = this.meals.map(meal => `
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
    if (this.meals.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.meals.length;
    this.updateSliderPosition();
  }

  prevSlide() {
    if (this.meals.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.meals.length) % this.meals.length;
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