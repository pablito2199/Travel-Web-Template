import { FiEdit3, FiMapPin } from 'react-icons/fi';
import './styles.css';

function CitySection({ city, isPartyTime }) {
    const editUrl = city.editUrl || city.mapUrl;

    return (
        <section
            className={`city-section-card ${isPartyTime ? 'party' : ''}`}
            style={city.color ? { '--city-color': city.color } : undefined}
        >
            <div className="city-card-content">
                <div className="city-top-row">
                    <div>
                        <h2 className="city-title">
                            <FiMapPin className="city-title-icon" aria-hidden="true" />
                            <span>{city.title}</span>
                        </h2>
                        {city.description && <p className="city-desc">{city.description}</p>}
                    </div>

                    {city.editUrl && (
                        <a href={editUrl} target="_blank" rel="noreferrer" className="city-map-link">
                            <FiEdit3 className="city-map-icon" aria-hidden="true" />
                            Editar mapa
                        </a>
                    )}
                </div>

                {city.mapUrl && (
                    <div className="map-frame">
                        <iframe
                            src={city.mapUrl}
                            className={`map-iframe ${isPartyTime ? 'party' : ''}`}
                            title={city.title}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CitySection;
