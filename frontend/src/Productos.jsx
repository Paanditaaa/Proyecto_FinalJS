import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Productos.css';
import './ProductosModal.css';
import { FaHome, FaBox, FaTruck, FaCog, FaSearch, FaFilter } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';
// --- Componente de Fila de Producto (ProductRow) ---
const ProductRow = ({ id, colorClass, name, status, stock, unit, category, onAddStockClick, onEditClick, onDeleteClick }) => {

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

    const displayStock = `${stock} ${getUnitIcon(unit)} ${unit}`;

    return (
        <tr className="productRow">
            <td className="productCell"><div className={`productColor ${colorClass}`} /></td>
            <td className="productCell productTitleCell">
                <div className="productNameAndActions">
                    <span className="productNameText">{name}</span>
                    <div className="productActions">
                        <button className="iconActionButton edit" onClick={() => onEditClick(id)} title="Editar Producto">✏️</button>
                        <button className="iconActionButton delete" onClick={() => onDeleteClick(id)} title="Eliminar Producto">🗑️</button>
                    </div>
                </div>
            </td>
            <td className="productCell"><span className={`status ${status ? status.toLowerCase() : ''}`}>{status}</span></td>

            <td className="productCell">
                <span className="stockValueStatic">{displayStock}</span>
            </td>

            <td className="productCell">{category}</td>

            <td className="productCell actionsCell">
                {/* Llama a la función del componente padre para abrir el modal de agregar stock */}
                <button className="addSpecificStockButton" onClick={onAddStockClick}>
                    <IoMdAdd /> Add Qty 📦
                </button>
            </td>
        </tr>
    );
};


// --- Componente Principal (Productos) ---
function Productos() {
    // ESTADOS
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    // ⭐ ESTADOS PARA AGREGAR STOCK
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockToUpdate, setStockToUpdate] = useState({ id: null, name: '', currentStock: 0, newStockAmount: '' });

    // Formulario de edición
    const [editForm, setEditForm] = useState({ name: '', unit: '', categoryId: '' });

    const [addForm, setAddForm] = useState({ name: '', categoryId: '', stock: '', unit: '' });

    // ESTADOS PARA AGREGAR CATEGORÍA
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [addCategoryForm, setAddCategoryForm] = useState({ Nombre: '' });


    // FUNCIÓN AUXILIAR PARA OBTENER EL NOMBRE DE LA CATEGORÍA
    const getCategoryNameById = (categoryId) => {
        const category = categories.find(
            cat => cat.IDCategoria?.toString() === categoryId?.toString()
        );
        return category ? category.Nombre : 'General / No Asignada';
    };


    // FETCH CATEGORIES
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3002/api/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.message) {
                setCategories(response.data.message);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };


    // FETCH PRODUCTS - CORREGIDO PARA USAR STOCKMINIMO
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3002/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.message) {
                const mappedProducts = response.data.message.map((p, index) => {

                    // ⭐ LECTURA DE STOCK: Usa p.StockMinimo
                    const stockValue = p.StockMinimo !== null && p.StockMinimo !== undefined
                        ? Number(p.StockMinimo)
                        : 0;

                    const categoryName = getCategoryNameById(p.IDCategoria);

                    return {
                        id: p.IDProducto,
                        colorClass: `color${(index % 8) + 1}`,
                        name: p.Nombre,
                        // El estado se calcula en base al StockMinimo
                        status: stockValue > 10 ? 'Active' : (stockValue > 0 ? 'Low' : 'Sold'),
                        stock: stockValue,
                        unit: p.UnidadMedida || 'unidades',
                        category: categoryName,
                        categoryId: p.IDCategoria
                    };
                });
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    // EFECTO 1: Carga las categorías al inicio
    useEffect(() => {
        fetchCategories();
    }, []);

    // EFECTO 2: Carga los productos SOLO cuando las categorías están disponibles (Sincronización)
    useEffect(() => {
        if (categories.length > 0) {
            fetchProducts();
        }
    }, [categories]);


    // LÓGICA DE ELIMINAR 
    const handleDeleteClick = async (product) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3002/api/products/${product.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (categories.length > 0) fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Error al eliminar el producto");
            }
        }
    };

    // LÓGICA DE EDICIÓN - INICIALIZACIÓN
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            unit: product.unit,
            categoryId: product.categoryId || ''
        });
    };

    // LÓGICA DE EDICIÓN - GUARDADO 
    const handleEditSave = async () => {
        if (!editingProduct) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3002/api/products/${editingProduct.id}`, {
                Nombre: editForm.name,
                UnidadMedida: editForm.unit,
                IDCategoria: editForm.categoryId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingProduct(null);
            if (categories.length > 0) fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error al actualizar el producto");
        }
    };

    // LÓGICA DE AGREGAR PRODUCTO 
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
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3002/api/products', {
                Nombre: addForm.name,
                IDCategoria: addForm.categoryId,
                // Usamos StockMinimo para el campo de stock
                StockMinimo: addForm.stock,
                UnidadMedida: addForm.unit
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddingProduct(false);
            if (categories.length > 0) fetchProducts();
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Error al crear el producto");
        }
    };

    // LÓGICA DE AGREGAR CATEGORÍA
    const handleAddCategoryClick = () => {
        setIsAddingCategory(true);
        setAddCategoryForm({ Nombre: '' });
    };

    const handleAddCategorySave = async () => {
        if (!addCategoryForm.Nombre) {
            alert("El nombre de la categoría es obligatorio");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3002/api/categories', {
                Nombre: addCategoryForm.Nombre,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsAddingCategory(false);
            fetchCategories(); // Refresca la lista de categorías
            alert(`Categoría "${addCategoryForm.Nombre}" creada exitosamente.`);
        } catch (error) {
            console.error("Error al crear la categoría:", error);
            alert("Error al crear la categoría. Inténtalo de nuevo.");
        }
    };

    // ⭐ LÓGICA DE AGREGAR STOCK (Modal y PUT a la API)
    const handleShowAddStockModal = (product) => {
        setStockToUpdate({
            id: product.id,
            name: product.name,
            currentStock: product.stock,
            newStockAmount: '' // Limpiar el input al abrir
        });
        setIsAddingStock(true);
    };

    const handleUpdateStock = async () => {
        const amountToAdd = Number(stockToUpdate.newStockAmount);

        // Validación básica
        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            alert("Por favor introduce una cantidad válida y positiva.");
            return;
        }

        const newTotalStock = stockToUpdate.currentStock + amountToAdd;

        try {
            const token = localStorage.getItem('token');

            // Llama a la API para actualizar StockMinimo
            await axios.put(`http://localhost:3002/api/products/${stockToUpdate.id}`, {
                // Envía el nuevo total bajo el campo StockMinimo
                StockMinimo: newTotalStock,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Cerrar modal y refrescar la tabla
            setIsAddingStock(false);
            setStockToUpdate({ id: null, name: '', currentStock: 0, newStockAmount: '' });
            if (categories.length > 0) fetchProducts();
            alert(`Stock de ${stockToUpdate.name} actualizado a ${newTotalStock}.`);

        } catch (error) {
            console.error("Error al actualizar stock:", error);
            alert("Error al actualizar el stock. Asegúrate de que tu API acepte el campo 'StockMinimo' en el PUT.");
        }
    };
    // ⭐ FIN LÓGICA DE AGREGAR STOCK


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
                            <input className="searchInput" placeholder="🔍 Buscar ingredientes o items..." />
                        </div>
                        <button className="filterButton"><FaFilter /> Filter by</button>

                        {/* BOTÓN PARA AGREGAR CATEGORÍA */}
                        <button className="filterButton" onClick={handleAddCategoryClick}>
                            <IoMdAdd /> Nueva Categoría 🏷️
                        </button>

                        <button className="addProductButton" onClick={handleAddClick}>
                            <IoMdAdd /> Add New Item 📦
                        </button>
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
                                    // Pasa la función para abrir el modal de stock
                                    onAddStockClick={() => handleShowAddStockModal(product)}
                                    onEditClick={() => handleEditClick(product)}
                                    onDeleteClick={() => handleDeleteClick(product)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* -------------------- MODAL DE AGREGAR STOCK ⭐ NUEVO -------------------- */}
            {isAddingStock && stockToUpdate.id && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Agregar Stock a: {stockToUpdate.name}</h2>
                        <p>Stock actual: **{stockToUpdate.currentStock}**</p>
                        <label>
                            Cantidad a Añadir:
                            <input
                                type="number"
                                placeholder="Ej: 50"
                                value={stockToUpdate.newStockAmount}
                                onChange={(e) => setStockToUpdate({ ...stockToUpdate, newStockAmount: e.target.value })}
                            />
                        </label>
                        <div className="modalActions">
                            <button onClick={() => setIsAddingStock(false)}>Cancelar</button>
                            <button onClick={handleUpdateStock}>Actualizar Stock</button>
                        </div>
                    </div>
                </div>
            )}
            {/* -------------------- FIN MODAL DE AGREGAR STOCK -------------------- */}

            {/* -------------------- MODAL DE EDICIÓN -------------------- */}
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
                        <label>
                            Categoría:
                            <select
                                value={editForm.categoryId}
                                onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                                className="modalSelect"
                            >
                                <option value="">Seleccionar Categoría (Opcional)</option>
                                {categories.map(cat => (
                                    <option key={cat.IDCategoria} value={cat.IDCategoria}>
                                        {cat.Nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="modalActions">
                            <button onClick={() => setEditingProduct(null)}>Cancelar</button>
                            <button onClick={handleEditSave}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- MODAL DE AGREGAR PRODUCTO -------------------- */}
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

            {/* -------------------- MODAL DE AGREGAR CATEGORÍA -------------------- */}
            {isAddingCategory && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Agregar Nueva Categoría 🏷️</h2>
                        <label>
                            Nombre de la Categoría:
                            <input
                                type="text"
                                value={addCategoryForm.Nombre}
                                onChange={(e) => setAddCategoryForm({ Nombre: e.target.value })}
                            />
                        </label>
                        <div className="modalActions">
                            <button onClick={() => setIsAddingCategory(false)}>Cancelar</button>
                            <button onClick={handleAddCategorySave}>Crear Categoría</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* Componente para un elemento del menú lateral con navegación */
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