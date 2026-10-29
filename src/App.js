import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import CitySection from './components/CitySection/CitySection';
import ConfigEditor from './components/ConfigEditor/ConfigEditor';
import FlightSection from './components/FlightSection/FlightSection';
import FooterSection from './components/FooterSection/FooterSection';
import HeaderSection from './components/HeaderSection/HeaderSection';
import HotelSection from './components/HotelSection/HotelSection';
import SideNav from './components/SideNav/SideNav';
import TravelSection from './components/TravelSection/TravelSection';
import tripConfig from './config/tripConfig.json';
import { DEFAULT_THEME, resolveTheme, themes, toCssVars } from './config/themes';
import usePartyMode from './hooks/usePartyMode';
import { createColorPicker } from './utils/colors';
import { getSectionIcon, LinkIcon } from './utils/sectionIcons';
import './styles/shared.css';

const partyAsset = (file) => (file ? `${process.env.PUBLIC_URL}/party/${file}` : '');

const MODE_KEY = 'trip-theme-mode';

const systemMode = () => (
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

const readSaved = () => {
    try {
        return JSON.parse(localStorage.getItem(MODE_KEY)) || {};
    } catch (error) {
        return {};
    }
};

const getInitialMode = (themeCfg = {}) => {
    const baseMode = themeCfg.mode || 'light';
    const fallback = baseMode === 'auto' ? systemMode() : baseMode;
    const saved = readSaved();

    if (themeCfg.allowToggle !== false && saved.base === baseMode && (saved.mode === 'light' || saved.mode === 'dark')) {
        return saved.mode;
    }

    return fallback;
};

const getInitialTheme = (themeCfg = {}) => {
    const saved = readSaved();

    return themeCfg.allowThemePicker !== false && themes[saved.theme] ? saved.theme : (themeCfg.name || DEFAULT_THEME);
};

const saveChoice = (changes, baseMode) => {
    try {
        localStorage.setItem(MODE_KEY, JSON.stringify({ ...readSaved(), base: baseMode, ...changes }));
    } catch (error) {
        // sin almacenamiento: el cambio solo dura la sesión
    }
};

const themeOptions = Object.entries(themes).map(([id, theme]) => ({
    id,
    label: theme.label,
    color: theme.light.accent,
    colorDark: theme.dark.accent
}));

function renderSection(section, isPartyTime) {
    switch (section.type) {
        case 'flights':
            return <FlightSection isPartyTime={isPartyTime} title={section.title} flights={section.items} />;
        case 'hotel':
            return <HotelSection isPartyTime={isPartyTime} hotel={section} />;
        case 'city':
            return <CitySection isPartyTime={isPartyTime} city={section} />;
        case 'transport':
            return <TravelSection isPartyTime={isPartyTime} trip={section} />;
        default:
            return null;
    }
}

function validateTripConfig(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new Error('La configuración debe ser un objeto JSON.');
    }
    if (!config.meta || typeof config.meta !== 'object' || Array.isArray(config.meta)) {
        throw new Error('Falta el objeto "meta".');
    }
    if (!Array.isArray(config.quickLinks) || !Array.isArray(config.sections)) {
        throw new Error('"quickLinks" y "sections" deben ser listas.');
    }
    if (config.quickLinks.some(link => !link || typeof link !== 'object' || Array.isArray(link))) {
        throw new Error('Cada acceso rápido debe ser un objeto.');
    }

    const ids = new Set();
    config.sections.forEach(section => {
        if (!section || typeof section !== 'object' || Array.isArray(section)) {
            throw new Error('Cada sección debe ser un objeto.');
        }
        if (!['flights', 'hotel', 'city', 'transport'].includes(section.type)) {
            throw new Error(`Tipo de sección no válido: "${section.type}".`);
        }
        if (typeof section.id !== 'string' || !section.id.trim() || ids.has(section.id)) {
            throw new Error('Cada sección necesita un id único y no vacío.');
        }
        if (section.type === 'flights' && !Array.isArray(section.items)) {
            throw new Error(`La sección "${section.id}" necesita una lista "items".`);
        }
        if (section.type === 'flights' && section.items.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
            throw new Error(`Cada elemento de "${section.id}" debe ser un objeto.`);
        }
        ids.add(section.id);
    });
}

function App() {
    const [config, setConfig] = useState(tripConfig);
    const [editorOpen, setEditorOpen] = useState(false);
    const [jsonError, setJsonError] = useState('');
    const [saveState, setSaveState] = useState('saved');
    const [pendingConfig, setPendingConfig] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeId, setActiveId] = useState('');
    const [mode, setMode] = useState(() => getInitialMode(tripConfig.theme));
    const colorPickerRef = useRef(null);
    const colorCacheRef = useRef(new Map());
    const saveQueueRef = useRef(Promise.resolve());
    const saveVersionRef = useRef(0);

    if (!colorPickerRef.current) {
        colorPickerRef.current = createColorPicker();
    }

    const {
        meta = {},
        theme: themeCfg = {},
        partyMode = {},
        quickLinks: rawQuickLinks = [],
        sections: rawSections = []
    } = config;
    const partyEnabled = Boolean(partyMode.enabled && partyMode.audio);
    const themeMode = themeCfg.mode;
    const themeDefaultName = themeCfg.name;
    const allowThemePicker = themeCfg.allowThemePicker;
    const allowToggle = themeCfg.allowToggle;
    const baseMode = themeMode || 'light';
    const sections = useMemo(() => rawSections.map(section => {
        const key = `section:${section.id}`;
        const color = section.iconColor || colorCacheRef.current.get(key) || colorPickerRef.current();
        colorCacheRef.current.set(key, color);
        return { ...section, iconColor: color };
    }), [rawSections]);
    const quickLinks = useMemo(() => rawQuickLinks.map((link, index) => {
        const key = `link:${index}:${link.label}:${link.url}`;
        const color = link.color || colorCacheRef.current.get(key) || colorPickerRef.current();
        colorCacheRef.current.set(key, color);
        return { ...link, color };
    }), [rawQuickLinks]);

    const [themeName, setThemeName] = useState(() => getInitialTheme(tripConfig.theme));

    const palette = resolveTheme(themeName, mode);

    useEffect(() => {
        const themeSettings = {
            mode: themeMode,
            name: themeDefaultName,
            allowThemePicker,
            allowToggle
        };
        setMode(getInitialMode(themeSettings));
        setThemeName(getInitialTheme(themeSettings));
    }, [themeMode, themeDefaultName, allowToggle, allowThemePicker]);

    const toggleMode = () => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
        saveChoice({ mode: next }, baseMode);
    };

    const selectTheme = (name) => {
        setThemeName(name);
        saveChoice({ theme: name }, baseMode);
    };

    const handleConfigChange = (nextConfig) => {
        saveVersionRef.current += 1;

        try {
            validateTripConfig(nextConfig);
            setConfig(nextConfig);
            setPendingConfig(nextConfig);
            setJsonError('');
            setSaveState('pending');
        } catch (error) {
            setPendingConfig(null);
            setJsonError(error.message);
            setSaveState('invalid');
        }
    };

    useEffect(() => {
        if (!pendingConfig) {
            return undefined;
        }

        const version = saveVersionRef.current;
        const timeout = setTimeout(() => {
            const save = async () => {
                if (version === saveVersionRef.current) {
                    setSaveState('saving');
                }
                const response = await fetch('/api/trip-config', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pendingConfig)
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'No se pudo guardar tripConfig.json.');
                }

                if (version === saveVersionRef.current) {
                    setSaveState('saved');
                }
            };

            saveQueueRef.current = saveQueueRef.current.then(save, save).catch(error => {
                if (version === saveVersionRef.current) {
                    setJsonError(error.message);
                    setSaveState('error');
                }
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [pendingConfig]);

    const {
        isPartyTime,
        currentLyric,
        toggleParty,
        audioRef
    } = usePartyMode({
        enabled: partyEnabled,
        lyrics: partyMode.lyrics,
        confettiColors: partyMode.confettiColors
    });

    useEffect(() => {
        document.title = meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    }, [meta.title, meta.description]);

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.accent);
        document.body.style.background = palette.bg1;
        document.documentElement.style.colorScheme = mode;
    }, [palette, mode]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 120);

            const max = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const lockedIdRef = useRef('');

    // Sección activa: la última cuyo inicio ya pasó la línea de referencia;
    // al llegar al final de la página se marca la última aunque sea corta.
    useEffect(() => {
        const ids = [...sections.map(section => section.id), ...(quickLinks.length ? ['footer'] : [])];

        const updateActive = () => {
            if (lockedIdRef.current) {
                return;
            }

            const doc = document.documentElement;
            const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 4;
            const line = window.innerHeight * 0.35;
            let current = '';

            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) {
                    current = id;
                }
            });

            if (atBottom && ids.length) {
                current = ids[ids.length - 1];
            }

            setActiveId(current);
        };

        const releaseLock = () => {
            lockedIdRef.current = '';
        };

        updateActive();
        window.addEventListener('scroll', updateActive, { passive: true });
        window.addEventListener('resize', updateActive);
        window.addEventListener('wheel', releaseLock, { passive: true });
        window.addEventListener('touchstart', releaseLock, { passive: true });
        window.addEventListener('keydown', releaseLock);

        return () => {
            window.removeEventListener('scroll', updateActive);
            window.removeEventListener('resize', updateActive);
            window.removeEventListener('wheel', releaseLock);
            window.removeEventListener('touchstart', releaseLock);
            window.removeEventListener('keydown', releaseLock);
        };
    }, [sections, quickLinks]);

    // Al pulsar un enlace se marca ese, aunque la sección no pueda alcanzar la línea de referencia
    const handleNavigate = (href) => {
        const id = href.replace('#', '');
        lockedIdRef.current = id;
        setActiveId(id);
    };

    // Aparición de secciones
    useEffect(() => {
        const anchors = document.querySelectorAll('.section-anchor');

        if (!('IntersectionObserver' in window)) {
            anchors.forEach(anchor => anchor.classList.add('is-revealed'));
            return undefined;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        anchors.forEach(anchor => revealObserver.observe(anchor));

        return () => revealObserver.disconnect();
    }, [sections]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sectionLinks = [
        ...sections.map(section => ({
            label: section.menuLabel || section.title || section.id,
            href: `#${section.id}`,
            icon: getSectionIcon(section),
            color: section.iconColor
        })),
        ...(quickLinks.length ? [{ label: 'Accesos rápidos', href: '#footer', icon: LinkIcon, color: palette.accent }] : [])
    ];
    const canEditConfig = process.env.NODE_ENV === 'development';

    return (
        <div
            className={`app-container ${isPartyTime ? 'is-party-time' : ''}`}
            data-mode={mode}
            style={{ ...toCssVars(palette), colorScheme: mode }}
        >
            <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
            {partyEnabled && <audio ref={audioRef} src={partyAsset(partyMode.audio)} loop />}

            <SideNav
                title={meta.title}
                links={sectionLinks}
                activeHref={activeId ? `#${activeId}` : ''}
                onNavigate={handleNavigate}
                mode={mode}
                onToggleMode={allowToggle !== false ? toggleMode : undefined}
                themeOptions={allowThemePicker !== false ? themeOptions : []}
                themeName={themeName}
                onSelectTheme={selectTheme}
                onCustomize={canEditConfig ? () => {
                    setJsonError('');
                    setEditorOpen(true);
                } : undefined}
            />

            <div className="page">
                <HeaderSection
                    meta={meta}
                    isPartyTime={isPartyTime}
                    currentLyric={currentLyric}
                    onToggleParty={toggleParty}
                    partyLogoSrc={partyEnabled ? partyAsset(partyMode.logo) : ''}
                    partyLogoAlt={partyMode.logoAlt}
                />

                <main className="main-content">
                    {sections.map(section => (
                        <div key={section.id} id={section.id} className="section-anchor" style={{ '--icon-color': section.iconColor }}>
                            {renderSection(section, isPartyTime)}
                        </div>
                    ))}
                </main>

                <div id="footer" className="section-anchor">
                    <FooterSection quickLinks={quickLinks} footerText={meta.footerText} />
                </div>
            </div>

            {editorOpen && (
                <ConfigEditor
                    config={config}
                    onChange={handleConfigChange}
                    onClose={() => setEditorOpen(false)}
                    saveState={saveState}
                    error={jsonError}
                />
            )}

            <button
                type="button"
                className={`back-to-top-fab ${showBackToTop ? 'is-visible' : ''}`}
                onClick={scrollToTop}
                aria-hidden={!showBackToTop}
                tabIndex={showBackToTop ? 0 : -1}
            >
                Volver arriba ↑
            </button>
        </div>
    );
}

export default App;
