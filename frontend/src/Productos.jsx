import React from 'react';
import './dashboard.css';
function Productos() {
    return (
        <div className="dashboardContainer">
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Productos</h1>
                </div>
                <div className="welcomeMessage">
                    <h2 className="welcomeTitle">Gestión de Productos</h2>
                    <p>Aquí podrás administrar tu inventario de productos.</p>
                </div>
            </div>
        </div>
    );
}
export default Productos;