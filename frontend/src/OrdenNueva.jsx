import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrdenNueva.css';
import { FaHome, FaBox, FaTruck, FaCog, FaTimes } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';
import dayjs from 'dayjs';

// NOTA IMPORTANTE: Para que el botón se vea "bonito" como en Configuración, 
// debes asegurarte de que tu archivo CSS (OrdenNueva.css) contenga la definición
// de la clase '.primaryActionButton' o que la clase '.sidebarItem.active' tenga
// los estilos deseados. A continuación, un ejemplo de CSS que podrías usar:
/*
.primaryActionButton {
    background-color: #6366f1; // Color principal (ajusta a tu color de acento)
    color: white;
    border: none;
    border-radius: 8px; 
    padding: 12px 20px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
}

.primaryActionButton:hover:not(:disabled) {
    background-color: #4f46e5;
}

.primaryActionButton:disabled {
    background-color: #ccc; 
    cursor: not-allowed;
    box-shadow: none;
}
*/

// -------------------------------------------------------------
// Componente de Modal Genérico
// -------------------------------------------------------------
const CustomModal = ({ isOpen, content, onClose, navigate }) => {
    if (!isOpen) return null;

    const { title, message, type, onConfirm, showInput, inputPlaceholder } = content;
    const [inputValue, setInputValue] = useState('');

    const handleAction = () => {
        if (onConfirm) {
            // Ejecuta la función de confirmación (incluyendo la lógica de logout)
            onConfirm(inputValue, navigate); 
        }
        onClose();
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent" style={{ maxWidth: '400px', textAlign: 'center' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{title}</h2>
                <p>{message}</p>
                {showInput && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={inputPlaceholder}
                        className='mierdilla'
                        style={{ marginTop: '15px', padding: '8px', width: '90%' }}
                    />
                )}
                <div className="modalActions" style={{ marginTop: '20px' }}>
                    <button onClick={onClose} style={{ background: '#ccc', color: '#333' }}>
                        {type === 'alert' ? 'Aceptar' : 'Cancelar'}
                    </button>
                    {type === 'confirm' && (
                        <button onClick={handleAction} style={{ background: '#ff4d4f', color: 'white', marginLeft: '10px' }}>
                            Aceptar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// -------------------------------------------------------------
// Componentes de la Interfaz
// -------------------------------------------------------------

/**
 * Componente para un elemento del menú lateral con navegación y soporte para Modal.
 */
const SidebarItem = ({ icon: Icon, label, isActive, path, showModal }) => {
    const navigate = useNavigate();

    const handleLogoutConfirm = (inputValue, nav) => {
        localStorage.removeItem('token');
        console.log("Sesión cerrada");
        nav('/'); // Redirigir al inicio de sesión
    };

    const handleClick = () => {
        if (path) {
            navigate(path);
        } else if (label === "Cerrar sesion" && showModal) {
            // Llama a showModal para la confirmación de logout
            showModal(
                'Confirmación de Salida',
                '¿Estás seguro de que quieres cerrar la sesión actual?',
                'confirm',
                handleLogoutConfirm // Pasa la función de confirmación
            );
        }
    };

    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            style={{ cursor: path || label === "Cerrar sesion" ? 'pointer' : 'default' }}
        >
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};


/**
 * Representa una tarjeta de producto disponible.
 */
const ProductCard = ({ product, onAdd, onDelete }) => (
    <div className="productCard">
        <div onClick={() => onAdd(product)} style={{ cursor: 'pointer', flex: 1 }} title={`Añadir ${product.Nombre} a la orden`}>
            {/* Si hay imagen, mostrarla, si no, un icono genérico */}
            {product.Imagen ? (
                <img src={product.Imagen} alt={product.Nombre} className="productImage" />
            ) : (
                <div className="productIcon">🍔</div>
            )}

            <span className="productName">{product.Nombre}</span>
            <span className="productPrice">${parseFloat(product.Precio).toFixed(2)}</span>
        </div>
        {onDelete && (
            <button
                className="deleteProductButton"
                onClick={(e) => { e.stopPropagation(); onDelete(product.IDPlatillo); }}
                title="Eliminar platillo"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ff4d4f',
                    borderRadius: '7%',
                    width: '35px',
                    height: '35px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                🗑️
            </button>
        )}
    </div>
);

/**
 * Lista de Productos Disponibles.
 */
const AvailableProducts = ({ products, onProductAdd, onProductDelete, onAddNewDish }) => {
    return (
        <div className="availableProducts">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="sectionTitle">Productos Disponibles</h2>
                <button className="addProductButton" onClick={onAddNewDish} >
                    <IoMdAdd size={20} /> Agregar Platillo
                </button>
            </div>
            <div className="productsGrid">
                {products.map((product) => (
                    <ProductCard
                        key={product.IDPlatillo}
                        product={product}
                        onAdd={onProductAdd}
                        onDelete={onProductDelete}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Resumento de Orden y Totales.
 */
const OrderSummary = ({ orderItems, subtotal, taxRate = 0.16, onProcessOrder, onRemoveItem }) => {
    const iva = subtotal * taxRate;
    const total = subtotal + iva;

    return (
        <div className="orderSummary">
            <h2 className="sectionTitle">Resumen de Orden</h2>

            {/* Lista de Artículos en la Orden */}
            <div className="orderItemsList">
                {orderItems.length > 0 ? (
                    orderItems.map((item, index) => (
                        <div key={item.IDPlatillo} className="summaryRow itemRow">
                            <span style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                                {item.Nombre}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.9em' }}>
                                    x{item.quantity} (${(item.Precio * item.quantity).toFixed(2)})
                                </span>
                                {/* BOTÓN DE ELIMINAR */}
                                <button
                                    className="removeItemButton"
                                    onClick={() => onRemoveItem(item.IDPlatillo)}
                                    title={`Eliminar ${item.Nombre}`}
                                >
                                    <FaTimes size={12} style={{ color: '#ff4d4f' }} />
                                </button>
                            </div>
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

            {/* BOTÓN MODIFICADO para que se vea igual de bonito */}
            <button 
                className="primaryActionButton" /* Nueva clase para estilo destacado */
                disabled={orderItems.length === 0} 
                onClick={onProcessOrder}
                style={{ 
                    width: '100%', 
                    padding: '15px 0', 
                    marginTop: '20px', 
                    fontSize: '1.1em',
                }}
            >
                Procesar Orden
            </button>
        </div>
    );
};

/**
 * Modal para agregar nuevo platillo
 */
const AddDishModal = ({ isOpen, onClose, onSave, availableIngredients }) => {
    const [dishName, setDishName] = useState('');
    const [dishPrice, setDishPrice] = useState('');
    const [ingredients, setIngredients] = useState([{ IDProducto: '', Cantidad: '' }]);

    if (!isOpen) return null;

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { IDProducto: '', Cantidad: '' }]);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleSubmit = () => {
        if (!dishName || !dishPrice) {
            alert('Por favor ingresa nombre y precio');
            return;
        }

        const validIngredients = ingredients.filter(ing => ing.IDProducto && ing.Cantidad);
        if (validIngredients.length === 0) {
            alert('Por favor agrega al menos un ingrediente');
            return;
        }

        onSave({
            Nombre: dishName,
            Precio: parseFloat(dishPrice),
            ingredients: validIngredients.map(ing => ({
                IDProducto: parseInt(ing.IDProducto),
                Cantidad: parseFloat(ing.Cantidad)
            }))
        });

        // Reset
        setDishName('');
        setDishPrice('');
        setIngredients([{ IDProducto: '', Cantidad: '' }]);
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                <h2>Agregar Nuevo Platillo</h2>

                <label>
                    <p>Nombre del Platillo:</p>
                    <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="Ej: Hamburguesa Doble"
                        className='mierdilla'
                        style={{ marginTop: '15px', padding: '8px', width: '90%' }}
                    />
                </label>

                <label>
                    <p>Precio:</p>
                    <input
                        type="number"
                        step="0.01"
                        value={dishPrice}
                        onChange={(e) => setDishPrice(e.target.value)}
                        placeholder="Ej: 150.00"
                        className='mierdilla'
                        style={{ marginTop: '15px', padding: '8px', width: '90%' }}
                    />
                </label>

                <h3>Ingredientes</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select
                            value={ingredient.IDProducto}
                            onChange={(e) => handleIngredientChange(index, 'IDProducto', e.target.value)}
                            style={{ flex: 2 }}
                        >
                            <option value="" className='mierdilla' id='mierdilla'>Seleccionar Ingrediente</option>
                            {availableIngredients.map(ing => (
                                <option key={ing.IDProducto} value={ing.IDProducto}>
                                    {ing.Nombre}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            step="0.01"
                            value={ingredient.Cantidad}
                            onChange={(e) => handleIngredientChange(index, 'Cantidad', e.target.value)}
                            placeholder="Cantidad"
                            style={{ flex: 1 }}
                            className='mierdilla'
                        />
                        <button onClick={() => handleRemoveIngredient(index)} style={{ padding: '5px 10px' }}>
                            🗑️
                        </button>
                    </div>
                ))}

                <button onClick={handleAddIngredient} style={{ margin: '10px 0', padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Agregar Ingrediente
                </button>

                <div className="modalActions">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSubmit}>Guardar Platillo</button>
                </div>
            </div>
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
    const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
    const [availableIngredients, setAvailableIngredients] = useState([]);

    useEffect(() => {
        fetchMenu();
        fetchIngredients();
    }, []);

    const fetchMenu = async () => {
        try {
            console.log("Fetching menu...");
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3002/api/menu', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Menu response:", response.data);
            if (response.data && response.data.message) {
                setProducts(response.data.message);
            }
        } catch (error) {
            console.error("Error loading menu:", error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3002/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.message) {
                setAvailableIngredients(response.data.message);
            }
        } catch (error) {
            console.error("Error loading ingredients:", error);
        }
    };

    const handleDeleteDish = async (dishId) => {
        if (!window.confirm('¿Estás seguro de eliminar este platillo?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3002/api/menu/${dishId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Platillo eliminado correctamente');
            fetchMenu(); // Refresh
        } catch (error) {
            console.error("Error deleting dish:", error);
            alert('Error al eliminar el platillo');
        }
    };

    const handleAddDish = async (dishData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3002/api/menu', dishData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Platillo creado correctamente');
            setIsAddDishModalOpen(false);
            fetchMenu(); // Refresh
        } catch (error) {
            console.error("Error creating dish:", error);
            alert('Error al crear el platillo');
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

    // Lógica para eliminar un producto de la orden
    const handleProductRemove = (dishId) => {
        setOrderItems(prevItems => {
            // Decrementa si la cantidad es > 1, si no, lo elimina
            const existingItem = prevItems.find(item => item.IDPlatillo === dishId);

            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item.IDPlatillo === dishId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                // Si la cantidad es 1 o menos, o no se encontró, lo elimina por completo de la lista
                return prevItems.filter(item => item.IDPlatillo !== dishId);
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

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3002/api/orders', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 201) {
                alert("Orden procesada exitosamente! Stock actualizado.");
                setOrderItems([]); // Limpiar orden
            }
        } catch (error) {
            console.error("Error processing order:", error);
            const errorMessage = error.response?.data?.error || error.response?.data?.sqlMessage || error.message || "Error desconocido";
            const availableTables = error.response?.data?.availableTables;
            if (availableTables) {
                alert(`Error: ${errorMessage}\n\nTablas disponibles: ${availableTables}`);
            } else {
                alert(`Error al procesar la orden: ${errorMessage}`);
            }
        }
    };

    return (
        <div className="newOrderViewContainer">
            <AvailableProducts
                products={products}
                onProductAdd={handleProductAdd}
                onProductDelete={handleDeleteDish}
                onAddNewDish={() => setIsAddDishModalOpen(true)}
            />
            <OrderSummary
                orderItems={orderItems}
                subtotal={subtotal}
                onProcessOrder={handleProcessOrder}
                onRemoveItem={handleProductRemove}
            />

            <AddDishModal
                isOpen={isAddDishModalOpen}
                onClose={() => setIsAddDishModalOpen(false)}
                onSave={handleAddDish}
                availableIngredients={availableIngredients}
            />
        </div>
    );
};


// --- Componente Principal (OrdenNueva) ---
function OrdenNueva() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(dayjs());
    
    // ESTADOS DEL MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    // FUNCIÓN SHOW MODAL
    const showModal = (title, message, type = 'alert', onConfirm = null, showInput = false, inputPlaceholder = '') => {
        setModalContent({ title, message, type, onConfirm, showInput, inputPlaceholder });
        setIsModalOpen(true);
    };
    
    // FUNCIÓN DE CIERRE DE MODAL
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent({});
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
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" showModal={showModal} />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" isActive={true} path="/dashboard/orden-nueva" showModal={showModal} />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" showModal={showModal} />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" showModal={showModal} />
                    <SidebarItem icon={FaTruck} label="Proveedores" path="/dashboard/proveedores" showModal={showModal} />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" showModal={showModal} />
                    {/* Elemento de cerrar sesión con la función showModal */}
                    <SidebarItem icon={BsFillDoorOpenFill} label="Cerrar sesion" showModal={showModal} />
                </div>
            </div>

            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Orden nueva</h1>
                </div>

                {/* Muestra la vista de órdenes */}
                <NewOrderView />
            </div>
            
            {/* -------------------- MODAL GENÉRICO -------------------- */}
            <CustomModal
                isOpen={isModalOpen}
                content={modalContent}
                onClose={handleCloseModal}
                navigate={navigate} // Pasamos navigate al modal
            />
        </div>
    );
}

export default OrdenNueva;