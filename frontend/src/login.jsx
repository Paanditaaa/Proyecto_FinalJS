import "./login.css";
import user from "./assets/user-regular.svg";
import lock from "./assets/lock2.svg";
import { useState } from "react";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            // Guardar el token si lo necesitas
            localStorage.setItem("token", data.token);

            alert("Inicio de sesión exitoso!");

        } catch (error) {
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className="login-container">
            <h1 className="title">Indirismo Burger</h1>

            <div className="card">
                <div className="user-icon">
                    <img src={user} alt="user" className="icon" style={{ width: "70px", height: "70px" }} />
                </div>

                <div className="input-group">
                    <img src={user} alt="user" className="icon" />
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <img src={lock} alt="lock" className="icon" />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button className="btn" onClick={handleLogin}>
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
}
