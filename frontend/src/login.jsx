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
        setError(""); // Limpiar errores previos

        try {
            // 💡 URL CORREGIDA: Usa /api/user/login para coincidir con tu router Express
            const res = await fetch("http://localhost:3002/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_mail: usuario, user_password: password }),
            });

            const data = await res.json();

            // Manejo de errores del servidor (ej. 401 Unauthorized)
            if (!res.ok) {
                setError(data.message || "Error: Credenciales inválidas o servidor no responde.");
                return;
            }

            // Lógica de Verificación de Rol
            const userToken = data.token;
            const userRole = data.role;

            // Verifica si el rol es 'admin'
            if (userRole !== "admin") {
                setError("Acceso denegado. Solo los administradores pueden ingresar.");
                return;
            }

            // Si es 'admin', procede a guardar datos
            localStorage.setItem("token", userToken);
            localStorage.setItem("userName", usuario);
            localStorage.setItem("userRole", userRole);

            // Redirigir al dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Error al conectar o procesar JSON:", error);
            setError("Error al conectar con el servidor.");
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
                            id="login-usuario"
                            name="usuario"
                            type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <img src={lock} alt="lock" className="icon" />
                        <input
                            id="login-password"
                            name="password"
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