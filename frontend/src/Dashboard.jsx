import React, { useState, useEffect } from 'react';
import { Home, Package, Truck, Settings, LogOut, History, PlusCircle } from 'lucide-react';
import "./Dashboard.css";

// --- Funciones de Utilidad (para reemplazar dayjs) ---

/**
 * Convierte un objeto Date en una cadena de fecha formateada en español.
 * @param {Date} date El objeto Date actual.
 * @returns {string} La fecha formateada (Ej: SÁBADO, 29 DE NOVIEMBRE DE 2025).
 */
const getFormattedDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // Usamos el locale 'es-ES' y convertimos a mayúsculas para replicar el estilo
    const dateString = date.toLocaleDateString('es-ES', options).toUpperCase();
    return dateString.replace(/,/g, ''); // Eliminar comas
};


// --- Componentes Reutilizables ---

/**
 * Componente para mostrar una tarjeta de estadísticas.
 */
const StatCard = ({ title, value, description }) => (
    <div className='statCard'>
        <h3 className="cardTitle">{title}</h3>
        <p className="cardValue">{value}</p>
        <p className="cardDescription">{description}</p>
        <div className="cardChartWave" />
    </div>
);


/**
 * Componente para un elemento del menú lateral con manejo de estado.
 */
const SidebarItem = ({ icon: Icon, label, viewId, activeView, onSelect }) => {
    // Usamos 'viewId' para identificar qué vista debe mostrar
    const isActive = activeView === viewId;

    const handleClick = () => {
        // Llama a la función de selección en el componente padre
        onSelect(viewId, label.toUpperCase());
    };

    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
            {/* Los iconos de Lucide-React se renderizan aquí */}
            <Icon className="sidebarIcon" size={24} />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

/**
 * Componente para el mensaje de bienvenida y reloj.
 */
const WelcomeContent = ({ currentTime }) => {
    const formattedDate = getFormattedDate(currentTime);
    const welcomeMessageText = `Esperamos que estés teniendo un muy buen día \n\nHoy es ${formattedDate}`;

    return (
        <div className="welcomeMessage">
            <p className="welcomeTitle">{welcomeMessageText}</p>
            <AnalogClock currentTime={currentTime} />
        </div>
    );
};

// 🌟 COMPONENTE: Reloj Analógico
const AnalogClock = ({ currentTime }) => {
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();

    // Calcular grados: (valor / total) * 360 + 90 (el 90 es por el CSS transform: rotate(90deg))

    // Horas: (horas % 12 + minutos / 60) / 12 * 360 + 90
    const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360 + 90;
    // Minutos: (minutos + segundos / 60) / 60 * 360 + 90
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360 + 90;
    // Segundos: (segundos / 60) * 360 + 90
    const secondDegrees = (seconds / 60) * 360 + 90;

    return (
        <div className="analogClockContainer">
            <div className="centerDot" />
            <div
                className="hand hourHand"
                style={{ transform: `rotate(${hourDegrees}deg)` }}
            />
            <div
                className="hand minuteHand"
                style={{ transform: `rotate(${minuteDegrees}deg)` }}
            />
            <div
                className="hand secondHand"
                style={{ transform: `rotate(${secondDegrees}deg)` }}
            />
        </div>
    );
};


// --- Componente de Contenido para cada Vista ---
const ContentSection = ({ viewId, activeView, children }) => {
    const isActive = activeView === viewId;
    return (
        <div className={`contentSection ${isActive ? 'active' : ''}`} data-content={viewId}>
            {children}
        </div>
    );
};

// --- Componente Principal (Dashboard) ---

function Dashboard() {
    // Estado para el reloj
    const [currentTime, setCurrentTime] = useState(new Date());

    // Estado para la navegación y el título
    const [activeView, setActiveView] = useState('inicio');
    const [pageTitle, setPageTitle] = useState('INICIO');

    // Efecto para actualizar el reloj cada segundo
    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    // Manejador de la selección en la barra lateral
    const handleViewSelect = (viewId, label) => {
        if (viewId === 'cerrar-sesion') {
            console.log("Cerrando sesión...");
            // Aquí iría la lógica de cierre de sesión
        }
        setActiveView(viewId);
        setPageTitle(label);
    };

    // Estructura de las vistas
    const views = [
        {
            id: 'inicio', label: 'INICIO', icon: Home, component: () => (
                <>
                    <WelcomeContent currentTime={currentTime} />
                    <div className='topCardsRow'>
                        <StatCard title="Ventas Hoy" value="$1,250" description="2% más que ayer" />
                        <StatCard title="Órdenes Activas" value="15" description="3 en preparación" />
                        <StatCard title="Productos Stock" value="480" description="Reabastecer 5 ítems" />
                        <StatCard title="Nuevos Clientes" value="8" description="Meta mensual: 50" />
                    </div>
                </>
            )
        },
        {
            id: 'orden-nueva', label: 'Orden nueva', icon: PlusCircle, component: () => (
                <>
                    <h2>Formulario de Creación</h2>
                    <p>Aquí se diseñaría la interfaz para crear y registrar una nueva orden de compra o venta.</p>
                    <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-dark)', borderRadius: '8px', padding: '20px' }}>
                        <p style={{ color: 'var(--text-light)', margin: 0 }}>Rellena los campos para proceder.</p>
                    </div>
                </>
            )
        },
        {
            id: 'ordenes-pasadas', label: 'Ordenes pasadas', icon: History, component: () => (
                <>
                    <h2>Listado Histórico</h2>
                    <p>Visualización y filtros de todas las transacciones históricas.</p>
                    <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-dark)', borderRadius: '8px', padding: '20px' }}>
                        <p style={{ color: 'var(--text-light)', margin: 0 }}>Tabla con 100+ órdenes.</p>
                    </div>
                </>
            )
        },
        {
            id: 'productos', label: 'Productos', icon: Package, component: () => (
                <>
                    <h2>Gestión de Inventario</h2>
                    <p>Sección para administrar el catálogo de productos: precios, stock, categorías.</p>
                </>
            )
        },
        {
            id: 'proveedores', label: 'Proveedores', icon: Truck, component: () => (
                <>
                    <h2>Administración de Suministros</h2>
                    <p>Información de contactos, historial de pedidos y plazos de entrega de proveedores.</p>
                </>
            )
        },
        {
            id: 'configuracion', label: 'Configuracion', icon: Settings, component: () => (
                <>
                    <h2>Ajustes del Sistema</h2>
                    <p>Opciones de personalización y administración de usuarios y permisos.</p>
                </>
            )
        },
        {
            id: 'cerrar-sesion', label: 'Cerrar sesion', icon: LogOut, component: () => (
                <>
                    <h2>Confirmación de Salida</h2>
                    <p>Estás a punto de cerrar tu sesión. Gracias por tu trabajo hoy.</p>
                </>
            )
        },
    ];


    return (
        <div className="dashboardContainer">
            {/* -------------------- SIDEBAR -------------------- */}
            <div className="sidebar">
                <div className="profileSection">
                    <div className="avatar" />
                    <h2 className="accountTitle">ACCOUNT</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    {views.map(view => (
                        <SidebarItem
                            key={view.id}
                            icon={view.icon}
                            label={view.label}
                            viewId={view.id}
                            activeView={activeView}
                            onSelect={handleViewSelect}
                        />
                    ))}
                </div>
            </div>

            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">{pageTitle}</h1>
                    <div className="searchBox">
                        <input type="text" placeholder="Buscar en el dashboard..." className="searchInput" />
                    </div>
                </div>

                {/* CONTENEDOR DE VISTAS DINÁMICAS */}
                <div className="contentWrapper">
                    {views.map(view => (
                        <ContentSection key={view.id} viewId={view.id} activeView={activeView}>
                            <view.component />
                        </ContentSection>
                    ))}
                </div>
            </div>
        </div>
    );
}