i'm building a resturant system website consisting of 3 main pages:
1- Home page
2- Menu page
3- Product details page

* Home page contains:
- Header: Logo, dark and light mode button, cart icon, and cta "Order Now"
Hero container containing of: Image, Headline and subheadline
 and cta "Order Now"
- Navigation bar: containing of 4 links 
- Static content in the boday contains: 
a. card containing image slider, 
b. Trust container containing 4 trust badges 
c. Horizontal card containing: Headine, subheadline, cta "View Menu"
- Footer containing: 4 footer columns 
The first column is for Policies and under of policies there are links for privacy policy, terms and conditions, return policy
The second column is for Contact & Support and under of contact & support there are Jordanian mobile number, Email address and Location: Amman- Jordan
The third column is for Follow us and under of it there are 3 icons for : Instagram, X and Facebook
The forth column is for Hours
© 2026 Restaurant. All rights reserved.


when Clicking on the cta "Order Now" in the header move to the menu page.
when Clicking  on hero container cta "Order Now" move to the menu page.
when Clicking on the "View Menu" cta in the horizontal card move to the menu page.


* Menu page contains: 
the menu page contains
1- same home header and footer with all icons and links
2- Our menu section contains: 
- Our menu as title
- meals categories in 2 rows flex layout 
- sorting by price (low to high and high to low)
- meals cards in grid layout (4 meals in each row) in 4 rows
each meal card contains: a. the name of the meal, b. the price after discount and c. discription of the meal
note: if the description is more than 2 rows show "..." and when clicking on the card show the full description in a modal d. cta button "add to cart" 
- pagination for numbering pages from 1 to 5 with previous and next buttons

- clicking on the "add to cart" button should:
- add the meal to the cart and show a toast message "Meal added to cart" 
- show the cart icon with the number of items in the cart, 
- show counter instead of add to cart icon cta with increment and decrement buttons, and clicking on the counter should update the cart items count, when the counter reaches 0 show a pop up to confirm deleting the item from the cart, or cancel deleting the item 
use same api integration you used in slider image for getting the items data fromTheMealDB API 



Clicking on the meal item in home page or menu page move me to the product page 

*Product page conatins: 
- same header and same footer as home page 
- product image on the left side of the page 
- product details on the right side of the page (contains: product title, product price, product description, small card for increment and decrement buttons with add to cart button)
When the user clicks on the "add to cart" button, the meal should be added to the cart and a toast message "Meal added to cart" should be shown. same as menu page 

For google sheet integration:
When the user click on check out button, show a modal with the following fields:
- Name
- Phone with prefilled data 7XXXXXXXX
- Address: City, street, Building number, additional notes 
- Payment method: Cash on delievry , Online payment
- Submit button

When the user click on submit button, send the data to google sheet by API and show a pop up message "Order submitted successfully" with "Thank you for your order, we will contact you once the order is out for delivery"





