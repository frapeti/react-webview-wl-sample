# Guía de integración – White Label Ualabee en React Native

Esta guía sirve tanto si usas **este proyecto como app lista** (solo cambias la URL y personalizas) como si quieres **llevar la integración a tu propia app React Native** (nueva o existente). Describe cómo configurar la URL de tu white label Ualabee, los permisos y el build para Android e iOS. El código de este repo es la referencia: podés copiar o adaptar la lógica del WebView y del bridge de geolocalización desde `App.tsx` a tu app.

## Paso 1 – URL de tu white label Ualabee

En `App.tsx`, al inicio del archivo, está la constante:

```ts
const WEBVIEW_URL = 'https://wl-pilar-prod.firebaseapp.com';
```

**Reemplaza** ese valor por la URL de tu white label Ualabee. Debe ser HTTPS en producción (o la URL de staging si estás probando). Ejemplo:

```ts
const WEBVIEW_URL = 'https://tu-white-label-ualabee.ejemplo.com';
```

No hace falta tocar nada más en el código: el WebView usa esta constante como `source={{ uri: WEBVIEW_URL }}`.

## Paso 2 – Identidad de la app

En `app.json`, dentro de `expo`:

- **`name`**: Nombre que verá el usuario (p. ej. en la pantalla de inicio).
- **`slug`**: Identificador usado por Expo en URLs y builds; conviene que sea único (p. ej. `mi-empresa-app`).

Si vas a publicar en las tiendas con un bundle/package propio, añade o edita:

- **`expo.ios.bundleIdentifier`**: Identificador único de la app en iOS (p. ej. `com.tuempresa.appnombre`).
- **`expo.android.package`**: Nombre del paquete en Android (p. ej. `com.tuempresa.appnombre`).

Opcional: cambia las rutas de `icon`, `splash.image` y los iconos adaptativos de Android para usar los assets de tu marca.

## Paso 3 – Permisos de ubicación

Los permisos ya están declarados:

- **iOS**: `expo.ios.infoPlist.NSLocationWhenInUseUsageDescription` con el mensaje que se muestra al pedir ubicación. Puedes editarlo para que refleje el uso en tu app (p. ej. “Para mostrarte contenido cercano”).
- **Android**: `expo.android.permissions` incluye `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION`.

No hace falta añadir más configuración para que la app pida ubicación; el código ya solicita el permiso al iniciar y lo usa cuando el white label llama a `navigator.geolocation`.

## Paso 4 – Geolocalización en el white label

Tu white label Ualabee debe usar la **API estándar del navegador** `navigator.geolocation` (`getCurrentPosition`, `watchPosition`). La app:

1. Inyecta un script que intercepta esas llamadas.
2. Pide la ubicación al sistema (con los permisos ya configurados).
3. Devuelve la posición al white label mediante un bridge, de forma transparente.

Si tu white label ya usa `navigator.geolocation`, no necesitas cambiar nada en el sitio. Si usara otra API o postMessage propio, habría que adaptar el script inyectado en `App.tsx` para hacer el puente con esa API.

## Paso 5 – Safe area

La app usa `SafeAreaProvider` y `SafeAreaView` (React Native Safe Area Context) para que el contenido del WebView no quede bajo la barra de estado ni bajo la barra de navegación del sistema. No hace falta configuración adicional; el área visible del WebView ya respeta las zonas seguras en dispositivos con notch o gestos.

## Paso 6 – Build para producción

1. Instala EAS CLI y entra con tu cuenta de Expo:  
   `npm install -g eas-cli` y `eas login`.

2. En la raíz del proyecto:  
   `eas build:configure`  
   (genera o actualiza `eas.json` si hace falta).

3. Builds:
   - **Android (APK para pruebas)**:  
     `eas build --platform android --profile preview`  
     El perfil `preview` en `eas.json` genera un APK; para Google Play suele usarse `production` y formato AAB.
   - **iOS**:  
     `eas build --platform ios --profile preview`  
     Necesitas cuenta de Apple Developer. La primera vez, EAS puede pedir configurar credenciales con `eas credentials`.

4. Descarga los artefactos desde el panel de Expo o el enlace que devuelve el comando y distribúyelos (TestFlight, Google Play, instalación directa del APK, etc.).

## Resumen de archivos a tocar

| Objetivo                    | Archivo   | Qué cambiar                                                                 |
|----------------------------|-----------|-----------------------------------------------------------------------------|
| URL del white label Ualabee| `App.tsx` | Constante `WEBVIEW_URL`                                                     |
| Nombre e identidad         | `app.json`| `name`, `slug`; opcional: `ios.bundleIdentifier`, `android.package`, iconos |
| Mensaje de ubicación       | `app.json`| `expo.ios.infoPlist.NSLocationWhenInUseUsageDescription`                    |

El resto (permisos Android, bridge de geolocalización, safe area, EAS) está listo para usar tal cual.

---

## Integrar en tu app React Native (nueva o existente)

Si ya tenés una app React Native o vas a crear una desde cero, podés usar este repo como **referencia de código**:

- **`App.tsx`** – Contiene la pantalla con el WebView, la petición de permisos de ubicación y el script inyectado que hace de bridge entre `navigator.geolocation` (en el sitio) y `expo-location` (en la app). Podés copiar o adaptar ese componente (y la lógica del bridge) a tu app.
- **`app.json`** – Ejemplo de configuración de permisos de ubicación para iOS y Android; replicá lo que necesites en tu proyecto.

Con eso tenés todo lo necesario para embeber tu white label Ualabee en cualquier app React Native.
