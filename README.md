# Simulador Ecommerce 
Este proyecto es un simulador de ecommerce desarrollado en JavaScript, HTML y CSS, utilizando Bootstrap 5 para el diseño visual y componentes modernos. Permite explorar productos, filtrar por categoría, gestionar un carrito de compras, realizar compras simuladas, ver historial de compras y alternar entre modo claro y oscuro.

## Características 
- __Catálogo de productos__: Visualización de productos con imagen, nombre, descripción, precio, categoría y stock. 
- __Filtro y búsqueda__: Filtra productos por categoría y busca por nombre o descripción. 
- __Carrito de compras__: Agrega productos al carrito, ajusta cantidades, elimina productos o vacía el carrito. 
- __Control de stock__: No permite agregar más productos al carrito que el stock disponible. El stock se descuenta al comprar. 
- __Persistencia__: El stock y el carrito se guardan en localStorage, por lo que persisten al recargar la página. 
- __Historial de compras__: Cada compra queda registrada y puede consultarse en un modal, mostrando productos, cantidades y totales por compra. 
- __Modo oscuro__: Alterna entre modo claro y oscuro con un solo clic, guardando la preferencia del usuario. 
- __Feedback visual__: Notificaciones con Toastify y alertas con SweetAlert2 para una mejor experiencia de usuario. -
- __Responsive__: Diseño adaptable a dispositivos móviles y de escritorio. 

## Instalación y uso 
- Clona o descarga este repositorio. 
- Abre index.html en tu navegador. 
- __¡Listo!__

Puedes comenzar a explorar y simular compras. 

## Personalización 
- __Agregar productos__: Edita el archivo data/products.json y agrega los productos que desees. 
Si cambias productos, borra la clave simu_products del localStorage para que se recarguen. 
- __Imágenes__: Coloca las imágenes de productos en la carpeta img/ y referencia su ruta en el JSON. 
- __Restablecer stock__: Borra la clave simu_products del localStorage desde la consola del navegador para restablecer el stock original. 
- __Dependencias__: Bootstrap 5 Bootstrap Icons SweetAlert2 Toastify JS Todas las dependencias se cargan desde CDN, no necesitas instalar nada extra.

### Créditos 
- Desarrollado por __Omar Dario Pascualetti__.