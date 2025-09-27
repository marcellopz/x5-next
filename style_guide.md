# Style Guide - CSS Design Tokens

This guide documents all available CSS design tokens and how to use them in your Next.js application with Tailwind CSS v4.

## 🎨 Color Palette

### Background & Foreground

```tsx
// Main app backgrounds and text
<div className="bg-background text-foreground">
  Main content area with primary text
</div>
```

### Cards & Panels

```tsx
// Card components and content panels
<div className="bg-card text-card-foreground border border-border">
  Card content with proper contrast
</div>
```

### Popovers & Dropdowns

```tsx
// Dropdown menus, tooltips, popovers
<div className="bg-popover text-popover-foreground">Dropdown menu content</div>
```

## 🔥 Action Colors

### Primary Actions

```tsx
// Main buttons, links, call-to-action elements
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Button
</button>
```

### Secondary Actions

```tsx
// Secondary buttons, less prominent actions
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Secondary Button
</button>
```

### Destructive Actions

```tsx
// Delete buttons, error states, warnings
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete Item
</button>
```

## 🎯 Interactive States

### Muted Elements

```tsx
// Disabled states, placeholders, subtle text
<p className="text-muted-foreground">
  Helper text or disabled content
</p>

<div className="bg-muted">
  Subtle background for disabled elements
</div>
```

### Accent & Hover States

```tsx
// Hover backgrounds, highlighted states
<div className="hover:bg-accent hover:text-accent-foreground">
  Interactive element with hover state
</div>
```

## 🖼️ Form Elements

### Input Fields

```tsx
// Text inputs, form fields
<input className="border border-input bg-background text-foreground" />
```

### Focus States

```tsx
// Focus rings on interactive elements
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Accessible button with focus ring
</button>
```

### Borders

```tsx
// Consistent borders throughout the app
<div className="border border-border">Element with themed border</div>
```

## 📐 Layout & Spacing

### Border Radius

```tsx
// Consistent rounded corners
<div className="rounded-lg">      {/* Uses calc(var(--radius) - 2px) */}
<div className="rounded-md">      {/* Uses calc(var(--radius) - 2px) */}
<div className="rounded-sm">      {/* Uses calc(var(--radius) - 4px) */}
```

## 🎨 Current Color Values

### Dark Theme (Default)

- **Background**: `hsl(220, 60%, 7%)` - Very dark blue
- **Foreground**: `hsl(210, 40%, 98%)` - Light text
- **Primary**: `hsl(42, 60%, 52%)` - Golden yellow
- **Card**: `hsl(220, 50%, 9%)` - Dark blue cards
- **Border**: `hsl(42, 38%, 32%)` - Golden brown borders
- **Destructive**: `hsl(0, 62.8%, 30.6%)` - Dark red
- **Muted**: `hsl(220, 35%, 12%)` - Dark blue-gray

## 🚀 Usage Examples

### Complete Button Component

```tsx
function Button({ variant = "default", children, ...props }) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
        ring-offset-background transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Card Component

```tsx
function Card({ children, className, ...props }) {
  return (
    <div
      className={`
        rounded-lg border border-border bg-card text-card-foreground shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Input Component

```tsx
function Input({ className, ...props }) {
  return (
    <input
      className={`
        flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
        placeholder:text-muted-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
```

## 🎯 Best Practices

### 1. Always Use Design Tokens

```tsx
// ✅ Good - Uses design tokens
<div className="bg-card border border-border">

// ❌ Bad - Hard-coded colors
<div className="bg-gray-900 border border-gray-700">
```

### 2. Maintain Contrast Ratios

```tsx
// ✅ Good - Proper foreground/background pairing
<div className="bg-card text-card-foreground">
<div className="bg-primary text-primary-foreground">

// ❌ Bad - Mismatched contrast
<div className="bg-card text-primary-foreground">
```

### 3. Use Semantic Color Names

```tsx
// ✅ Good - Semantic meaning
<button className="bg-destructive">Delete</button>
<p className="text-muted-foreground">Helper text</p>

// ❌ Bad - Generic color names
<button className="bg-red-600">Delete</button>
<p className="text-gray-500">Helper text</p>
```

### 4. Leverage Hover States

```tsx
// ✅ Good - Consistent hover patterns
<button className="bg-primary hover:bg-primary/90">
<div className="hover:bg-accent hover:text-accent-foreground">
```

## 🔧 Customization

To modify colors, update the CSS custom properties in `app/globals.css`:

```css
:root {
  --primary: hsl(42, 60%, 52%); /* Change primary color */
  --destructive: hsl(0, 62.8%, 30.6%); /* Change error color */
  /* ... other tokens */
}
```

The Tailwind classes will automatically use the updated values throughout your application.

## 📱 Responsive Design

All color tokens work seamlessly with Tailwind's responsive prefixes:

```tsx
<div className="bg-card md:bg-background lg:bg-muted">
  Responsive background colors
</div>
```

---

_This style guide ensures consistent, accessible, and maintainable styling across your entire application._
