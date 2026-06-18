cat > /opt/infdemic/frontend/bacterias.js <<'EOF'
const API_URL = "/api";

function obtenerJsonProtegido(url, mensajeError) {
    return peticionAutenticada(url)
        .then(function (respuesta) {
            return respuesta.json()
                .then(function (datos) {
                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error || mensajeError
                        );
                    }

                    return datos;
                });
        });
}

function crearCelda(fila, texto) {
    const celda = document.createElement("td");

    celda.textContent =
        texto === null || texto === undefined
            ? ""
            : String(texto);

    fila.appendChild(celda);
}

function crearTablaBacterias(
    bacterias,
    resistencias
) {
    const contenedor =
        document.createElement("div");

    contenedor.className =
        "tabla-contenedor";

    const tabla =
        document.createElement("table");

    const cabecera =
        document.createElement("thead");

    const filaCabecera =
        document.createElement("tr");

    [
        "Bacteria",
        "Familia",
        "Descripción",
        "Antibiótico",
        "Nivel"
    ].forEach(function (titulo) {
        const celda =
            document.createElement("th");

        celda.textContent = titulo;
        filaCabecera.appendChild(celda);
    });

    cabecera.appendChild(filaCabecera);
    tabla.appendChild(cabecera);

    const cuerpo =
        document.createElement("tbody");

    bacterias.forEach(function (bacteria) {
        const resistenciasBacteria =
            resistencias.filter(
                function (resistencia) {
                    return (
                        resistencia.bacteria ===
                        bacteria.nombre
                    );
                }
            );

        if (resistenciasBacteria.length === 0) {
            const fila =
                document.createElement("tr");

            crearCelda(fila, bacteria.nombre);
            crearCelda(fila, bacteria.familia);
            crearCelda(fila, bacteria.descripcion);
            crearCelda(fila, "Sin información");
            crearCelda(fila, "Sin información");

            cuerpo.appendChild(fila);
            return;
        }

        resistenciasBacteria.forEach(
            function (resistencia) {
                const fila =
                    document.createElement("tr");

                crearCelda(
                    fila,
                    bacteria.nombre
                );

                crearCelda(
                    fila,
                    bacteria.familia
                );

                crearCelda(
                    fila,
                    bacteria.descripcion
                );

                crearCelda(
                    fila,
                    resistencia.antibiotico
                );

                crearCelda(
                    fila,
                    resistencia.nivel
                );

                cuerpo.appendChild(fila);
            }
        );
    });

    tabla.appendChild(cuerpo);
    contenedor.appendChild(tabla);

    return contenedor;
}

function cargarBacterias() {
    const zona =
        document.getElementById(
            "tablaBacterias"
        );

    zona.textContent =
        "Cargando información...";

    Promise.all([
        obtenerJsonProtegido(
            API_URL + "/bacterias",
            "No se pudieron consultar las bacterias."
        ),

        obtenerJsonProtegido(
            API_URL + "/resistencias",
            "No se pudieron consultar las resistencias."
        )
    ])
        .then(function (resultados) {
            const bacterias =
                resultados[0];

            const resistencias =
                resultados[1];

            zona.replaceChildren();

            if (bacterias.length === 0) {
                const mensaje =
                    document.createElement("div");

                mensaje.className =
                    "resultado";

                mensaje.textContent =
                    "No hay bacterias registradas.";

                zona.appendChild(mensaje);
                return;
            }

            zona.appendChild(
                crearTablaBacterias(
                    bacterias,
                    resistencias
                )
            );
        })
        .catch(function (error) {
            zona.replaceChildren();

            const mensaje =
                document.createElement("div");

            mensaje.className =
                "resultado error";

            mensaje.textContent =
                error.message;

            zona.appendChild(mensaje);
        });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const accesoPermitido =
            protegerPagina([
                "medico",
                "investigador"
            ]);

        if (!accesoPermitido) {
            return;
        }

        configurarNavegacion();

        const boton =
            document.getElementById(
                "btnBacterias"
            );

        boton.addEventListener(
            "click",
            cargarBacterias
        );
    }
);
EOF
