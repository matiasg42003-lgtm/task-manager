# Task Manager

Aplicación web de gestión de tareas desarrollada con React, TypeScript y Firebase. Permite a los usuarios autenticarse, administrar sus tareas y enviar por correo un resumen de su estado.

## Enlaces del proyecto

- **Aplicación en producción:** [Probar Task Manager](https://task-manager-kohl-mu-38.vercel.app)
- **Repositorio:** [GitHub — Task Manager](https://github.com/matiasg42003-lgtm/task-manager)

## Funcionalidades

- Registro e inicio de sesión mediante Firebase Authentication.
- Rutas protegidas según el estado de autenticación.
- Creación, visualización, edición, eliminación y finalización de tareas.
- Persistencia de tareas en Cloud Firestore.
- Datos asociados al usuario autenticado.
- Sincronización de los datos con la interfaz.
- Manejo de estados de carga y errores.
- Envío de resúmenes de tareas por email mediante una función serverless.
- Interfaz adaptable a distintos tamaños de pantalla.
- Pruebas automatizadas con Vitest y React Testing Library.

## Diseño UI

- **Interfaz Retro Console:** estética de terminal arcade con fondo oscuro, scanlines CRT discretas, paleta de verde fósforo y acentos ámbar.
- **Registro e inicio de sesión:** consolas de autenticación seguras mediante Firebase Authentication con feedback de estado en tiempo real.
- **Rutas protegidas:** navegación condicionada por el estado de autenticación de la sesión.
- **Gestión integral de tareas:** creación, listado, cambio de estado (completada/pendiente) y eliminación con persistencia en Cloud Firestore.
- **Telemetría y métricas en vivo:** panel de lectura digital con contadores de tareas totales, completadas y pendientes, además de un medidor porcentual de sincronización (`% SYNCHRONIZED`).
- **Línea de comandos para nuevas tareas:** formulario con prefijos `>` y contadores de longitud máxima de caracteres en vivo.
- **Envío de resúmenes por email:** transmisión de reportes de tareas vía endpoint serverless con Resend.
- **Microinteracciones y animaciones sutiles:** cursor parpadeante (`_`), LEDs de estado (`● SYSTEM ONLINE`), botones con resplandor arcade y soporte para `prefers-reduced-motion`.
- **Diseño adaptable (Responsive):** interfaz optimizada para teléfonos móviles (desde 320px), tablets y pantallas de escritorio sin desbordamientos horizontales.
- **Pruebas automatizadas:** suite de pruebas con Vitest y React Testing Library que asegura la robustez funcional y la accesibilidad.

## Identidad visual: Retro Console / Arcade Terminal

El rediseño visual transforma la aplicación en una consola de comandos de una computadora arcade de los años 80, combinando ambientación retro con la ergonomía y estándares de una aplicación de productividad moderna.

### Paleta de colores técnica
- **Fondo principal (`#080C0A`):** negro azulado profundo que evoca el fondo de un monitor CRT apagado.
- **Superficies y paneles (`#101713`):** chasis de terminal oscuro con bordes sutiles fosforescentes (`rgba(57, 255, 136, 0.18)`).
- **Verde fósforo primario (`#39FF88`):** color distintivo de terminal para títulos principales, bordes activos, botones primarios y resaltado de selección.
- **Verde secundario (`#19C765`):** tono complementario para métricas y tareas completadas.
- **Ámbar (`#FFBF47`):** indicador para tareas pendientes, advertencias de terminal y cierre de sesión.
- **Rojo peligro (`#FF4D5A`):** reservado para alertas de sistema (`[!] ERROR`) y botones de purga/eliminación.
- **Texto secundario (`#7CA38B`):** verde grisáceo atenuado que garantiza alto contraste y descanso visual en textos largos.

### Tipografía y ambientación CRT
- **Fuentes monoespaciadas:** integración de `IBM Plex Mono` y `Share Tech Mono` (Google Fonts), asegurando alineación visual técnica y excelente legibilidad.
- **Scanlines CRT sutiles:** textura de líneas horizontales mediante CSS puro (`repeating-linear-gradient`), diseñada para no interferir con la nitidez de los textos.
- **Viñeta de pantalla curva:** sombreado en los extremos de la pantalla que recrea la sensación del cristal de un monitor analógico.
- **Detalles de hardware:** indicadores luminosos con animación de pulso, cabeceras técnicas (`SYSTEM ONLINE`, `AUTH-NODE // 80S`, `OPERATOR: email`) y esquinas con corchetes en los paneles.

### Experiencia de usuario y microinteracciones
- **Botones arcade:** controles con acabado técnico, microdesplazamiento al hacer clic y resplandor al pasar el cursor.
- **Formularios con foco fosforescente:** inputs que intensifican su contorno al recibir foco con teclado o mouse.
- **Accesibilidad universal:** preservación de atributos semánticos, contraste de colores y reglas `@media (prefers-reduced-motion: reduce)` para desactivar transiciones a solicitud del usuario.

## Tecnologías

- **Frontend:** React, TypeScript y Vite.
- **Estilos:** CSS Vanilla modularizado con variables (tokens de diseño), animaciones ligeras y efectos visuales retro.
- **Tipografía:** Google Fonts (`IBM Plex Mono` y `Share Tech Mono`).
- **Navegación:** React Router.
- **Autenticación:** Firebase Authentication.
- **Base de datos:** Cloud Firestore.
- **Servicio de email:** Resend.
- **Backend serverless:** Vercel Functions.
- **Testing:** Vitest y React Testing Library.
- **Control de versiones:** Git y GitHub.

## Arquitectura

La aplicación separa la interfaz, la lógica de negocio y los servicios externos para facilitar el mantenimiento y la organización del código.

- `src/`: aplicación frontend.
- `src/pages/`: páginas principales.
- `src/features/`: funcionalidades organizadas por área.
- `src/hooks/`: lógica reutilizable.
- `src/services/`: servicios de Firebase y otras integraciones.
- `api/`: funciones serverless.
- `tests/`: pruebas automatizadas.

Las tareas se almacenan en Cloud Firestore asociadas al usuario autenticado. La aplicación utiliza Firebase Authentication para gestionar el acceso y proteger las páginas privadas.

### Flujo de envío de emails

El envío de resúmenes utiliza la siguiente arquitectura:

1. El usuario solicita el envío desde la interfaz.
2. El frontend realiza una solicitud `POST` a `/api/send-email`.
3. La función serverless de Vercel procesa la solicitud y utiliza las credenciales privadas del servidor.
4. La función se comunica con Resend para enviar el correo.
5. La aplicación informa al usuario del resultado de la operación.

La API key de Resend no debe exponerse en el frontend.

## Cuenta de demostración

Se dispone de una cuenta de prueba para facilitar la evaluación de la aplicación.

- **Correo de acceso:** `ejemplotest@gmail.com`
- **Contraseña:** se comparte por separado con la persona encargada de la evaluación.

La cuenta debe utilizarse exclusivamente para probar el proyecto y sus datos ficticios. No debe contener información personal ni utilizar una contraseña reutilizada de otros servicios.

### Cómo probar la aplicación

1. Abrir la [aplicación desplegada](https://task-manager-kohl-mu-38.vercel.app).
2. Iniciar sesión con las credenciales de demostración proporcionadas.
3. Crear, editar, completar y eliminar tareas.
4. Recargar la aplicación para comprobar la persistencia de los datos.
5. Probar el envío del resumen por email siguiendo las indicaciones de la sección siguiente.

## Envío de resúmenes por email

Task Manager integra Resend mediante una función serverless desplegada en Vercel.

### Configuración del proveedor

La implementación utiliza **Resend en lugar de AWS SES**, el proveedor mencionado en la consigna original. La integración mantiene la arquitectura serverless: el frontend se comunica con la función de Vercel y esta se encarga de contactar al proveedor de email.

### Cómo probar el envío

El envío se comprobó en producción y el resumen llegó correctamente al correo autorizado de la cuenta de Resend.

**Correo autorizado para las pruebas:**

`matiasg.42003@gmail.com`

Para comprobar esta funcionalidad:

1. Iniciar sesión en Task Manager.
2. Acceder a la sección de tareas.
3. Utilizar la opción para enviar el resumen.
4. Verificar que la aplicación muestre el mensaje de éxito.
5. Comprobar la recepción del correo en el destinatario autorizado.

### Limitación del entorno de prueba

La cuenta de Resend utilizada actualmente tiene restricciones de envío. En esta configuración, solo permite enviar emails al destinatario autorizado indicado anteriormente.

Para habilitar envíos a otros destinatarios, es necesario verificar un dominio propio en Resend y configurar una dirección remitente asociada a ese dominio.

Por este motivo, el funcionamiento del envío se ha validado con el destinatario autorizado, pero no se afirma que el envío a cualquier dirección esté habilitado.

## Instalación local

### Requisitos previos

- Node.js y npm.
- Un proyecto de Firebase configurado.
- Firebase Authentication habilitado.
- Cloud Firestore habilitado.
- Una cuenta de Resend si se desea probar el envío de emails.

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

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

Variables utilizadas:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

RESEND_API_KEY=
FIREBASE_SERVICE_ACCOUNT_JSON=
```

Las variables `VITE_FIREBASE_*` se utilizan para configurar Firebase en el frontend. `RESEND_API_KEY` y `FIREBASE_SERVICE_ACCOUNT_JSON` son variables del servidor y no deben exponerse al navegador.

Los valores deben completarse con las credenciales correspondientes a cada servicio. No se deben publicar claves reales en el repositorio.

### 4. Iniciar el entorno de desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación en el navegador.

Para probar las funciones serverless localmente, utilizar el entorno de desarrollo de Vercel y configurar las variables de entorno necesarias.

## Pruebas automatizadas

Ejecutar la suite de pruebas:

```bash
npm test
```

Ejecutar las pruebas en modo interactivo:

```bash
npm run test:watch
```

## Compilación de producción

Generar la versión optimizada:

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist`.

Para ejecutar el análisis estático:

```bash
npm run lint
```

## Despliegue en Vercel

La aplicación está desplegada en Vercel y utiliza Vite para generar los archivos de producción.

Para configurar un despliegue propio:

1. Importar el repositorio de GitHub en Vercel.
2. Configurar las variables de entorno requeridas.
3. Verificar la configuración de Firebase Authentication y Cloud Firestore.
4. Configurar las variables privadas necesarias para la función serverless.
5. Realizar el despliegue y comprobar las funcionalidades principales.

La configuración de rutas debe permitir el acceso y la recarga directa de las páginas de la SPA.

## Seguridad

- Las claves privadas se mantienen en variables de entorno del servidor.
- La API key de Resend no debe incluirse en el código del frontend.
- El archivo `.env` debe permanecer excluido del control de versiones.
- `.env.example` contiene únicamente los nombres de las variables, sin credenciales reales.
- Las reglas de Firestore deben restringir el acceso a los datos de cada usuario autenticado.
- Las funciones serverless deben validar las solicitudes y gestionar los errores.
- Las credenciales de demostración no deben ser credenciales personales ni reutilizadas.

## Uso de inteligencia artificial

Durante el desarrollo se utilizaron herramientas de inteligencia artificial como apoyo para el aprendizaje, la programación y la resolución de problemas.

Se utilizaron para:

- Analizar requisitos y organizar las etapas de desarrollo.
- Comprender componentes de React, TypeScript, hooks y servicios de Firebase.
- Investigar errores de ejecución y problemas de integración.
- Diseñar y comprender pruebas automatizadas.
- Revisar la arquitectura y documentar las decisiones técnicas.

Las sugerencias se revisaron y contrastaron mediante pruebas y comprobaciones del funcionamiento de la aplicación. La IA se utilizó como herramienta de asistencia al aprendizaje y no como sustituto de la validación técnica.

## Autor

Proyecto de práctica de desarrollo Full Stack, con foco en React, TypeScript, autenticación, persistencia de datos, integración de servicios externos, testing y despliegue.
