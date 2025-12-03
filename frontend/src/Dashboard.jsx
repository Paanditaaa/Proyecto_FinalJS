import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { FaHome, FaBox, FaTruck, FaCog } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.locale('es');

// -------------------------------------------------------------
// Componente de Modal Personalizado (Copiado de la lógica anterior)
// -------------------------------------------------------------

const CustomModal = ({ isOpen, title, message, type, onConfirm, onClose, showInput = false, inputPlaceholder = "" }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    // Estilos internos para el modal (Puedes usar clases CSS si prefieres)
    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
    };

    const contentStyle = {
        position: 'relative',
        backgroundColor: '#2f254f', // Fondo oscuro de la tarjeta
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        color: '#ffffff',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        color: '#a0a0a0',
        fontSize: '1.5em',
        cursor: 'pointer',
        fontWeight: 'bold',
        lineHeight: '1',
        transition: 'color 0.2s',
    };

    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        fontSize: '0.9em',
        transition: 'background-color 0.2s',
    };

    const confirmButtonStyle = {
        ...buttonStyle,
        backgroundColor: type === 'confirm' ? '#ef4444' : '#4f46e5',
        color: '#ffffff',
    };

    const cancelButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#555',
        color: '#ffffff',
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm(showInput ? inputValue : undefined);
        onClose();
        setInputValue('');
    };

    const handleClose = () => {
        onClose();
        setInputValue('');
    };



    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <button style={closeButtonStyle} onClick={handleClose}>
                    &times;
                </button>
                <h3 style={{
                    marginTop: 0,
                    borderBottom: '1px solid #3c3066',
                    paddingBottom: '15px',
                    marginBottom: '20px',
                    color: type === 'confirm' ? '#ef4444' : '#4f46e5'
                }}>
                    {title}
                </h3>
                <p style={{ lineHeight: '1.4' }}>{message}</p>

                {showInput && (
                    <div style={{ marginTop: '20px' }}>
                        <textarea
                            style={{ minHeight: '120px', resize: 'vertical', padding: '15px', width: '100%', boxSizing: 'border-box', border: '1px solid #3c3066', borderRadius: '8px', backgroundColor: '#3c3066', color: '#ffffff' }}
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', gap: '10px' }}>
                    {type === 'confirm' && (
                        <button style={cancelButtonStyle} onClick={handleClose}>
                            Cancelar
                        </button>
                    )}
                    <button
                        style={confirmButtonStyle}
                        onClick={handleConfirm}
                        disabled={showInput && inputValue.trim() === ''}
                    >
                        {showInput ? 'Enviar' : (type === 'confirm' ? 'Confirmar' : 'Aceptar')}
                    </button>
                </div>
            </div>
        </div>
    );
};
// -- Constante que permite que aparezca el nombre del usuario en el sidebar --
const userName = localStorage.getItem('userName') || "Invitado";

// --- Componentes Reutilizables (SidebarItem MODIFICADO) ---

/**
 * Componente para un elemento del menú lateral con navegación y manejo de modal.
 */
const SidebarItem = ({ icon: Icon, label, isActive, path, navigate, showModal }) => {

    // Función de confirmación de logout (se define aquí para usar navigate)
    const handleLogoutConfirm = () => {
        // Lógica real de CERRAR SESIÓN
        localStorage.removeItem('token'); // Eliminar el token de autenticación
        console.log("Sesión cerrada y token eliminado.");
        navigate('/login'); // Redirigir a la página de login (o donde sea tu ruta de inicio de sesión)
    };

    const handleClick = () => {
        if (path) {
            navigate(path);
        } else if (label === "Cerrar sesion" && showModal) {
            showModal(
                'Confirmación de Salida',
                '¿Estás seguro de que quieres cerrar la sesión actual? Necesitarás tus credenciales para volver a entrar.',
                'confirm',
                handleLogoutConfirm
            );
        }
    };

    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

// Componentes de la Interfaz (sin cambios mayores, mantenidos para coherencia)

const StatCard = ({ title, value, description, isSmall = false }) => (
    <div className={`statCard ${isSmall ? 'smallCard' : ''}`}>
        <h3 className="cardTitle">{title}</h3>
        <p className="cardValue">{value}</p>
        <p className="cardDescription">{description}</p>
        <div className="cardChartWave" />
    </div>
);

const ProgressBar = ({ label, percentage }) => {
    const progressStyle = {
        width: `${percentage}%`,
    };

    return (
        <div className="progressBarContainer">
            <span className="progressLabel">{label}</span>
            <div className="progressBarTrack">
                <div className="progressBarFill" style={progressStyle} />
            </div>
        </div>
    );
};

const WelcomeMessage = ({ message, extraContent }) => (
    <div className="welcomeMessage">
        <p className="welcomeTitle">{message}</p>
        {extraContent}
    </div>
);

const AnalogClock = ({ currentTime }) => {
    const seconds = currentTime.second();
    const minutes = currentTime.minute();
    const hours = currentTime.hour() % 12;

    const secondRotation = (seconds * 6) - 90;
    const minuteRotation = (minutes * 6) + (seconds * 0.1) - 90;
    const hourRotation = (hours * 30) + (minutes * 0.5) - 90;

    return (
        <div className="analogClockContainer">
            <div className="centerDot" />
            <div
                className="hand hourHand"
                style={{ transform: `rotate(${hourRotation}deg)` }}
            />
            <div
                className="hand minuteHand"
                style={{ transform: `rotate(${minuteRotation}deg)` }}
            />
            <div
                className="hand secondHand"
                style={{ transform: `rotate(${secondRotation}deg)` }}
            />
        </div>
    );
};


// --- Componente Principal (Dashboard) ---

function Dashboard() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(dayjs());

    // --- Estados del Modal AÑADIDOS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        type: 'alert',
        onConfirm: null,
        showInput: false,
        inputPlaceholder: ''
    });

    // Función showModal definida en el padre
    const showModal = (title, message, type = 'alert', onConfirm = null, showInput = false, inputPlaceholder = '') => {
        setModalContent({ title, message, type, onConfirm, showInput, inputPlaceholder });
        setIsModalOpen(true);
    };

    // Función closeModal definida en el padre
    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent({ title: '', message: '', type: 'alert', onConfirm: null, showInput: false, inputPlaceholder: '' });
    };

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedDate = currentTime.format('dddd, DD [de] MMMM [de] YYYY');
    const welcomeMessageText = `Esperamos que estés teniendo un muy buen dia \n\nHoy es ${formattedDate}`;

    return (
        <div className="dashboardContainer">
            {/* -------------------- SIDEBAR -------------------- */}
            <div className="sidebar">
                <div className="profileSection">
                    <UserAvatar />
                    <h2 className="accountTitle">{userName}</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    {/* Los SidebarItem ahora reciben showModal y navigate */}
                    <SidebarItem icon={FaHome} label="INICIO" isActive={true} path="/dashboard" navigate={navigate} showModal={showModal} />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" navigate={navigate} showModal={showModal} />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" navigate={navigate} showModal={showModal} />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" navigate={navigate} showModal={showModal} />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" navigate={navigate} showModal={showModal} />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" navigate={navigate} showModal={showModal} />

                    {/* Botón de Cerrar Sesión con lógica de modal */}
                    <SidebarItem
                        icon={BsFillDoorOpenFill}
                        label="Cerrar sesion"
                        navigate={navigate}
                        showModal={showModal}
                    />
                </div>
            </div>

            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">INICIO</h1>
                </div>

                <WelcomeMessage
                    message={welcomeMessageText}
                    extraContent={<AnalogClock currentTime={currentTime} />}
                />

                <div className='topCardsRow'>
                    {/* Aquí irían otras StatCards */}
                </div>
            </div>

            {/* -------------------- MODAL GLOBAL AÑADIDO -------------------- */}
            <CustomModal
                isOpen={isModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                type={modalContent.type}
                onConfirm={modalContent.onConfirm}
                onClose={closeModal}
                showInput={modalContent.showInput}
                inputPlaceholder={modalContent.inputPlaceholder}
            />
        </div>
    );
}

export default Dashboard;