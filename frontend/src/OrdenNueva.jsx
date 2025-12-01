import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrdenNueva.css';
import { FaHome, FaBox, FaTruck, FaCog } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// -------------------------------------------------------------
// Componentes de la Interfaz
// -------------------------------------------------------------

/**
 * Representa una tarjeta de producto disponible.
 */
const ProductCard = ({ product, onAdd }) => (
    <div
        className="productCard"
        onClick={() => onAdd(product)}
        title={`Añadir ${product.Nombre} a la orden`}
    >
        {/* Si hay imagen, mostrarla, si no, un icono genérico */}
        {product.Imagen ? (
            <img src={product.Imagen} alt={product.Nombre} className="productImage" />
        ) : (
            <div className="productIcon">🍔</div>
        )}

        <span className="productName">{product.Nombre}</span>
        <span className="productPrice">${parseFloat(product.Precio).toFixed(2)}</span>
    </div>
);

/**
 * Lista de Productos Disponibles.
 */
const AvailableProducts = ({ products, onProductAdd }) => {
    return (
        <div className="availableProducts">
            <h2 className="sectionTitle">Productos Disponibles</h2>
            <div className="productsGrid">
                {products.map((product) => (
                    <ProductCard
                        key={product.IDPlatillo}
                        product={product}
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
const OrderSummary = ({ orderItems, subtotal, taxRate = 0.16, onProcessOrder }) => {
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
                            <span style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{item.Nombre}</span>
                            <span style={{ fontSize: '0.9em' }}>x{item.quantity} (${(item.Precio * item.quantity).toFixed(2)})</span>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
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

            <button className="processOrderButton" disabled={orderItems.length === 0} onClick={onProcessOrder}>
                Procesar Orden
            </button>
        </div>
    );
};

/**
 * Contenedor principal para la vista de "Orden nueva" y su LÓGICA.
 */
const NewOrderView = () => {
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0.00);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            console.log("Fetching menu...");
            const response = await axios.get('http://localhost:3001/api/menu');
            console.log("Menu response:", response.data);
            if (response.data && response.data.message) {
                setProducts(response.data.message);
            }
        } catch (error) {
            console.error("Error loading menu:", error);
        }
    };

    // Lógica para añadir/incrementar un producto
    const handleProductAdd = (product) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.IDPlatillo === product.IDPlatillo);

            if (existingItem) {
                // Si el producto ya existe, incrementa la cantidad
                return prevItems.map(item =>
                    item.IDPlatillo === product.IDPlatillo
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
            acc + (item.Precio * item.quantity), 0);
        setSubtotal(newSubtotal);
    }, [orderItems]);

    const handleProcessOrder = async () => {
        if (orderItems.length === 0) return;

        try {
            // Preparar payload: { items: [{ id: IDPlatillo, quantity: number }] }
            const payload = {
                items: orderItems.map(item => ({
                    id: item.IDPlatillo,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post('http://localhost:3001/api/orders', payload);

            if (response.status === 201) {
                alert("Orden procesada exitosamente! Stock actualizado.");
                setOrderItems([]); // Limpiar orden
            }
        } catch (error) {
            console.error("Error processing order:", error);
            alert("Error al procesar la orden.");
        }
    };

    return (
        <div className="newOrderViewContainer">
            <AvailableProducts products={products} onProductAdd={handleProductAdd} />
            <OrderSummary orderItems={orderItems} subtotal={subtotal} onProcessOrder={handleProcessOrder} />
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