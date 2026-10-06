# Table Ready Orders

Coffee Shop Website — Premium Ordering System Demo

Build a complete, polished, modern, responsive coffee shop website that will be used as a realistic demo for a local coffee shop.

The goal is NOT to create a generic AI-generated coffee landing page. The website should feel like a professionally designed website for an actual independent specialty coffee shop in the Philippines.

The website should prioritize:

Strong visual identity

Excellent UX/UI

Mobile-first responsive design

Easy food and drink ordering

A realistic dine-in ordering experience

Clear information about the coffee shop

Conversion from visitor → customer → order

Do NOT make the website look like a generic SaaS dashboard, template, or "AI slop" website.

1. DESIGN DIRECTION

Create a premium, modern coffee-shop aesthetic.

The design should feel:

Warm

Sophisticated

Minimal

Editorial

Authentic

Local

Premium but approachable

Avoid excessive rounded cards, excessive gradients, random glassmorphism, huge text everywhere, unnecessary animations, and generic AI-generated layouts.

Do NOT use:

Emoji as icons

Generic stock-looking illustrations

Excessive floating cards

Excessive pill-shaped UI elements

Random gradients

Overly futuristic UI

Generic "Welcome to our coffee shop" layouts

Use SVG icons where appropriate.

Use a carefully selected typography system with strong hierarchy.

Use high-quality coffee/food imagery. Images should feel like real café photography rather than generic AI-generated stock images.

The visual design should have enough personality that a real café owner could imagine using it for their actual business.

2. RESPONSIVE DESIGN

The website must be fully responsive.

Optimize for:

Desktop

Laptop

Tablet

Mobile

Mobile should NOT simply be a compressed desktop layout.

On mobile:

Navigation should become a clean mobile menu

Menu browsing should be easy with one hand

Product cards should remain readable

Cart/order interface should be easy to access

Checkout should be simple

Buttons should have appropriate touch targets

Images should resize/crop intelligently

Sticky ordering/cart controls may be used when appropriate

Test the layout conceptually at:

1440px

1024px

768px

390px

3. WEBSITE STRUCTURE

Create the following main sections/pages:

Homepage

Menu

Product/Menu Item Details

Cart

Checkout

Order Confirmation

Reviews

About

Contact / Location

The navigation should make it very easy to reach:

Home

Menu

Order

About

Reviews

Contact

Include a prominent "Order Now" CTA.

4. HOMEPAGE

Create a strong hero section.

The hero should include:

Coffee shop name

Short brand statement

High-quality coffee/food image

Primary CTA: "Order Now"

Secondary CTA: "View Menu"

Do NOT use generic copy such as:

"Welcome to the best coffee shop in town!"

Instead, use realistic, concise coffee-shop branding copy.

Example direction:

"Good coffee. Slow moments. Made for your table."

The copy should feel like a real local café brand.

Featured Menu

Show several popular products.

For example:

Spanish Latte

Iced Americano

Caramel Macchiato

Matcha Latte

Chocolate Frappe

Croissant

Carbonara

Chicken Rice Bowl

Each item should display:

Image

Name

Short description

Price

Add to Order button

Include "View Full Menu".

5. MENU SYSTEM

This is one of the most important parts of the website.

Create a complete menu system with categories:

COFFEE

Include multiple items such as:

Espresso

Americano

Iced Americano

Cappuccino

Café Latte

Spanish Latte

Caramel Macchiato

Mocha

Cold Brew

NON-COFFEE

Include:

Matcha Latte

Chocolate

Strawberry Milk

Chai Latte

Milk Tea

Fruit Soda

Iced Tea

PASTRIES

Include:

Butter Croissant

Chocolate Croissant

Cinnamon Roll

Blueberry Muffin

Banana Bread

Cookies

Cheesecake

RICE BOWLS

Include:

Chicken Rice Bowl

Beef Rice Bowl

Teriyaki Chicken

Korean Beef Bowl

Garlic Chicken

Breakfast Rice Bowl

Add enough items to make the menu feel like a real coffee shop rather than a small demo.

6. MENU ITEM DETAILS

When the user clicks a menu item, show a detailed product view.

Display:

Large product image

Product name

Description

Ingredients

Price

Available sizes

Customization options where appropriate

Quantity selector

Add to Order button

Example:

Spanish Latte

Ingredients:

Espresso

Fresh milk

Condensed milk

Ice

Price:
₱150

Size:

Regular

Large

The user should be able to customize the order before adding it to the cart.

For example:

Coffee:

Size

Hot/Iced

Extra shot

Less ice

Extra milk

Food:

Add-ons

Extra rice

Sauce preferences

Only show relevant customization options for each product.

7. ORDERING SYSTEM

The website must have a functional demo ordering system.

The user should be able to:

Browse menu

Select a product

Customize it

Add it to cart

Change quantity

Remove items

See subtotal

See applicable fees

See total

Proceed to checkout

Create a persistent cart experience.

On desktop, the cart can use a side drawer or dedicated cart page.

On mobile, make the cart easy to access using a sticky bottom order bar or similarly intuitive solution.

8. SPECIAL FEATURE — TABLE ORDERING

This is the most important unique feature.

The coffee shop should allow customers to order directly from their table.

The concept:

A customer sits at a table.

Instead of going to the cashier, they can open the website and order directly.

They select:

"Order for Table"

Then provide:

Customer Name

Example:
Juan Dela Cruz

Table Number

Example:
Table 12

The order should be associated with the customer's:

Name

Table number

Order number

Example:

Order #1042
Juan Dela Cruz
Table 12

This information should appear in the order confirmation so the café staff knows where to deliver the order.

9. DINE-IN ORDER FLOW

Create a clear ordering experience.

Recommended flow:

Step 1

User clicks:

"Order Now"

Step 2

User chooses:

"Dining Options"

Dine In

Takeout

Delivery

For the main demo, make Dine In the primary experience.

Step 3 — Dine In

Ask:

"Where should we serve your order?"

Customer Name:
[ Juan Dela Cruz ]

Table Number:
[ 12 ]

Step 4

Customer browses the menu.

Step 5

Customer adds products to the cart.

Step 6

Customer reviews the order.

Example:

Table 12
Juan Dela Cruz

2 × Spanish Latte
1 × Chicken Rice Bowl
1 × Butter Croissant

Subtotal
₱420

Total
₱420

Step 7

Customer proceeds to payment.

10. PAYMENT SYSTEM

Create a realistic payment interface.

For the demo, include:

GCash

Card

Cash

GCash should be the primary suggested payment method because this website is designed for a Philippine coffee shop.

However, structure the payment system so another payment provider can be integrated later.

IMPORTANT:

This is a demo website.

Do NOT pretend that a real payment transaction has occurred if no real payment gateway is connected.

For the demo:

Create a realistic payment UI

Clearly separate payment UI from actual payment processing

Use mock/demo payment confirmation when appropriate

Structure the code so a real payment provider can later be connected

Do not expose fake API keys or hardcode real payment credentials.

11. ORDER CONFIRMATION

After completing checkout, show a polished order confirmation screen.

Example:

ORDER CONFIRMED

Order #1042

Juan Dela Cruz
Table 12

Your order has been sent to the café.

Estimated preparation time:
15–20 minutes

Your order will be served directly to your table.

Show:

Ordered items

Quantity

Total

Payment method

Customer name

Table number

Order number

Estimated preparation time

Include a simple order status:

Received
↓
Preparing
↓
Ready
↓
Served

For the demo, allow the status to be simulated.

12. ONLINE DELIVERY SYSTEM

Also implement a delivery ordering option.

When the user chooses:

"Delivery"

ask for:

Full Name

Phone Number

Delivery Address

Optional delivery instructions

Then show:

Order subtotal

Delivery fee

Total

The interface should clearly distinguish between:

Dine-In

"Order from your table and we'll serve it to you."

Takeout

"Order ahead and pick it up at the café."

Delivery

"Have your order delivered to your location."

13. REVIEWS AND RATINGS

Create a professional reviews section.

Display:

Overall rating:

★★★★★
4.8 / 5

Based on 128 reviews

Show rating distribution:

5 stars — 92%
4 stars — 6%
3 stars — 2%
2 stars — 0%
1 star — 0%

Then display individual customer reviews.

Each review can include:

Customer name

Rating

Review

Date

Optional profile image

Example:

★★★★★

"Really good Spanish latte and the staff were friendly. Love that you can order directly from the table."

— Maria S.

Add a "Leave a Review" button.

Create a review form with:

Name

Rating

Review

Submit Review

For the demo, submitted reviews can be stored locally or through the application's database if one is configured.

14. CONTACT INFORMATION

Create a complete contact section.

Include clickable links for:

Facebook

Clicking should open the coffee shop's Facebook page.

Instagram

Clicking should open the coffee shop's Instagram page.

Email

Use a mailto link.

Phone

Use a tel link so mobile users can call directly.

Location

Display the coffee shop address.

Make the address clickable and connect it to a map service.

Example:

📍 Batangas City, Batangas

Do NOT use emoji icons.

Use clean SVG icons for:

Facebook

Instagram

Email

Phone

Location

15. LOCATION SECTION

Create a dedicated location section.

Include:

Café address

Opening hours

Phone number

Embedded map or map placeholder

"Get Directions" button

Example:

MONDAY — SUNDAY
8:00 AM — 10:00 PM

The information should look like real business information rather than placeholder UI.

16. ABOUT SECTION

Create a short but visually strong About section.

Explain the coffee shop's:

Story

Coffee philosophy

Food

Atmosphere

Community

Use photography and editorial-style layouts rather than a generic text block.

17. NAVIGATION

Create a clean navigation bar.

Desktop:

Logo | Menu | About | Reviews | Contact | Order Now

Mobile:

Logo
Menu icon

The navigation should remain easy to use while scrolling.

Consider a sticky header, but don't make it visually heavy.

18. FOOTER

Create a complete professional footer.

Include:

Logo

Short description

Menu links

Contact information

Social media

Opening hours

Location

Copyright

Include the same social/contact links here.

19. MICROINTERACTIONS

Use subtle animations only where they improve UX.

Examples:

Smooth hover states

Button feedback

Cart item transitions

Menu category transitions

Product image hover

Toast notification when item is added

Checkout step transitions

Avoid excessive animation.

The site should feel polished, not animated for the sake of animation.

20. UX REQUIREMENTS

Prioritize usability.

A customer should be able to go from:

Homepage → Menu → Product → Cart → Checkout → Payment → Order Confirmation

with minimal friction.

The primary CTA throughout the website should be:

"Order Now"

Do not make users hunt for the ordering system.

21. DATA STRUCTURE

Create reusable menu item data instead of hardcoding every product into separate components.

Each menu item should support fields such as:

id

name

category

description

ingredients

price

image

sizes

customization options

available

Categories:

coffee
nonCoffee
pastries
riceBowls

The cart should store:

product

quantity

selected size

selected options

price

subtotal

Orders should store:

order ID

customer name

phone

order type

table number

delivery address

items

subtotal

delivery fee

total

payment method

payment status

order status

created date

22. COMPONENT ARCHITECTURE

Build reusable components.

Examples:

Navbar

Hero

MenuSection

MenuCard

ProductModal

ProductDetails

CategoryTabs

CartDrawer

CartItem

Checkout

PaymentMethod

OrderConfirmation

OrderStatus

ReviewCard

ReviewSection

ContactSection

LocationSection

Footer

Do not create one giant component containing the entire website.

Keep components organized and maintainable.

23. TECHNICAL REQUIREMENTS

Use a modern frontend stack appropriate for Lovable.

Prefer:

React

TypeScript

Tailwind CSS

Vite

Component-based architecture

Use clean, maintainable code.

Avoid unnecessary dependencies.

Make sure the project can be easily extended later with:

Supabase/database

Authentication

Real payment gateway

Admin dashboard

Order management

QR-code table ordering

Real-time order status

Customer accounts

24. QR TABLE ORDERING — FUTURE-READY

Structure the system so that each table could eventually have a QR code.

Example:

Table 12 QR code

When scanned:

coffeewebsite.com/order?table=12

The website should automatically recognize:

Table 12

and populate the table number during checkout.

For the current demo, implement the table number manually, but make the architecture easy to extend to QR-based ordering.

25. ADMIN / STAFF CONCEPT

The demo should be architected with a future staff dashboard in mind.

Eventually, café staff should be able to see:

NEW ORDERS

Order #1042
Juan Dela Cruz
Table 12

2 × Spanish Latte
1 × Chicken Rice Bowl

[Accept Order]

Then:

PREPARING

Then:

READY

Then:

SERVED

Do not necessarily build the complete admin dashboard unless needed, but make the order data structure compatible with this future feature.

26. REALISTIC CONTENT

Do not use obvious placeholder text such as:

"Lorem ipsum"
"Coffee Shop Name"
"John Doe"
"123 Main Street"

Create believable Philippine coffee-shop demo content.

Use Philippine peso pricing such as:

₱120
₱140
₱150
₱180
₱220

Use realistic café menu descriptions.

Use realistic customer reviews.

However, clearly treat the business information as demo content.

27. VISUAL QUALITY BAR

The final result should look like something a freelance web developer could confidently show to a real café owner.

It should NOT look like:

A student project

A basic HTML template

A generic restaurant template

An AI-generated landing page

A SaaS dashboard

A Dribbble concept that is impossible to use

It should look like a real, commercially usable coffee shop website.

Focus on:

Visual hierarchy

Spacing

Typography

Photography

Product presentation

Navigation

Conversion

Mobile usability

Ordering UX

28. IMPORTANT: AVOID AI SLOP

Do NOT use the typical AI-generated design pattern:

Huge headline
+
gradient background
+
three rounded cards
+
random blobs
+
"Elevate your experience"
+
generic coffee image
+
huge rounded buttons.

Instead, create a deliberate visual system.

Use asymmetrical layouts where appropriate.

Use editorial typography.

Use whitespace intentionally.

Use strong photography.

Use subtle borders and shadows.

Use a restrained color palette.

Create visual hierarchy through typography, spacing, imagery, and composition rather than excessive UI decoration.

29. FINAL USER EXPERIENCE

The most important experience is:

A customer enters the website.

They immediately understand what the café offers.

They browse the menu.

They click an item.

They see:

Ingredients

Price

Options

Image

They add it to their order.

They choose:

Dine In

They enter:

Juan Dela Cruz
Table 12

They review their order.

They choose:

GCash

They complete the demo payment.

They receive:

ORDER #1042

"Your order is being prepared and will be served to Table 12."

This should be the signature feature of the website.

The website should communicate this feature clearly:

"Skip the cashier. Order from your table."

Make this concept visually prominent without making the site feel like a technology product.

30. BEFORE FINISHING

Review the entire website and make sure:

It is responsive

Navigation works

Menu categories work

Product details work

Ingredients are displayed

Prices are displayed

Items can be added to cart

Quantities can be changed

Items can be removed

Checkout works

Dine-in ordering works

Customer name can be entered

Table number can be entered

Delivery ordering works

Delivery address can be entered

Payment selection works

Demo payment flow works

Order confirmation works

Order status is displayed

Reviews are displayed

Rating system is displayed

Social links work

Email link works

Phone link works

Location link works

Mobile navigation works

No emoji are used as interface icons

SVG icons are used instead

There are no broken images

There is no lorem ipsum

There is no generic AI copy

There is no unnecessary UI clutter

Most importantly:

The final website must feel like a real coffee shop business with a thoughtfully designed ordering experience, not an AI-generated website template.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f7aca6d0-f51a-4c7d-913c-6b0361785260).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
