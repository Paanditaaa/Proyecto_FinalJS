import React from 'react';
import './dashboard.css';
function Proveedores() {
    return (
        <div className="dashboardContainer">
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Proveedores</h1>
                </div>
                <div className="welcomeMessage">
                    <h2 className="welcomeTitle">Gestión de Proveedores</h2>
                    <p>Aquí podrás administrar tus proveedores.</p>
                </div>
            </div>
        </div>
    );
}
export default Proveedores;