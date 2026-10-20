# Task Manager

Aplicación web de gestión de tareas desarrollada con React, TypeScript y Firebase. Permite a los usuarios autenticarse y administrar sus tareas desde una interfaz web.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Rutas protegidas según el estado de autenticación.
- Creación, visualización, finalización y eliminación de tareas.
- Almacenamiento y sincronización de tareas con Cloud Firestore.
- Persistencia de los datos entre sesiones.
- Manejo de estados de carga y errores.
- API serverless para integración con Resend.
- Pruebas automatizadas de componentes de autenticación y gestión de tareas.
- Interfaz adaptable a distintos tamaños de pantalla.

## Tecnologías

- React
- TypeScript
- Vite
- Firebase Authentication
- Cloud Firestore
- Resend
- Vercel
- Vitest
- React Testing Library

## Arquitectura

La aplicación está organizada en componentes, páginas, hooks y servicios para separar las responsabilidades.

- **Pages:** pantallas principales de la aplicación.
- **Features:** funcionalidades organizadas por área, como autenticación.
- **Hooks:** lógica reutilizable para acceder al usuario y administrar tareas.
- **Services:** comunicación con Firebase y servicios externos.
- **API:** endpoint serverless para el envío de emails.
- **Tests:** pruebas automatizadas de funcionalidades principales.

Las tareas se almacenan asociadas al usuario autenticado en Firestore. Las credenciales privadas de los servicios externos deben mantenerse en variables de entorno y nunca exponerse en el frontend.

## Instalación local

### Requisitos previos

- Node.js y npm.
- Un proyecto de Firebase con Authentication y Cloud Firestore configurados.
- Las variables de entorno necesarias para la aplicación.

### 1. Clonar el repositorio

```bash
git clone https://github.com/matiasg42003-lgtm/task-manager.git
cd task-manager
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto y completar las variables necesarias tomando como referencia `.env.example`.

No compartir el archivo `.env` ni subirlo al repositorio.

### 4. Iniciar el entorno de desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación en el navegador.

## Pruebas

Ejecutar las pruebas automatizadas con:

```bash
npm test
```

Para ejecutar las pruebas en modo interactivo durante el desarrollo:

```bash
npm run test:watch
```

## Compilación de producción

Generar la versión de producción:

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist`.

## Despliegue

La aplicación está preparada para desplegarse en Vercel. La configuración de compilación utiliza Vite y la carpeta de salida `dist`.

Para que funcione correctamente en producción, se deben configurar las variables de entorno requeridas en Vercel, habilitar los servicios necesarios en Firebase y mantener las reglas de seguridad de Firestore correctamente configuradas.

La configuración de rutas permite que las rutas de la aplicación de una sola página (SPA) funcionen al acceder directamente o recargar el navegador.

## Seguridad

- Las claves privadas de servicios externos no deben incluirse en el código del frontend.
- Las variables de entorno locales deben excluirse del control de versiones.
- Las reglas de Firestore deben restringir el acceso a los datos de cada usuario autenticado.
- Las operaciones de backend deben validar las solicitudes y manejar los errores correspondientes.

## Uso de inteligencia artificial

Durante el desarrollo de este proyecto utilicé herramientas de inteligencia artificial como apoyo para el aprendizaje, la resolución de problemas y la mejora del código.

La IA se utilizó para:

- **Análisis y planificación:** comprender los requisitos y organizar las tareas de desarrollo en etapas.
- **Asistencia en programación:** analizar componentes de React, TypeScript, hooks y servicios de Firebase.
- **Depuración:** investigar errores, interpretar mensajes de la consola y evaluar posibles soluciones.
- **Testing:** recibir orientación para diseñar y comprender pruebas automatizadas con Vitest y React Testing Library.
- **Documentación:** organizar la estructura del proyecto y mejorar la documentación técnica.

La IA fue utilizada como herramienta de asistencia, combinando sus sugerencias con la revisión del código, las pruebas y la validación del funcionamiento de la aplicación.

El objetivo fue utilizarla para aprender, comprender las decisiones técnicas y desarrollar progresivamente mayor autonomía como desarrollador.


## Autor

Desarrollado como proyecto de práctica de desarrollo Full Stack, con foco en React, TypeScript, autenticación, persistencia de datos, testing y despliegue.
