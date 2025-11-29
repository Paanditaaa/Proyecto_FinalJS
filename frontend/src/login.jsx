import "./login.css";
import user from "./assets/user-regular.svg";
import lock from "./assets/lock2.svg";
import user2 from "./assets/usuario.png";
import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_mail: usuario, user_password: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            // Guardar el token si lo necesitas
            localStorage.setItem("token", data.message);

            // Redirigir al dashboard
            navigate("/dashboard");

        } catch (error) {
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className="login-container">
            <div className="logo">
                <img src={logo} alt="logo2" className="logo2" />
            </div>

            <div className="card-wrapper">
                <div className="card">
                    <div className="icon-login">
                        <img src={user2} alt="user" className="logo" />
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
                </div>

                <button className="btn" onClick={handleLogin}>
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
}
