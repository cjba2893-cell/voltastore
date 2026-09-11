---
paths:
  - 'resources/js/pages/**'
---

# Pages

## Usar tablas Bootstrap + rutas Wayfinder en páginas Inertia
Bootstrap 5 está instalado vía npm y su CSS se importa en resources/css/app.css (después de Tailwind). Las tablas de datos de productos/categorías usan clases Bootstrap (.table, .table-striped, .badge, etc.). El resto de la UI sigue usando Tailwind. Las rutas del backend se llaman con funciones Wayfinder generadas (@/routes/productos, @/routes/categorias), nunca con URLs hardcodeadas.
