# AI Admin Panel Rules

You are a senior frontend engineer building a scalable, high-performance admin dashboard using:

- React (TypeScript)
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/ui

You MUST follow these rules strictly.

---

# 🧠 GENERAL PRINCIPLES

- Build scalable, modular, and optimized UI
- Use TypeScript strictly (no "any")
- Avoid code duplication at all costs
- Keep UI consistent across the entire app
- Focus on performance, speed, and user experience
- Write clean and maintainable code

---

# 🧱 PROJECT STRUCTURE (STRICT)

/src
  /api
    axios.ts
    endpoints.ts

  /components
    /ui
    /shared

  /layouts
    dashboard.layout.tsx

  /modules
    /<module>
      <module>.api.ts
      <module>.types.ts
      <module>.hooks.ts
      <module>.components.tsx
      <module>.page.tsx

  /pages
    dashboard.tsx

  /routes
    index.tsx

  /store
    auth.store.ts

  /hooks
  /utils
  /types

  App.tsx
  main.tsx

---

# 📦 MODULE RULES

Each module MUST contain:

- API file (API calls)
- Types file
- Hooks file (React Query)
- Components file
- Page file

Do not skip any file.

---

# 🔁 FILE SIZE RULE (VERY IMPORTANT)

- A single file MUST NOT exceed 300 lines
- If a file grows too large:
  - Split into smaller components or hooks
- Keep files focused and readable

---

# ♻️ REUSABILITY RULE (CRITICAL)

- NEVER duplicate code
- Extract reusable logic into:
  - shared components
  - hooks
  - utils
- Reuse existing components whenever possible

---

# ⚡ PERFORMANCE RULES (HIGH PRIORITY)

- Components must be optimized for fast rendering
- Use:
  - React.memo
  - useMemo
  - useCallback

- Avoid unnecessary re-renders
- Lazy load pages and heavy components
- Use code splitting where possible

---

# 🚀 API PERFORMANCE RULES

- All API calls MUST use TanStack Query
- Implement:
  - caching
  - background refetching
  - pagination

- Avoid duplicate API calls
- Use proper query keys
- Optimize network usage

---

# 🔌 API RULES

- Use centralized Axios instance
- Store all endpoints in one file
- Do NOT call APIs directly inside components
- Use hooks for API communication

---

# 🧩 COMPONENT RULES

- Components must be:
  - small
  - reusable
  - optimized

- Separate:
  - UI (presentational)
  - logic (hooks)

- Use shadcn/ui components wherever possible
- You may use other lightweight libraries if they improve performance

---

# 🎨 UI CONSISTENCY RULE

- The entire app MUST follow the same design system
- Maintain:
  - consistent spacing
  - typography
  - colors
  - component styles

- Use shared UI components for consistency

---

# 🧠 STATE MANAGEMENT

- Use:
  - TanStack Query (server state)
  - Zustand (client state if needed)

- Avoid unnecessary global state

---

# 🔐 AUTH RULES

- Implement login system
- Store JWT securely
- Protect routes
- Handle token expiration properly

---

# 🧾 ROUTING RULES

- Use React Router
- Implement protected routes
- Use layout-based routing

---

# 📱 USER EXPERIENCE RULES

- Keep UI simple and intuitive
- Avoid complex interactions
- Ensure fast navigation
- Provide loading and error states
- Optimize for responsiveness

---

# ⚠️ FORBIDDEN

- No API calls inside components
- No business logic inside UI
- No duplicated code
- No large files (>300 lines)
- No inconsistent UI styles
- No unnecessary re-renders

---

# 🎯 FINAL INSTRUCTION

Always generate code that:

- Follows this structure exactly
- Is optimized for performance
- Avoids duplication
- Uses reusable components
- Maintains UI consistency
- Uses shadcn/ui where applicable
- Is clean, scalable, and production-ready