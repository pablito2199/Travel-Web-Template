/**
 * Temas disponibles. Cada tema tiene una variante clara (light) y otra oscura (dark).
 * Para crear uno propio, añade una entrada nueva con el mismo formato y
 * escribe su nombre en `theme.name` dentro de tripConfig.js.
 *
 * Campos de cada variante (solo hay que indicar los que cambian respecto a la base):
 *  accent      color principal (menú lateral, cabecera, barra de progreso)
 *  bg1, bg2    degradado del fondo de la página
 *  surface     fondo de las tarjetas;  surface2 tarjetas internas;  surface3 etiquetas
 *  border      color de los bordes
 *  text, textStrong, textMuted   textos normales, títulos y textos secundarios
 *  link        color de enlaces
 *  mapBg       fondo mientras carga el mapa
 *  fieldBg, fieldText   fondo y texto del nº de reserva
 */

const LIGHT_BASE = {
    accent: '#21468b',
    bg1: '#f8fafc',
    bg2: '#eef2f7',
    surface: 'rgba(255, 255, 255, 0.82)',
    surface2: 'rgba(255, 255, 255, 0.92)',
    surface3: 'rgba(241, 245, 249, 0.95)',
    border: 'rgba(148, 163, 184, 0.32)',
    text: '#334155',
    textStrong: '#0f172a',
    textMuted: '#64748b',
    link: '#1d4ed8',
    mapBg: '#eef3f9',
    fieldBg: '#eef6ff',
    fieldText: '#003580'
};

const DARK_BASE = {
    accent: '#3b82f6',
    bg1: '#0b1220',
    bg2: '#111827',
    surface: 'rgba(30, 41, 59, 0.78)',
    surface2: 'rgba(15, 23, 42, 0.6)',
    surface3: 'rgba(51, 65, 85, 0.6)',
    border: 'rgba(148, 163, 184, 0.22)',
    text: '#cbd5e1',
    textStrong: '#f8fafc',
    textMuted: '#94a3b8',
    link: '#93c5fd',
    mapBg: '#1e293b',
    fieldBg: 'rgba(147, 197, 253, 0.14)',
    fieldText: '#bfdbfe'
};

const light = (overrides) => ({ ...LIGHT_BASE, ...overrides });
const dark = (overrides) => ({ ...DARK_BASE, ...overrides });

export const themes = {
    ocean: {
        label: 'Océano',
        light: light({}),
        dark: dark({
            bg1: '#0a1424',
            bg2: '#0f1b30',
            surface: 'rgba(23, 37, 64, 0.78)',
            surface2: 'rgba(10, 20, 38, 0.6)',
            surface3: 'rgba(38, 58, 94, 0.55)'
        })
    },
    forest: {
        label: 'Bosque',
        light: light({
            accent: '#166534',
            bg1: '#f3faf5',
            bg2: '#e5f2e9',
            link: '#15803d',
            fieldBg: '#e8f6ec',
            fieldText: '#14532d'
        }),
        dark: dark({
            accent: '#22c55e',
            bg1: '#08140d',
            bg2: '#0e1d14',
            surface: 'rgba(20, 45, 31, 0.78)',
            surface2: 'rgba(9, 24, 16, 0.6)',
            surface3: 'rgba(34, 70, 49, 0.55)',
            link: '#86efac',
            fieldBg: 'rgba(134, 239, 172, 0.14)',
            fieldText: '#bbf7d0'
        })
    },
    sunset: {
        label: 'Atardecer',
        light: light({
            accent: '#c2410c',
            bg1: '#fff8f3',
            bg2: '#fdeee3',
            link: '#c2410c',
            fieldBg: '#ffedd5',
            fieldText: '#9a3412'
        }),
        dark: dark({
            accent: '#fb923c',
            bg1: '#180c08',
            bg2: '#231210',
            surface: 'rgba(55, 30, 22, 0.78)',
            surface2: 'rgba(30, 15, 11, 0.6)',
            surface3: 'rgba(90, 50, 36, 0.5)',
            link: '#fdba74',
            fieldBg: 'rgba(253, 186, 116, 0.14)',
            fieldText: '#fed7aa'
        })
    },
    lavender: {
        label: 'Lavanda',
        light: light({
            accent: '#6d28d9',
            bg1: '#f8f5ff',
            bg2: '#efe9fc',
            link: '#6d28d9',
            fieldBg: '#ede9fe',
            fieldText: '#4c1d95'
        }),
        dark: dark({
            accent: '#a78bfa',
            bg1: '#100b1e',
            bg2: '#171030',
            surface: 'rgba(40, 30, 70, 0.78)',
            surface2: 'rgba(20, 14, 38, 0.6)',
            surface3: 'rgba(70, 55, 115, 0.5)',
            link: '#c4b5fd',
            fieldBg: 'rgba(196, 181, 253, 0.14)',
            fieldText: '#ddd6fe'
        })
    },
    rose: {
        label: 'Rosa',
        light: light({
            accent: '#be185d',
            bg1: '#fff5f8',
            bg2: '#fde8ef',
            link: '#be185d',
            fieldBg: '#fce7f3',
            fieldText: '#831843'
        }),
        dark: dark({
            accent: '#f472b6',
            bg1: '#1a0a12',
            bg2: '#260f1b',
            surface: 'rgba(60, 24, 42, 0.78)',
            surface2: 'rgba(33, 12, 23, 0.6)',
            surface3: 'rgba(100, 42, 70, 0.5)',
            link: '#f9a8d4',
            fieldBg: 'rgba(249, 168, 212, 0.14)',
            fieldText: '#fbcfe8'
        })
    },
    graphite: {
        label: 'Grafito',
        light: light({
            accent: '#334155',
            bg1: '#f8fafc',
            bg2: '#e5e7eb',
            link: '#475569',
            fieldBg: '#e2e8f0',
            fieldText: '#1e293b'
        }),
        dark: dark({
            accent: '#94a3b8',
            bg1: '#0a0a0b',
            bg2: '#141416',
            surface: 'rgba(39, 39, 42, 0.78)',
            surface2: 'rgba(24, 24, 27, 0.6)',
            surface3: 'rgba(63, 63, 70, 0.55)',
            link: '#a5b4fc',
            fieldBg: 'rgba(165, 180, 252, 0.14)',
            fieldText: '#c7d2fe'
        })
    }
};

export const DEFAULT_THEME = 'ocean';

export function resolveTheme(name, mode) {
    const theme = themes[name] || themes[DEFAULT_THEME];

    if (!themes[name]) {
        console.warn(`Tema "${name}" no encontrado. Temas disponibles: ${Object.keys(themes).join(', ')}`);
    }

    return mode === 'dark' ? theme.dark : theme.light;
}

export function toCssVars(palette) {
    return Object.fromEntries(
        Object.entries(palette).map(([key, value]) => [
            `--${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`,
            value
        ])
    );
}
