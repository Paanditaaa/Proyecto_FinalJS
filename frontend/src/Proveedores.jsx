import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Proveedores.css';
import { FaHome, FaBox, FaTruck, FaCog } from 'react-icons/fa';
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserAvatar from './components/UserAvatar';

const API_URL = 'http://localhost:3002/api/proveedores';

// Componente para mostrar mensajes de confirmación temporales
const ConfirmationMessage = ({ message }) => {
    return (
        <div className="confirmationMessage">
            {message}
        </div>
    );
};

// ----------------------------------------------------
// --- Elementos del sidebar ---
// ----------------------------------------------------
const SidebarItem = ({ icon: Icon, label, isActive, path, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <div
            className={`sidebarItem ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}>
            <Icon className="sidebarIcon" />
            <span className="sidebarLabel">{label}</span>
        </div>
    );
};

// ----------------------------------------------------
// --- Componente de Formulario para Nuevo Proveedor (Modal) ---
// ----------------------------------------------------
const SupplierForm = ({ onClose, onSave, editData }) => {
    const [formData, setFormData] = useState({
        nombre: editData?.Nombre || '',
        telefono: editData?.Telefono || '',
        email: editData?.Correo || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#2f254f',
                    padding: '30px',
                    borderRadius: '15px',
                    width: '90%',
                    maxWidth: '500px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    color: 'white'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #3c3066',
                    paddingBottom: '15px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.4em', fontWeight: 600 }}>
                        {editData ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor'}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#a0a0a0',
                            fontSize: '2em',
                            cursor: 'pointer',
                            lineHeight: 1
                        }}
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85em',
                            color: '#a0a0a0',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Nombre del Proveedor
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Distribuidora XYZ"
                            required
                            style={{
                                backgroundColor: '#3c3066',
                                border: '1px solid #55477d',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85em',
                            color: '#a0a0a0',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ej: +52 55 9876 5432"
                            style={{
                                backgroundColor: '#3c3066',
                                border: '1px solid #55477d',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85em',
                            color: '#a0a0a0',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ej: contacto@xyz.com"
                            required
                            style={{
                                backgroundColor: '#3c3066',
                                border: '1px solid #55477d',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '15px',
                        paddingTop: '10px'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #a0a0a0',
                                color: '#a0a0a0',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#4f46e5',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Guardar Proveedor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ----------------------------------------------------
// --- Modal de Confirmación de Cierre de Sesión ---
// ----------------------------------------------------
const LogoutConfirmationModal = ({ onClose, onConfirm }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#2f254f',
                    padding: '30px',
                    borderRadius: '15px',
                    width: '90%',
                    maxWidth: '400px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    textAlign: 'center'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.4em', fontWeight: 600 }}>
                    Confirmación de Salida
                </h3>
                <p style={{ marginBottom: '30px', color: '#a0a0a0' }}>
                    Estás a punto de salir de la aplicación.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    gap: '15px'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #a0a0a0',
                            color: '#a0a0a0',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: 600
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: '#ef4444',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: 600
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------
// --- Componente Principal (Dashboard Layout) ---
// ----------------------------------------------------
function Proveedores() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Nuevo estado
    const [editingProveedor, setEditingProveedor] = useState(null);
    const [confirmation, setConfirmation] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar proveedores al montar el componente
    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.code === 200) {
                setProveedores(data.message);
            }
        } catch (error) {
            showConfirmation('❌ Error al cargar proveedores');
        } finally {
            setLoading(false);
        }
    };

    const showConfirmation = (message) => {
        setConfirmation(message);
        setTimeout(() => setConfirmation(''), 3000);
    };

    const handleNewSupplier = () => {
        setEditingProveedor(null);
        setIsModalOpen(true);
    };

    const handleSaveNewSupplier = async (newSupplierData) => {
        try {
            if (editingProveedor) {
                // Actualizar proveedor existente
                const response = await fetch(`${API_URL}/${editingProveedor.IDProveedor}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Nombre: newSupplierData.nombre,
                        Telefono: newSupplierData.telefono,
                        Correo: newSupplierData.email
                    })
                });
                const data = await response.json();

                if (data.code === 200) {
                    showConfirmation(`✅ Proveedor ${newSupplierData.nombre} actualizado con éxito.`);
                    fetchProveedores();
                }
            } else {
                // Crear nuevo proveedor
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Nombre: newSupplierData.nombre,
                        Telefono: newSupplierData.telefono,
                        Correo: newSupplierData.email
                    })
                });
                const data = await response.json();

                if (data.code === 201) {
                    showConfirmation(`✅ Proveedor ${newSupplierData.nombre} añadido con éxito.`);
                    fetchProveedores();
                }
            }
            setIsModalOpen(false);
            setEditingProveedor(null);
        } catch (error) {
            showConfirmation('❌ Error al guardar proveedor');
        }
    };

    const handleEdit = (proveedor) => {
        setEditingProveedor(proveedor);
        setIsModalOpen(true);
    };

    const handleDelete = async (proveedor) => {
        if (window.confirm(`¿Estás seguro de eliminar al proveedor ${proveedor.Nombre}?`)) {
            try {
                const response = await fetch(`${API_URL}/${proveedor.IDProveedor}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (data.code === 200) {
                    showConfirmation(`🗑️ Proveedor ${proveedor.Nombre} eliminado`);
                    fetchProveedores();
                }
            } catch (error) {
                showConfirmation('❌ Error al eliminar proveedor');
            }
        }
    };
    // -- Constante que permite que aparezca el nombre del usuario en el sidebar --
    const userName = localStorage.getItem('userName') || "Invitado";
    // Funciones para el Modal de Cerrar Sesión
    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        // Lógica de cierre de sesión (ej: limpiar tokens, etc.)
        setIsLogoutModalOpen(false);
        navigate('/'); // Redirigir a la página de inicio de sesión
    };

    if (loading) {
        return <div style={{ color: 'white', padding: '20px' }}>Cargando...</div>;
    }

    return (
        <div className="dashboardContainer">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="profileSection">
                    <UserAvatar />
                    <h2 className="accountTitle">{userName}</h2>
                    <p className="loremText">Buen dia</p>
                </div>
                <div className="menu">
                    <SidebarItem icon={FaHome} label="INICIO" path="/dashboard" />
                    <SidebarItem icon={IoMdAdd} label="Orden nueva" path="/dashboard/orden-nueva" />
                    <SidebarItem icon={MdOutlineHistory} label="Ordenes pasadas" path="/dashboard/ordenes-pasadas" />
                    <SidebarItem icon={FaBox} label="Productos" path="/dashboard/productos" />
                    <SidebarItem icon={FaTruck} label="Proveedores" isActive={true} path="/dashboard/proveedores" />
                    <SidebarItem icon={FaCog} label="Configuracion" path="/dashboard/configuracion" />
                    <SidebarItem
                        icon={BsFillDoorOpenFill}
                        label="Cerrar sesion"
                        onClick={handleLogoutClick} // Cambiado a onClick
                    />
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="mainContent">
                <div className="proveedoresCard">
                    {/* Mensaje de confirmación */}
                    {confirmation && <ConfirmationMessage message={confirmation} />}

                    <div className="proveedoresHeader">
                        <h2 className="title proveedoresTitle">Gestión de Proveedores</h2>
                        <button className="newProveedorButton" onClick={handleNewSupplier}>
                            <IoMdAdd className="buttonIcon" />
                            Nuevo Proveedor
                        </button>
                    </div>

                    <div className="proveedoresTableContainer">
                        <table className="proveedoresTable">
                            <thead>
                                <tr>
                                    <th>NOMBRE</th>
                                    <th>TELÉFONO</th>
                                    <th>EMAIL</th>
                                    <th className="accionesColumn">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proveedores.map((p) => (
                                    <tr key={p.IDProveedor}>
                                        <td>{p.Nombre}</td>
                                        <td>{p.Telefono || 'N/A'}</td>
                                        <td>{p.Correo}</td>
                                        <td>
                                            <div className="accionesCell">
                                                <button
                                                    className="actionButton editButton"
                                                    onClick={() => handleEdit(p)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="actionButton deactivateButton"
                                                    onClick={() => handleDelete(p)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {proveedores.length === 0 && (
                        <p className="noDataMessage">No hay proveedores registrados.</p>
                    )}
                </div>
            </div>

            {/* MODAL - Formulario de Proveedor */}
            {isModalOpen && (
                <SupplierForm
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingProveedor(null);
                    }}
                    onSave={handleSaveNewSupplier}
                    editData={editingProveedor}
                />
            )}

            {/* MODAL - Confirmación de Cierre de Sesión */}
            {isLogoutModalOpen && (
                <LogoutConfirmationModal
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={handleConfirmLogout}
                />
            )}
        </div>
    );
}

export default Proveedores;