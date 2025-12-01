import React from 'react';

function OrdenesPasadas() {
    return (
        <div className="dashboardContainer">
            {/* -------------------- SIDEBAR -------------------- */}
            <div className="sidebar">
                <div className="profileSection">
                    <div className="avatar" />
                    <h2 className="accountTitle">ACCOUNT</h2>
                    <p className="loremText">Buen dia</p>
                </div>
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
        </div>
    );
}

export default OrdenesPasadas;