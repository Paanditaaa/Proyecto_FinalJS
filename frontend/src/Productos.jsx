import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Productos.css';
// Se mantienen las importaciones de iconos necesarios
import { FaHome, FaBox, FaTruck, FaCog, FaSearch, FaFilter } from 'react-icons/fa'; 
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

// --- Componente de Fila de Producto (ProductRow) ---
const ProductRow = ({ id, colorClass, name, status, stock, unit, category, location, onAddStockClick, onEditClick, onDeleteClick, handleStockChange }) => {
    
    // Función local para sumar 1 unidad
    const increment = () => handleStockChange(id, 1);
    
    // Función local para restar 1 unidad
    const decrement = () => handleStockChange(id, -1);

    // Función para determinar el emoji basado en la unidad
    const getUnitIcon = (unit) => {
        switch (unit.toLowerCase()) {
            case 'kg':
                return '⚖️'; 
            case 'litros':
                return '💧'; 
            case 'unidades':
            case 'rebanadas':
            case 'botellas':
            case 'paquetes':
                return '🔢'; 
            default:
                return '';
        }
    };
    
    // El stock ahora incluye el ícono antes de la unidad.
    const displayStock = `${stock} ${getUnitIcon(unit)} ${unit}`;

    return (
        <tr className="productRow">
            <td className="productCell"><div className={`productColor ${colorClass}`} /></td>
            <td className="productCell productTitleCell">
                <div className="productNameAndActions">
                    {/* Nombre del producto */}
                    <span className="productNameText">{name}</span>
                    
                    {/* Botones de acción SIEMPRE visibles con EMOJIS */}
                    <div className="productActions">
                        {/* Botón de Editar con Emoji ✏️ */}
                        <button className="iconActionButton edit" onClick={onEditClick} title="Editar Producto">✏️</button>
                        {/* Botón de Eliminar con Emoji 🗑️ */}
                        <button className="iconActionButton delete" onClick={onDeleteClick} title="Eliminar Producto">🗑️</button>
                    </div>
                </div>
            </td>
            <td className="productCell"><span className={`status ${status.toLowerCase()}`}>{status}</span></td>
            <td className="productCell">
                {/* Control de Stock Funcional con Emojis */}
                <div className="stockControl">
                    {/* Botón de Quitar con Emoji ➖ */}
                    <button className="stockButton minus" onClick={decrement}>➖</button>
                    <span className="stockValue">{displayStock}</span> 
                    {/* Botón de Agregar con Emoji ➕ */}
                    <button className="stockButton plus" onClick={increment}>➕</button>
                </div>
            </td>
            <td className="productCell">{category}</td>
            <td className="productCell">{location}</td>
            {/* Celda de acción para añadir cantidad específica con emoji de caja */}
            <td className="productCell actionsCell">
                <button className="addSpecificStockButton" onClick={onAddStockClick}>
                    <IoMdAdd /> Add Qty 📦
                </button>
            </td>
        </tr>
    );
};

// --- Componente Principal (Productos) ---
function Productos() {
    // 1. Uso de useState para gestionar el stock
    const [products, setProducts] = useState([
        // ... (Datos sin cambios)
        { id: 1, colorClass: 'color1', name: 'Pan para hamburguesa', status: 'Active', stock: 120, unit: 'unidades', category: 'Ingredientes', location: 'Almacén 1' },
        { id: 2, colorClass: 'color2', name: 'Carne molida 80/20', status: 'Active', stock: 45, unit: 'kg', category: 'Proteína', location: 'Refrigerador' },
        { id: 3, colorClass: 'color3', name: 'Queso cheddar rebanado', status: 'Active', stock: 200, unit: 'rebanadas', category: 'Lácteos', location: 'Refrigerador' },
        { id: 4, colorClass: 'color4', name: 'Papas para freír', status: 'Low', stock: 8, unit: 'kg', category: 'Acompañamientos', location: 'Congelador' },
        { id: 5, colorClass: 'color5', name: 'Salsa especial de la casa', status: 'Active', stock: 15, unit: 'litros', category: 'Salsas', location: 'Cocina' },
        { id: 6, colorClass: 'color6', name: 'Refrescos variados', status: 'Active', stock: 90, unit: 'botellas', category: 'Bebidas', location: 'Almacén 2' },
        { id: 7, colorClass: 'color7', name: 'Servilletas', status: 'Low', stock: 3, unit: 'paquetes', category: 'Consumibles', location: 'Almacén 1' },
        { id: 8, colorClass: 'color8', name: 'Cajas para hamburguesa', status: 'Sold', stock: 0, unit: 'unidades', category: 'Empaques', location: '0 ubicaciones' },
    ]);

    // 2. Función que modifica el estado (stock)
    const handleStockChange = (productId, change) => {
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === productId) {
                    const newStock = Math.max(0, product.stock + change); // Evita stock negativo
                    
                    // Actualiza el estado (status) automáticamente si el stock es 0
                    let newStatus = product.status;
                    if (newStock === 0) {
                        newStatus = 'Sold';
                    } else if (newStock > 0 && newStock <= 10 && product.unit !== 'unidades' ) { // Ejemplo simple de "Low"
                        newStatus = 'Low';
                    } else if (newStock > 10) {
                        newStatus = 'Active';
                    }
                    
                    return { ...product, stock: newStock, status: newStatus };
                }
                return product;
            })
        );
    };

    return (
        <div className="dashboardContainer">
            {/* -------------------- SIDEBAR (NO MODIFICADO) -------------------- */}
            <div className="sidebar">
                <div className="profileSection">
                    <div className="avatar" />
                    <h2 className="accountTitle">ACCOUNT</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" />
                    <SidebarItem icon={FaBox} label="Productos" isActive={true} path="/dashboard/productos" />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" />
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesion" />
                </div>
            </div>
            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Inventario de Productos 🍔</h1>
                </div>

                {/* -------------------- TABLA DE PRODUCTOS -------------------- */}
                <div className="productsTableContainer">
                    <div className="productsTopBar">
                        <div className="searchContainer">
                            <FaSearch className="searchIcon" />
                            <input className="searchInput" placeholder="🔍 Search ingredients or items..." />
                        </div>
                        <button className="filterButton"><FaFilter /> Filter by</button>
                        <button className="addProductButton"><IoMdAdd /> Add New Item 📦</button>
                    </div>

                    <table className="productsTable">
                        <thead>
                            <tr className="tableHeader">
                                <th></th> 
                                <th>Name of product</th>
                                <th>Status</th>
                                <th>Stock</th> 
                                <th>Category</th>
                                <th>Location</th>
                                <th>Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <ProductRow
                                    key={product.id}
                                    id={product.id}
                                    colorClass={product.colorClass}
                                    name={product.name}
                                    status={product.status}
                                    stock={product.stock}
                                    unit={product.unit}
                                    category={product.category}
                                    location={product.location}
                                    handleStockChange={handleStockChange}
                                    onAddStockClick={() => alert(`Añadir cantidad específica a: ${product.name}`)}
                                    onEditClick={() => alert(`Editar: ${product.name}`)}
                                    onDeleteClick={() => alert(`Eliminar: ${product.name}`)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* Componente para un elemento del menú lateral con navegación (NO MODIFICADO) */
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

export default Productos;