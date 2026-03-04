# Embeber tu White Label Ualabee en una app React Native

Este repositorio cumple dos fines:

1. **Demostración** – Una app de ejemplo que puedes ejecutar para ver cómo tu **white label de Ualabee** funciona embebida en una aplicación móvil (React Native con Expo), con WebView y geolocalización.
2. **Referencia de código** – Sirve como guía para que, en tu propia app React Native (nueva o ya existente), sepas cómo embeber el white label: qué componentes usar, cómo configurar permisos y cómo hacer que la geolocalización esté disponible dentro del WebView.

Puedes usar este proyecto tal cual cambiando la URL de tu white label, o tomar solo las partes que necesites (por ejemplo el manejo del WebView y el bridge de geolocalización en `App.tsx`) e integrarlas en tu app.

## Requisitos

- Node.js 18+
- npm o yarn
- [Expo Go](https://expo.dev/go) en el dispositivo (desarrollo) o EAS CLI para builds
- Para iOS: Xcode y simulador o dispositivo físico (macOS)
- Para Android: Android Studio y emulador o dispositivo con depuración USB

## Instalación y ejecución

```bash
npm install
npm start
```

Luego:

- Escanea el código QR con Expo Go (Android) o con la cámara (iOS), o
- En la terminal: `a` para Android, `i` para iOS (con emulador/simulador abierto)

O directamente:

```bash
npm run android
# o
npm run ios
```

Al abrir la app se pedirán permisos de ubicación. Si los aceptas, el white label embebido podrá usar la geolocalización (mapas, servicios cercanos, etc.).

## Configurar tu white label Ualabee

1. **URL del sitio**  
   En `App.tsx`, edita la constante `WEBVIEW_URL` y pon la URL de tu white label Ualabee. Es la única modificación obligatoria para que la app cargue tu entorno.

2. **Nombre e icono de la app (opcional)**  
   En `app.json` puedes cambiar `name`, `slug` y las rutas de `icon` y `splash` para que la app tenga la identidad de tu marca.

3. **Permisos de ubicación**  
   Ya están configurados para iOS y Android. Si quieres cambiar el texto que ve el usuario al pedir ubicación, edita `expo.ios.infoPlist.NSLocationWhenInUseUsageDescription` en `app.json`.

Guía paso a paso: [Guía de integración](docs/INTEGRATION.md).

## Build para producción

Se usa [EAS Build](https://docs.expo.dev/build/introduction/) de Expo.

### Configurar EAS (primera vez)

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Generar builds

**Android (APK para pruebas):**

```bash
eas build --platform android --profile preview
```

Para Google Play suele usarse el perfil `production` y formato AAB (configurable en `eas.json`).

**iOS:**

```bash
eas build --platform ios --profile preview
```

Requiere cuenta de Apple Developer. El primer build puede pedir configurar credenciales con `eas credentials`.

## Estructura del proyecto

- `App.tsx` – Pantalla principal: WebView, petición de permisos de ubicación y bridge de geolocalización hacia el white label.
- `app.json` – Nombre, slug, icono, splash y permisos (ubicación en iOS y Android).
- `eas.json` – Perfiles de build (development, preview, production).

La geolocalización del white label se resuelve con la ubicación del dispositivo: la app reemplaza `navigator.geolocation` en la página y responde con la posición obtenida vía `expo-location`. Si tu white label Ualabee ya usa la API estándar del navegador, no hace falta cambiar nada en el sitio.

## Documentación

- [Guía de integración](docs/INTEGRATION.md) – Pasos para configurar la URL de tu white label, identidad de la app, permisos y build. Incluye qué partes del código reutilizar si integrás el white label en una app React Native propia (nueva o existente).
