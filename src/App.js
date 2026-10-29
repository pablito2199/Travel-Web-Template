import { useEffect, useState } from 'react';
import './App.css';
import CitySection from './components/CitySection/CitySection';
import FlightSection from './components/FlightSection/FlightSection';
import FooterSection from './components/FooterSection/FooterSection';
import HeaderSection from './components/HeaderSection/HeaderSection';
import HotelSection from './components/HotelSection/HotelSection';
import TravelSection from './components/TravelSection/TravelSection';
import tripConfig from './config/tripConfig';
import usePartyMode from './hooks/usePartyMode';
import './styles/shared.css';

const { meta, partyMode = {}, quickLinks = [], sections = [] } = tripConfig;
const partyEnabled = Boolean(partyMode.enabled && partyMode.audio);
const partyAsset = (file) => (file ? `${process.env.PUBLIC_URL}/party/${file}` : '');

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
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', meta.themeColor);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 120);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sectionLinks = [
        ...sections.map(section => ({ label: section.menuLabel || section.title || section.id, href: `#${section.id}` })),
        ...(quickLinks.length ? [{ label: 'Accesos rápidos', href: '#footer' }] : [])
    ];

    return (
        <div className={`app-container ${isPartyTime ? 'is-party-time' : ''}`}>
            {partyEnabled && <audio ref={audioRef} src={partyAsset(partyMode.audio)} loop />}

            <HeaderSection
                meta={meta}
                isPartyTime={isPartyTime}
                currentLyric={currentLyric}
                onToggleParty={toggleParty}
                partyLogoSrc={partyEnabled ? partyAsset(partyMode.logo) : ''}
                partyLogoAlt={partyMode.logoAlt}
                sectionLinks={sectionLinks}
            />

            <main className="main-content">
                {sections.map(section => (
                    <div key={section.id} id={section.id} className="section-anchor">
                        {renderSection(section, isPartyTime)}
                    </div>
                ))}
            </main>

            <div id="footer" className="section-anchor">
                <FooterSection quickLinks={quickLinks} footerText={meta.footerText} />
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
