import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Configuracion.css';

// Importación de íconos
import { FaHome, FaBox, FaTruck, FaCog, FaDatabase, FaShieldAlt, FaEnvelope, FaGlobe, FaBug } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';

// --- Componente de Modal Personalizado (FINAL) ---
const CustomModal = ({ isOpen, title, message, type, onConfirm, onClose, showInput = false, inputPlaceholder = "" }) => {
    // Estado local para el contenido del campo de texto
    const [inputValue, setInputValue] = useState('');

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
        position: 'relative', // Necesario para posicionar el botón de cerrar
        backgroundColor: '#2f254f', // var(--bg-card)
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        color: '#ffffff', // var(--text-light)
    };
    
    // Estilo para el botón de cerrar (X) AÑADIDO
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

    // Colores basados en variables del CSS para coherencia
    const confirmButtonStyle = {
        ...buttonStyle,
        backgroundColor: type === 'confirm' ? '#ef4444' : '#4f46e5', // Rojo para confirmación peligrosa o Azul para Aceptar/Enviar
        color: '#ffffff',
    };

    const cancelButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#555',
        color: '#ffffff',
    };

    // FUNCIÓN MODIFICADA: Llama a onConfirm primero, luego cierra el modal
    const handleConfirm = () => {
        // Pasa el valor del input si showInput es true
        if (onConfirm) onConfirm(showInput ? inputValue : undefined);
        
        // Cierra el modal, haciéndolo desaparecer
        onClose(); 
        
        // Limpiar el estado local al cerrar
        setInputValue('');
    };
    
    // Función para manejar el cierre al presionar el botón "X" o "Cancelar"
    const handleClose = () => {
        onClose();
        setInputValue('');
    };


    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                 {/* --- BOTÓN DE CERRAR (X) AÑADIDO --- */}
                 <button style={closeButtonStyle} onClick={handleClose}>
                    &times; {/* El carácter HTML para una X */}
                </button>
                {/* ------------------------------------ */}
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
                
                {/* --- CAMPO DE TEXTO PARA ERRORES/SUGERENCIAS --- */}
                {showInput && (
                    <div className="configFormGroup" style={{marginTop: '20px'}}>
                        <textarea
                            className="configInput" 
                            style={{ minHeight: '120px', resize: 'vertical', padding: '15px' }}
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                )}
                {/* ----------------------------------------------- */}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', gap: '10px' }}>
                    {type === 'confirm' && (
                        <button style={cancelButtonStyle} onClick={handleClose}>
                            Cancelar
                        </button>
                    )}
                    <button 
                        style={confirmButtonStyle} 
                        onClick={handleConfirm}
                        // Deshabilitar si se requiere input y está vacío
                        disabled={showInput && inputValue.trim() === ''} 
                    >
                        {/* Cambia el texto del botón si hay un input */}
                        {showInput ? 'Enviar' : (type === 'confirm' ? 'Confirmar' : 'Aceptar')}
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
        onConfirm: null,
        // Nuevos campos
        showInput: false, 
        inputPlaceholder: ''
    });

    // Función showModal
    const showModal = (title, message, type = 'alert', onConfirm = null, showInput = false, inputPlaceholder = '') => {
        setModalContent({ title, message, type, onConfirm, showInput, inputPlaceholder });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Limpiar todos los campos al cerrar
        setModalContent({ title: '', message: '', type: 'alert', onConfirm: null, showInput: false, inputPlaceholder: '' });
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

    const handleSave = () => {
        console.log("Configuración guardada:", config);
        showModal('Éxito al Guardar', 'Configuración guardada exitosamente.', 'alert');
    };

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
        // NOTA: El modal de confirmación se cierra automáticamente después de handleResetConfirm
        // Gracias a la lógica en CustomModal/handleConfirm.
    };

    const handleReset = () => {
        showModal(
            'Confirmación de Restablecimiento',
            '¿Estás seguro de que quieres restablecer todos los valores a la configuración predeterminada? Esta acción es irreversible.',
            'confirm',
            handleResetConfirm
        );
    };

    // Lógica para manejar el envío del feedback (errores/sugerencias)
    const handleSubmitFeedback = (feedbackType) => (text) => {
        console.log(`[${feedbackType}] Contenido enviado:`, text);
        // Aquí iría la lógica para enviar el error/sugerencia al backend
        // Abrir un nuevo modal de éxito SÓLO si el envío fue exitoso.
        showModal('Gracias por tu aporte', `Tu ${feedbackType} ha sido enviado exitosamente.`, 'alert');
        
        // NOTA: El modal de input actual se cierra automáticamente después de handleSubmitFeedback
    };

    // Función para dejar errores (Reportar error)
    const reportError = () => 
    {
        showModal(
            "Reportar un Error",
            "Describe con detalle el error o problema que encontraste en el programa:",
            'alert', 
            handleSubmitFeedback('Error'), 
            true, // showInput = true
            "Ej: No funciona el botón de cerrar sesion." // inputPlaceholder
        );
    }

    // Función para mencionar comentarios (Sugerencias)
    const comentaSurg = () =>
    {
        showModal(
            "Comentarios y Sugerencias",
            "Agradecemos tus ideas para mejorar y buenos comentarios:",
            'alert',
            handleSubmitFeedback('Sugerencia'), 
            true, // showInput = true
            "Ej: Sería agradable agregar esta opcion" // inputPlaceholder
        );
    }

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "configuracion_exportada.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleTestConnection = () => {
        console.log("Probando conexión a DB con:", config.dbHost, config.dbUser);

        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% de éxito
            setConfig(prev => ({ ...prev, isConnected: success }));
            const title = success ? 'Conexión Exitosa' : 'Fallo de Conexión';
            const message = success ? 'Prueba de conexión exitosa. ¡La base de datos respondió correctamente!' : 'Fallo en la conexión. Revisa el host y el usuario.';
            showModal(title, message, 'alert');
        }, 1500);
    };

    const handleLogoutConfirm = () => {
        console.log("Sesión cerrada");
        // NOTA: El modal de confirmación se cierra automáticamente después de handleLogoutConfirm
    };

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
                    <UserAvatar />
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
                            onToggle={() => { }} // No permitir desactivar
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

                    {/* --- 5. Tarjeta de bugs y errores --- */}
                    <div className="configCard bugs">
                        <div className="cardHeader">
                            <FaBug />
                            <h2 className="cardTitle">Errores y sugerencias</h2>
                        </div>
                        {/* Botones que abren el modal con input */}
                        <button className="actionButton connectButton" onClick={reportError}>
                            Reportar error
                        </button>
                        <button className="actionButton connectButton" onClick={comentaSurg}>
                            Dejar comentario o sugerencias 
                        </button>
                            <button className="actionButton connectButton" onClick={comentaSurg}>
                            Ver comentarios 
                        </button>
                            <button className="actionButton connectButton" onClick={comentaSurg}>
                            Ver sugerencias 
                        </button>
                    </div>
                </div>
            </div>

            {/* -------------------- ACCIONES FIJAS AL PIE -------------------- */}
            <FooterActions
                onSave={handleSave}
                onReset={handleReset} 
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
                // Props para el input
                showInput={modalContent.showInput} 
                inputPlaceholder={modalContent.inputPlaceholder}
            />
        </div>
    );
}

export default Configuracion;