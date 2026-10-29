const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config', 'tripConfig.json');
const allowedTypes = new Set(['flights', 'hotel', 'city', 'transport']);
const loopbackAddresses = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
const maxBodySize = 1024 * 1024;

function validateConfig(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        return 'La configuración debe ser un objeto JSON.';
    }
    if (!config.meta || typeof config.meta !== 'object' || Array.isArray(config.meta)) {
        return 'Falta el objeto "meta".';
    }
    if (!Array.isArray(config.quickLinks) || !Array.isArray(config.sections)) {
        return '"quickLinks" y "sections" deben ser listas.';
    }
    if (config.quickLinks.some(link => !link || typeof link !== 'object' || Array.isArray(link))) {
        return 'Cada acceso rápido debe ser un objeto.';
    }

    const ids = new Set();
    for (const section of config.sections) {
        if (!section || typeof section !== 'object' || Array.isArray(section)) {
            return 'Cada sección debe ser un objeto.';
        }
        if (!allowedTypes.has(section.type)) {
            return `Tipo de sección no válido: "${section.type}".`;
        }
        if (typeof section.id !== 'string' || !section.id.trim() || ids.has(section.id)) {
            return 'Cada sección necesita un id único y no vacío.';
        }
        if (section.type === 'flights' && !Array.isArray(section.items)) {
            return `La sección "${section.id}" necesita una lista "items".`;
        }
        if (section.type === 'flights' && section.items.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
            return `Cada elemento de "${section.id}" debe ser un objeto.`;
        }
        ids.add(section.id);
    }

    return '';
}

module.exports = function setupProxy(app) {
    app.put('/api/trip-config', (req, res) => {
        if (!loopbackAddresses.has(req.socket.remoteAddress)) {
            res.status(403).json({ error: 'La edición solo está disponible desde este ordenador.' });
            return;
        }

        let body = '';
        let bodySize = 0;
        let tooLarge = false;
        req.setEncoding('utf8');

        req.on('data', chunk => {
            bodySize += Buffer.byteLength(chunk, 'utf8');
            if (bodySize > maxBodySize) {
                tooLarge = true;
                return;
            }
            body += chunk;
        });

        req.on('end', async () => {
            if (tooLarge) {
                res.status(413).json({ error: 'El JSON supera el límite de 1 MB.' });
                return;
            }

            let config;
            try {
                config = JSON.parse(body);
            } catch (error) {
                res.status(400).json({ error: 'El contenido no es JSON válido.' });
                return;
            }

            const validationError = validateConfig(config);
            if (validationError) {
                res.status(400).json({ error: validationError });
                return;
            }

            try {
                await fs.promises.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
                res.json({ saved: true });
            } catch (error) {
                console.error('No se pudo guardar src/config/tripConfig.json:', error);
                res.status(500).json({ error: 'No se pudo escribir tripConfig.json.' });
            }
        });

        req.on('error', error => {
            console.error('Error al recibir la configuración del viaje:', error);
            if (!res.headersSent) {
                res.status(400).json({ error: 'No se pudo recibir el JSON.' });
            }
        });
    });
};
