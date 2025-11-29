import React from 'react';
import './dashboard.css';
function Configuracion() {
    return (
        <div className="dashboardContainer">
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Configuración</h1>
                </div>
                <div className="welcomeMessage">
                    <h2 className="welcomeTitle">Configuración del Sistema</h2>
                    <p>Aquí podrás ajustar las configuraciones de tu cuenta y sistema.</p>
                </div>
            </div>
        </div>
    );
}
export default Configuracion;