# Naki Wallet

Naki Wallet es una aplicación móvil para gestionar criptomonedas USDC en la red Base Testnet, desarrollada con React Native, Expo y tecnologías Web3.

![Naki Wallet Banner](https://via.placeholder.com/800x200/8134AF/FFFFFF?text=Naki+Wallet)

## Características Principales

- 💰 **Gestión de USDC**: Visualiza tu balance de USDC en Base Testnet
- 📱 **Autenticación Sencilla**: Acceso con correo electrónico mediante Privy
- 💲 **Compra de USDC**: Integración con MoonPay para adquirir USDC
- 🔄 **Transacciones**: Envía y recibe USDC de manera sencilla
- 📊 **Historial**: Visualiza todas tus transacciones conectado a la blockchain
- 📂 **Wallet Embebida**: Wallet no-custodial generada automáticamente

## Requisitos Previos

- Node.js (v18.x o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Cuenta de Privy para autenticación
- Cuenta de MoonPay para pagos (opcional para desarrollo)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nakiWallet.git
   cd nakiWallet
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

4. Configura las variables de entorno en el archivo `.env`:
   - Obtén un ID de aplicación de Privy y actualiza `EXPO_PUBLIC_PRIVY_APP_ID`
   - Si deseas utilizar MoonPay, actualiza las credenciales de MoonPay
   - Los valores de conexión a Base Testnet ya están configurados

## Conexión a Base Testnet

La aplicación está configurada para conectarse a Base Testnet (Sepolia). Las variables importantes para esta conexión son:

- `EXPO_PUBLIC_BLOCKCHAIN_RPC_URL`: URL del RPC de Base Testnet
- `EXPO_PUBLIC_CHAIN_ID`: ID de la cadena de Base Testnet (84532)
- `EXPO_PUBLIC_USDC_CONTRACT_ADDRESS`: Contrato de USDC en Base Testnet

Estos valores ya están preconfigurados en el archivo `.env.example`.

## Ejecución de la Aplicación

1. Inicia la aplicación:
   ```bash
   npm start
   # o
   yarn start
   ```

2. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil, o presiona 'a' para abrir en un emulador Android o 'i' para iOS.

## Modo Simulado

La aplicación puede funcionar en dos modos:

- **Modo Conectado**: Conectado directamente a Base Testnet (requiere conexión a internet)
- **Modo Simulado**: Utilizando datos simulados para desarrollo sin conexión

El modo simulado se activará automáticamente si hay problemas de conexión con la blockchain.

## Funcionalidades Principales

### Visualización de Transacciones

La aplicación permite ver tu historial de transacciones conectándose directamente a Base Testnet. Puedes:

- Filtrar transacciones por tipo (Recibidas/Enviadas)
- Filtrar por periodo de tiempo
- Ver detalles completos de cada transacción
- Acceder al explorador de bloques para verificar cada transacción

### Envío de USDC

Para enviar USDC a otra dirección:

1. En la pantalla principal, toca "Send"
2. Ingresa la dirección del destinatario o escanea un código QR
3. Ingresa el monto a enviar
4. Confirma la transacción

### Recepción de USDC

Para recibir USDC:

1. En la pantalla principal, toca "Receive"
2. Comparte tu dirección o código QR con el remitente

### Compra de USDC

Para comprar USDC con tarjeta o transferencia bancaria:

1. En la pantalla principal, toca "Add Money"
2. Selecciona el método de pago (tarjeta, banco, etc.)
3. Sigue las instrucciones de MoonPay para completar la compra

## Estructura del Proyecto

- `/app`: Pantallas de la aplicación (usando Expo Router)
- `/components`: Componentes reutilizables
- `/hooks`: Hooks personalizados para lógica de negocio
- `/services`: Servicios de conexión a la blockchain y APIs
- `/utils`: Funciones utilitarias

## Resolución de Problemas

Si encuentras problemas de conexión con Base Testnet:

1. Verifica tu conexión a internet
2. Asegúrate de que las variables de entorno estén correctamente configuradas
3. La aplicación cambiará automáticamente al modo simulado si no puede conectarse

## Créditos

- Design UI/UX: Sasasamaes
- Blockchain Integration: Equipo Naki

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

---

Desarrollado con ❤️ por el equipo de Naki Wallet