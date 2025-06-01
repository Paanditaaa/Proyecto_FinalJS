-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-06-2025 a las 07:22:56
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
-- Estructura de tabla para la tabla `datos_empleados`
--

CREATE TABLE `datos_empleados` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(25) NOT NULL,
  `Apellidos` varchar(25) NOT NULL,
  `Telefono` int(25) NOT NULL,
  `CorreoE` varchar(50) NOT NULL,
  `Direccion` varchar(50) NOT NULL,
  `Contraseña` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_empleados`
--

INSERT INTO `datos_empleados` (`ID`, `Nombre`, `Apellidos`, `Telefono`, `CorreoE`, `Direccion`, `Contraseña`) VALUES
(2, 'Angel', 'Perez', 442143453, 'alejandro@uaq.mxx', 'dsadsadsadare', '1234567'),
(5, 'pedro', 'dpsaodksakodak', 2147483647, 'alejandro@uaq.mx', 'lkmdsakdsakm;da', 'dsadsadwadas');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `datos_empleados`
--
ALTER TABLE `datos_empleados`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `datos_empleados`
--
ALTER TABLE `datos_empleados`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
