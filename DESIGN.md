---
name: Dra. Yadira Flores Wellness System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#504444'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#827474'
  outline-variant: '#d4c2c3'
  surface-tint: '#7c5357'
  primary: '#7c5357'
  on-primary: '#ffffff'
  primary-container: '#e8b4b8'
  on-primary-container: '#6b4448'
  inverse-primary: '#eeb9bd'
  secondary: '#665880'
  on-secondary: '#ffffff'
  secondary-container: '#e1cfff'
  on-secondary-container: '#64567f'
  tertiary: '#605e5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#c4c0be'
  on-tertiary-container: '#504e4d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadc'
  primary-fixed-dim: '#eeb9bd'
  on-primary-fixed: '#301216'
  on-primary-fixed-variant: '#623c40'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d0bfed'
  on-secondary-fixed: '#211438'
  on-secondary-fixed-variant: '#4d4067'
  tertiary-fixed: '#e6e1e0'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  grid-margin: 24px
  grid-gutter: 24px
---

## Brand & Style

The design system is rooted in the concept of "Empathetic Luxury." It bridges the gap between clinical excellence and the nurturing comfort of a wellness retreat. The brand personality is serene, sophisticated, and deeply human, avoiding the sterile, "industrial" feel of traditional healthcare.

The aesthetic follows a **Premium Minimalist** approach. It utilizes expansive whitespace to reduce cognitive load and evoke a sense of calm. Elements are treated with a tactile softness, favoring organic curves and gentle depth over sharp edges and flat planes. This ensures the patient feels cared for from the first digital touchpoint, establishing Dra. Yadira Flores as a trusted, high-end practitioner.

## Colors

The palette is designed to be soothing and distinctly feminine without being juvenile.

*   **Primary (Soft Rose):** Used for key actions, active states, and brand-building moments. It represents warmth and vitality.
*   **Secondary (Muted Lavender):** Used for supportive elements, sub-headers, and gentle highlights. It conveys calm and professional wisdom.
*   **Warm Nude/Cream:** The primary surface color for "container" elements to provide a softer alternative to stark white.
*   **Slate Grey:** Reserved exclusively for typography and iconography to ensure high legibility while remaining softer than pure black.
*   **Light Grey:** Used for subtle dividers and decorative borders to maintain structure without breaking the visual flow.

## Typography

The typography strategy employs a "High-Contrast Pairing" to balance authority with accessibility.

*   **Headlines (EB Garamond):** A classical, graceful serif that communicates the doctor's years of expertise and the premium nature of the practice. It should be used for all page titles and section headers.
*   **Body & UI (Manrope):** A modern, highly legible sans-serif chosen for its clean proportions and professional tone. It handles dense medical information with clarity.
*   **Stylistic Note:** Large display text should use a slight negative letter-spacing to appear more "editorial." Labels and small captions use increased letter-spacing and uppercase styling for a sophisticated, organized look.

## Layout & Spacing

This design system utilizes a **Fixed Grid** on desktop (12 columns, 1200px max-width) and a **Fluid Grid** on mobile (4 columns). 

The spacing philosophy prioritizes "Vertical Breathing Room." Section gaps are intentionally generous to prevent the interface from feeling cluttered or urgent. 
*   **Rhythm:** All spacing units are multiples of 8px.
*   **Margins:** Content containers use 24px internal padding as a standard to maintain a consistent "cushion" around information.
*   **Alignment:** Text is primarily left-aligned to assist readability, but headlines may be centered for more formal "hero" sections.

## Elevation & Depth

Hierarchy is achieved through **Ambient Shadows** and **Tonal Layering**.

*   **Surface Strategy:** The base background is Crisp White (#FFFFFF). Content cards and sections often sit on the Warm Nude (#F9F4F2) tone to create soft distinction.
*   **Shadows:** Use extremely diffused, low-opacity shadows (Color: #4A4A4A at 5-8% opacity) with a large blur radius (20px - 40px) and a slight Y-offset. This creates the "Floating Card" effect typical of high-end wellness sites.
*   **Translucency:** For navigation bars and modal overlays, use a backdrop blur (Glassmorphism) with a 90% white tint to maintain context of the underlying page.

## Shapes

The shape language is defined by **Softened Geometries**. Sharp corners are avoided to maintain the "warm and human" narrative.

*   **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
*   **Container Elements:** Large content cards, hero image containers, and modals use a 1.5rem (24px) radius.
*   **Iconography:** Icons should feature rounded terminators and a 1.5px stroke weight. Avoid filled icons unless indicating an "active" state; use line-art icons to maintain a lightweight, airy feel.

## Components

### Buttons
*   **Primary:** Filled with Soft Rose (#E8B4B8), white text, 8px border radius. On hover, a subtle scale-up (1.02x) and a deepened shadow.
*   **Secondary:** Ghost style with a 1px border of Muted Lavender (#A393BF) and matching text.

### Cards
*   Cards should have a 24px radius, no border, and a soft ambient shadow. They serve as the primary vessel for service descriptions and patient testimonials.

### Inputs
*   Fields use the Warm Nude (#F9F4F2) background with no border in their default state. On focus, they transition to a 1px Soft Rose border with a subtle glow.

### Navigation
*   A clean, centered navigation with plenty of horizontal padding. Use the `label-caps` typography style for menu items to give them a refined, organized appearance.

### Specialized Components
*   **Booking Widget:** A prominent but elegant component using the Secondary color for time slots and the Primary color for the final "Confirm" action.
*   **Wellness Chips:** Rounded pills used for tagging medical specialties or symptoms, using desaturated versions of the palette.