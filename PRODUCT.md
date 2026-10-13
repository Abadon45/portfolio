# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The storefront is for shoppers in the Philippines exploring Santé wellness products. The route is also a portfolio demonstration for people evaluating the shopping experience. The exact customer segments have not been confirmed.

## Product Purpose

`/twc-ecommerce` is an ecommerce portfolio reconstruction. This redesign should make Santé products the clear focus and let a shopper move from product discovery through the demo checkout and order confirmation.

## Positioning

No unique product promise or competitive differentiator has been confirmed. Do not invent health outcomes, medical advice, exclusivity, or superiority claims.

## Operating Context

Shoppers browse a product catalog, search and filter items, view product details, add products to a shared cart, select a shop, enter a Philippine delivery address, choose a demo payment option, and review an order confirmation.

## Capabilities and Constraints

- Product records are supplied through the portfolio's store product repository and normalized for the shared storefront.
- Cart, selected-shop checkout, delivery estimates, payment selection, and order confirmation use the existing demo flow. The checkout does not call a live payment provider.
- The address flow uses Philippine location data and mobile-number validation.
- Santé products use the existing Santé category and inventory rules. Preserve product names, prices, and available catalog facts.
- This request changes the presentation of the existing store. Preserve catalog behavior, cart state, shipping calculations, payment simulation, and order details.
- Keep the other three storefront concepts available as alternate demos; Santé remains the default shop experience.

## Brand Commitments

- Keep the Santé name and identity central to the redesigned storefront.
- Use the Street-fair Sheet direction for this portfolio storefront, with a layered screenprint character and a clear path from the Santé introduction into shopping.
- Avoid generated-looking filler: use actual catalog product images and names, and do not ship the mockups' invented packaging text, slogans, or claims.
- The user supplied [santeorganicbarley.shop](https://www.santeorganicbarley.shop/) as a reference for the experience. Treat it as inspiration, not as verified evidence for claims or permission to reuse its assets or copy.
- No exact logo, typeface, color values, or approved brand guide has been confirmed in this repository.

## Evidence on Hand

- Product fields and Santé category handling are defined in `app/twc-ecommerce/_components/twcProductCatalog.ts` and the store product repository boundary.
- Current local storefront artwork is under `public/images/twc/`; its origin and brand approval are not documented.
- No verified testimonials, certification documents, health claims, or current fulfillment promises have been provided for this demo.
- Checkout code describes the order and payment lifecycle as a local demo; do not present it as a live transaction.

## Product Principles

- Make product discovery and the next shopping action clear.
- Keep product facts distinct from editorial language and promotional claims.
- Preserve the complete, working demo purchase flow.
- Make the storefront usable on narrow mobile screens and with keyboard navigation.

## Accessibility & Inclusion

Follow the portfolio's baseline accessibility conventions, including keyboard operation, visible focus, readable contrast, and meaningful image alternatives. No additional product-specific accessibility standard has been confirmed.
