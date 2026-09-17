/* ==========================================================================
   TECHSTORE MÓVIL - ORQUESTADOR PRINCIPAL (PLANTILLA DE ALUMNOS)
   Materia: Desarrollo de Software para Plataformas Móviles (7° 5ta)
   Profesor: Axel Castellano Gutiérrez
   ========================================================================== */

// ==========================================================================
// 📦 IMPORTACIÓN DE MÓDULOS ES6 (ES Modules)
// ==========================================================================
import { descargarProductosTech } from "./api.js";
import { obtenerFavoritos, alternarFavorito, esProductoFavorito } from "./storage.js";
import { crearTarjetaProductoHTML, filtrarProductos, calcularTotalCatalogo } from "./ui.js";

// ==========================================================================
// 🎯 1. Selección de Nodos Principales del DOM
// ==========================================================================
const btnTema = document.querySelector("#btn-tema");
const iconoTema = document.querySelector("#icono-tema");

const btnVerFavoritos = document.querySelector("#btn-ver-favoritos");
const badgeFavoritos = document.querySelector("#badge-favoritos-contador");

const inputBuscador = document.querySelector("#input-buscador");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

const contenedorCatalogo = document.querySelector("#contenedor-catalogo");

const totalProductosSpan = document.querySelector("#total-productos-visibles");
const totalPrecioSpan = document.querySelector("#total-precio-acumulado");

const estadoLoading = document.querySelector("#estado-loading");
const estadoError = document.querySelector("#estado-error");
const btnReintentar = document.querySelector("#btn-reintentar");
const sinResultadosBox = document.querySelector("#sin-resultados");

// ==========================================================================
// 🧠 2. Estado Global en Memoria
// ==========================================================================
let productosEnMemoria = [];
let categoriaActual = "todas";

// ==========================================================================
// 🎨 3. Funciones de Renderizado y Actualización de UI
// ==========================================================================

function actualizarBadgeFavoritos() {
    const favoritos = obtenerFavoritos();
    badgeFavoritos.textContent = favoritos.length;
}

function aplicarFiltros() {
    const texto = inputBuscador.value;
    const favoritosIds = obtenerFavoritos();
    const productosFiltrados = filtrarProductos(productosEnMemoria, texto, categoriaActual, favoritosIds);

    totalProductosSpan.textContent = productosFiltrados.length;

    const total = calcularTotalCatalogo(productosFiltrados);
    totalPrecioSpan.textContent = "$" + total.toFixed(2);

    if (productosFiltrados.length === 0) {
        contenedorCatalogo.innerHTML = "";
        sinResultadosBox.classList.remove("oculto");
        return;
    }

    sinResultadosBox.classList.add("oculto");

    let html = "";
    for (let i = 0; i < productosFiltrados.length; i++) {
        const producto = productosFiltrados[i];
        const favorito = esProductoFavorito(producto.id);
        html = html + crearTarjetaProductoHTML(producto, favorito);
    }

    contenedorCatalogo.innerHTML = html;
}

function activarFiltroCategoria(categoria) {
    categoriaActual = categoria;

    for (let i = 0; i < botonesFiltro.length; i++) {
        const boton = botonesFiltro[i];

        if (boton.dataset.categoria === categoria) {
            boton.classList.add("activo");
        } else {
            boton.classList.remove("activo");
        }
    }

    aplicarFiltros();
}

// ==========================================================================
// 🌐 4. Carga Asíncrona del Catálogo (Consumo del módulo api.js)
// ==========================================================================
async function cargarCatalogo() {
    estadoLoading.classList.remove("oculto");
    estadoError.classList.add("oculto");
    contenedorCatalogo.innerHTML = "";

    try {
        const productos = await descargarProductosTech();
        productosEnMemoria = productos;
        estadoLoading.classList.add("oculto");
        aplicarFiltros();
    } catch (error) {
        console.error(error);
        estadoLoading.classList.add("oculto");
        estadoError.classList.remove("oculto");
    }
}

// ==========================================================================
// 🖱️ 5. Manejo de Eventos (Event Listeners & Delegación)
// ==========================================================================

// 🌓 Modo Oscuro:
btnTema.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        iconoTema.textContent = "☀️";
    } else {
        iconoTema.textContent = "🌙";
    }
});

// ⭐ Botón de Favoritos en el Header:
btnVerFavoritos.addEventListener("click", function () {
    activarFiltroCategoria("favoritos");
});

// 🏷️ Botones de Categorías:
for (let i = 0; i < botonesFiltro.length; i++) {
    const boton = botonesFiltro[i];
    boton.addEventListener("click", function () {
        activarFiltroCategoria(boton.dataset.categoria);
    });
}

// 🔍 Búsqueda en tiempo real:
inputBuscador.addEventListener("input", function () {
    aplicarFiltros();
});

// 🔄 Botón de Reintento:
btnReintentar.addEventListener("click", function () {
    cargarCatalogo();
});

// 🌟 Delegación de Favoritos en el Catálogo:
contenedorCatalogo.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".btn-fav-card");

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    alternarFavorito(id);
    actualizarBadgeFavoritos();
    aplicarFiltros();
});

// ==========================================================================
// 🚀 6. Inicialización de la Aplicación
// ==========================================================================
actualizarBadgeFavoritos();
cargarCatalogo();
