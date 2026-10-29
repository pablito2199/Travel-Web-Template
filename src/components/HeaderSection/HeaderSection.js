import './styles.css';

function HeaderSection({ meta, partyLogoSrc, partyLogoAlt, isPartyTime, currentLyric, onToggleParty }) {
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

    const heroStyle = meta.heroImage ? { '--hero-image': `url("${meta.heroImage}")` } : undefined;

    return (
        <header id="top" className={`hero ${meta.heroImage ? 'has-image' : ''} ${isPartyTime ? 'party' : ''}`} style={heroStyle}>
            <div className="hero-inner">
                <div className="hero-title-row">
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
            </div>
        </header>
    );
}

export default HeaderSection;
