import './styles.css';
import { useState } from 'react';

function HeaderSection({ meta, partyLogoSrc, partyLogoAlt, isPartyTime, currentLyric, onToggleParty, sectionLinks = [] }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const partyLogo = partyLogoSrc ? (
        <img
            src={partyLogoSrc}
            alt={partyLogoAlt}
            onClick={onToggleParty}
            className={`party-logo ${isPartyTime ? 'party' : ''}`}
        />
    ) : null;

    const flag = (waveClass) => meta.flagUrl ? (
        <img src={meta.flagUrl} className={`flag-image ${isPartyTime ? waveClass : ''}`} alt="" />
    ) : null;

    return (
        <header className={`header ${isPartyTime ? 'party' : ''}`}>
            <div className="header-content">
                {partyLogo}
                <h1 className="title">
                    {flag('flag-wave-1')}
                    <span className={isPartyTime ? 'rainbow-text' : ''}>{meta.title}</span>
                    {flag('flag-wave-2')}
                </h1>
                {partyLogo}
            </div>
            <p className="subtitle">
                {isPartyTime ? <span className="lyric-text">{currentLyric}</span> : meta.subtitle}
            </p>

            <button
                type="button"
                className="header-menu-toggle"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-expanded={menuOpen}
                aria-controls="section-nav"
            >
                {menuOpen ? 'Ocultar menú' : 'Ver menú'}
            </button>

            <nav id="section-nav" className={`header-nav ${menuOpen ? 'open' : ''}`} aria-label="Navegación de secciones">
                {sectionLinks.map(link => (
                    <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
                ))}
            </nav>
        </header>
    );
}

export default HeaderSection;
