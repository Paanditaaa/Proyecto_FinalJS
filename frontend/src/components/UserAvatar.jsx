import React from 'react';
import Avatar from '@mui/material/Avatar';

// Función para obtener el color basado en el nombre
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

// Función para obtener las iniciales
function stringAvatar(name) {
    // Si el nombre es nulo o vacío, usar 'Invitado'
    if (!name || name.trim().length === 0) {
        name = 'Invitado';
    }

    // Dividir el nombre
    const nameParts = name.trim().split(' ');
    let initials;

    if (nameParts.length >= 2) {
        // Caso: "Juan Perez" -> "JP"
        initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
        // Caso: "juanperez" -> "JU"
        // Si solo hay una palabra con 2 o más letras, toma las dos primeras letras
        initials = `${nameParts[0][0]}${nameParts[0][1]}`.toUpperCase();
    } else {
        // Caso: "j" o "hola" predeterminado
        initials = `${nameParts[0][0]}${nameParts[0][0]}`.toUpperCase();
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 80,
            height: 80,
            fontSize: '2em',
            fontWeight: 600,
            border: '3px solid rgba(255, 255, 255, 0.2)',
        },
        children: initials,
    };
}

export default function UserAvatar() {
    // Obtener el nombre del usuario desde localStorage
    const userName = localStorage.getItem('userName') || "Invitado";

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Avatar {...stringAvatar(userName)} />
        </div>
    );
}