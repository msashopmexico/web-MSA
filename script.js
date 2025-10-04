// script.js
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

// Inicializar EmailJS con tu Public Key
emailjs.init('PhV4Hp36EPOLiGe6t');

// Función para obtener el carrito
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Mostrar el carrito en la página
function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total");
  const carrito = obtenerCarrito();
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio;

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "5px";

    const textSpan = document.createElement("span");
    textSpan.textContent = `${item.nombre} - Talla: ${item.talla || 'N/A'}${item.color ? ", Color: " + item.color : ""} - $${item.precio} MXN`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-red");
    btnEliminar.style.padding = "5px 10px";
    btnEliminar.style.fontSize = "14px";
    btnEliminar.addEventListener("click", () => {
      const carritoActualizado = obtenerCarrito();
      carritoActualizado.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
      mostrarCarrito();
    });

    li.appendChild(textSpan);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  totalTexto.textContent = `Total: $${total} MXN`;
  
  // Mostrar/ocultar botón de proceder según si hay productos
  const btnProceder = document.getElementById("btn-proceder");
  if (btnProceder) {
    if (carrito.length === 0) {
      btnProceder.style.display = "none";
    } else {
      btnProceder.style.display = "block";
    }
  }
}

// Vaciar carrito
document.getElementById("btn-vaciar").addEventListener("click", () => {
  localStorage.removeItem("carrito");
  mostrarCarrito();
});

// Mostrar formulario de compra
const btnProceder = document.getElementById("btn-proceder");
const formCompra = document.getElementById("form-compra");

if (btnProceder && formCompra) {
  btnProceder.addEventListener("click", () => {
    formCompra.style.display = "block";
    btnProceder.style.display = "none";
  });
}

// Enviar formulario con EmailJS
if (formCompra) {
  formCompra.addEventListener("submit", async (e) => {
    e.preventDefault();

    const confirmacion = confirm("¿Estás seguro que deseas realizar la compra?");
    if (!confirmacion) {
      alert("Compra cancelada");
      return;
    }

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const ciudad = document.getElementById("ciudad").value;
    const codigo = document.getElementById("codigo").value;

    const carritoActual = obtenerCarrito();
    if (carritoActual.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const productos = carritoActual.map(p => 
      `${p.nombre} - Talla: ${p.talla || 'N/A'}, Color: ${p.color || 'N/A'} - $${p.precio} MXN`
    ).join("\n");

    const total = carritoActual.reduce((acc, p) => acc + p.precio, 0);

    try {
      // REEMPLAZA 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con tus IDs reales de EmailJS
      await emailjs.send(PhV4Hp36EPOLiGe6t, template_biyacaa, {
        nombre: nombre,
        email: email,
        telefono: telefono,
        direccion: direccion,
        ciudad: ciudad,
        codigo_postal: codigo,
        productos: productos,
        total: `$${total} MXN`,
        fecha: new Date().toLocaleDateString()
      });
      
      alert("✅ Pedido enviado correctamente!");
      formCompra.style.display = "none";
      
      // Mostrar mensaje de procesamiento si existe el elemento
      const procesandoElement = document.getElementById("procesando");
      if (procesandoElement) {
        procesandoElement.style.display = "block";
      }
      
      localStorage.removeItem("carrito");
      mostrarCarrito();
      formCompra.reset();
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("❌ Error al enviar el pedido. Por favor, intenta nuevamente.");
    }
  });
}

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", mostrarCarrito);