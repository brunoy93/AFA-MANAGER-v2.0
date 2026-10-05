// ============================================
// PRESIDENTE: estado del presidente de la AFA
// ============================================

const presidente = {
    nombre: "Usted",
    anioMandato: 1,
    anioMaximo: 4,
    apoyoClubes: 50,
    prestigioInternacional: 50,
    dineroEnCaja: 11000,
    seleccionador: null,
    varActivo: false,
    historialDecisiones: []
};

// Sueldos anuales de cada DT (en millones)
const SUELDOS_DT = {
    "Pablo Aimar": 300,
    "Walter Samuel": 250,
    "Diego Simeone": 800,
    "Marcelo Gallardo": 500,
    "Javier Mascherano": 400,
    "Antonio Mohamed": 200,
    "José Pekerman": 400
};

function sueldoDTActual() {
    if (!presidente.seleccionador) return 0;
    return SUELDOS_DT[presidente.seleccionador] || 0;
}

// --- Ajustes rápidos de valores (con toasts automáticos) ---

function ajustarApoyo(cantidad) {
    if (cantidad === 0) return;
    presidente.apoyoClubes = Math.max(0, Math.min(100, Math.round(presidente.apoyoClubes + cantidad)));
    if (typeof toastApoyo === "function") toastApoyo(cantidad);
}

function ajustarPrestigio(cantidad) {
    if (cantidad === 0) return;
    presidente.prestigioInternacional = Math.max(0, Math.min(100, Math.round(presidente.prestigioInternacional + cantidad)));
    if (typeof toastPrestigio === "function") toastPrestigio(cantidad);
}

function ajustarDinero(cantidad) {
    if (cantidad === 0) return;
    presidente.dineroEnCaja = Math.max(0, Math.round(presidente.dineroEnCaja + cantidad));
    if (typeof toastDinero === "function") toastDinero(cantidad);
}