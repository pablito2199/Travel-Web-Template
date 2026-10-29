/**
 * ============================================================
 *  CONFIGURACIÓN DEL VIAJE  (único archivo que hay que editar)
 * ============================================================
 *  Guía completa de campos: ver TRIP_GUIDE.md en la raíz del proyecto.
 *
 *  Todo lo que aparece en la web sale de este archivo.
 *  Los valores actuales son datos de EJEMPLO: sustitúyelos por los tuyos.
 *  Los campos marcados como opcionales pueden borrarse o dejarse vacíos ("")
 *  y la web simplemente no los mostrará.
 */

const tripConfig = {
    // ---------- Datos generales ----------
    meta: {
        title: "Mi Viaje",                          // Título principal (cabecera y pestaña)
        subtitle: "Una aventura inolvidable",       // Subtítulo bajo el título
        description: "Organización de mi viaje",    // Descripción (metadatos de la web)
        footerText: "Mi Viaje · XXXX · País",       // Texto inferior del pie de página
        flagUrl: "",                                // Opcional: URL de una imagen a ambos lados del título (p. ej. https://flagcdn.com/w80/es.png)
        themeColor: "#21468b"                       // Color de la barra del navegador en móvil
    },

    // ---------- Modo fiesta (opcional, desactivado por defecto) ----------
    // Si enabled es true, al pulsar el logo de la cabecera suena la música,
    // salen confetis y se muestran frases aleatorias.
    // Coloca los archivos en la carpeta public/party/ y escribe aquí solo el nombre.
    partyMode: {
        enabled: false,
        audio: "",                                  // Ej: "cancion.mp3" (archivo en public/party/)
        logo: "",                                   // Ej: "logo.jpg"    (archivo en public/party/)
        logoAlt: "Modo fiesta",
        lyrics: ["¡Vamos de viaje!", "¡Que empiece la fiesta!"], // Frases que se muestran en bucle
        confettiColors: ["#fff9c4", "#00a699", "#FFD700", "#ffffff"]
    },

    // ---------- Accesos rápidos (pie de página) ----------
    // icon: "drive" | "hotel" | "map" | "money" | "link"
    quickLinks: [
        { label: "Archivos", url: "https://drive.google.com/", icon: "drive" },
        { label: "Hotel Ciudad A", url: "https://www.booking.com/", icon: "hotel" },
        { label: "Mapa Ciudad A", url: "https://www.google.com/maps", icon: "map" },
        { label: "Gastos", url: "https://tricount.com/", icon: "money" }
    ],

    // ---------- Secciones ----------
    // Se muestran en este orden. Puedes añadir, borrar o reordenar las que quieras.
    // Tipos: "flights" | "hotel" | "city" | "transport"
    // Cada sección necesita un `id` único (sin espacios) y un `menuLabel` (texto del menú).
    sections: [
        {
            type: "flights",
            id: "vuelos-ida",
            menuLabel: "Vuelos ida",
            title: "Vuelos de ida",
            items: [
                {
                    from: "Destino inicio (INI)",
                    to: "Ciudad A (AAA)",
                    date: "Lun 6 Julio 2026",
                    hour: "09:00 - 11:30 (2 horas 30 minutos)",
                    link: "https://drive.google.com/"   // Opcional: billete / documento
                }
            ]
        },
        {
            type: "hotel",
            id: "hotel-ciudad-a",
            menuLabel: "Hotel Ciudad A",
            name: "Hotel Ejemplo",
            address: "Calle Ejemplo 1, 00000 Ciudad A, País",
            checkInDate: "Lun 6 Julio 2026",
            checkInHour: "15:00",
            checkOutDate: "Jue 9 Julio 2026",
            checkOutHour: "11:00",
            nights: "3",
            reservationNumber: "123456789",            // Opcional
            contact: {                                   // Opcional
                phone: "+00 000 000 000",
                email: "info@hotelejemplo.com"
            },
            driveLink: "https://drive.google.com/",     // Opcional: documentos de la reserva
            bookingLink: "https://www.booking.com/",    // Opcional: enlace a la reserva
            bookingCta: "Ver en Booking"                // Opcional: texto del botón
        },
        {
            type: "city",
            id: "ciudad-a",
            menuLabel: "Ciudad A",
            title: "Ciudad A",
            description: "Ciudad A y alrededores",
            mapUrl: "https://www.google.com/maps/embed?pb=",  // URL de "Insertar un mapa" de Google Maps (o Mi Mapa)
            editUrl: "",                                       // Opcional: enlace para editar el mapa
            color: "#0d6bc6"                                   // Color de acento de la sección
        },
        {
            type: "transport",
            id: "traslado",
            menuLabel: "Tren",
            title: "Traslado intermedio",
            mode: "train",                              // "bus" | "train" | "car"
            from: "Ciudad A",
            to: "Ciudad B",
            date: "Jue 9 Julio 2026",
            hour: "10:00 - 12:00 (2 horas)",
            link: "https://drive.google.com/"           // Opcional
        },
        {
            type: "hotel",
            id: "hotel-ciudad-b",
            menuLabel: "Hotel Ciudad B",
            name: "Hotel Muestra",
            address: "Avenida Muestra 2, 00001 Ciudad B, País",
            checkInDate: "Jue 9 Julio 2026",
            checkInHour: "15:00",
            checkOutDate: "Sáb 11 Julio 2026",
            checkOutHour: "11:00",
            nights: "2",
            reservationNumber: "",
            contact: { phone: "", email: "" },
            driveLink: "",
            bookingLink: ""
        },
        {
            type: "city",
            id: "ciudad-b",
            menuLabel: "Ciudad B",
            title: "Ciudad B",
            description: "Ciudad B y alrededores",
            mapUrl: "https://www.google.com/maps/embed?pb=",
            editUrl: "",
            color: "#13845f"
        },
        {
            type: "transport",
            id: "traslado-2",
            menuLabel: "Bus",
            title: "Traslado a Ciudad C",
            mode: "bus",
            from: "Ciudad B",
            to: "Ciudad C",
            date: "Sáb 11 Julio 2026",
            hour: "09:30 - 11:00 (1 hora 30 minutos)",
            link: ""
        },
        {
            type: "hotel",
            id: "hotel-ciudad-c",
            menuLabel: "Hotel Ciudad C",
            name: "Hotel Modelo",
            address: "Plaza Modelo 3, 00002 Ciudad C, País",
            checkInDate: "Sáb 11 Julio 2026",
            checkInHour: "15:00",
            checkOutDate: "Lun 13 Julio 2026",
            checkOutHour: "11:00",
            nights: "2",
            reservationNumber: "",
            contact: { phone: "", email: "" },
            driveLink: "",
            bookingLink: ""
        },
        {
            type: "city",
            id: "ciudad-c",
            menuLabel: "Ciudad C",
            title: "Ciudad C",
            description: "Ciudad C y alrededores",
            mapUrl: "https://www.google.com/maps/embed?pb=",
            editUrl: "",
            color: "#d9480f"
        },
        {
            type: "flights",
            id: "vuelos-vuelta",
            menuLabel: "Vuelos vuelta",
            title: "Vuelos de vuelta",
            items: [
                {
                    from: "Ciudad C (CCC)",
                    to: "Destino final (FIN)",
                    date: "Lun 13 Julio 2026",
                    hour: "18:00 - 20:30 (2 horas 30 minutos)",
                    link: ""
                }
            ]
        }
    ]
};

export default tripConfig;
