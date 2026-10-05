// ============================================
// JUEGO: el director de orquesta
// ============================================

let dtElegido = false;
let incidenciaPendiente = null;
let eventoPendiente = null;
let conferenciaPendiente = null;
let partidaYaIniciada = false;
let clasicoPendiente = null;

const CADA_DECISION = 6;
const CADA_ENCUESTA = 12;
const CADA_EVENTO = 10;
const CADA_CONFERENCIA = 18;
const PROBABILIDAD_EVENTO = 0.8;

// -----------------------------
// INICIALIZACIÓN
// -----------------------------

window.addEventListener("DOMContentLoaded", function() {
    if (hayPartidaGuardada()) {
        const info = infoPartidaGuardada();
        mostrarBienvenida(info);
    } else {
        iniciarPartidaNueva();
    }
    conectarBotonesHeader();
});

function conectarBotonesHeader() {
    const btnMute = document.getElementById("btn-mute");
    const btnNueva = document.getElementById("btn-nueva-partida");

    if (btnMute) {
        btnMute.addEventListener("click", function() {
            toggleMute();
        });
    }

    if (btnNueva) {
        btnNueva.addEventListener("click", function() {
            if (confirm("¿Seguro que querés empezar una nueva partida? Se perderá el progreso actual.")) {
                borrarPartida();
                location.reload();
            }
        });
    }
}

window.iniciarPartidaNueva = function() {
    inicializarEquipos();
    inicializarHistorialArbitros();
    inicializarTablas();
    generarTodosLosCalendarios();
    asignarDeudasIniciales();

    conectarPestanias();
    refrescarTodo();

    guardarInicioAnio();

    const btnAvanzar = document.getElementById("btn-avanzar");
    if (btnAvanzar) {
        btnAvanzar.addEventListener("click", manejarAvanceFecha);
        btnAvanzar.disabled = true;
    }

    conectarBotonesVAR();
    mostrarIntro();

    const btnIntro = document.getElementById("btn-intro-continuar");
    if (btnIntro) {
        btnIntro.addEventListener("click", function() {
            sonidoClick();
            cerrarIntro();
            mostrarEleccionDT();
        });
    }

    partidaYaIniciada = true;
    actualizarBotonMute();
};

window.iniciarPartidaGuardada = function() {
    const cargado = cargarPartida();
    if (!cargado) {
        alert("Error al cargar. Empezando una partida nueva.");
        iniciarPartidaNueva();
        return;
    }

    inicializarHistorialArbitros();

    conectarPestanias();
    refrescarTodo();

    const btnAvanzar = document.getElementById("btn-avanzar");
    if (btnAvanzar) {
        btnAvanzar.addEventListener("click", manejarAvanceFecha);
    }

    conectarBotonesVAR();

    if (!dtElegido) {
        if (btnAvanzar) btnAvanzar.disabled = true;
        mostrarIntro();
        const btnIntro = document.getElementById("btn-intro-continuar");
        if (btnIntro) {
            btnIntro.addEventListener("click", function() {
                sonidoClick();
                cerrarIntro();
                mostrarEleccionDT();
            });
        }
    }

    partidaYaIniciada = true;
    actualizarBotonMute();
    renderizarEncuesta();
};

function conectarBotonesVAR() {
    const btnActivar = document.getElementById("btn-var-activar");
    const btnRechazar = document.getElementById("btn-var-rechazar");

    if (btnActivar) {
        btnActivar.addEventListener("click", function() {
            sonidoClick();
            const exito = activarVAR();
            cerrarModalVAR();
            renderizarPanelPresidente();
            renderizarArbitros();

            if (!exito) {
                alert("No hay dinero suficiente para activar el VAR.");
                return;
            }

            noticiaDeVAR(true);

            setTimeout(function() {
                const ofertas = generarOfertasSponsors();
                mostrarModalSponsors(ofertas);
            }, 300);
        });
    }

    if (btnRechazar) {
        btnRechazar.addEventListener("click", function() {
            sonidoClick();
            cerrarModalVAR();
            noticiaDeVAR(false);

            setTimeout(function() {
                const ofertas = generarOfertasSponsors();
                mostrarModalSponsors(ofertas);
            }, 300);
        });
    }
}

function refrescarTodo() {
    renderizarTablasTodasLasLigas();
    renderizarVisorResultados();
    actualizarTituloFecha();
    actualizarBotonAvanzar();
    renderizarPanelPresidente();
    renderizarArbitros();
    renderizarFinanzas();
    renderizarRankingFifa();
    renderizarSeleccion();
    renderizarCopa();
    renderizarContinentales();
    renderizarNoticias();
    renderizarDecisionesRecientes();
    renderizarEncuesta();
    renderizarCopaArgentina();
}

function desbloquearJuego() {
    dtElegido = true;
    const btnAvanzar = document.getElementById("btn-avanzar");
    if (btnAvanzar) btnAvanzar.disabled = false;
    noticiasDeBienvenida();
    guardarPartida();
}

// -----------------------------
// AVANZAR UNA FECHA
// -----------------------------

function manejarAvanceFecha() {
    if (!dtElegido) return;

    const clasico = buscarClasicoSinArbitro();

    if (clasico) {
        clasicoPendiente = clasico;
        mostrarModalDesignacion(
            clasico.ligaId,
            clasico.numeroFecha,
            clasico.indicePartido,
            clasico.nombreLocal,
            clasico.nombreVisitante,
            function() {
                clasicoPendiente = null;
                ejecutarAvanceFecha();
            }
        );
        return;
    }

    ejecutarAvanceFecha();
}

function buscarClasicoSinArbitro() {
    const ligaId = "primera";
    const numeroFecha = estadoLigas.fechaActual;

    const calendario = estadoLigas.calendarios[ligaId];
    if (!calendario || numeroFecha >= calendario.length) return null;

    const fecha = calendario[numeroFecha];

    for (let i = 0; i < fecha.length; i++) {
        const partido = fecha[i];
        if (esClasico(partido.local, partido.visitante)) {
            const clave = clavePartido(ligaId, numeroFecha, i);
            if (!designacionesPorFecha[clave]) {
                const eqLocal = EQUIPOS[partido.local];
                const eqVisitante = EQUIPOS[partido.visitante];
                return {
                    ligaId: ligaId,
                    numeroFecha: numeroFecha,
                    indicePartido: i,
                    nombreLocal: eqLocal.nombre,
                    nombreVisitante: eqVisitante.nombre
                };
            }
        }
    }
    return null;
}

// -----------------------------
// EJECUTAR EL AVANCE REAL
// -----------------------------

function ejecutarAvanceFecha() {
    sonidoAvanzar();

    if (typeof mostrarSimulando === "function") mostrarSimulando();
    if (typeof silenciarToasts === "function") silenciarToasts();

    try {
        procesarFechasSancion();
        jugarFechaTodasLasLigas();
        detectarIncidenciaEnClasico();
    } catch (e) {
        console.error("Error en simulación:", e);
    }

    if (typeof reactivarToasts === "function") reactivarToasts();

    renderizarTablasTodasLasLigas();
    renderizarVisorResultados();
    actualizarTituloFecha();
    actualizarBotonAvanzar();
    renderizarPanelPresidente();
    renderizarArbitros();
    renderizarFinanzas();
    renderizarDecisionesRecientes();
    renderizarCopaArgentina();

    if (typeof ocultarSimulando === "function") ocultarSimulando();

    const total = estadoLigas.totalFechas;
    const fechasAmistoso = [
        Math.round(total * 0.2),
        Math.round(total * 0.4),
        Math.round(total * 0.6),
        Math.round(total * 0.8)
    ];

    if (fechasAmistoso.includes(estadoLigas.fechaActual)) {
        if (presidente.seleccionador) {
            simularAmistoso();
            renderizarSeleccion();
            renderizarRankingFifa();
        }
    }

    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) {
        manejarFinDeTemporada();
        guardarPartida();
        return;
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % CADA_DECISION === 0) {
        const idsUsados = presidente.historialDecisiones.map(function(d) {
            const encontrada = DECISIONES.find(function(dec) {
                return dec.titulo === d.decision;
            });
            return encontrada ? encontrada.id : null;
        });

        const decision = obtenerDecisionDisponible(idsUsados);
        if (decision) {
            mostrarDecision(decision);
        }
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % CADA_ENCUESTA === 0) {
        generarEncuesta();
        renderizarEncuesta();
        renderizarNoticias();
        renderizarPanelPresidente();
        if (typeof toastInfo === "function") {
            toastInfo("Nueva encuesta de opinión publicada", "📊");
        }
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % CADA_CONFERENCIA === 0) {
        conferenciaPendiente = generarConferencia();
    }

    if (estadoLigas.fechaActual > 0 &&
        estadoLigas.fechaActual % CADA_EVENTO === 0 &&
        Math.random() < PROBABILIDAD_EVENTO) {
        eventoPendiente = generarEvento();
    }

    guardarPartida();

    if (incidenciaPendiente) {
        const inc = incidenciaPendiente;
        incidenciaPendiente = null;

        noticiaDeIncidencia(inc.incidencia, inc.partido);
        renderizarNoticias();

        if (typeof toastAlerta === "function") {
            toastAlerta("¡Escándalo arbitral en el clásico!", "⚖️");
        }

        setTimeout(function() {
            mostrarModalIncidencia(inc.incidencia, inc.partido);
        }, 500);
        return;
    }

    if (conferenciaPendiente) {
        const conf = conferenciaPendiente;
        conferenciaPendiente = null;

        if (typeof toastInfo === "function") {
            toastInfo("Conferencia de prensa pendiente", "🎤");
        }

        setTimeout(function() {
            mostrarConferenciaPrensa(conf);
        }, 500);
        return;
    }

    if (eventoPendiente) {
        const ev = eventoPendiente;
        eventoPendiente = null;

        setTimeout(function() {
            if (ev.automatico) {
                ev.efecto();
                registrarEvento(ev, "Automático");
                mostrarModalEventoAutomatico(ev);
                renderizarPanelPresidente();
                renderizarFinanzas();
                renderizarNoticias();
            } else {
                mostrarModalEvento(ev);
            }
        }, 500);
    }
}

// -----------------------------
// FIN DE TEMPORADA
// -----------------------------

function manejarFinDeTemporada() {
    if (presidente.anioMandato === 1 || presidente.anioMandato === 3) {
        simularCopa();
        renderizarCopa();
        renderizarRankingFifa();
        renderizarPanelPresidente();
        noticiaDeCopa(copaActual.posicionArgentina);

        if (copaActual.posicionArgentina === "campeon") sonidoLogro();
        else if (copaActual.posicionArgentina === "grupos") sonidoFracaso();
    }

    simularContinentales();
    renderizarContinentales();
    renderizarPanelPresidente();

    cobrarVARAnual();
    cobrarEgresosAnuales();
    empeorarDeudasAlCierre();
    cerrarAnioFinanciero();

    const campPrimera = obtenerTablaOrdenada("primera")[0].nombre;
    const campNacional = obtenerTablaOrdenada("nacional")[0].nombre;
    const campFederalA = obtenerTablaOrdenada("federalA")[0].nombre;
    noticiasDeFinDeTemporada(campPrimera, campNacional, campFederalA);

    renderizarPanelPresidente();
    renderizarFinanzas();
    renderizarNoticias();

    mostrarFinDeTemporada();
}

// -----------------------------
// DETECTAR INCIDENCIA EN CLÁSICO
// -----------------------------

function detectarIncidenciaEnClasico() {
    const ligaId = "primera";
    const resultadosLiga = estadoLigas.resultados[ligaId];
    if (!resultadosLiga || resultadosLiga.length === 0) return;

    const ultimaFechaResultados = resultadosLiga[resultadosLiga.length - 1];
    const calendarioLiga = estadoLigas.calendarios[ligaId];
    const numeroFecha = estadoLigas.fechaActual - 1;
    const fechaCalendario = calendarioLiga[numeroFecha];
    if (!fechaCalendario) return;

    ultimaFechaResultados.forEach(function(r, indice) {
        if (!r.incidencia) return;

        const partido = fechaCalendario[indice];
        if (!partido) return;

        if (esClasico(partido.local, partido.visitante)) {
            incidenciaPendiente = {
                incidencia: r.incidencia,
                partido: { local: r.local, visitante: r.visitante }
            };
        }
    });
}