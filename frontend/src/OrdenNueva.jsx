import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdenNueva.css';
import { FaHome, FaBox, FaTruck, FaCog } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import hamburbur from './assets/Hamburguesaa.JPG';
import awita from './assets/agua.JPG';
import papitas from './assets/papas.JPG';



// 🍔 Datos de los productos disponibles
const initialProducts = [
    { id: 1, name: "Agua natural (1 litro)", price: 25.00, icon: awita },
    { id: 2, name: "Hamburguesa sencilla (120gr)", price: 120.00, icon: hamburbur },
    { id: 3, name: "Papas medianas (150gr)", price: 130.00, icon: papitas},
    { id: 4, name: "Agua embotellada", price: 15.00, icon: () => <i className="fa-solid fa-bottle-water">💧</i> },
    { id: 5, name: "Papas Fritas", price: 35.00, icon: () => <i className="fa-solid fa-fries">🍟</i> },
    { id: 6, name: "Té Frío", price: 30.00, icon: () => <i className="fa-solid fa-glass-water">🧊</i> },
];

// -------------------------------------------------------------
// Componentes de la Interfaz
// -------------------------------------------------------------

/**
 * Representa una tarjeta de producto disponible.
 */
const ProductCard = ({ product, icon, onAdd }) => (
    <div 
        className="productCard" 
        onClick={() => onAdd(product)}
        title={`Añadir ${product.name} a la orden`}
    >
        {/* Lógica para renderizar icono (función) o imagen (si fuera un string) */}
        {typeof icon === 'function' ? (
            icon({ className: "productIcon" })
        ) : (
            // Usa <img /> si el 'icon' es una ruta de imagen (JPG/PNG)
            <img src={icon} alt={product.name} className="productImage" />
        )}
        
        <span className="productName">{product.name}</span>
        <span className="productPrice">${product.price.toFixed(2)}</span>
    </div>
);

/**
 * Lista de Productos Disponibles.
 */
const AvailableProducts = ({ onProductAdd }) => {
    return (
        <div className="availableProducts">
            <h2 className="sectionTitle">Productos Disponibles</h2>
            <div className="productsGrid">
                {initialProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        icon={product.icon} 
                        onAdd={onProductAdd}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Resumen de Orden y Totales.
 */
const OrderSummary = ({ orderItems, subtotal, taxRate = 0.16 }) => {
    const iva = subtotal * taxRate;
    const total = subtotal + iva;

    return (
        <div className="orderSummary">
            <h2 className="sectionTitle">Resumen de Orden</h2>
            
            {/* Lista de Artículos en la Orden */}
            <div className="orderItemsList">
                {orderItems.length > 0 ? (
                    orderItems.map((item, index) => (
                        <div key={index} className="summaryRow itemRow">
                            <span style={{fontWeight: 'bold', fontSize: '0.9em'}}>{item.name}</span>
                            <span style={{fontSize: '0.9em'}}>x{item.quantity} (${(item.price * item.quantity).toFixed(2)})</span>
                        </div>
                    ))
                ) : (
                    <p style={{fontSize: '0.9em', color: '#666', marginBottom: '15px'}}>
                        Aún no hay productos en la orden. Haz clic para agregar.
                    </p>
                )}
            </div>
            
            {/* Detalles de Totales */}
            <div className="summaryDetails">
                <div className="summaryRow">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summaryRow">
                    <span>IVA (16%)</span>
                    <span>${iva.toFixed(2)}</span>
                </div>
                <div className="summarySeparator" />
                <div className="summaryRow summaryTotal">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <button className="processOrderButton" disabled={orderItems.length === 0}>
                Procesar Orden
            </button>
        </div>
    );
};

/**
 * Contenedor principal para la vista de "Orden nueva" y su LÓGICA.
 */
const NewOrderView = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0.00); 

    // Lógica para añadir/incrementar un producto
    const handleProductAdd = (product) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // Si el producto ya existe, incrementa la cantidad
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si es nuevo, agrégalo con cantidad 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Recalcula el subtotal cada vez que orderItems cambia
    useEffect(() => {
        const newSubtotal = orderItems.reduce((acc, item) => 
            acc + (item.price * item.quantity), 0);
        setSubtotal(newSubtotal);
    }, [orderItems]);

    return (
        <div className="newOrderViewContainer">
            <AvailableProducts onProductAdd={handleProductAdd} />
            <OrderSummary orderItems={orderItems} subtotal={subtotal} />
        </div>
    );
};


// --- Componente Principal (OrdenNueva) ---
function OrdenNueva() {
    // Se mantienen los hooks de tiempo y navegación
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

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
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" isActive={true} path="/dashboard/orden-nueva" />
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
                    <h1 className="title">Orden nueva</h1>
                </div>

                {/* 🚨 REEMPLAZO: Muestra la nueva vista de órdenes */}
                <NewOrderView />
            </div>
        </div>
    );
}


// --- Componentes Reutilizables (Mantenidos) ---

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

export default OrdenNueva;