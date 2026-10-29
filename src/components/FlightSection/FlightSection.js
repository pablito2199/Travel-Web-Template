import { FaPlaneDeparture } from "react-icons/fa6";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { SiGoogledrive } from "react-icons/si";
import './styles.css';

function FlightSection({ isPartyTime, title = 'Vuelos', flights = [] }) {
    return (
        <section className={`flight-section-card ${isPartyTime ? 'party' : ''}`}>
            <div className="flight-card-content">
                <h3 className="flight-title">
                    <FaPlaneDeparture className="flight-title-icon" aria-hidden="true" />
                    <span>{title}</span>
                </h3>

                <div className="flight-grid">
                    {flights.map((flight, index) => (
                        <div key={`${flight.from}-${flight.to}-${index}`} className="flight-card">
                            <div className="flight-main">
                                <div className="route-row" aria-label={`Ruta: ${flight.from}${flight.to ? ` a ${flight.to}` : ''}`}>
                                    <span className="route-point">{flight.from}</span>
                                    {flight.to && <FiArrowRight className="route-arrow" aria-hidden="true" />}
                                    {flight.to && <span className="route-point">{flight.to}</span>}
                                </div>

                                <div className="flight-details">
                                    {flight.date && (
                                        <span className="flight-detail-pill">
                                            <FiCalendar className="flight-detail-icon" aria-hidden="true" />
                                            <span>{flight.date}</span>
                                        </span>
                                    )}
                                    {flight.hour && (
                                        <span className="flight-detail-pill">
                                            <FiClock className="flight-detail-icon" aria-hidden="true" />
                                            <span>{flight.hour}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {flight.link && (
                                <a href={flight.link} target="_blank" rel="noreferrer" className="btn-drive">
                                    <div className="drive-icon-wrapper">
                                        <SiGoogledrive className="icon-google" />
                                    </div>
                                    <span>Ver en Google Drive</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FlightSection;
