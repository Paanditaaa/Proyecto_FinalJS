import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login.jsx";
import Dashboard from "./Dashboard.jsx";
import OrdenNueva from "./OrdenNueva.jsx";
import OrdenesPasadas from "./OrdenesPasadas.jsx";
import Productos from "./Productos.jsx";
import Proveedores from "./Proveedores.jsx";
import Configuracion from "./Configuracion.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/orden-nueva" element={<OrdenNueva />} />
        <Route path="/dashboard/ordenes-pasadas" element={<OrdenesPasadas />} />
        <Route path="/dashboard/productos" element={<Productos />} />
        <Route path="/dashboard/proveedores" element={<Proveedores />} />
        <Route path="/dashboard/configuracion" element={<Configuracion />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;