# Travel Web Template

Plantilla web (React) para organizar un viaje: vuelos, hoteles, ciudades con mapa, traslados y accesos rápidos.

## Cómo usarla

1. `npm install`
2. `npm start` y abre [http://localhost:3000](http://localhost:3000).
3. Pulsa **Personalizar viaje** para editar visualmente los datos, accesos, secciones y vuelos. Los cambios se guardan automáticamente en [`src/config/tripConfig.json`](src/config/tripConfig.json).
4. `npm run build` para generar la versión de producción.

El modo fiesta (música, confeti y frases) es opcional y viene desactivado; se activa en `partyMode` dentro de la configuración.
El editor solo está disponible al ejecutar la aplicación localmente con `npm start`; una web estática publicada no puede escribir archivos del proyecto. Consulta [`TRIP_GUIDE.md`](TRIP_GUIDE.md) para ver los campos disponibles.
