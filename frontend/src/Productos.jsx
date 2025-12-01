import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Productos.css';
import './ProductosModal.css';
import { FaHome, FaBox, FaTruck, FaCog, FaSearch, FaFilter } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

// --- Componente de Fila de Producto (ProductRow) ---
const ProductRow = ({ id, colorClass, name, status, stock, unit, category, onAddStockClick, onEditClick, onDeleteClick, handleStockChange }) => {

    // Función local para sumar 1 unidad
    const increment = () => handleStockChange(id, 1);

    // Función local para restar 1 unidad
    const decrement = () => handleStockChange(id, -1);

    // Función para determinar el emoji basado en la unidad
    const getUnitIcon = (unit) => {
        switch (unit ? unit.toLowerCase() : '') {
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
            <td className="productCell"><span className={`status ${status ? status.toLowerCase() : ''}`}>{status}</span></td>
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
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', unit: '' });
    const [addForm, setAddForm] = useState({ name: '', categoryId: '', stock: '', unit: '' });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products');
            if (response.data && response.data.message) {
                const mappedProducts = response.data.message.map((p, index) => ({
                    id: p.IDProducto,
                    colorClass: `color${(index % 8) + 1}`, // Cycle through colors
                    name: p.Nombre,
                    status: p.Stock > 10 ? 'Active' : (p.Stock > 0 ? 'Low' : 'Sold'), // Calculate status
                    stock: p.Stock || 0, // Use Stock or 0
                    unit: p.UnidadMedida || 'unidades',
                    category: p.IDCategoria // Placeholder for category name
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/categories');
            if (response.data && response.data.message) {
                setCategories(response.data.message);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

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
                    } else if (newStock > 0 && newStock <= 10 && product.unit !== 'unidades') { // Ejemplo simple de "Low"
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

    const handleDeleteClick = async (product) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
            try {
                await axios.delete(`http://localhost:3001/api/products/${product.id}`);
                fetchProducts(); // Refresh list
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Error al eliminar el producto");
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditForm({ name: product.name, unit: product.unit });
    };

    const handleEditSave = async () => {
        if (!editingProduct) return;
        try {
            await axios.put(`http://localhost:3001/api/products/${editingProduct.id}`, {
                Nombre: editForm.name,
                UnidadMedida: editForm.unit
            });
            setEditingProduct(null);
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error al actualizar el producto");
        }
    };

    const handleAddClick = () => {
        setIsAddingProduct(true);
        setAddForm({ name: '', categoryId: '', stock: '', unit: '' });
    };

    const handleAddSave = async () => {
        if (!addForm.name || !addForm.categoryId || !addForm.unit) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/products', {
                Nombre: addForm.name,
                IDCategoria: addForm.categoryId,
                Stock: addForm.stock,
                UnidadMedida: addForm.unit
            });
            setIsAddingProduct(false);
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Error al crear el producto");
        }
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
                            <input className="searchInput" placeholder="🔍 Buscar ingredientes o items..." />
                        </div>
                        <button className="filterButton"><FaFilter /> Filter by</button>
                        <button className="addProductButton" onClick={handleAddClick}><IoMdAdd /> Add New Item 📦</button>
                    </div>

                    <table className="productsTable">
                        <thead>
                            <tr className="tableHeader">
                                <th></th>
                                <th>Name of product</th>
                                <th>Status</th>
                                <th>Stock</th>
                                <th>Category</th>
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
                                    handleStockChange={handleStockChange}
                                    onAddStockClick={() => alert(`Añadir cantidad específica a: ${product.name}`)}
                                    onEditClick={() => handleEditClick(product)}
                                    onDeleteClick={() => handleDeleteClick(product)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edición */}
            {editingProduct && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Editar Producto</h2>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </label>
                        <label>
                            Unidad:
                            <input
                                type="text"
                                value={editForm.unit}
                                onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                            />
                        </label>
                        <div className="modalActions">
                            <button onClick={() => setEditingProduct(null)}>Cancelar</button>
                            <button onClick={handleEditSave}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Agregar Producto */}
            {isAddingProduct && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Agregar Nuevo Producto</h2>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={addForm.name}
                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                            />
                        </label>
                        <label>
                            Categoría:
                            <select
                                value={addForm.categoryId}
                                onChange={(e) => setAddForm({ ...addForm, categoryId: e.target.value })}
                                className="modalSelect"
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.IDCategoria} value={cat.IDCategoria}>
                                        {cat.Nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Stock Inicial:
                            <input
                                type="number"
                                value={addForm.stock}
                                onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                            />
                        </label>
                        <label>
                            Unidad:
                            <input
                                type="text"
                                value={addForm.unit}
                                onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                            />
                        </label>
                        <div className="modalActions">
                            <button onClick={() => setIsAddingProduct(false)}>Cancelar</button>
                            <button onClick={handleAddSave}>Crear</button>
                        </div>
                    </div>
                </div>
            )}
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