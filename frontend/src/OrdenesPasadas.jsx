import React from 'react';
import './dashboard.css';
function OrdenesPasadas() {
    return (
        <div className="dashboardContainer">
            <div className="mainContent">
                <div className="headerBar">
                    <h1 className="title">Ordenes Pasadas</h1>
                </div>
                <div className="welcomeMessage">
                    <h2 className="welcomeTitle">Historial de Ordenes</h2>
                    <p>Aquí podrás ver todas las ordenes anteriores.</p>
                </div>
            </div>
        </div>
    );
}
export default OrdenesPasadas;