Simulador Ecommerce
Este proyecto es un simulador de ecommerce desarrollado en JavaScript, HTML y CSS, utilizando Bootstrap 5 para el diseño visual y componentes modernos. Permite explorar productos, filtrar por categoría, gestionar un carrito de compras, realizar compras simuladas, ver historial de compras y alternar entre modo claro y oscuro.

Características
Catálogo de productos: Visualización de productos con imagen, nombre, descripción, precio, categoría y stock.
Filtro y búsqueda: Filtra productos por categoría y busca por nombre o descripción.
Carrito de compras: Agrega productos al carrito, ajusta cantidades, elimina productos o vacía el carrito.
Control de stock: No permite agregar más productos al carrito que el stock disponible. El stock se descuenta al comprar.
Persistencia: El stock y el carrito se guardan en localStorage, por lo que persisten al recargar la página.
Historial de compras: Cada compra queda registrada y puede consultarse en un modal, mostrando productos, cantidades y totales por compra.
Modo oscuro: Alterna entre modo claro y oscuro con un solo clic, guardando la preferencia del usuario.
Feedback visual: Notificaciones con Toastify y alertas con SweetAlert2 para una mejor experiencia de usuario.
Responsive: Diseño adaptable a dispositivos móviles y de escritorio.
Instalación y uso
Clona o descarga este repositorio.
Asegúrate de tener la siguiente estructura de carpetas:
Abre index.html en tu navegador.
¡Listo! Puedes comenzar a explorar y simular compras.
Personalización
Agregar productos: Edita el archivo data/products.json y agrega los productos que desees. Si cambias productos, borra la clave simu_products del localStorage para que se recarguen.
Imágenes: Coloca las imágenes de productos en la carpeta img/ y referencia su ruta en el JSON.
Restablecer stock: Borra la clave simu_products del localStorage desde la consola del navegador para restablecer el stock original.
Dependencias
Bootstrap 5
Bootstrap Icons
SweetAlert2
Toastify JS
Todas las dependencias se cargan desde CDN, no necesitas instalar nada extra.

Créditos
Desarrollado por Omar Dario Pascualetti.
