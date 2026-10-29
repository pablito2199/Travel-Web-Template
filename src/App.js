import { useEffect, useRef, useState } from 'react';
import './App.css';
import CitySection from './components/CitySection/CitySection';
import FlightSection from './components/FlightSection/FlightSection';
import FooterSection from './components/FooterSection/FooterSection';
import HeaderSection from './components/HeaderSection/HeaderSection';
import HotelSection from './components/HotelSection/HotelSection';
import SideNav from './components/SideNav/SideNav';
import TravelSection from './components/TravelSection/TravelSection';
import tripConfig from './config/tripConfig';
import { DEFAULT_THEME, resolveTheme, themes, toCssVars } from './config/themes';
import usePartyMode from './hooks/usePartyMode';
import { createColorPicker } from './utils/colors';
import { getSectionIcon, LinkIcon } from './utils/sectionIcons';
import './styles/shared.css';

const { meta, theme: themeCfg = {}, partyMode = {}, quickLinks: rawQuickLinks = [], sections: rawSections = [] } = tripConfig;
const partyEnabled = Boolean(partyMode.enabled && partyMode.audio);
const partyAsset = (file) => (file ? `${process.env.PUBLIC_URL}/party/${file}` : '');

// Colores resueltos una sola vez por carga: los indicados en la config o aleatorios
const pickColor = createColorPicker();
const sections = rawSections.map(section => ({ ...section, iconColor: pickColor(section.iconColor) }));
const quickLinks = rawQuickLinks.map(link => ({ ...link, color: pickColor(link.color) }));

const MODE_KEY = 'trip-theme-mode';
const baseMode = themeCfg.mode || 'light';

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

const getInitialMode = () => {
    const fallback = baseMode === 'auto' ? systemMode() : baseMode;
    const saved = readSaved();

    if (themeCfg.allowToggle !== false && saved.base === baseMode && (saved.mode === 'light' || saved.mode === 'dark')) {
        return saved.mode;
    }

    return fallback;
};

const getInitialTheme = () => {
    const saved = readSaved();

    return themeCfg.allowThemePicker !== false && themes[saved.theme] ? saved.theme : (themeCfg.name || DEFAULT_THEME);
};

const saveChoice = (changes) => {
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

function App() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeId, setActiveId] = useState('');
    const [mode, setMode] = useState(getInitialMode);

    const [themeName, setThemeName] = useState(getInitialTheme);

    const palette = resolveTheme(themeName, mode);

    const toggleMode = () => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
        saveChoice({ mode: next });
    };

    const selectTheme = (name) => {
        setThemeName(name);
        saveChoice({ theme: name });
    };

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
    }, []);

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
    }, []);

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
    }, []);

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
                onToggleMode={themeCfg.allowToggle !== false ? toggleMode : undefined}
                themeOptions={themeCfg.allowThemePicker !== false ? themeOptions : []}
                themeName={themeName}
                onSelectTheme={selectTheme}
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
