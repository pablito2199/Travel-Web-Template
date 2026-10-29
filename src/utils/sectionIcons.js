import { FaBusSimple, FaCarSide, FaPlaneDeparture, FaTrainSubway } from 'react-icons/fa6';
import { FiLink, FiMapPin } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

const TRANSPORT_ICONS = {
    bus: FaBusSimple,
    train: FaTrainSubway,
    car: FaCarSide
};

export const getSectionIcon = (section) => {
    switch (section.type) {
        case 'flights':
            return FaPlaneDeparture;
        case 'hotel':
            return MdHotel;
        case 'city':
            return FiMapPin;
        case 'transport':
            return TRANSPORT_ICONS[section.mode] || FaBusSimple;
        default:
            return FiLink;
    }
};

export { FiLink as LinkIcon, TRANSPORT_ICONS };
