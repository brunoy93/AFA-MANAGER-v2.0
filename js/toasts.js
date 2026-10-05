// ============================================
// TOASTS: notificaciones flotantes
// ============================================

const toastsActivos = [];
const MAX_TOASTS = 4;
let toastsSilenciados = false;

function silenciarToasts() {
    toastsSilenciados = true;
}

function reactivarToasts() {
    toastsSilenciados = false;
}

function mostrarToast(mensaje, tipo, icono, duracion) {
    if (toastsSilenciados) return;

    const contenedor = document.getElementById("toast-container");
    if (!contenedor) return;

    if (toastsActivos.length >= MAX_TOASTS) {
        const viejo = toastsActivos.shift();
        if (viejo && viejo.parentNode) {
            viejo.classList.add("toast-saliendo");
            setTimeout(function() {
                if (viejo.parentNode) viejo.parentNode.removeChild(viejo);
            }, 300);
        }
    }

    const toast = document.createElement("div");
    toast.className = "toast toast-" + (tipo || "info");
    toast.innerHTML =
        (icono ? "<span class='toast-icono'>" + icono + "</span>" : "") +
        "<span class='toast-mensaje'>" + mensaje + "</span>";

    contenedor.appendChild(toast);
    toastsActivos.push(toast);

    if (typeof reproducirTono === "function") {
        if (tipo === "verde") reproducirTono(800, 0.08, "sine", 0.03);
        else if (tipo === "rojo") reproducirTono(300, 0.12, "sawtooth", 0.03);
        else if (tipo === "amarillo") reproducirTono(600, 0.1, "triangle", 0.03);
    }

    const tiempo = duracion || 3000;
    setTimeout(function() {
        if (!toast.parentNode) return;
        toast.classList.add("toast-saliendo");
        setTimeout(function() {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
            const idx = toastsActivos.indexOf(toast);
            if (idx !== -1) toastsActivos.splice(idx, 1);
        }, 300);
    }, tiempo);

    toast.addEventListener("click", function() {
        if (!toast.parentNode) return;
        toast.classList.add("toast-saliendo");
        setTimeout(function() {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
            const idx = toastsActivos.indexOf(toast);
            if (idx !== -1) toastsActivos.splice(idx, 1);
        }, 300);
    });
}

function toastApoyo(cantidad) {
    if (cantidad === 0) return;
    const signo = cantidad > 0 ? "+" : "";
    const icono = cantidad > 0 ? "📈" : "📉";
    const tipo = cantidad > 0 ? "verde" : "rojo";
    mostrarToast("Apoyo " + signo + cantidad, tipo, icono);
}

function toastPrestigio(cantidad) {
    if (cantidad === 0) return;
    const signo = cantidad > 0 ? "+" : "";
    const icono = cantidad > 0 ? "🌟" : "💫";
    const tipo = cantidad > 0 ? "verde" : "rojo";
    mostrarToast("Prestigio " + signo + cantidad, tipo, icono);
}

function toastDinero(cantidad) {
    if (cantidad === 0) return;
    const signo = cantidad > 0 ? "+" : "";
    const icono = cantidad > 0 ? "💰" : "💸";
    const tipo = cantidad > 0 ? "verde" : "rojo";
    const absCantidad = Math.abs(cantidad).toLocaleString();
    mostrarToast("Caja " + signo + "$" + absCantidad + "M", tipo, icono);
}

function toastInfo(mensaje, icono) {
    mostrarToast(mensaje, "azul", icono || "ℹ️");
}

function toastExito(mensaje, icono) {
    mostrarToast(mensaje, "verde", icono || "✅");
}

function toastAlerta(mensaje, icono) {
    mostrarToast(mensaje, "amarillo", icono || "⚠️");
}

function toastError(mensaje, icono) {
    mostrarToast(mensaje, "rojo", icono || "❌");
}

function toastLogro(mensaje, icono) {
    mostrarToast(mensaje, "violeta", icono || "🏆", 5000);
}

function toastNoticia(mensaje, icono) {
    mostrarToast(mensaje, "rosa", icono || "📰", 4000);
}