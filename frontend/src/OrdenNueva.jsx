import React from 'react';
import './dashboard.css';
function OrdenNueva() {
    return (
        <div className="dashboardContainer">
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Orden Nueva</h1>
                </div>
                <div className="welcomeMessage">
                    <h2 className="welcomeTitle">Crear Nueva Orden</h2>
                    <p>Aquí podrás crear una nueva orden para tus clientes.</p>
                </div>
            </div>
        </div>
    );
}
export default OrdenNueva;