// ============================================
// IMÁGENES: helpers centralizados para todo lo visual
// ============================================

const PALETA_PLACEHOLDER = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#06b6d4",
    "#84cc16", "#a855f7", "#0ea5e9", "#f59e0b", "#10b981"
];

function colorPorNombre(nombre) {
    let hash = 0;
    const str = String(nombre || "");
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return PALETA_PLACEHOLDER[Math.abs(hash) % PALETA_PLACEHOLDER.length];
}

function normalizarNombre(nombre) {
    return String(nombre || "")
        .toLowerCase()
        .trim()
        .replace(/ /g, "_")
        .replace(/[áàäâã]/g, "a")
        .replace(/[èéëê]/g, "e")
        .replace(/[íìïî]/g, "i")
        .replace(/[óòöôõ]/g, "o")
        .replace(/[úùüû]/g, "u")
        .replace(/ñ/g, "n")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9_]/g, "");
}

// -----------------------------
// ESCUDO DE EQUIPO
// -----------------------------

function htmlEscudo(idEquipo, nombreEquipo, tamaño) {
    const tam = tamaño || 32;
    const inicial = String(nombreEquipo || "?").charAt(0).toUpperCase();
    const color = colorPorNombre(nombreEquipo);
    const ruta = "img/escudos/" + idEquipo + ".png";

    return (
        "<span class='img-wrap' style='width:" + tam + "px;height:" + tam + "px;background:" + color + ";'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='" + ruta + "' alt='" + nombreEquipo + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.parentElement.style.background='transparent'; this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + tam + "px;object-fit:contain;'>" +
        "</span>"
    );
}

// -----------------------------
// BANDERA DE PAÍS
// -----------------------------

function htmlBandera(nombrePais, tamaño) {
    const tam = tamaño || 32;
    const alto = Math.round(tam * 0.67);
    const inicial = String(nombrePais || "?").charAt(0).toUpperCase();
    const color = colorPorNombre(nombrePais);
    const archivo = normalizarNombre(nombrePais);
    const ruta = "img/banderas/" + archivo + ".png";

    return (
        "<span class='img-wrap' style='width:" + tam + "px;height:" + alto + "px;background:" + color + ";'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='" + ruta + "' alt='" + nombrePais + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.parentElement.style.background='transparent'; this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + alto + "px;object-fit:cover;'>" +
        "</span>"
    );
}

// -----------------------------
// FOTO DE DT
// -----------------------------

function htmlFotoDT(idDT, nombreDT, tamaño) {
    const tam = tamaño || 60;
    const inicial = String(nombreDT || "?").charAt(0).toUpperCase();
    const color = colorPorNombre(nombreDT);
    const ruta = "img/dts/" + idDT + ".png";

    return (
        "<span class='img-wrap img-wrap-redondo' style='width:" + tam + "px;height:" + tam + "px;background:" + color + ";'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='" + ruta + "' alt='" + nombreDT + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.parentElement.style.background='transparent'; this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + tam + "px;object-fit:cover;'>" +
        "</span>"
    );
}

// -----------------------------
// LOGO DE SPONSOR
// -----------------------------

function htmlLogoSponsor(idSponsor, nombreSponsor, tamaño) {
    const tam = tamaño || 60;
    const inicial = String(nombreSponsor || "?").charAt(0).toUpperCase();
    const color = colorPorNombre(nombreSponsor);
    const ruta = "img/sponsors/" + idSponsor + ".png";

    return (
        "<span class='img-wrap' style='width:" + tam + "px;height:" + tam + "px;background:" + color + ";'>" +
            "<span class='img-placeholder'>" + inicial + "</span>" +
            "<img src='" + ruta + "' alt='" + nombreSponsor + "' " +
                "onerror=\"this.style.display='none';\" " +
                "onload=\"this.parentElement.style.background='transparent'; this.previousElementSibling.style.display='none';\" " +
                "style='width:" + tam + "px;height:" + tam + "px;object-fit:contain;'>" +
        "</span>"
    );
}

// -----------------------------
// ICONO GENÉRICO (emoji o letra)
// -----------------------------

function htmlIcono(emoji, tamaño, colorFondo) {
    const tam = tamaño || 32;
    const color = colorFondo || "#1f2d3d";

    return (
        "<span class='img-wrap img-wrap-redondo' style='width:" + tam + "px;height:" + tam + "px;background:" + color + ";'>" +
            "<span class='img-placeholder' style='font-size:" + Math.round(tam * 0.55) + "px'>" + emoji + "</span>" +
        "</span>"
    );
}