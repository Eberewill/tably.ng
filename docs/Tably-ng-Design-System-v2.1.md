---
name: Hospitality Editorial
version: 2.0
principle: "Quiet hospitality, not generic SaaS."
colors:
  canvas: '#F8F5EF'
  surface: '#FCF9F3'
  surface-primary: '#FFFFFF'
  surface-neutral: '#F1ECE3'
  surface-dim: '#DCDAD4'
  surface-container-low: '#F6F3ED'
  surface-container: '#F0EEE8'
  surface-container-high: '#EBE8E2'
  ink-primary: '#1C1C18'
  ink-secondary: '#4B463F'
  ink-muted: '#7C766E'
  border-subtle: '#DED8CE'
  border-strong: '#BFB7AC'
  accent-terracotta: '#B95332'
  accent-terracotta-dark: '#A04021'
  accent-gold: '#B8914B'
  error: '#BA1A1A'

typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-md:
    fontFamily: Poppins
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.3
  headline-sm:
    fontFamily: Poppins
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.4
  body-lg:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  label-caps:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.10em

radius:
  xs: 4px
  sm: 8px
  control: 10px
  card: 14px
  large: 18px
  modal: 22px
  full: 9999px

spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px

motion:
  duration-instant: 100ms
  duration-fast: 150ms
  duration-base: 220ms
  duration-slow: 320ms
  duration-hero: 420ms
  ease-standard: 'cubic-bezier(0.22, 1, 0.36, 1)'
  ease-enter: 'cubic-bezier(0.16, 1, 0.3, 1)'
  ease-exit: 'cubic-bezier(0.4, 0, 1, 1)'
---

# Tably.ng — Hospitality Editorial Design System v2.1

## 1. Design Position

This product should feel like a beautifully run restaurant: calm, confident, tactile, and almost invisible in use.

The visual language is **Editorial Hospitality**, not generic SaaS.

The interface should feel closer to a thoughtfully typeset menu, boutique hotel stationery, or a premium dining publication than to a dashboard template.

The system must avoid visual habits commonly associated with AI-generated product design:
- excessive rounded rectangles
- borders around every object
- floating cards for ordinary content
- nested cards inside cards
- large gradient blobs
- glassmorphism
- decorative shadows
- oversized pills
- gratuitous icons
- centered-everything layouts
- random bento grids
- exaggerated hover effects
- overly playful motion
- empty "premium" gradients with no functional purpose

**Core rule:** if typography, spacing, alignment, image composition, or tone can create hierarchy, do not add a container.

---


## 1A. Platform Context

**Platform:** Tably.ng

Tably.ng is a multi-tenant restaurant ordering and operations platform designed for real hospitality environments.

The design system must work coherently across:
- **Web app**
- **Desktop**
- **Tablet**

The same brand and interaction principles apply across all three surfaces, but layouts should respond to the job being performed rather than simply scaling the same screen.

### Web / Guest Experience

Prioritize browsing, appetite, ordering speed, and low-friction interaction.

### Tablet

Treat tablet as a first-class operational surface. Controls should remain touch-friendly, scanning should be fast, and important order states should be visible without excessive navigation.

### Desktop

Desktop can support greater information density for restaurant operations, menu management, reporting, and multi-location administration while preserving Tably.ng's restrained editorial character.

**Responsive rule:** shared system, adapted composition. Do not create a desktop UI and merely shrink it for tablet or web ordering.


## 2. Brand Character

The interface should communicate:

**Mature**
Not trendy for the sake of being trendy.

**Warm**
Use ivory, cream, black ink, terracotta, and restrained gold rather than clinical white, blue-grey, or neon accents.

**Editorial**
Type, spacing, photography, and composition create hierarchy.

**Quietly premium**
Premium means restraint, not visual decoration.

**Hospitality-first**
The guest should feel guided, never processed.

**Fast**
The interface should look calm while interactions remain immediate.

---

## 3. Canvas & Color

### Canvas

Use `#F8F5EF` as the primary app background.

It should feel like warm paper rather than a bright digital white.

Use pure white only when a surface genuinely needs separation from the canvas.

### Ink

Primary text:
`#1C1C18`

Secondary text:
`#4B463F`

Muted metadata:
`#7C766E`

Avoid light-grey text that compromises legibility.

### Accent

Terracotta is the primary action color:
`#B95332`

Use it for:
- primary actions
- selected states
- order confirmation moments
- progress markers
- active controls

Gold:
`#B8914B`

Gold is not a second CTA color.

Use it for:
- prices
- fine rules
- tiny decorative details
- premium status
- subtle focus details

Never use gold as a large filled surface.

---

## 4. Typography

### Primary typeface

Use **Poppins** across Tably.ng.

Poppins should carry both brand expression and product utility across the guest ordering experience, restaurant operations interface, and management surfaces.

Use it for:
- restaurant names
- menu headings
- dish names
- descriptions
- prices and totals
- modifiers
- quantity controls
- table numbers
- navigation
- labels
- buttons
- helper text
- statuses

### Hierarchy principle

Because Tably.ng uses one type family, hierarchy must come from **scale, weight, spacing, alignment, and contrast** rather than mixing serif and sans-serif typefaces.

Keep display typography restrained. Prefer medium weights and confident whitespace over oversized or ultra-bold headings.

Recommended weight range:
- Display: 500
- Headings: 500–600
- Body: 400
- Labels/actions: 500–600

Avoid relying on 700–800 weights as the default way to create hierarchy.

### Avoid

- oversized 72–96px SaaS hero headlines
- bold sans-serif everywhere
- uppercase paragraph text
- excessive font weights
- gradients inside text
- italic serif used as decoration without purpose

---

## 5. Layout

### Desktop

Use a 12-column grid with 64px side margins.

Maximum content width:
`1280px`

Do not stretch menu content edge-to-edge on large displays.

### Mobile

Use a 4-column grid with 20px side margins.

Mobile is the primary guest-ordering surface, not a compressed desktop layout.

### Breathing room

Major sections:
`64px`

Normal component separation:
`16–32px`

Tight utility groups:
`8px`

Whitespace is structural.

Do not fill empty areas simply because they exist.

---

## 6. Border Philosophy

This is a critical rule.

**Borders are punctuation, not containers.**

The interface must not use rounded outlined boxes around every navigation item, row, category, field, or piece of text.

### Do not use this pattern

A rounded rectangle with:
- transparent or cream fill
- 1px border
- text inside
- repeated many times vertically

This pattern quickly creates a generic AI/SaaS appearance.

Avoid it especially for:
- navigation links
- menu category tabs
- ordinary list rows
- section headers
- restaurant information
- passive labels
- filter groups

### Prefer these hierarchy tools first

1. whitespace
2. typography
3. alignment
4. tonal change
5. a single hairline divider
6. imagery
7. border only when containment is functionally necessary

### Border rules

Use `1px` borders only for:
- input boundaries when required
- selected/active states
- menu cards where the card is genuinely a tappable object
- drawers/modals where surfaces meet
- subtle table/list division
- accessibility-critical focus states

Never use more than one visible border hierarchy in the same component.

Do not combine:
- border
- shadow
- tinted background
- strong radius

unless the component genuinely requires strong separation.

### Partial and decorative borders

Avoid decorative partial-border treatments around controls or text, including the bracket-like rounded border style that makes an element look artificially "designed."

If a control needs emphasis, prefer:
- a terracotta underline
- a gold dot
- a tonal background shift
- increased text contrast

---

## 7. Shape Language

The system should feel softly architectural, not bubbly.

### Radius guidance

Small utility elements:
`4–8px`

Buttons and inputs:
`10px`

Menu cards:
`14px`

Large media:
`18px`

Modal/sheet:
`22px`

Pills:
Only for true chips, compact statuses, or dietary tags.

### Avoid

- 20px+ radius on ordinary buttons
- pill-shaped primary buttons by default
- every component sharing the same large radius
- nested rounded surfaces
- bubble-like layouts

The eye should notice the food and typography before the radii.

---

## 8. Depth

No conventional SaaS card shadows.

Depth should come from:

- tonal contrast
- image framing
- overlap when functionally meaningful
- surface transitions
- very subtle backdrop dimming
- occasional 1px rules

If a surface is distinguishable by tone, do not add a shadow.

### Shadow exception

For transient overlays only, such as a floating cart or modal, a very soft shadow may be used:

```css
box-shadow: 0 18px 50px rgba(28, 28, 24, 0.08);
```

Never use multiple layered shadows.

---

## 9. Menu Cards

Menu items are the primary commercial object.

They should not resemble ecommerce product cards.

### Preferred structure

Image
Dish name + price
Description
Optional dietary metadata
Add action

Allow content to breathe.

### Desktop

Cards may use:
- white or canvas surface
- 1px subtle border only when necessary
- 14px radius
- large image
- no drop shadow

### Mobile

Prefer flatter presentation.

A strong mobile pattern is:

`Dish information | image`

with a subtle divider between rows instead of wrapping every dish in a card.

This makes a long menu easier to scan and feels closer to a physical menu.

### Hover

Do not lift cards.

Use:
- image scale to max `1.015`
- tiny tonal shift
- optional border contrast increase

---

## 10. Navigation

Navigation should feel almost typographic.

### Restaurant navigation

Prefer:
- plain text links
- category names in a horizontal scroll
- active terracotta underline
- small gold marker
- weight or opacity shift

Do not put each navigation item inside an outlined rounded rectangle.

### Sticky menu categories

On mobile, category navigation may become sticky.

Use a canvas background with subtle translucency only if content remains fully legible.

Do not use a glassmorphism bar.

---

## 11. Buttons

### Primary

Terracotta fill
White text
10px radius
No shadow

Height:
`44–48px`

### Secondary

Prefer text + restrained border only for true secondary actions.

Do not use bordered secondary buttons repeatedly across the interface.

### Tertiary

Plain text.

Optional arrow or compact icon.

### Press state

Scale to `0.98` for approximately `100–140ms`.

No bounce.

---

## 12. Inputs

Inputs should not look like floating pill controls.

Default:
- neutral tonal background
- 10px radius
- no visible border

Focus:
- surface becomes slightly brighter
- 1px ink or terracotta focus ring

Always include visible labels where context could be ambiguous.

---

## 13. Chips

Use chips sparingly.

Appropriate:
- Vegan
- Spicy
- Gluten-free
- New
- Sold out

Do not use chips for ordinary navigation.

Chips should be compact and quiet.

---

## 14. Tables & Order Lists

Orders should feel operational and precise.

Prefer:
- alignment
- tabular numbers
- separators
- whitespace
- status text

Avoid wrapping every order in a floating rounded card on desktop.

Use cards only on mobile when grouping materially improves scanning.

---

## 15. Photography

Photography provides most of the visual richness.

Images should feel:
- natural
- appetizing
- warm
- editorial
- minimally processed

Avoid:
- synthetic-looking AI food
- over-saturated photography
- stock-photo compositions
- excessive background blur
- decorative image masks

Dish photography should normally use:
`4:3`, `3:2`, or square crops depending on context.

Use one dominant crop system per screen.

---

# Motion System

## 16. Motion Philosophy

Motion should behave like excellent service:

**present when useful, invisible when not.**

The product should feel smooth without looking animated.

Avoid:
- bounce
- elastic easing
- overshoot
- exaggerated springs
- large-scale zooming
- random stagger animation
- parallax for decoration
- constant floating elements
- motion on every scroll event

Use:
- opacity
- 4–16px translation
- clipping
- restrained shared-element movement
- tiny scale response
- background tone interpolation

---

## 17. Timing

### Micro interaction

`100–180ms`

Use for:
- press
- hover
- check state
- quantity changes
- icon state

### Interface transition

`200–320ms`

Use for:
- drawers
- tabs
- filters
- menu category changes
- sheets
- cart states

### Editorial transition

`320–420ms`

Use sparingly for:
- dish-detail opening
- hero transitions
- restaurant landing entrance
- large image transitions

Anything slower than ~450ms should have a strong reason.

---

## 18. Easing

```css
:root {
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-base: 220ms;
  --duration-slow: 320ms;
  --duration-hero: 420ms;
}
```

Do not use one easing curve for every interaction.

Entrances may decelerate gently.

Exits should leave slightly faster than entrances arrive.

---

## 19. Page Entry

A page may enter with:

- opacity `0 → 1`
- translateY `8–12px → 0`
- duration `280–320ms`

Do not animate the entire page from 40px away.

Do not stagger every child individually.

At most, stagger major content groups by `30–50ms`.

---

## 20. Category Switching

When switching menu categories:

- active underline glides to the new label
- menu content crossfades
- content may move `4–8px`
- preserve scroll position intentionally

Do not slide an entire screen horizontally unless the navigation model actually represents pages.

---

## 21. Dish Detail Transition

This is the product's signature motion.

When a guest opens a dish:

1. selected image subtly expands or visually carries into the detail view
2. destination surface fades in
3. dish title appears immediately
4. description and modifiers fade in with minimal delay
5. bottom order action settles into position

The transition should feel continuous rather than like a generic modal appearing.

Recommended:
`280–420ms`

Scale should remain subtle:
approximately `0.985 → 1`.

---

## 22. Cart

### Mobile

Use a bottom sheet.

Opening:
- translateY `16–24px → 0`
- opacity `0 → 1`
- backdrop `0 → 0.18–0.24`

Do not use a dramatic black overlay.

### Desktop

Use a right-side panel or anchored summary.

Movement should be short and controlled.

---

## 23. Add-to-Order Feedback

When an item is added:

- button compresses to `0.98`
- label may transition from "Add" to "Added"
- quantity control can replace the button
- cart count updates with a restrained scale transition

Do not:
- fire confetti
- bounce the cart
- animate the dish flying across the screen
- use celebratory effects for routine actions

---

## 24. Loading

Prefer content-aware skeletons.

Skeleton contrast should be low.

Use either:
- very subtle opacity breathing
- a restrained tonal sweep

Avoid glossy gradient shimmer.

If content loads quickly, prefer preserving the layout and fading content in rather than showing a skeleton for a fraction of a second.

---

## 25. Reduced Motion

Always support:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Meaning must never depend on motion.

---

# Product-Specific Patterns

## 26. Guest Ordering Flow

The ordering journey should remain visually simple:

**Restaurant identity**
↓
**Menu categories**
↓
**Dish browsing**
↓
**Dish configuration**
↓
**Cart**
↓
**Review**
↓
**Order placed**

Do not introduce dashboard language into the guest experience.

The guest UI should feel like the restaurant itself is speaking.

---

## 27. Multi-Tenant Brand Handling

The platform brand should stay quiet inside restaurant experiences.

Allow each restaurant to express:
- logo
- restaurant name
- selected imagery
- optional accent
- menu content

Do not allow tenant customization to destroy layout hierarchy or accessibility.

The product should remain recognizable through:
- typography
- spacing
- interaction behavior
- motion
- structural consistency

rather than a giant platform logo.

---

## 28. Restaurant Admin

The admin product may be denser than the guest experience, but must keep the same philosophy.

Prefer:
- flat tables
- editorial section headings
- restrained side navigation
- clear numbers
- useful empty states
- few containers

Avoid copying conventional analytics-dashboard templates.

Operational clarity is more important than visual novelty.

---

# Anti-Generic Design Checklist

Before shipping a screen, ask:

- Can any border be removed?
- Can any card become a flat section?
- Is a pill being used where plain text would work?
- Is radius doing too much visual work?
- Is there a shadow that could become a tonal change?
- Is an icon necessary?
- Is the hierarchy understandable in grayscale?
- Does the screen still feel premium without animation?
- Does the animation clarify continuity?
- Is photography doing enough of the visual work?
- Does this look designed specifically for hospitality?
- Would this still feel mature three years from now?

If the answer to the last two questions is no, simplify.

---

# Reference Component Behaviors

## Menu item hover

```css
.menu-item {
  transition:
    background-color 220ms var(--ease-standard),
    border-color 220ms var(--ease-standard);
}

.menu-item img {
  transform: scale(1);
  transition: transform 320ms var(--ease-enter);
}

@media (hover: hover) {
  .menu-item:hover img {
    transform: scale(1.015);
  }
}
```

## Quiet content reveal

```css
.reveal {
  opacity: 0;
  transform: translateY(10px);
}

.reveal[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 260ms var(--ease-enter),
    transform 300ms var(--ease-enter);
}
```

## Dish sheet

```css
.dish-sheet {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
}

.dish-sheet[data-state="open"] {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition:
    opacity 220ms var(--ease-enter),
    transform 320ms var(--ease-enter);
}
```

---

# Final Principle

**Do less, but make every decision intentional.**

This product should never need to announce that it is premium.

The warmth of the canvas, quality of the type, composition of the food, clarity of the hierarchy, precision of the interactions, and restraint of the motion should communicate that automatically.
