import { FaBusSimple, FaCarSide, FaTrainSubway } from "react-icons/fa6";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { SiGoogledrive } from "react-icons/si";
import './styles.css';

const MODE_ICONS = {
    bus: FaBusSimple,
    train: FaTrainSubway,
    car: FaCarSide
};

function TravelSection({ isPartyTime, trip }) {
    const ModeIcon = MODE_ICONS[trip.mode] || FaBusSimple;

    return (
        <section className={`bus-section-card ${isPartyTime ? 'party' : ''}`}>
            <div className="bus-card-content">
                <h3 className="bus-title">
                    <ModeIcon className="bus-title-icon" aria-hidden="true" />
                    <span>{trip.title || 'Traslado'}</span>
                </h3>

                <div className="bus-card">
                    <div className="bus-main">
                        <div className="bus-route-row" aria-label={`Ruta: ${trip.from}${trip.to ? ` a ${trip.to}` : ''}`}>
                            <span className="bus-route-point">{trip.from}</span>
                            {trip.to && <FiArrowRight className="bus-route-arrow" aria-hidden="true" />}
                            {trip.to && <span className="bus-route-point">{trip.to}</span>}
                        </div>

                        <div className="bus-details">
                            {trip.date && (
                                <span className="bus-detail-pill">
                                    <FiCalendar className="bus-detail-icon" aria-hidden="true" />
                                    <span>{trip.date}</span>
                                </span>
                            )}
                            {trip.hour && (
                                <span className="bus-detail-pill">
                                    <FiClock className="bus-detail-icon" aria-hidden="true" />
                                    <span>{trip.hour}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {trip.link && (
                        <div className="bus-action">
                            <a href={trip.link} target="_blank" rel="noreferrer" className="btn-drive">
                                <div className="drive-icon-wrapper">
                                    <SiGoogledrive className="icon-google" />
                                </div>
                                <span>Ver en Google Drive</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TravelSection;
