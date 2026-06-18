cat > /opt/infdemic/frontend/resistencias.js <<'EOF'
const API_URL = "/api";

function crearCelda(fila, texto) {
    const celda =
        document.createElement("td");

    celda.textContent =
        texto === null || texto === undefined
            ? ""
            : String(texto);

    fila.appendChild(celda);
}

function crearTablaResistencias(
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

    resistencias.forEach(
        function (resistencia) {
            const fila =
                document.createElement("tr");

            crearCelda(
                fila,
                resistencia.bacteria
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

    tabla.appendChild(cuerpo);
    contenedor.appendChild(tabla);

    return contenedor;
}

function cargarResistencias() {
    const zona =
        document.getElementById(
            "tablaResistencias"
        );

    zona.textContent =
        "Cargando resistencias...";

    peticionAutenticada(
        API_URL + "/resistencias"
    )
        .then(function (respuesta) {
            return respuesta.json()
                .then(function (datos) {
                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error ||
                            "No se pudieron consultar las resistencias."
                        );
                    }

                    return datos;
                });
        })
        .then(function (resistencias) {
            zona.replaceChildren();

            if (resistencias.length === 0) {
                const mensaje =
                    document.createElement("div");

                mensaje.className =
                    "resultado";

                mensaje.textContent =
                    "No hay resistencias registradas.";

                zona.appendChild(mensaje);
                return;
            }

            zona.appendChild(
                crearTablaResistencias(
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
                "btnResistencias"
            );

        boton.addEventListener(
            "click",
            cargarResistencias
        );
    }
);
EOF
