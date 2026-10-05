// ============================================
// GUARDADO: persistencia con localStorage
// ============================================

const CLAVE_GUARDADO = "afa_manager_partida_v2";

// -----------------------------
// GUARDAR
// -----------------------------

function guardarPartida() {
    try {
        const datos = {
            version: 2,
            fecha: new Date().toISOString(),

            presidente: {
                anioMandato: presidente.anioMandato,
                apoyoClubes: presidente.apoyoClubes,
                prestigioInternacional: presidente.prestigioInternacional,
                dineroEnCaja: presidente.dineroEnCaja,
                seleccionador: presidente.seleccionador,
                varActivo: presidente.varActivo,
                historialDecisiones: presidente.historialDecisiones
            },

            estadoLigas: {
                fechaActual: estadoLigas.fechaActual,
                totalFechas: estadoLigas.totalFechas,
                calendarios: estadoLigas.calendarios,
                resultados: estadoLigas.resultados,
                tablas: estadoLigas.tablas
            },

            equipos: EQUIPOS,
            proximoIdEquipo: proximoIdEquipo,
            ligasEstructura: {
                primera: { equipos: LIGAS.primera.equipos },
                nacional: { equipos: LIGAS.nacional.equipos },
                federalA: { equipos: LIGAS.federalA.equipos }
            },

            estadoFinanzas: {
                sponsorActual: estadoFinanzas.sponsorActual,
                ingresosDelAnio: estadoFinanzas.ingresosDelAnio,
                egresosDelAnio: estadoFinanzas.egresosDelAnio,
                historial: estadoFinanzas.historial,
                eventosDelAnio: estadoFinanzas.eventosDelAnio,
                rescates: estadoFinanzas.rescates,
                nivelDeuda: estadoFinanzas.nivelDeuda
            },

            historialAmistosos: historialAmistosos,
            copaActual: copaActual,
            historialContinentales: historialContinentales,

            ranking: {
                puesto: ESTADO_RANKING.puesto,
                historial: ESTADO_RANKING.historial
            },

            noticiasHistoricas: noticiasHistoricas,
            incidenciasHistoricas: incidenciasHistoricas,
            encuestasHistoricas: encuestasHistoricas,
            eventosHistoricos: eventosHistoricos,

            designacionesPorFecha: designacionesPorFecha,

            // ====== ÁRBITROS (v2.1) ======
            arbitros: {
                primera: ARBITROS.primera,
                nacional: ARBITROS.nacional,
                federalA: ARBITROS.federalA
            },

            // ====== COPA ARGENTINA (v2.2) ======
            copaArgentina: {
                anio: estadoCopaArgentina.anio,
                activa: estadoCopaArgentina.activa,
                rondaActual: estadoCopaArgentina.rondaActual,
                equiposVivos: estadoCopaArgentina.equiposVivos,
                bracket: estadoCopaArgentina.bracket,
                historial: estadoCopaArgentina.historial
            },

            dtElegido: dtElegido,
            valoresInicioAnio: valoresInicioAnio,
            fechaVisorActual: fechaVisorActual,
            sonidoActivado: sonidoActivado
        };

        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(datos));
        return true;
    } catch (e) {
        console.error("Error al guardar:", e);
        return false;
    }
}

// -----------------------------
// CARGAR
// -----------------------------

function hayPartidaGuardada() {
    return localStorage.getItem(CLAVE_GUARDADO) !== null;
}

function infoPartidaGuardada() {
    try {
        const raw = localStorage.getItem(CLAVE_GUARDADO);
        if (!raw) return null;
        const datos = JSON.parse(raw);
        return {
            fecha: datos.fecha,
            anioMandato: datos.presidente.anioMandato,
            fechaLiga: datos.estadoLigas.fechaActual,
            seleccionador: datos.presidente.seleccionador
        };
    } catch (e) {
        return null;
    }
}

function cargarPartida() {
    try {
        const raw = localStorage.getItem(CLAVE_GUARDADO);
        if (!raw) return false;

        const datos = JSON.parse(raw);

        // Presidente
        presidente.anioMandato = datos.presidente.anioMandato;
        presidente.apoyoClubes = datos.presidente.apoyoClubes;
        presidente.prestigioInternacional = datos.presidente.prestigioInternacional;
        presidente.dineroEnCaja = datos.presidente.dineroEnCaja;
        presidente.seleccionador = datos.presidente.seleccionador;
        presidente.varActivo = datos.presidente.varActivo;
        presidente.historialDecisiones = datos.presidente.historialDecisiones || [];

        // Estado de ligas
        estadoLigas.fechaActual = datos.estadoLigas.fechaActual;
        estadoLigas.totalFechas = datos.estadoLigas.totalFechas;
        estadoLigas.calendarios = datos.estadoLigas.calendarios;
        estadoLigas.resultados = datos.estadoLigas.resultados;
        estadoLigas.tablas = datos.estadoLigas.tablas;

        // Limpiar EQUIPOS antes de cargar
        Object.keys(EQUIPOS).forEach(function(id) { delete EQUIPOS[id]; });
        Object.keys(datos.equipos).forEach(function(id) {
            EQUIPOS[id] = datos.equipos[id];
        });
        proximoIdEquipo = datos.proximoIdEquipo || 104;

        // Limpiar y cargar estructura de ligas
        LIGAS.primera.equipos = datos.ligasEstructura.primera.equipos.slice();
        LIGAS.nacional.equipos = datos.ligasEstructura.nacional.equipos.slice();
        LIGAS.federalA.equipos = datos.ligasEstructura.federalA.equipos.slice();

        // Finanzas
        estadoFinanzas.sponsorActual = datos.estadoFinanzas.sponsorActual;
        estadoFinanzas.ingresosDelAnio = datos.estadoFinanzas.ingresosDelAnio;
        estadoFinanzas.egresosDelAnio = datos.estadoFinanzas.egresosDelAnio;
        estadoFinanzas.historial = datos.estadoFinanzas.historial || [];
        estadoFinanzas.eventosDelAnio = datos.estadoFinanzas.eventosDelAnio || [];
        estadoFinanzas.rescates = datos.estadoFinanzas.rescates || {};
        estadoFinanzas.nivelDeuda = datos.estadoFinanzas.nivelDeuda || {};

        // Selección
        historialAmistosos.length = 0;
        (datos.historialAmistosos || []).forEach(function(a) {
            historialAmistosos.push(a);
        });

        copaActual = datos.copaActual || null;

        historialContinentales.length = 0;
        (datos.historialContinentales || []).forEach(function(c) {
            historialContinentales.push(c);
        });

        // Ranking
        ESTADO_RANKING.puesto = datos.ranking.puesto;
        ESTADO_RANKING.historial = datos.ranking.historial || [];

        // Noticias e historiales
        noticiasHistoricas.length = 0;
        (datos.noticiasHistoricas || []).forEach(function(n) {
            noticiasHistoricas.push(n);
        });

        incidenciasHistoricas.length = 0;
        (datos.incidenciasHistoricas || []).forEach(function(i) {
            incidenciasHistoricas.push(i);
        });

        encuestasHistoricas.length = 0;
        (datos.encuestasHistoricas || []).forEach(function(e) {
            encuestasHistoricas.push(e);
        });

        eventosHistoricos.length = 0;
        (datos.eventosHistoricos || []).forEach(function(e) {
            eventosHistoricos.push(e);
        });

        // Designaciones de árbitros
        Object.keys(designacionesPorFecha).forEach(function(k) {
            delete designacionesPorFecha[k];
        });
        Object.keys(datos.designacionesPorFecha || {}).forEach(function(k) {
            designacionesPorFecha[k] = datos.designacionesPorFecha[k];
        });

        // ====== ÁRBITROS (v2.1) ======
        if (datos.arbitros) {
            ["primera", "nacional", "federalA"].forEach(function(ligaId) {
                if (datos.arbitros[ligaId]) {
                    ARBITROS[ligaId] = datos.arbitros[ligaId];
                    // Asegurar estructura historial/favores
                    ARBITROS[ligaId].forEach(function(arb) {
                        if (!arb.historial) arb.historial = [];
                        if (!arb.favores) arb.favores = {};
                    });
                }
            });
        }

        // ====== COPA ARGENTINA (v2.2) ======
        if (datos.copaArgentina) {
            estadoCopaArgentina.anio = datos.copaArgentina.anio || 1;
            estadoCopaArgentina.activa = datos.copaArgentina.activa || false;
            estadoCopaArgentina.rondaActual = datos.copaArgentina.rondaActual || 0;
            estadoCopaArgentina.equiposVivos = datos.copaArgentina.equiposVivos || [];
            estadoCopaArgentina.bracket = datos.copaArgentina.bracket || [];
            estadoCopaArgentina.historial = datos.copaArgentina.historial || [];
        }

        // Variables de control
        dtElegido = datos.dtElegido || false;
        valoresInicioAnio = datos.valoresInicioAnio || valoresInicioAnio;
        fechaVisorActual = datos.fechaVisorActual || 0;

        if (typeof datos.sonidoActivado !== "undefined") {
            sonidoActivado = datos.sonidoActivado;
        }

        return true;
    } catch (e) {
        console.error("Error al cargar:", e);
        return false;
    }
}

// -----------------------------
// BORRAR
// -----------------------------

function borrarPartida() {
    localStorage.removeItem(CLAVE_GUARDADO);
}