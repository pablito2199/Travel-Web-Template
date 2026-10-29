import { FiExternalLink, FiImage } from 'react-icons/fi';
import './styles.css';

const FOLDER_ID_PATTERNS = [/\/folders\/([\w-]+)/, /[?&]id=([\w-]+)/, /^([\w-]{10,})$/];

const getFolderId = (value = '') => {
    const text = value.trim();
    for (const pattern of FOLDER_ID_PATTERNS) {
        const match = text.match(pattern);
        if (match) return match[1];
    }
    return '';
};

function MemoriesSection({ memories, isPartyTime }) {
    const folderId = getFolderId(memories.driveLink);
    const openUrl = folderId ? `https://drive.google.com/drive/folders/${folderId}` : '';

    return (
        <section className={`city-section-card memories-card ${isPartyTime ? 'party' : ''}`}>
            <div className="city-card-content">
                <div className="city-top-row">
                    <div>
                        <h2 className="city-title">
                            <FiImage className="city-title-icon" aria-hidden="true" />
                            <span>{memories.title}</span>
                        </h2>
                        {memories.description && <p className="city-desc">{memories.description}</p>}
                    </div>

                    {openUrl && (
                        <a href={openUrl} target="_blank" rel="noreferrer" className="city-map-link">
                            <FiExternalLink className="city-map-icon" aria-hidden="true" />
                            Abrir en Drive
                        </a>
                    )}
                </div>

                {folderId ? (
                    <div className="memories-frame">
                        <iframe
                            src={`https://drive.google.com/embeddedfolderview?id=${folderId}#grid`}
                            className="memories-iframe"
                            title={memories.title}
                            loading="lazy"
                        ></iframe>
                    </div>
                ) : (
                    <p className="memories-empty">Añade el enlace de una carpeta de Google Drive compartida para ver aquí tus fotos.</p>
                )}
            </div>
        </section>
    );
}

export default MemoriesSection;
