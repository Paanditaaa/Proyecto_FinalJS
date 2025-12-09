-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-12-2025 a las 18:20:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectofinal`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `IDCategoria` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`IDCategoria`, `Nombre`) VALUES
(5, 'Pan'),
(6, 'Verdura'),
(7, 'Extras'),
(8, 'Origen Animal'),
(9, 'Condimentos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `IDOrden` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden`
--

INSERT INTO `orden` (`IDOrden`, `Fecha`, `Total`) VALUES
(5, '2025-12-08', 160.00),
(6, '2025-12-08', 100.00),
(7, '2025-12-08', 140.00),
(8, '2025-12-08', 84.00),
(9, '2025-12-08', 134.00),
(10, '2025-12-08', 120.00),
(11, '2025-12-08', 220.00),
(12, '2025-12-08', 244.00),
(13, '2025-12-08', 170.00),
(14, '2025-12-08', 150.00),
(15, '2025-12-08', 294.00),
(16, '2025-12-08', 270.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `IDPedido` int(11) NOT NULL,
  `IDOrden` int(11) NOT NULL,
  `IDPlatillo` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `PrecioIndividual` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`IDPedido`, `IDOrden`, `IDPlatillo`, `Cantidad`, `PrecioIndividual`) VALUES
(2, 5, 8, 1, 40),
(3, 5, 7, 1, 70),
(4, 5, 9, 1, 50),
(5, 6, 11, 1, 50),
(6, 6, 9, 1, 50),
(7, 7, 10, 2, 50),
(8, 7, 8, 1, 40),
(9, 8, 15, 1, 14),
(10, 8, 14, 1, 20),
(11, 8, 9, 1, 50),
(12, 9, 7, 1, 70),
(13, 9, 10, 1, 50),
(14, 9, 15, 1, 14),
(15, 10, 14, 1, 20),
(16, 10, 11, 1, 50),
(17, 10, 10, 1, 50),
(18, 11, 7, 1, 70),
(19, 11, 9, 1, 50),
(20, 11, 12, 1, 100),
(21, 12, 15, 1, 14),
(22, 12, 13, 1, 130),
(23, 12, 12, 1, 100),
(24, 13, 11, 1, 50),
(25, 13, 14, 1, 20),
(26, 13, 12, 1, 100),
(27, 14, 9, 2, 50),
(28, 14, 10, 1, 50),
(29, 15, 13, 2, 130),
(30, 15, 14, 1, 20),
(31, 15, 15, 1, 14),
(32, 16, 7, 1, 70),
(33, 16, 8, 2, 40),
(34, 16, 12, 1, 100),
(35, 16, 14, 1, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platillo`
--

CREATE TABLE `platillo` (
  `IDPlatillo` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Imagen` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `platillo`
--

INSERT INTO `platillo` (`IDPlatillo`, `Nombre`, `Precio`, `Imagen`) VALUES
(7, 'Hamburguesa Sencilla', 70.00, ''),
(8, 'Orden de papas', 40.00, ''),
(9, 'Orden de aros de cebolla', 50.00, ''),
(10, 'Orden de papas gajos', 50.00, ''),
(11, 'Orden de dedos de queso', 50.00, ''),
(12, 'Hamburguesa Doble', 100.00, ''),
(13, 'Hamburguesa Triple', 130.00, ''),
(14, 'Refresco de uva', 20.00, ''),
(15, 'Agua natural', 14.00, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `IDProducto` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `IDCategoria` int(11) NOT NULL,
  `UnidadMedida` varchar(20) NOT NULL,
  `StockMinimo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`IDProducto`, `Nombre`, `IDCategoria`, `UnidadMedida`, `StockMinimo`) VALUES
(11, 'Pan de hamburguesa', 5, 'unidades', 29.00),
(12, 'Mostaza', 9, 'kg', 29.45),
(13, 'Papas', 7, 'kg', 19.00),
(14, 'Ketchup', 9, 'kg', 39.45),
(15, 'Mayonesa', 9, 'kg', 29.45),
(16, 'Carne para hamburguesa', 8, 'kg', 16.85),
(17, 'Queso Amarillo', 8, 'unidades', 83.00),
(18, 'Tomate Rojo', 6, 'kg', 14.45),
(19, 'Aguacate', 6, 'kg', 19.49),
(20, 'Cebolla', 6, 'kg', 9.53),
(21, 'Queso liquido', 9, 'kg', 10.00),
(22, 'Aros de cebolla', 7, 'kg', 8.50),
(23, 'Papas gajo', 7, 'kg', 8.75),
(24, 'Dedos de queso', 7, 'kg', 14.25),
(25, 'Refresco de Uva', 7, 'unidades', 35.00),
(26, 'Botella de agua', 7, 'unidades', 36.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `IDProveedor` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  `Correo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`IDProveedor`, `Nombre`, `Telefono`, `Correo`) VALUES
(3, 'Distribuidora Nova', '+52 55 1234 5678', 'contacto@nova.com'),
(4, 'Suministros del Centro', '+52 55 9988 2211', 'ventas@centro.mx'),
(5, 'Proveedora Global', '+52 33 8877 6655', 'info@proveedoraglobal.com'),
(6, 'Comercializadora Álamo', '+52 81 4433 2288', 'soporte@alamo.mx'),
(7, 'Abastos Rivera', '+52 55 7654 3210', 'pedidos@rivera.com'),
(8, 'Insumos del Pacífico', '+52 55 9012 3456', 'atencion@pacifico.mx'),
(9, 'Industrial Montoya', '+52 33 5566 7788', 'contacto@montoya.com'),
(10, 'Logística Express', '+52 81 1122 3344', 'servicio@logisticaexpress.mx'),
(11, 'Grupo Mercantil Orion', '+52 55 6789 0123', 'ventas@orion.com'),
(12, 'Proveedora Andina', '+52 55 2233 4455', 'admin@andina.mx');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `receta`
--

CREATE TABLE `receta` (
  `IDReceta` int(11) NOT NULL,
  `IDPlatillo` int(11) NOT NULL,
  `IDProducto` int(11) NOT NULL,
  `Cantidad` decimal(20,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `receta`
--

INSERT INTO `receta` (`IDReceta`, `IDPlatillo`, `IDProducto`, `Cantidad`) VALUES
(20, 7, 11, 1.00),
(21, 7, 16, 0.15),
(22, 7, 15, 0.05),
(23, 7, 14, 0.05),
(24, 7, 12, 0.05),
(25, 7, 18, 0.05),
(26, 7, 20, 0.03),
(27, 7, 19, 0.04),
(28, 8, 13, 0.25),
(29, 9, 22, 0.25),
(30, 10, 23, 0.25),
(31, 11, 24, 0.25),
(32, 12, 11, 1.00),
(33, 12, 16, 0.30),
(34, 12, 19, 0.05),
(35, 12, 20, 0.05),
(36, 12, 18, 0.05),
(37, 12, 14, 0.05),
(38, 12, 15, 0.05),
(39, 12, 12, 0.05),
(40, 12, 17, 2.00),
(41, 13, 11, 1.00),
(42, 13, 16, 0.45),
(43, 13, 17, 3.00),
(44, 13, 15, 0.05),
(45, 13, 14, 0.05),
(46, 13, 12, 0.05),
(47, 13, 20, 0.05),
(48, 13, 19, 0.05),
(49, 13, 18, 0.05),
(50, 14, 25, 1.00),
(51, 15, 26, 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte`
--

CREATE TABLE `reporte` (
  `IDReporte` int(11) NOT NULL,
  `Reporte` varchar(300) NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reporte`
--

INSERT INTO `reporte` (`IDReporte`, `Reporte`, `Fecha`) VALUES
(4, 'No se puede cerrar sesion', '2025-12-08'),
(5, 'No puedo acceder a orden nueva', '2025-12-08'),
(6, 'No me deja cambiar el nombre de la app\n', '2025-12-08'),
(7, 'No puedo editar a los proveedores', '2025-12-08'),
(8, 'No puedo eliminar proveedores', '2025-12-08'),
(9, 'No puedo agregar nuevos proveedores', '2025-12-08'),
(10, 'No puedo eliminar un producto en las ordenes nuevas', '2025-12-08'),
(11, 'No puedo agregar un nuevo producto', '2025-12-08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sugerencia`
--

CREATE TABLE `sugerencia` (
  `IDSugerencia` int(11) NOT NULL,
  `Sugerencia` varchar(300) NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `IDUsuario` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Password` varchar(40) NOT NULL,
  `Rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`IDUsuario`, `Nombre`, `Password`, `Rol`) VALUES
(1, 'admin', '1234', 'Admin'),
(3, 'hola', '1234', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`IDCategoria`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`IDOrden`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`IDPedido`),
  ADD KEY `FK` (`IDOrden`),
  ADD KEY `fks` (`IDPlatillo`);

--
-- Indices de la tabla `platillo`
--
ALTER TABLE `platillo`
  ADD PRIMARY KEY (`IDPlatillo`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`IDProducto`),
  ADD KEY `fk_producto_categoria` (`IDCategoria`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`IDProveedor`);

--
-- Indices de la tabla `receta`
--
ALTER TABLE `receta`
  ADD PRIMARY KEY (`IDReceta`),
  ADD UNIQUE KEY `Receta` (`IDPlatillo`,`IDProducto`),
  ADD KEY `IDProducto` (`IDProducto`);

--
-- Indices de la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`IDReporte`);

--
-- Indices de la tabla `sugerencia`
--
ALTER TABLE `sugerencia`
  ADD PRIMARY KEY (`IDSugerencia`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IDUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IDCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `IDOrden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `IDPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `platillo`
--
ALTER TABLE `platillo`
  MODIFY `IDPlatillo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `IDProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `IDProveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `receta`
--
ALTER TABLE `receta`
  MODIFY `IDReceta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `reporte`
--
ALTER TABLE `reporte`
  MODIFY `IDReporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `sugerencia`
--
ALTER TABLE `sugerencia`
  MODIFY `IDSugerencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IDUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`IDOrden`) REFERENCES `orden` (`IDOrden`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`IDPlatillo`) REFERENCES `platillo` (`IDPlatillo`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`IDCategoria`) REFERENCES `categoria` (`IDCategoria`);

--
-- Filtros para la tabla `receta`
--
ALTER TABLE `receta`
  ADD CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`IDProducto`) REFERENCES `producto` (`IDProducto`),
  ADD CONSTRAINT `receta_ibfk_2` FOREIGN KEY (`IDPlatillo`) REFERENCES `platillo` (`IDPlatillo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
