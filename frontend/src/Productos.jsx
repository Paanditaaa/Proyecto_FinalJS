import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Productos.css';
import './ProductosModal.css';
import { FaHome, FaBox, FaTruck, FaCog } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';

// --- COPIA DEL CUSTOM MODAL DE CONFIGURACION (INICIO) ---
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
        backgroundColor: '#2f254f', // var(--bg-card)
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        color: '#ffffff', // var(--text-light)
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

    // Colores basados en variables del CSS para coherencia
    const confirmButtonStyle = {
        ...buttonStyle,
        backgroundColor: type === 'confirm' ? '#ef4444' : '#4f46e5',
        color: '#ffffff',
    };

    const cancelButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#555',
        color: '#ffffff',
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm(showInput ? inputValue : undefined);
        onClose();
        setInputValue('');
    };

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

                {showInput && (
                    <div style={{ marginTop: '20px' }}>
                        <textarea
                            style={{ minHeight: '120px', resize: 'vertical', padding: '15px', width: '100%', boxSizing: 'border-box', backgroundColor: '#3c3066', color: '#ffffff', border: '1px solid #4f46e5', borderRadius: '8px' }}
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', gap: '10px' }}>
                    {type === 'confirm' && (
                        <button style={cancelButtonStyle} onClick={handleClose}>
                            Cancelar
                        </button>
                    )}
                    <button
                        style={confirmButtonStyle}
                        onClick={handleConfirm}
                        disabled={showInput && inputValue.trim() === ''}
                    >
                        {showInput ? 'Enviar' : (type === 'confirm' ? 'Confirmar' : 'Aceptar')}
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- COPIA DEL CUSTOM MODAL DE CONFIGURACION (FIN) ---


// --- Componente de Fila de Producto (ProductRow) ---
const ProductRow = ({ id, colorClass, name, status, stock, unit, category, onAddStockClick, onEditClick, onDeleteClick }) => {
    // ... (El código de ProductRow se mantiene igual)
    const getUnitIcon = (unit) => {
        switch (unit ? unit.toLowerCase() : '') {
            case '':
                return '⚖️';
            case 'litros':
            case 'unidades':
            case 'rebanadas':
            case 'botellas':
            case 'paquetes':
                return '';
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
                <button className="addSpecificStockButton" onClick={() => onAddStockClick({ id, name, stock, unit })}>
                    <IoMdAdd /> Añadir existencias
                </button>
            </td>
        </tr>
    );
};


// --- Componente Principal (Productos) ---
function Productos() {
    const navigate = useNavigate();

    // ESTADOS
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    // ESTADOS PARA AGREGAR STOCK
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockToUpdate, setStockToUpdate] = useState({ id: null, name: '', currentStock: 0, newStockAmount: '' });

    // Formulario de edición
    const [editForm, setEditForm] = useState({ name: '', unit: '', categoryId: '' });

    const [addForm, setAddForm] = useState({ name: '', categoryId: '', stock: '', unit: '' });

    // ESTADOS PARA AGREGAR CATEGORÍA
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [addCategoryForm, setAddCategoryForm] = useState({ Nombre: '' });

    // --- Estados del Modal Custom (AÑADIDOS) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        type: 'alert',
        onConfirm: null,
        showInput: false,
        inputPlaceholder: ''
    });

    // Función showModal (AÑADIDA)
    const showModal = (title, message, type = 'alert', onConfirm = null, showInput = false, inputPlaceholder = '') => {
        setModalContent({ title, message, type, onConfirm, showInput, inputPlaceholder });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent({ title: '', message: '', type: 'alert', onConfirm: null, showInput: false, inputPlaceholder: '' });
    };
    // ---------------------------------------------


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

                    // LECTURA DE STOCK: Usa p.StockMinimo
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

    // LÓGICA DE CERRAR SESIÓN (Acción real después de confirmar) ⭐
    const handleLogoutExecute = () => {
        // 1. Limpia el token de autenticación
        localStorage.removeItem('token');
        // 2. Redirige al usuario a la página de login (o la ruta que uses)
        navigate('/');
    };

    // LÓGICA DE CERRAR SESIÓN (Abre el modal) ⭐
    const handleLogout = () => {
        showModal(
            'Confirmación de Salida',
            '¿Estás seguro de que quieres cerrar la sesión actual?',
            'confirm',
            handleLogoutExecute // Pasa la función que ejecuta el cierre
        );
    };

    // LÓGICA DE ELIMINAR (Usando el modal nativo para mantener el código simple aquí, pero se podría migrar)
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

    // LÓGICA DE AGREGAR STOCK (Modal y PUT a la API)
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

    // Función para manejar clics en el sidebar
    const handleSidebarClick = (path, label) => {
        if (label === "Cerrar sesion") {
            handleLogout(); // Llama a la función que abre el modal Custom
        } else if (path) {
            navigate(path);
        }
    };


    return (
        <div className="dashboardContainer">
            {/* -------------------- SIDEBAR -------------------- */}
            <div className="sidebar">
                <div className="profileSection">
                    <UserAvatar />
                    <h2 className="accountTitle">{userName}</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" onClick={() => handleSidebarClick('/dashboard', 'INICIO')} />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" onClick={() => handleSidebarClick('/dashboard/orden-nueva', 'Orden nueva')} />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" onClick={() => handleSidebarClick('/dashboard/ordenes-pasadas', 'Ordenes pasadas')} />
                    <SidebarItem icon={FaBox} label="Productos" isActive={true} path="/dashboard/productos" onClick={() => handleSidebarClick('/dashboard/productos', 'Productos')} />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" onClick={() => handleSidebarClick('/dashboard/proveedores', 'Proveedores')} />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" onClick={() => handleSidebarClick('/dashboard/configuracion', 'Configuracion')} />
                    {/* El botón de Cerrar Sesión ahora usa handleSidebarClick, que llama a handleLogout */}
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesion" onClick={() => handleSidebarClick(null, 'Cerrar sesion')} />
                </div>
            </div>

            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Inventario de Productos</h1>
                </div>

                {/* -------------------- TABLA DE PRODUCTOS -------------------- */}
                <div className="productsTableContainer">
                    <div className="productsTopBar">
                        {/* BOTÓN PARA AGREGAR CATEGORÍA */}
                        <button className="addProductButton" onClick={handleAddCategoryClick}>
                            <IoMdAdd /> Nueva Categoría
                        </button>
                        <button className="addProductButton" onClick={handleAddClick}>
                            <IoMdAdd /> Agregar nuevo producto
                        </button>
                    </div>

                    <table className="productsTable">
                        <thead>
                            <tr className="tableHeader">
                                <th></th>
                                <th>Producto</th>
                                <th>Status</th>
                                <th>Stock</th>
                                <th>Categoria</th>
                                <th>Acciones</th>
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
                                    onAddStockClick={() => handleShowAddStockModal(product)}
                                    onEditClick={() => handleEditClick(product)}
                                    onDeleteClick={() => handleDeleteClick(product)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* -------------------- MODAL DE AGREGAR STOCK -------------------- */}
            {isAddingStock && stockToUpdate.id && (
                <div className="modalOverlay">
                    <div className="modalContent" id='mierdilla'>
                        <div>
                            <h2>Agregar Stock a {stockToUpdate.name}</h2>
                            <p>Stock actual: **{stockToUpdate.currentStock}**</p>
                        </div>
                        <label className='mierdilla'>
                            <p>Cantidad a Añadir:</p>
                            <input
                                type="number"
                                placeholder="Ej: 50"
                                value={stockToUpdate.newStockAmount}
                                onChange={(e) => setStockToUpdate({ ...stockToUpdate, newStockAmount: e.target.value })}
                                className='mierdilla'
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
                <div className="modalOverlay id=mierdilla">
                    <div className="modalContent">
                        <h2>Agregar Nuevo Producto</h2>
                        <label>
                            <p>Nombre:</p>
                            <input
                                type="text"
                                value={addForm.name}
                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                className='mierdilla'
                            />
                        </label>
                        <label>
                            <p>Categoría:</p>
                            <select
                                value={addForm.categoryId}
                                onChange={(e) => setAddForm({ ...addForm, categoryId: e.target.value })}
                                className="modalSelect"
                                id='mierdilla'
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
                            <p>Stock Inicial:</p>
                            <input
                                type="number"
                                value={addForm.stock}
                                onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                                className='mierdilla'
                            />
                        </label>
                        <label>
                            <p>Unidad:</p>
                            <input
                                type="text"
                                value={addForm.unit}
                                onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                                className='mierdilla'

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
                        <h2>Agregar Nueva Categoría </h2>
                        <label>
                            <p>Nombre de la Categoría:</p>
                            <input
                                type="text"
                                value={addCategoryForm.Nombre}
                                onChange={(e) => setAddCategoryForm({ Nombre: e.target.value })}
                                className='mierdilla'

                            />
                        </label>
                        <div className="modalActions">
                            <button onClick={() => setIsAddingCategory(false)}>Cancelar</button>
                            <button onClick={handleAddCategorySave}>Crear Categoría</button>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- MODAL GLOBAL CUSTOM -------------------- */}
            <CustomModal
                isOpen={isModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                type={modalContent.type}
                onConfirm={modalContent.onConfirm}
                onClose={closeModal}
                showInput={modalContent.showInput}
                inputPlaceholder={modalContent.inputPlaceholder}
            />

        </div>
    );
}
// -- Constante que permite que aparezca el nombre del usuario en el sidebar --
const userName = localStorage.getItem('userName') || "Invitado";
/* Componente para un elemento del menú lateral con navegación */
const SidebarItem = ({ icon: Icon, label, isActive, path, onClick }) => {
    // Si hay un onClick, úsalo. Si no, navega.
    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
    };
    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

export default Productos;