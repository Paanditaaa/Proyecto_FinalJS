import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrdenesPasadas.css';
import { FaHome, FaBox, FaTruck, FaCog, FaDollarSign } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';

// -------------------------------------------------------------
// Componente de Modal Genérico
// -------------------------------------------------------------
// -- Constante que permite que aparezca el nombre del usuario en el sidebar --
const userName = localStorage.getItem('userName') || "Invitado";

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
        position: 'relative',
        backgroundColor: '#2f254f',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        color: '#ffffff',
        textAlign: 'center'
    };

    // Estilo para el botón de cerrar (X)
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

    // Estilo de Confirmar: Rojo (Danger)
    const confirmButtonStyle = {
        ...buttonStyle,
        backgroundColor: type === 'confirm' ? '#ef4444' : '#4f46e5', // Rojo para CONFIRMAR, Azul para ACEPTAR
        color: '#ffffff',
    };

    // Estilo de Cancelar
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

                {/* --- CAMPO DE TEXTO PARA INPUT --- */}
                {showInput && (
                    <div style={{ marginTop: '20px' }}>
                        <textarea
                            className="configInput"
                            style={{ minHeight: '120px', resize: 'vertical', padding: '15px', width: '90%' }}
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                )}
                {/* ----------------------------------------------- */}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', gap: '10px' }}>
                    {/* Botón de Cancelar solo si es de confirmación */}
                    {type === 'confirm' && (
                        <button style={cancelButtonStyle} onClick={handleClose}>
                            Cancelar
                        </button>
                    )}
                    {/* Botón de Confirmar / Aceptar / Enviar */}
                    <button
                        style={confirmButtonStyle}
                        onClick={handleConfirm}
                        // Deshabilitar si se requiere input y está vacío
                        disabled={showInput && inputValue.trim() === ''}
                    >
                        {showInput ? 'Enviar' : (type === 'confirm' ? 'Confirmar' : 'Aceptar')}
                    </button>
                </div>
            </div>
        </div>
    );
};


// -------------------------------------------------------------
// Componente de Modal para Mostrar Detalles de la Orden (NUEVO)
// -------------------------------------------------------------
const OrderDetailsModal = ({ isOpen, order, onClose }) => {
    // Si el modal no está abierto o no hay datos de orden, no renderizar nada.
    if (!isOpen || !order) return null;

    // Estilos inline para la estructura del modal
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
        backgroundColor: '#2f254f',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '700px', // Mayor ancho para la tabla de detalles
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        color: '#ffffff',
    };

    // Estilo para el botón de cerrar (X)
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

    // Formatear la fecha
    const formattedDate = new Date(order.Fecha).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Asegurar que Detalles sea un array y calcular el total de los detalles
    const detalles = order.Detalles || [];
    const totalOrderCost = detalles.reduce((sum, item) => sum + (item.Cantidad * item.PrecioIndividual), 0);
    const totalOrderDisplay = `$${parseFloat(totalOrderCost).toFixed(2)}`;

    // Usamos el Total de la orden o calculamos si no está presente
    const orderTotal = order.Total ? `$${parseFloat(order.Total).toFixed(2)}` : totalOrderDisplay;


    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <button style={closeButtonStyle} onClick={onClose}>
                    &times;
                </button>
                <h3 style={{
                    marginTop: 0,
                    borderBottom: '1px solid #3c3066',
                    paddingBottom: '15px',
                    marginBottom: '20px',
                    color: '#4f46e5',
                    textAlign: 'center'
                }}>
                    Detalles de Orden <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{order.IDOrden}</span>
                </h3>

                <p style={{ marginBottom: '20px', fontSize: '0.9em', color: '#ccc', textAlign: 'center' }}>
                    **Fecha:** **{formattedDate}** | **Total de la Orden:** **{orderTotal}**
                </p>

                {/* Tabla de Detalles de Productos */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#3c3066' }}>
                                <th style={{ padding: '10px', textAlign: 'left', width: '40%' }}>Productos</th>
                                <th style={{ padding: '10px', textAlign: 'center', width: '20%' }}>Cantidad</th>
                                <th style={{ padding: '10px', textAlign: 'right', width: '20%' }}>Precio Individual</th>
                                <th style={{ padding: '10px', textAlign: 'right', width: '20%' }}>Costo Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalles.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #3c3066' }}>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{item.Producto}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>{item.Cantidad}</td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>${item.PrecioIndividual.toFixed(2)}</td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>${(item.Cantidad * item.PrecioIndividual).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {detalles.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>No hay detalles de productos para esta orden.</p>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <button
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '0.9em',
                            backgroundColor: '#4f46e5',
                            color: '#ffffff'
                        }}
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};



// -------------------------------------------------------------
// --- Componentes Reutilizables en todas las pestañas ---
// -------------------------------------------------------------

// --- SidebarItem ---
const SidebarItem = ({ icon: Icon, label, isActive, path, showModal, navigate }) => {
    const handleClick = () => {
        if (path) {
            navigate(path);
        } else if (label === "Cerrar sesion" && showModal) {
            showModal(
                'Confirmación de Salida',
                '¿Estás seguro de que quieres cerrar la sesión actual?',
                'confirm',
                () => {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            );
        }
    };
    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            style={{ cursor: (path || label === "Cerrar sesion") ? 'pointer' : 'default' }}
        >
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

// --- Componente de Estadística ---
const StatCard = ({ icon: Icon, title, value, colorClass }) => {
    return (
        <div className={`statCard ${colorClass}`}>
            <div className="statIconWrapper">
                <Icon className="statIcon" />
            </div>
            <div className="statInfo centered-stat-info">
                <p className="statTitle">{title}</p>
                <h3 className="statValue">{value}</h3>
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// --- Componente Principal: OrdenesPasadas ---
// -------------------------------------------------------------

function OrdenesPasadas() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    // --- ESTADOS DEL MODAL GENÉRICO ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        type: 'alert',
        onConfirm: null,
        showInput: false,
        inputPlaceholder: ''
    });

    // --- NUEVOS ESTADOS PARA EL MODAL DE DETALLES ---
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    // FUNCIÓN SHOW MODAL GENÉRICO
    const showModal = (title, message, type = 'alert', onConfirm = null, showInput = false, inputPlaceholder = '') => {
        setModalContent({ title, message, type, onConfirm, showInput, inputPlaceholder });
        setIsModalOpen(true);
    };

    // FUNCIÓN DE CIERRE DE MODAL GENÉRICO
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent({ title: '', message: '', type: 'alert', onConfirm: null, showInput: false, inputPlaceholder: '' });
    };

    // FUNCIÓN PARA ABRIR EL MODAL DE DETALLES
    const handleViewDetails = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            // Endpoint para obtener los detalles de una orden por ID
            const response = await axios.get(`http://localhost:3002/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Si la llamada es exitosa y hay datos, abrir el modal
            if (response.data && response.data.message) {
                // response.data.message debe contener IDOrden, Fecha, Total, y Detalles: []
                setSelectedOrderDetails(response.data.message);
                setIsDetailsModalOpen(true);
            } else {
                showModal('Error', 'No se pudieron cargar los detalles de la orden.', 'alert');
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            showModal('Error', 'Hubo un problema al conectar con el servidor para obtener los detalles.', 'alert');
        }
    };

    // FUNCIÓN PARA CERRAR EL MODAL DE DETALLES
    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrderDetails(null);
    };


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.message) {
                    const mappedOrders = response.data.message.map(order => ({
                        // Almacenamos el ID de la orden REAL para la llamada de detalles
                        IDOrden: order.IDOrden,
                        id: `#${order.IDOrden.toString().padStart(6, '0')}`,
                        fecha: new Date(order.Fecha).toLocaleDateString(),
                        cliente: 'Cliente General',
                        total: `$${parseFloat(order.Total).toFixed(2)}`,
                        estado: 'Completada',
                    }));
                    setOrders(mappedOrders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                // Opcional: mostrar un modal si la carga inicial falla
                // showModal('Error de Carga', 'No se pudo obtener la lista de órdenes.', 'alert');
            }
        };

        fetchOrders();
    }, []);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
        const numericValue = parseFloat(order.total.replace('$', '').replace(',', ''));
        return sum + numericValue;
    }, 0).toFixed(2);


    return (
        <div className="dashboardContainer">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="profileSection">
                    <UserAvatar />
                    <h2 className="accountTitle">{userName}</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" navigate={navigate} />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" navigate={navigate} />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" isActive={true} path="/dashboard/ordenes-pasadas" navigate={navigate} />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" navigate={navigate} />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" navigate={navigate} />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" navigate={navigate} />
                    {/* Elemento de cerrar sesión usando showModal */}
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesion" showModal={showModal} navigate={navigate} />
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="mainContent">
                <div className="headerBar">
                    <div className="pageHeader">
                        <h1 className="title">Historial de Órdenes</h1>
                        <p className="subtitle">Revisa y gestiona las órdenes anteriores.</p>
                    </div>
                </div>
                <div className="statsGrid two-cols">
                    <StatCard
                        icon={MdOutlineHistory}
                        title="Total de Órdenes"
                        value={totalOrders}
                        colorClass="statTotal"
                    />
                    <StatCard
                        icon={FaDollarSign}
                        title="Ingreso Total"
                        value={`$${totalRevenue}`}
                        colorClass="statRevenue"
                    />
                </div>

                {/* Tarjeta de Órdenes Pasadas (Tabla) */}
                <div className="ordersCard">
                    <div className="cardHeader">
                        <h2 className="cardTitle">Detalle de Órdenes</h2>
                    </div>
                    <div className="tableContainer">
                        <table className="ordersTable">
                            <thead>
                                <tr>
                                    <th>ID ORDEN</th>
                                    <th>FECHA</th>
                                    <th>TOTAL</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={index} className="orderRow">
                                            <td><span className="orderId">{order.id}</span></td>
                                            <td>{order.fecha}</td>
                                            <td className="totalAmount">{order.total}</td>
                                            <td>
                                                <div className="actions">
                                                    {/* Botón que llama a la nueva función de detalles */}
                                                    <button
                                                        className="actionLink view"
                                                        onClick={() => handleViewDetails(order.IDOrden)} // USAMOS order.IDOrden para la API
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                    <button className="actionLink print">Imprimir</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                            No hay órdenes registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* -------------------- MODAL GENÉRICO (Existente) -------------------- */}
            <CustomModal
                isOpen={isModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                type={modalContent.type}
                onConfirm={modalContent.onConfirm}
                onClose={handleCloseModal}
                showInput={modalContent.showInput}
                inputPlaceholder={modalContent.inputPlaceholder}
            />

            {/* -------------------- MODAL DE DETALLES (NUEVO) -------------------- */}
            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                order={selectedOrderDetails} // Pasa los detalles cargados
                onClose={handleCloseDetailsModal}
            />
        </div>
    );
}

export default OrdenesPasadas;