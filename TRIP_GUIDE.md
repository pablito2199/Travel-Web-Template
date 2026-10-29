# Guía para definir tu viaje

Todo el contenido de la web sale de **un único archivo**: [`src/config/tripConfig.js`](src/config/tripConfig.js).
Los valores que trae son de ejemplo; reemplázalos por los tuyos. Los campos marcados como *(opcional)* pueden dejarse vacíos (`""`) o borrarse y la web no los mostrará.

## 1. `meta` – datos generales

| Campo | Descripción |
|---|---|
| `title` | Título de la cabecera y de la pestaña del navegador |
| `subtitle` | Subtítulo bajo el título |
| `description` | Descripción del viaje |
| `footerText` | Texto inferior del pie de página *(opcional)* |
| `flagUrl` | URL de una imagen (p. ej. bandera) a ambos lados del título *(opcional)* |
| `heroImage` | Imagen de fondo de la cabecera: URL o ruta dentro de `public/` (p. ej. `"/portada.jpg"`). Sin ella se usa un degradado animado *(opcional)* |

## 1b. `theme` – tema visual

| Campo | Descripción |
|---|---|
| `name` | Tema por defecto: `ocean`, `forest`, `sunset`, `lavender`, `rose` o `graphite`. Cada uno tiene variante clara y oscura. Puedes crear más en `src/config/themes.js` |
| `mode` | `light`, `dark` o `auto` (sigue el sistema del visitante) |
| `allowThemePicker` | `true` (por defecto) muestra en el pie del menú un selector con todos los temas; la elección se recuerda |
| `allowToggle` | `true` (por defecto) muestra en el pie del menú el botón claro/oscuro (se recuerda la elección) |

## 2. `partyMode` – modo fiesta *(opcional, desactivado por defecto)*

Con `enabled: true` y un `audio` definido, al pulsar el logo de la cabecera suena la música, salen confetis y se muestran frases.

1. Copia tu audio y tu imagen en `public/party/`.
2. Rellena `audio` (ej. `"cancion.mp3"`), `logo` (ej. `"logo.jpg"`), `logoAlt`, `lyrics` (lista de frases) y `confettiColors`.
3. Cambia `enabled` a `true`.

Usa solo música e imágenes que tengas derecho a utilizar.

## 3. `quickLinks` – accesos rápidos del pie

Lista de `{ label, url, icon, color }`. `icon` puede ser `drive`, `hotel`, `map`, `money` o `link`. `color` es opcional (hexadecimal); si falta, se asigna uno aleatorio. Añade o borra las que quieras; si la lista está vacía no se muestra el bloque.

## 4. `sections` – secciones del viaje

Se muestran **en el orden de la lista** y generan automáticamente el menú. Todas necesitan:

- `type`: `flights`, `hotel`, `city` o `transport`
- `id`: identificador único, sin espacios (ancla del menú)
- `menuLabel`: texto en el menú
- `iconColor` *(opcional)*: color hexadecimal del icono y acentos de la sección. Si no se indica, se elige uno aleatorio (cambia en cada carga de la página)

### `flights`
`title`, `items[]` con `from`, `to`, `date`, `hour`, `link` *(opcional, enlace al billete)*.

### `hotel`
`name`, `address`, `checkInDate`, `checkInHour`, `checkOutDate`, `checkOutHour`, `nights`, y *(opcionales)* `reservationNumber`, `contact.phone`, `contact.email`, `driveLink`, `bookingLink`, `bookingCta`.

### `city`
`title`, `description`, `mapUrl` (URL de «Insertar mapa» de Google Maps o de Mis Mapas), `editUrl` *(opcional; si existe aparece el botón «Editar mapa»)*.

### `transport`
`title`, `mode` (`bus`, `train` o `car`), `from`, `to`, `date`, `hour`, `link` *(opcional)*.

## 5. Ejecutar

```bash
npm install
npm start      # desarrollo en http://localhost:3000
npm run build  # versión de producción
```

Los textos fijos de la interfaz («Check-in», «Vuelos», «Accesos rápidos»…) están en español dentro de los componentes de `src/components/`.
