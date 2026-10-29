import { FaMoneyBillWave } from "react-icons/fa";
import { FiLink, FiMapPin } from "react-icons/fi";
import { MdHotel } from "react-icons/md";
import { SiGoogledrive } from "react-icons/si";
import './styles.css';

const ICONS = {
    drive: { Icon: SiGoogledrive, className: 'footer-link-drive' },
    hotel: { Icon: MdHotel, className: 'footer-link-booking' },
    map: { Icon: FiMapPin, className: 'footer-link-map' },
    money: { Icon: FaMoneyBillWave, className: 'footer-link-tricount' },
    link: { Icon: FiLink, className: 'footer-link-map' }
};

function FooterSection({ quickLinks = [], footerText }) {
    const links = quickLinks.filter(link => link.url);

    return (
        <footer className="footer-section">
            <div className="footer-card">
                {links.length > 0 && (
                    <div className="footer-top">
                        <h4 className="footer-title">Accesos rápidos</h4>
                        <div className="footer-links">
                            {links.map(link => {
                                const { Icon, className } = ICONS[link.icon] || ICONS.link;

                                return (
                                    <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className={`footer-link ${className}`}>
                                        <Icon className="footer-link-icon" aria-hidden="true" />
                                        <span>{link.label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {footerText && (
                    <div className="footer-bottom">
                        <span>{footerText}</span>
                    </div>
                )}
            </div>
        </footer>
    );
}

export default FooterSection;
