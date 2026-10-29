import { useEffect, useRef, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import './styles.css';

function SideNav({ title, links = [], activeHref, onNavigate, mode, onToggleMode, themeOptions = [], themeName, onSelectTheme }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handlePointer = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        const handleKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointer);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('pointerdown', handlePointer);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    return (
        <nav ref={rootRef} className={`side-nav ${open ? 'is-open' : ''}`} aria-label="Navegación de secciones">
            <div className="side-nav-bar">
                <a className="side-nav-brand" href="#top" onClick={() => setOpen(false)}>{title}</a>
                <div className="side-nav-actions">
                    <button
                        type="button"
                        className="side-nav-toggle"
                        onClick={() => setOpen(prev => !prev)}
                        aria-expanded={open}
                        aria-controls="side-nav-list"
                    >
                        <span className="burger" aria-hidden="true"><i /><i /><i /></span>
                        <span>{open ? 'Cerrar' : 'Secciones'}</span>
                    </button>
                </div>
            </div>

            <ul id="side-nav-list" className="side-nav-list">
                {links.map(link => {
                    const Icon = link.icon;

                    return (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={link.href === activeHref ? 'is-active' : ''}
                                aria-current={link.href === activeHref ? 'true' : undefined}
                                onClick={() => {
                                    onNavigate?.(link.href);
                                    setOpen(false);
                                }}
                            >
                                {Icon && (
                                    <span className="nav-icon" style={{ '--chip-color': link.color }} aria-hidden="true">
                                        <Icon />
                                    </span>
                                )}
                                <span>{link.label}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>

            {(onToggleMode || themeOptions.length > 0) && (
                <div className="side-nav-footer">
                    {themeOptions.length > 0 && (
                        <div className="theme-picker" role="radiogroup" aria-label="Tema">
                            {themeOptions.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={option.id === themeName}
                                    aria-label={option.label}
                                    title={option.label}
                                    className={`theme-swatch ${option.id === themeName ? 'is-selected' : ''}`}
                                    style={{ '--swatch': mode === 'dark' ? option.colorDark : option.color }}
                                    onClick={() => onSelectTheme?.(option.id)}
                                />
                            ))}
                        </div>
                    )}
                    {onToggleMode && (
                        <button
                            type="button"
                            className="side-nav-mode"
                            onClick={onToggleMode}
                            aria-label={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        >
                            {mode === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
                            <span>{mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default SideNav;
