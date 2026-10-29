import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { themes } from '../../config/themes';
import './styles.css';

const sectionTypes = [
    { value: 'flights', label: 'Billetes (vuelo, tren, bus…)' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'city', label: 'Ciudad' },
    { value: 'transport', label: 'Traslado' }
];

const sectionDefaults = {
    flights: { title: 'Billetes', items: [] },
    hotel: {
        name: 'Nuevo hotel',
        address: '',
        checkInDate: '',
        checkInHour: '',
        checkOutDate: '',
        checkOutHour: '',
        nights: '',
        reservationNumber: '',
        contact: { phone: '', email: '' },
        driveLink: '',
        bookingLink: '',
        bookingCta: ''
    },
    city: { title: 'Nueva ciudad', description: '', mapUrl: '', editUrl: '' },
    transport: { title: 'Nuevo traslado', mode: 'bus', from: '', to: '', date: '', hour: '', link: '' }
};

const sectionFields = {
    flights: [
        { name: 'title', label: 'Título de la sección' }
    ],
    hotel: [
        { name: 'name', label: 'Nombre del hotel' },
        { name: 'address', label: 'Dirección' },
        { name: 'checkInDate', label: 'Fecha de entrada' },
        { name: 'checkInHour', label: 'Hora de entrada' },
        { name: 'checkOutDate', label: 'Fecha de salida' },
        { name: 'checkOutHour', label: 'Hora de salida' },
        { name: 'nights', label: 'Noches' },
        { name: 'reservationNumber', label: 'Número de reserva' },
        { name: 'driveLink', label: 'Enlace a documentos' },
        { name: 'bookingLink', label: 'Enlace de reserva' },
        { name: 'bookingCta', label: 'Texto del botón de reserva' },
        { name: 'contact.phone', label: 'Teléfono de contacto' },
        { name: 'contact.email', label: 'Correo de contacto' }
    ],
    city: [
        { name: 'title', label: 'Nombre de la ciudad' },
        { name: 'description', label: 'Descripción' },
        { name: 'mapUrl', label: 'Enlace para insertar el mapa' },
        { name: 'editUrl', label: 'Enlace para editar el mapa' }
    ],
    transport: [
        { name: 'title', label: 'Título del traslado' },
        { name: 'mode', label: 'Medio de transporte', options: [
            { value: 'bus', label: 'Autobús' },
            { value: 'train', label: 'Tren' },
            { value: 'car', label: 'Coche' }
        ] },
        { name: 'from', label: 'Origen' },
        { name: 'to', label: 'Destino' },
        { name: 'date', label: 'Fecha' },
        { name: 'hour', label: 'Hora' },
        { name: 'link', label: 'Enlace al billete' }
    ]
};

function getValue(object, path) {
    return path.split('.').reduce((value, key) => value?.[key], object) ?? '';
}

function setValue(object, path, value) {
    const keys = path.split('.');
    const result = { ...object };
    let target = result;
    let source = object;

    keys.slice(0, -1).forEach(key => {
        target[key] = { ...(source?.[key] || {}) };
        target = target[key];
        source = source?.[key];
    });

    target[keys[keys.length - 1]] = value;
    return result;
}

function Field({ label, value, onChange, options, type = 'text' }) {
    return (
        <label className="editor-field">
            <span>{label}</span>
            {options ? (
                <select value={value} onChange={event => onChange(event.target.value)}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea value={value} onChange={event => onChange(event.target.value)} rows="3" />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                />
            )}
        </label>
    );
}

function ActionButton({ children, label, onClick, danger = false, disabled = false }) {
    return (
        <button
            type="button"
            className={`editor-action ${danger ? 'is-danger' : ''}`}
            aria-label={label}
            title={label}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

function ConfigEditor({ config, onChange, onClose, saveState, error }) {
    const [draft, setDraft] = useState(config);
    const [jsonMode, setJsonMode] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [syntaxError, setSyntaxError] = useState('');
    const scrollToNewSectionRef = useRef(false);
    const scrollToNewLinkRef = useRef(false);
    const sectionCount = draft.sections.length;

    const toggleJsonMode = () => {
        if (!jsonMode) {
            setJsonText(JSON.stringify(draft, null, 2));
            setSyntaxError('');
        }
        setJsonMode(current => !current);
    };

    const handleJsonChange = (text) => {
        setJsonText(text);
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (parseError) {
            setSyntaxError(`JSON no válido: ${parseError.message}`);
            return;
        }
        if (!parsed || !Array.isArray(parsed.sections) || !Array.isArray(parsed.quickLinks)) {
            setSyntaxError('El JSON debe incluir las listas "sections" y "quickLinks".');
            return;
        }
        setSyntaxError('');
        setDraft(parsed);
        onChange(parsed);
    };

    const formatJson = () => {
        try {
            setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2));
        } catch {
            // Sin cambios si el texto no es JSON válido
        }
    };

    useEffect(() => {
        if (!scrollToNewSectionRef.current) return;
        scrollToNewSectionRef.current = false;
        const cards = document.querySelectorAll('[data-editor-section]');
        cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [sectionCount]);

    const linkCount = draft.quickLinks.length;
    useEffect(() => {
        if (!scrollToNewLinkRef.current) return;
        scrollToNewLinkRef.current = false;
        const cards = document.querySelectorAll('[data-editor-link]');
        cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [linkCount]);

    const updateConfig = (updater) => {
        const next = updater(draft);
        setDraft(next);
        onChange(next);
    };

    const updateField = (path, value) => {
        updateConfig(current => setValue(current, path, value));
    };

    const updateSection = (index, path, value) => {
        updateConfig(current => {
            const sections = [...current.sections];
            sections[index] = setValue(sections[index], path, value);
            return { ...current, sections };
        });
    };

    const addSection = (type) => {
        scrollToNewSectionRef.current = true;
        updateConfig(current => {
            const baseId = type === 'flights' ? 'billetes' : type === 'transport' ? 'traslado' : type;
            let suffix = current.sections.length + 1;
            let id = `${baseId}-${suffix}`;
            const existingIds = new Set(current.sections.map(section => section.id));
            while (existingIds.has(id)) {
                suffix += 1;
                id = `${baseId}-${suffix}`;
            }
            const label = sectionTypes.find(option => option.value === type)?.label || 'Sección';
            const newSection = {
                type,
                id,
                menuLabel: `Nueva sección ${label.toLowerCase()}`,
                ...sectionDefaults[type]
            };
            return { ...current, sections: [...current.sections, newSection] };
        });
    };

    const moveSection = (index, direction) => {
        updateConfig(current => {
            const sections = [...current.sections];
            const nextIndex = index + direction;
            [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
            return { ...current, sections };
        });
    };

    const changeSectionType = (index, type) => {
        updateConfig(current => {
            const sections = [...current.sections];
            const previous = sections[index];
            sections[index] = {
                type,
                id: previous.id,
                menuLabel: previous.menuLabel,
                iconColor: previous.iconColor,
                ...sectionDefaults[type]
            };
            return { ...current, sections };
        });
    };

    const addFlight = (sectionIndex) => {
        const section = draft.sections[sectionIndex];
        updateSection(sectionIndex, 'items', [
            ...section.items,
            { from: '', to: '', date: '', hour: '', link: '' }
        ]);
    };

    const updateFlight = (sectionIndex, flightIndex, field, value) => {
        updateConfig(current => {
            const sections = [...current.sections];
            const items = [...sections[sectionIndex].items];
            items[flightIndex] = { ...items[flightIndex], [field]: value };
            sections[sectionIndex] = { ...sections[sectionIndex], items };
            return { ...current, sections };
        });
    };

    const removeFlight = (sectionIndex, flightIndex) => {
        updateConfig(current => {
            const sections = [...current.sections];
            sections[sectionIndex] = {
                ...sections[sectionIndex],
                items: sections[sectionIndex].items.filter((_, index) => index !== flightIndex)
            };
            return { ...current, sections };
        });
    };

    const updateQuickLink = (index, field, value) => {
        updateConfig(current => {
            const quickLinks = [...current.quickLinks];
            quickLinks[index] = { ...quickLinks[index], [field]: value };
            return { ...current, quickLinks };
        });
    };

    const statusText = syntaxError
        ? syntaxError
        : error
        ? error
        : saveState === 'saving'
            ? 'Guardando cambios…'
            : saveState === 'pending'
                ? 'Guardando…'
                : 'Cambios guardados en tripConfig.json';

    return (
        <div className="config-editor-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="config-editor" role="dialog" aria-modal="true" aria-labelledby="config-editor-title">
                <header className="config-editor-header">
                    <div>
                        <h2 id="config-editor-title">Personalizar viaje</h2>
                        <p>Edita los campos y gestiona las secciones con los controles. Los cambios se guardan automáticamente.</p>
                    </div>
                    <label className={`party-switch json-toggle ${jsonMode && (syntaxError || error) ? 'is-locked' : ''}`} title={jsonMode && (syntaxError || error) ? 'Corrige el JSON para volver al editor gráfico' : 'Alternar entre editor gráfico y JSON'}>
                        <input type="checkbox" checked={jsonMode} disabled={jsonMode && Boolean(syntaxError || error)} onChange={toggleJsonMode} />
                        <span className="party-switch-track" aria-hidden="true"></span>
                        <span className="party-switch-label">Editar JSON</span>
                    </label>
                    <button type="button" className="config-editor-close" onClick={onClose} aria-label="Cerrar editor">
                        <FiX aria-hidden="true" />
                    </button>
                </header>

                {jsonMode ? (
                    <div className="config-editor-content json-editor">
                        <div className="json-editor-bar">
                            <p>Edita el contenido completo de tripConfig.json. Se guarda cuando el JSON es válido.</p>
                            <button type="button" className="editor-add-button" onClick={formatJson}>Formatear</button>
                        </div>
                        <textarea
                            className={`json-editor-textarea ${syntaxError || error ? 'has-error' : ''}`}
                            value={jsonText}
                            onChange={event => handleJsonChange(event.target.value)}
                            spellCheck="false"
                            aria-label="Contenido JSON"
                        />
                    </div>
                ) : (
                <div className="config-editor-content">
                    <section className="editor-group">
                        <h3>Datos del viaje</h3>
                        <div className="editor-fields">
                            {[
                                ['meta.title', 'Título'],
                                ['meta.subtitle', 'Subtítulo'],
                                ['meta.description', 'Descripción'],
                                ['meta.footerText', 'Texto del pie'],
                                ['meta.flagUrl', 'URL de la bandera'],
                                ['meta.heroImage', 'Imagen de cabecera']
                            ].map(([path, label]) => (
                                <Field key={path} label={label} value={getValue(draft, path)} onChange={value => updateField(path, value)} />
                            ))}
                        </div>
                    </section>

                    <section className="editor-group">
                        <h3>Apariencia</h3>
                        <div className="editor-fields">
                            <Field
                                label="Tema predeterminado"
                                value={draft.theme?.name || 'ocean'}
                                options={Object.entries(themes).map(([value, theme]) => ({ value, label: theme.label }))}
                                onChange={value => updateField('theme.name', value)}
                            />
                            <Field
                                label="Modo de color"
                                value={draft.theme?.mode || 'light'}
                                options={[
                                    { value: 'light', label: 'Claro' },
                                    { value: 'dark', label: 'Oscuro' },
                                    { value: 'auto', label: 'Según el dispositivo' }
                                ]}
                                onChange={value => updateField('theme.mode', value)}
                            />
                            <label className="editor-checkbox">
                                <input type="checkbox" checked={draft.theme?.allowThemePicker !== false} onChange={event => updateField('theme.allowThemePicker', event.target.checked)} />
                                <span>Permitir cambiar el tema</span>
                            </label>
                            <label className="editor-checkbox">
                                <input type="checkbox" checked={draft.theme?.allowToggle !== false} onChange={event => updateField('theme.allowToggle', event.target.checked)} />
                                <span>Permitir modo claro/oscuro</span>
                            </label>
                        </div>
                    </section>

                    <section className="editor-group">
                        <div className="editor-group-heading is-sticky">
                            <h3>Accesos rápidos</h3>
                            <button type="button" className="editor-add-button" onClick={() => {
                                scrollToNewLinkRef.current = true;
                                updateConfig(current => ({
                                    ...current,
                                    quickLinks: [...current.quickLinks, { label: 'Nuevo enlace', url: '', icon: 'link' }]
                                }));
                            }}>
                                <FiPlus aria-hidden="true" /> Añadir enlace
                            </button>
                        </div>
                        {draft.quickLinks.length === 0 && <p className="editor-empty">No hay accesos rápidos.</p>}
                        {draft.quickLinks.map((link, index) => (
                            <div className="editor-item-card" data-editor-link={index} key={`quick-link-${index}`}>
                                <div className="editor-item-heading">
                                    <strong>{link.label || 'Nuevo enlace'}</strong>
                                    <ActionButton label="Eliminar enlace" danger onClick={() => updateConfig(current => ({
                                        ...current,
                                        quickLinks: current.quickLinks.filter((_, itemIndex) => itemIndex !== index)
                                    }))}><FiTrash2 /></ActionButton>
                                </div>
                                <div className="editor-fields">
                                    <Field label="Nombre" value={link.label} onChange={value => updateQuickLink(index, 'label', value)} />
                                    <Field label="URL" value={link.url} onChange={value => updateQuickLink(index, 'url', value)} />
                                    <Field
                                        label="Icono"
                                        value={link.icon || 'link'}
                                        options={['drive', 'hotel', 'map', 'money', 'link'].map(value => ({ value, label: value }))}
                                        onChange={value => updateQuickLink(index, 'icon', value)}
                                    />
                                    <Field label="Color" type="color" value={link.color || '#3b82f6'} onChange={value => updateQuickLink(index, 'color', value)} />
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="editor-group">
                        <div className="editor-group-heading is-sticky">
                            <h3>Itinerario</h3>
                            <div className="editor-add-actions">
                                {sectionTypes.map(type => (
                                    <button key={type.value} type="button" className="editor-add-button" onClick={() => addSection(type.value)}>
                                        <FiPlus aria-hidden="true" /> {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {draft.sections.length === 0 && <p className="editor-empty">Aún no hay secciones. Añade una para crear tu itinerario.</p>}
                        {draft.sections.map((section, index) => (
                            <article className="editor-section-card" data-editor-section={index} key={`${section.id}-${index}`}>
                                <div className="editor-section-heading">
                                    <strong>{section.menuLabel || section.title || section.name || 'Nueva sección'}</strong>
                                    <div className="editor-section-actions">
                                        <ActionButton label="Subir sección" disabled={index === 0} onClick={() => moveSection(index, -1)}><FiChevronUp /></ActionButton>
                                        <ActionButton label="Bajar sección" disabled={index === draft.sections.length - 1} onClick={() => moveSection(index, 1)}><FiChevronDown /></ActionButton>
                                        <ActionButton label="Eliminar sección" danger onClick={() => updateConfig(current => ({
                                            ...current,
                                            sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index)
                                        }))}><FiTrash2 /></ActionButton>
                                    </div>
                                </div>
                                <div className="editor-fields">
                                    <Field
                                        label="Tipo de sección"
                                        value={section.type}
                                        options={sectionTypes}
                                        onChange={value => changeSectionType(index, value)}
                                    />
                                    <Field label="Identificador" value={section.id} onChange={value => updateSection(index, 'id', value.trim().replace(/\s+/g, '-'))} />
                                    <Field label="Nombre en el menú" value={section.menuLabel} onChange={value => updateSection(index, 'menuLabel', value)} />
                                    <Field label="Color de acento" type="color" value={section.iconColor || '#3b82f6'} onChange={value => updateSection(index, 'iconColor', value)} />
                                </div>

                                {sectionFields[section.type].map(field => (
                                    <Field
                                        key={field.name}
                                        label={field.label}
                                        value={getValue(section, field.name)}
                                        options={field.options}
                                        onChange={value => updateSection(index, field.name, value)}
                                    />
                                ))}

                                {section.type === 'flights' && (
                                    <div className="editor-nested-items">
                                        <div className="editor-group-heading">
                                            <h4>Trayectos</h4>
                                            <button type="button" className="editor-add-button" onClick={() => addFlight(index)}>
                                                <FiPlus aria-hidden="true" /> Añadir billete
                                            </button>
                                        </div>
                                        {section.items.map((flight, flightIndex) => (
                                            <div className="editor-item-card" key={`flight-${flightIndex}`}>
                                                <div className="editor-item-heading">
                                                    <strong>Billete {flightIndex + 1}</strong>
                                                    <ActionButton label="Eliminar billete" danger onClick={() => removeFlight(index, flightIndex)}><FiTrash2 /></ActionButton>
                                                </div>
                                                <div className="editor-fields">
                                                    {[
                                                        ['from', 'Origen'],
                                                        ['to', 'Destino'],
                                                        ['date', 'Fecha'],
                                                        ['hour', 'Hora'],
                                                        ['link', 'Enlace al billete']
                                                    ].map(([field, label]) => (
                                                        <Field key={field} label={label} value={flight[field]} onChange={value => updateFlight(index, flightIndex, field, value)} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </section>

                    <section className="editor-group">
                        <div className={`party-card ${draft.partyMode?.enabled ? 'is-on' : ''}`}>
                            <div className="party-card-header">
                                <span className="party-card-emoji" aria-hidden="true">🎉</span>
                                <div className="party-card-title">
                                    <h3>Modo fiesta</h3>
                                    <p>Música, logo y frases que aparecen al activar la fiesta.</p>
                                </div>
                                <label className="party-switch">
                                    <input type="checkbox" checked={Boolean(draft.partyMode?.enabled)} onChange={event => updateField('partyMode.enabled', event.target.checked)} />
                                    <span className="party-switch-track" aria-hidden="true"></span>
                                    <span className="party-switch-label">{draft.partyMode?.enabled ? 'Activado' : 'Desactivado'}</span>
                                </label>
                            </div>
                            <div className="editor-fields party-card-fields">
                                <Field label="🎵 Archivo de audio (en public/party)" value={draft.partyMode?.audio || ''} onChange={value => updateField('partyMode.audio', value)} />
                                <Field label="🖼️ Archivo de logo (en public/party)" value={draft.partyMode?.logo || ''} onChange={value => updateField('partyMode.logo', value)} />
                                <Field label="Texto alternativo del logo" value={draft.partyMode?.logoAlt || ''} onChange={value => updateField('partyMode.logoAlt', value)} />
                                <Field
                                    label="🎤 Frases (una por línea)"
                                    type="textarea"
                                    value={(draft.partyMode?.lyrics || []).join('\n')}
                                    onChange={value => updateField('partyMode.lyrics', value.split('\n'))}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="editor-group">
                        <div className={`party-card memories-edit-card ${draft.memories?.enabled ? 'is-on' : ''}`}>
                            <div className="party-card-header">
                                <span className="party-card-emoji" aria-hidden="true">📸</span>
                                <div className="party-card-title">
                                    <h3>Recuerdos</h3>
                                    <p>Muestra las fotos de una carpeta de Google Drive encima de los accesos rápidos.</p>
                                </div>
                                <label className="party-switch">
                                    <input type="checkbox" checked={Boolean(draft.memories?.enabled)} onChange={event => updateField('memories.enabled', event.target.checked)} />
                                    <span className="party-switch-track" aria-hidden="true"></span>
                                    <span className="party-switch-label">{draft.memories?.enabled ? 'Activado' : 'Desactivado'}</span>
                                </label>
                            </div>
                            <div className="editor-fields party-card-fields">
                                <Field label="Título" value={draft.memories?.title || ''} onChange={value => updateField('memories.title', value)} />
                                <Field label="Descripción" value={draft.memories?.description || ''} onChange={value => updateField('memories.description', value)} />
                                <Field label="Enlace de la carpeta de Google Drive (compartida con cualquiera que tenga el enlace)" value={draft.memories?.driveLink || ''} onChange={value => updateField('memories.driveLink', value)} />
                            </div>
                        </div>
                    </section>
                </div>
                )}

                <footer className="config-editor-footer">
                    <p className={`config-editor-status ${error ? 'has-error' : ''}`} aria-live="polite">{statusText}</p>
                    <button type="button" className="editor-done-button" onClick={onClose}>Listo</button>
                </footer>
            </section>
        </div>
    );
}

export default ConfigEditor;
