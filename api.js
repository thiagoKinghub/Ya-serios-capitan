/* ==========================================================================
   MÓDULO: api.js - Consumo de Servicios Externos (Fetch & Async/Await)
   Materia: Desarrollo de Software para Plataformas Móviles (7° 5ta)
   Profesor: Axel Castellano Gutiérrez
   ========================================================================== */

export async function descargarProductosTech() {
    const fetchSmartphones = fetch("https://dummyjson.com/products/category/smartphones");
    const fetchLaptops = fetch("https://dummyjson.com/products/category/laptops");
    const fetchAccesorios = fetch("https://dummyjson.com/products/category/mobile-accessories");

    const respuestas = await Promise.all([fetchSmartphones, fetchLaptops, fetchAccesorios]);

    const datosSmartphones = await respuestas[0].json();
    const datosLaptops = await respuestas[1].json();
    const datosAccesorios = await respuestas[2].json();

    const todasLasCategorias = [datosSmartphones, datosLaptops, datosAccesorios];
    const productos = todasLasCategorias.flatMap(categoria => categoria.products);

    return productos;
}
