import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './OrdenesPasadas.css';
import { FaHome, FaBox, FaTruck, FaCog, FaDollarSign } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { IoIosSearch, IoIosNotificationsOutline } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import UserAvatar from './components/UserAvatar';

// --- Componentes Reutilizables en todas las pestañas --- //

// --- Efectos para que el sidebar se ilumine al cursos --- //
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

// --- Componente de Estadística (Nuevo) ---
const StatCard = ({ icon: Icon, title, value, colorClass }) => {
    return (
        <div className={`statCard ${colorClass}`}>
            <div className="statIconWrapper">
                <Icon className="statIcon" />
            </div>
            <div className="statInfo centered-stat-info"> {/* Clase para centrar el texto */}
                <p className="statTitle">{title}</p>
                <h3 className="statValue">{value}</h3>
            </div>
        </div>
    );
};

// --- Nombres de las secciones --- //

function OrdenesPasadas() {
    const [orders, setOrders] = useState([]); // State for orders

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3002/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data && response.data.message) {
                    // Map database fields to UI fields if necessary
                    const mappedOrders = response.data.message.map(order => ({
                        id: `#${order.IDOrden.toString().padStart(6, '0')}`, // Format ID
                        fecha: new Date(order.Fecha).toLocaleDateString(), // Format Date
                        cliente: 'Cliente General', // Placeholder as DB might not have client name yet
                        total: `$${parseFloat(order.Total).toFixed(2)}`, // Format Total
                        estado: 'Completada' // Default status
                    }));
                    setOrders(mappedOrders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    // Cálculo de estadísticas 
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
        // Simple parseo, asume formato como '$X,XXX.XX'
        const numericValue = parseFloat(order.total.replace('$', '').replace(',', ''));
        // Se suman todos los totales, ya que no se usa el campo 'estado' para filtrar aquí
        return sum + numericValue;
    }, 0).toFixed(2);


    return (
        <div className="dashboardContainer">
            {/* Sidebar con estructura original */}
            <div className="sidebar">
                <div className="profileSection">
                    <UserAvatar />
                    <h2 className="accountTitle">ACCOUNT</h2>
                    <p className="loremText">Buen día</p>
                </div>
                <div className="menu">
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" isActive={true} path="/dashboard/ordenes-pasadas" />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" />
                    {/* Elementos restaurados a la sección principal del menú */}
                    <SidebarItem icon={FaCog} label="Configuración" path="/dashboard/configuracion" />
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesión" />
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="mainContent">
                {/* Barra de Encabezado Modernizada */}
                <div className="headerBar">
                    <div className="pageHeader">
                        <h1 className="title">Historial de Órdenes</h1>
                        <p className="subtitle">Revisa y gestiona las órdenes anteriores.</p>
                    </div>
                    <div className="searchBar">
                        <IoIosSearch className="searchIcon" />
                        <input type="text" placeholder="Buscar por ID, Cliente o Total..." className="searchInput" />
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

                {/* Tarjeta de Órdenes Pasadas */}
                <div className="ordersCard">
                    <div className="cardHeader">
                        <h2 className="cardTitle">Detalle de Órdenes</h2>
                        <div className="filterGroup">
                            <div className="dateInputWrapper">
                                <LuCalendarDays className="dateIcon" />
                                <input type="date" placeholder="Filtrar por Fecha" className="dateInput" />
                            </div>
                            <button className="filterButton primaryButton">
                                <CiFilter className="filterIcon" />
                                Filtrar
                            </button>
                        </div>
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
                                                    <button className="actionLink view">Ver Detalles</button>
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
                    {/* Sección de Paginación */}
                    <div className="cardFooter">
                        <div className="paginationInfo">
                            Mostrando {orders.length > 0 ? 1 : 0} a {orders.length} de {orders.length} órdenes.
                        </div>
                        <div className="paginationControls">
                            <button className="paginationButton" disabled>Anterior</button>
                            <span className="pageNumber activePage">1</span>
                            <button className="paginationButton" disabled>Siguiente</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrdenesPasadas;