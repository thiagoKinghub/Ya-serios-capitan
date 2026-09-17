/* ==========================================================================
   MÓDULO: ui.js - Renderizado Visual y Métricas del Catálogo
   Materia: Desarrollo de Software para Plataformas Móviles (7° 5ta)
   Profesor: Axel Castellano Gutiérrez
   ========================================================================== */

export function crearTarjetaProductoHTML(producto, esFavorito) {
    const { id, title, price, category, thumbnail, stock } = producto;

    let claseBoton = "";
    let iconoFavorito = "☆";

    if (esFavorito) {
        claseBoton = "en-favoritos";
        iconoFavorito = "⭐";
    }

    return `
        <article class="tarjeta-producto" data-id="${id}">
            <div class="tarjeta-img-wrap">
                <img src="${thumbnail}" alt="${title}" loading="lazy" class="tarjeta-img">
                <span class="badge-categoria">${category}</span>
                <button class="btn-fav-card ${claseBoton}" data-id="${id}" aria-label="Guardar favorito">
                    ${iconoFavorito}
                </button>
            </div>
            <div class="tarjeta-cuerpo">
                <h3 class="tarjeta-titulo">${title}</h3>
                <div class="tarjeta-precio-wrap">
                    <span class="tarjeta-precio">$${price.toFixed(2)}</span>
                    <span class="tarjeta-stock">Stock: ${stock}</span>
                </div>
            </div>
        </article>
    `;
}

export function filtrarProductos(lista, textoBusqueda, categoria, favoritosIds = []) {
    return lista.filter(function (producto) {
        const titulo = producto.title.toLowerCase();
        const texto = textoBusqueda.toLowerCase();
        const coincideTexto = titulo.includes(texto);

        let coincideCategoria = false;

        if (categoria === "todas") {
            coincideCategoria = true;
        } else if (categoria === "favoritos") {
            coincideCategoria = favoritosIds.includes(producto.id);
        } else if (producto.category === categoria) {
            coincideCategoria = true;
        }

        return coincideTexto && coincideCategoria;
    });
}

export function calcularTotalCatalogo(lista) {
    const total = lista.reduce(function (acumulado, producto) {
        return acumulado + producto.price;
    }, 0);
    return total;
}
