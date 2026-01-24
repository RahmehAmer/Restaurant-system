# Sama Restaurant - Setup Guide

## API Integration Instructions

### 1. Meal Slider API Configuration

The meal slider is designed to dynamically fetch meal data from an external API. Here's how to configure it:

#### API Endpoint Setup
1. **Expected API Response Format:**
```json
[
  {
    "id": 1,
    "name": "Grilled Chicken Platter",
    "image": "https://your-api.com/images/meal1.jpg",
    "price": 12.99,
    "priceBefore": 18.99
  },
  {
    "id": 2,
    "name": "Beef Kebab Special",
    "image": "https://your-api.com/images/meal2.jpg",
    "price": 15.99,
    "priceBefore": 22.99
  }
]
```

#### Configuration Steps:
1. **Set the API endpoint in JavaScript:**
```javascript
// In the browser console or in script.js
restaurant.configureAPI('https://your-api.com/meals');
```

2. **Or update the script.js file directly:**
```javascript
// In the SamaRestaurant class constructor
this.apiEndpoint = 'https://your-api.com/meals';
```

#### Image Requirements:
- Images should be hosted on your API server or CDN
- Recommended size: 800x600px for optimal display
- Supported formats: JPG, PNG, WebP
- Fallback: If image fails to load, it will show placeholder

### 2. Google Sheets Checkout Integration (Future)

This section is reserved for future Google Sheets checkout integration.

#### Planned Features:
- Customer order data collection
- Automatic Google Sheets population
- Order confirmation system
- Inventory management

#### Setup Placeholder:
```javascript
// Future implementation
class CheckoutManager {
  async submitOrderToGoogleSheets(orderData) {
    // Google Sheets API integration will go here
  }
}
```

## Asset Management

### Required Images:
Place these images in the `assets/` folder:

1. **Logo:** `assets/logo.png`
   - Recommended size: 200x50px
   - Transparent background preferred

2. **Hero Image:** `assets/hero img.jpg`
   - Recommended size: 1920x1080px
   - High-quality restaurant/food photography

3. **Meal Images:** `assets/meal1.jpg`, `assets/meal2.jpg`, etc.
   - Recommended size: 800x600px
   - Professional food photography
   - Consistent styling and lighting

4. **Placeholder:** `assets/placeholder-meal.jpg`
   - Fallback image for missing meal photos

## Development Notes

### Theme System:
- Dark/Light mode toggle is fully functional
- Theme preference is saved in localStorage
- CSS variables make it easy to customize colors

### Cart System:
- Basic cart functionality implemented
- Cart count updates automatically
- Ready for enhanced cart modal implementation

### Responsive Design:
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly controls

### Performance:
- Lazy loading for images
- Optimized CSS transitions
- Efficient JavaScript event handling

## Customization

### Brand Colors:
Edit CSS variables in `style.css`:
```css
:root {
  --primary-color: #CB4154;  /* Brick Red */
  --secondary-color: #FFFFFF; /* White */
  /* Add your custom colors here */
}
```

### Typography:
The site uses Google Fonts (Poppins). To change:
1. Update the Google Fonts import in HTML
2. Modify the `font-family` property in CSS

### Content Updates:
All static content is stored in `content.js` for easy translation and updates.

## Troubleshooting

### Common Issues:

1. **Images not loading:**
   - Check file paths in assets folder
   - Verify image formats and sizes
   - Ensure proper naming (note the space in "hero img.jpg")

2. **Slider not working:**
   - Check if API endpoint is correctly configured
   - Verify API response format matches expected structure
   - Check browser console for errors

3. **Theme toggle not working:**
   - Ensure JavaScript is loaded properly
   - Check for CSS variable conflicts
   - Verify localStorage is enabled

4. **Responsive issues:**
   - Test on different screen sizes
   - Check CSS media queries
   - Verify container widths

## Next Steps

1. **Set up your meal API endpoint**
2. **Add actual meal images to assets folder**
3. **Configure Google Sheets checkout (when ready)**
4. **Test all functionality across devices**
5. **Add analytics and tracking as needed**

## Support

For technical issues or questions about the setup:
1. Check this documentation first
2. Review browser console for error messages
3. Test with placeholder data before API integration
4. Ensure all required assets are in place
