import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Configuracion.css';

// Asegúrate de que el CSS esté cargado en tu entorno, ya que no se genera aquí.
// import './Configuracion.css'; 

// Importación de íconos
import { FaHome, FaBox, FaTruck, FaCog, FaDatabase, FaShieldAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

// --- Componente de Modal Personalizado (Reemplaza alert/confirm) ---
const CustomModal = ({ isOpen, title, message, type, onConfirm, onClose }) => {
    if (!isOpen) return null;

    // Estilos inline básicos para la superposición y la tarjeta del modal
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
        backgroundColor: '#2f254f', // var(--bg-card)
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        color: '#ffffff', // var(--text-light)
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
    
    // Colores basados en variables del CSS para coherencia
    const confirmButtonStyle = {
        ...buttonStyle,
        backgroundColor: type === 'confirm' ? '#ef4444' : '#4f46e5', // Rojo para confirmación peligrosa (Reset/Logout) o Azul para Aceptar (Alert)
        color: '#ffffff',
    };

    const cancelButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#555',
        color: '#ffffff',
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <h3 style={{ 
                    marginTop: 0, 
                    borderBottom: '1px solid #3c3066', 
                    paddingBottom: '15px', 
                    marginBottom: '20px',
                    color: type === 'confirm' ? '#ef4444' : '#4f46e5' // Color del título según el tipo
                }}>{title}</h3>
                <p style={{ lineHeight: '1.4' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', gap: '10px' }}>
                    {type === 'confirm' && (
                        <button style={cancelButtonStyle} onClick={onClose}>
                            Cancelar
                        </button>
                    )}
                    <button style={confirmButtonStyle} onClick={handleConfirm}>
                        {type === 'confirm' ? 'Confirmar' : 'Aceptar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Componente de Botón de Toggle (Switch) ---
const SwitchToggle = ({ isChecked, onToggle, label, subtext }) => (
    <div className="configSwitchGroup">
        <label className="switchLabel">
            {label}
            {subtext && <span className="switchSubtext">{subtext}</span>}
        </label>
        <label className="switch">
            <input type="checkbox" checked={isChecked} onChange={onToggle} />
            <span className="slider round"></span>
        </label>
    </div>
);

// --- Componente de Estado de Conexión ---
const ConnectionStatus = ({ isConnected }) => {
    return (
        <div className={`connectionStatus ${isConnected ? 'statusSuccess' : 'statusDanger'}`}>
            {isConnected ? 'Conexión establecida' : 'Fallo en la conexión'}
        </div>
    );
};

// --- Componente de Acciones Fijas al Pie ---
const FooterActions = ({ onSave, onReset, onExport }) => (
    <div className="footerActions">
        <div className="leftFooterButtons">
            <button className="actionButton resetButton" onClick={onReset}>
                Restablecer a Valores Iniciales
            </button>
            <button className="actionButton exportButton" onClick={onExport}>
                Exportar Configuración
            </button>
        </div>
        <button className="actionButton saveButton" onClick={onSave}>
            Guardar Cambios
        </button>
    </div>
);


// --- Componente SidebarItem con manejo de navegación y modal (solo usa navigate) ---
const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => {
    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

// --- Componente Principal (Configuracion) ---
function Configuracion() {
    const navigate = useNavigate();

    // --- Estados para la Configuración ---
    const [config, setConfig] = useState({
        nombreApp: "Sistema de Inventario XYZ",
        moneda: "MXN",
        emailHost: "smtp.ejemplo.com",
        emailPort: 587,
        dbHost: "192.168.1.10",
        dbUser: "admin_db",
        useHttps: true,
        twoFactorAuth: false,
        isConnected: false, // Estado de conexión de la DB
    });

    // --- Estados del Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ 
        title: '', 
        message: '', 
        type: 'alert', 
        onConfirm: null 
    });

    const showModal = (title, message, type = 'alert', onConfirm = null) => {
        setModalContent({ title, message, type, onConfirm });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent({ title: '', message: '', type: 'alert', onConfirm: null });
    };

    // Manejador de cambios genérico
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // --- Funciones de Acción ---

    // Lógica que se ejecuta *después* de la confirmación de guardado
    const handleSave = () => {
        console.log("Configuración guardada:", config);
        // Aquí iría la lógica para enviar los datos al backend (API)
        showModal('Éxito al Guardar', 'Configuración guardada exitosamente.', 'alert');
    };

    // Lógica que se ejecuta *después* de la confirmación de restablecimiento
    const handleResetConfirm = () => {
        // Restaurar a valores predeterminados
        setConfig({
            nombreApp: "Sistema de Inventario XYZ",
            moneda: "MXN",
            emailHost: "smtp.ejemplo.com",
            emailPort: 587,
            dbHost: "192.168.1.10",
            dbUser: "admin_db",
            useHttps: true,
            twoFactorAuth: false,
            isConnected: false,
        });
        showModal('Restablecido', 'Configuración restablecida a valores predeterminados.', 'alert');
    };

    // Función que abre el modal de confirmación para restablecer
    const handleReset = () => {
        showModal(
            'Confirmación de Restablecimiento',
            '¿Estás seguro de que quieres restablecer todos los valores a la configuración predeterminada? Esta acción es irreversible.',
            'confirm',
            handleResetConfirm
        );
    };
    
    const handleExport = () => {
        // Lógica para generar un archivo JSON o TXT de la configuración
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "configuracion_exportada.json");
        document.body.appendChild(downloadAnchorNode); 
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleTestConnection = () => {
        // Simulación de conexión
        console.log("Probando conexión a DB con:", config.dbHost, config.dbUser);
        
        // Simular un tiempo de espera
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% de éxito
            setConfig(prev => ({ ...prev, isConnected: success }));
            const title = success ? 'Conexión Exitosa' : 'Fallo de Conexión';
            const message = success ? 'Prueba de conexión exitosa. ¡La base de datos respondió correctamente!' : 'Fallo en la conexión. Revisa el host y el usuario.';
            showModal(title, message, 'alert');
        }, 1500);
    };

    // Lógica que se ejecuta *después* de la confirmación de cerrar sesión
    const handleLogoutConfirm = () => {
        console.log("Sesión cerrada");
        // Aquí iría la lógica real de logout (limpiar tokens, etc.)
        // navigate('/login'); // Navegación a login
        showModal('Sesión Cerrada', 'Has cerrado tu sesión exitosamente.', 'alert');
    };

    // Manejador centralizado de clics en el Sidebar
    const handleSidebarClick = (label, path) => {
        if (path) {
            navigate(path);
        } else if (label === "Cerrar sesion") {
            showModal(
                'Confirmación de Salida',
                '¿Estás seguro de que quieres cerrar la sesión actual?',
                'confirm',
                handleLogoutConfirm
            );
        }
    };


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
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" onClick={() => handleSidebarClick('INICIO', '/dashboard')} />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" onClick={() => handleSidebarClick('Orden nueva', '/dashboard/orden-nueva')} />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" onClick={() => handleSidebarClick('Ordenes pasadas', '/dashboard/ordenes-pasadas')} />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" onClick={() => handleSidebarClick('Productos', '/dashboard/productos')} />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" onClick={() => handleSidebarClick('Proveedores', '/dashboard/proveedores')} />
                    <SidebarItem icon={FaCog} label="Configuracion" isActive={true} path="/dashboard/configuracion" onClick={() => handleSidebarClick('Configuracion', '/dashboard/configuracion')} />
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesion" onClick={() => handleSidebarClick('Cerrar sesion')} />
                </div>
            </div>

            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Configuración del Sistema</h1>
                </div>

                <div className="configGrid">
                    
                    {/* --- 1. Tarjeta de Configuración General --- */}
                    <div className="configCard general">
                        <div className="cardHeader">
                            <FaGlobe />
                            <h2 className="cardTitle">Ajustes Generales</h2>
                        </div>
                        <div className="configFormGroup">
                            <label htmlFor="nombreApp" className="configLabel">Nombre de la Aplicación</label>
                            <input
                                id="nombreApp"
                                name="nombreApp"
                                type="text"
                                className="configInput"
                                value={config.nombreApp}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="configFormGroup">
                            <label htmlFor="moneda" className="configLabel">Moneda Predeterminada</label>
                            <select
                                id="moneda"
                                name="moneda"
                                className="configSelect"
                                value={config.moneda}
                                onChange={handleChange}
                            >
                                <option value="MXN">Peso Mexicano (MXN)</option>
                                <option value="USD">Dólar Estadounidense (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="CAD">Dólar Canadiense (CAD)</option>
                            </select>
                        </div>
                        <SwitchToggle
                            isChecked={config.useHttps}
                            onToggle={() => setConfig(prev => ({ ...prev, useHttps: !prev.useHttps }))}
                            label="Usar Conexión Segura (HTTPS)"
                            subtext="Recomendado para producción."
                        />
                    </div>

                    {/* --- 2. Tarjeta de Configuración de Base de Datos --- */}
                    <div className="configCard database">
                        <div className="cardHeader">
                            <FaDatabase />
                            <h2 className="cardTitle">Base de Datos</h2>
                        </div>
                        <div className="configFormGroup">
                            <label htmlFor="dbHost" className="configLabel">Host de la Base de Datos</label>
                            <input
                                id="dbHost"
                                name="dbHost"
                                type="text"
                                className="configInput"
                                value={config.dbHost}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="configFormGroup">
                            <label htmlFor="dbUser" className="configLabel">Usuario de la Base de Datos</label>
                            <input
                                id="dbUser"
                                name="dbUser"
                                type="text"
                                className="configInput"
                                value={config.dbUser}
                                onChange={handleChange}
                            />
                        </div>
                        {/* El campo de contraseña no se incluye por seguridad real, solo para simulación */}
                        <button className="actionButton connectButton" onClick={handleTestConnection}>
                            Probar Conexión
                        </button>
                        <ConnectionStatus isConnected={config.isConnected} />
                    </div>

                    {/* --- 3. Tarjeta de Configuración de Correo Electrónico (SMTP) --- */}
                    <div className="configCard email">
                        <div className="cardHeader">
                            <FaEnvelope />
                            <h2 className="cardTitle">Configuración de Correo (SMTP)</h2>
                        </div>
                        <div className="configFormGroup">
                            <label htmlFor="emailHost" className="configLabel">Servidor SMTP Host</label>
                            <input
                                id="emailHost"
                                name="emailHost"
                                type="text"
                                className="configInput"
                                value={config.emailHost}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="inputGroup">
                            <div className="configFormGroup">
                                <label htmlFor="emailPort" className="configLabel">Puerto</label>
                                <input
                                    id="emailPort"
                                    name="emailPort"
                                    type="number"
                                    className="configInput"
                                    value={config.emailPort}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="configFormGroup">
                                <label htmlFor="emailPassword" className="configLabel">Contraseña (Sólo prueba)</label>
                                <input
                                    id="emailPassword"
                                    name="emailPassword"
                                    type="password"
                                    className="configInput"
                                    placeholder="••••••••"
                                    disabled
                                />
                            </div>
                        </div>
                        <button className="actionButton connectButton">
                            Enviar Correo de Prueba
                        </button>
                    </div>

                    {/* --- 4. Tarjeta de Seguridad --- */}
                    <div className="configCard security">
                        <div className="cardHeader">
                            <FaShieldAlt />
                            <h2 className="cardTitle">Seguridad y Autenticación</h2>
                        </div>
                        <SwitchToggle
                            isChecked={config.twoFactorAuth}
                            onToggle={() => setConfig(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                            label="Autenticación de Dos Factores (2FA)"
                            subtext="Añade una capa extra de seguridad para el inicio de sesión."
                        />
                        <SwitchToggle
                            isChecked={true} // Asumimos que el log de auditoría está siempre activado
                            onToggle={() => {}} // No permitir desactivar
                            label="Registro de Auditoría Detallado"
                            subtext="Mantiene un registro de todas las acciones importantes de los usuarios (activo)."
                        />
                        <div className="configFormGroup">
                            <label htmlFor="passwordPolicy" className="configLabel">Política de Contraseñas</label>
                            <select
                                id="passwordPolicy"
                                name="passwordPolicy"
                                className="configSelect"
                                defaultValue="medium"
                            >
                                <option value="low">Baja (Mín. 6 caracteres)</option>
                                <option value="medium">Media (Mín. 8 caracteres, 1 número)</option>
                                <option value="high">Alta (Mín. 10 caracteres, mayúsculas, números, símbolos)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* -------------------- ACCIONES FIJAS AL PIE -------------------- */}
            <FooterActions 
                onSave={handleSave} 
                onReset={handleReset} // Ahora llama a la función que dispara el modal de confirmación
                onExport={handleExport} 
            />

            {/* -------------------- MODAL GLOBAL -------------------- */}
            <CustomModal
                isOpen={isModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                type={modalContent.type}
                onConfirm={modalContent.onConfirm}
                onClose={closeModal}
            />
        </div>
    );
}

export default Configuracion;