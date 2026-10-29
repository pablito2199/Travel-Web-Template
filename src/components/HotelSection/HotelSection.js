import { FaMoon } from "react-icons/fa6";
import { FiCalendar, FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { MdHotel, MdOutlineHotel } from "react-icons/md";
import { SiGoogledrive } from "react-icons/si";
import { TbBrandBooking } from "react-icons/tb";
import './styles.css';

function HotelSection({ isPartyTime, hotel }) {
    return (
        <section className="info-section hotels">
            <div className="hotel-grid">
                <div key={hotel.id} className={`hotel-card ${isPartyTime ? 'party' : ''}`}>
                    <div className="hotel-main">
                        <div className="hotel-header-info">
                            <p className="hotel-title">
                                <MdHotel className="hotel-title-icon" aria-hidden="true" />
                                <span>{hotel.name}</span>
                            </p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hotel-address"
                            >
                                <FiMapPin className="hotel-address-icon" aria-hidden="true" />
                                {hotel.address}
                            </a>
                        </div>

                        <div className="hotel-details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Check-in</span>
                                <span className="detail-value">
                                    <FiCalendar className="detail-icon" aria-hidden="true" />
                                    <span>{hotel.checkInDate}</span>
                                </span>
                                <span className="detail-hour">
                                    <FiClock className="detail-icon" aria-hidden="true" />
                                    <span>{hotel.checkInHour}</span>
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Check-out</span>
                                <span className="detail-value">
                                    <FiCalendar className="detail-icon" aria-hidden="true" />
                                    <span>{hotel.checkOutDate}</span>
                                </span>
                                <span className="detail-hour">
                                    <FiClock className="detail-icon" aria-hidden="true" />
                                    <span>{hotel.checkOutHour}</span>
                                </span>
                            </div>
                            <div className="detail-item duration">
                                <span className="detail-label">Estancia</span>
                                <span className="detail-value-alt">
                                    <FaMoon className="detail-icon detail-icon-moon" aria-hidden="true" />
                                    <span>{hotel.nights} noches</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hotel-contact">
                        <h4 className="contact-title">Contacto</h4>
                        {hotel.contact?.phone && (
                            <a className="contact-item" href={`tel:${hotel.contact.phone}`}>
                                <FiPhone className="contact-icon" aria-hidden="true" />
                                <span>{hotel.contact.phone}</span>
                            </a>
                        )}
                        {hotel.contact?.email && (
                            <a className="contact-item" href={`mailto:${hotel.contact.email}`}>
                                <FiMail className="contact-icon" aria-hidden="true" />
                                <span>{hotel.contact.email}</span>
                            </a>
                        )}
                        {hotel.reservationNumber && (
                            <div className="contact-item reservation">
                                <TbBrandBooking className="contact-icon" />
                                <strong>Nº reserva:</strong>
                                <span className="reservation-number">{hotel.reservationNumber}</span>
                            </div>
                        )}

                        <div className="hotel-actions">
                            {hotel.driveLink && (
                                <a href={hotel.driveLink} target="_blank" rel="noreferrer" className="btn-drive btn-hotel-action">
                                    <div className="drive-icon-wrapper">
                                        <SiGoogledrive className="icon-google" />
                                    </div>
                                    <span>Ver en Google Drive</span>
                                </a>
                            )}
                            {hotel.bookingLink && (
                                <a href={hotel.bookingLink} target="_blank" rel="noreferrer" className="btn-booking btn-hotel-action">
                                    {hotel.bookingCta ? (
                                        <MdOutlineHotel className="icon-booking" aria-hidden="true" />
                                    ) : (
                                        <TbBrandBooking className="icon-booking" aria-hidden="true" />
                                    )}
                                    <span>{hotel.bookingCta || 'Ver en Booking'}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}

export default HotelSection;