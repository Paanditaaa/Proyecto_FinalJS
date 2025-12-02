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

// --- Componentes Reutilizables ---

/**
 * Componente para mostrar una tarjeta de estadísticas.
 */
const StatCard = ({ title, value, description, isSmall = false }) => (
    <div className={`statCard ${isSmall ? 'smallCard' : ''}`}>
        <h3 className="cardTitle">{title}</h3>
        <p className="cardValue">{value}</p>
        <p className="cardDescription">{description}</p>
        <div className="cardChartWave" />
    </div>
);

/**
 * Componente para simular una barra de progreso.
 */
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

/**
 * Componente para un elemento del menú lateral con navegación.
 */
const SidebarItem = ({ icon: Icon, label, isActive, path }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            style={{ cursor: path ? 'pointer' : 'default' }}
        >
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

/**
 * Componente para el mensaje de bienvenida que ocupa el ancho completo.
 */
const WelcomeMessage = ({ message, extraContent }) => (
    <div className="welcomeMessage">
        <p className="welcomeTitle">{message}</p>
        {extraContent}
    </div>
);

// 🌟 COMPONENTE: Reloj Analógico
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
    const [currentTime, setCurrentTime] = useState(dayjs());

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
                    <h2 className="accountTitle">ACCOUNT</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    <SidebarItem icon={FaHome} label="INICIO" isActive={true} path="/dashboard" />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" />
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesion" />
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
        </div>
    );
}

export default Dashboard;