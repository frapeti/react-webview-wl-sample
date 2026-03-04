import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Reemplaza con la URL de tu white label (ej. https://tu-wl.ejemplo.com)
const WEBVIEW_URL = 'https://wl-pilar-prod.web.app';

const VIEWPORT_META =
  'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';

// Injected before content: viewport, fit-to-screen CSS, then geolocation bridge
const createInjectedScript = () => `
(function() {
  function setViewport() {
    var head = document.head || document.documentElement;
    if (!head) return;
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      head.insertBefore(meta, head.firstChild);
    }
    meta.setAttribute('content', '${VIEWPORT_META}');
  }
  function injectFitStyles() {
    var head = document.head || document.documentElement;
    if (!head || document.getElementById('_rnw-fit-screen')) return;
    var style = document.createElement('style');
    style.id = '_rnw-fit-screen';
    style.textContent = 'html, body, #root { width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; box-sizing: border-box !important; } * { box-sizing: border-box !important; } body { margin: 0 !important; padding: 0 !important; } #root > * { max-width: 100% !important; } img, video, iframe, embed, object { max-width: 100% !important; height: auto !important; } table { max-width: 100% !important; table-layout: fixed !important; } .tripContainer { max-width: 100% !important; }';
    head.appendChild(style);
  }
  function init() {
    setViewport();
    injectFitStyles();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  setViewport();
})();
(function() {
  if (!window.navigator || !window.navigator.geolocation) return;
  window.__geoCallbacks = window.__geoCallbacks || {};
  var getCurrentPosition = window.navigator.geolocation.getCurrentPosition.bind(window.navigator.geolocation);
  var watchPosition = window.navigator.geolocation.watchPosition.bind(window.navigator.geolocation);

  function postGeoRequest(type, id, options) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: type,
      id: id,
      options: options || {}
    }));
  }

  window.navigator.geolocation.getCurrentPosition = function(success, error, options) {
    var id = 'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    window.__geoCallbacks[id] = { success: success, error: error || function() {} };
    postGeoRequest('getCurrentPosition', id, options);
  };

  window.navigator.geolocation.watchPosition = function(success, error, options) {
    var id = 'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    window.__geoCallbacks[id] = { success: success, error: error || function() {}, watch: true };
    postGeoRequest('watchPosition', id, options);
    return id;
  };

  window.navigator.geolocation.clearWatch = function(watchId) {
    if (window.__geoClearWatch) window.__geoClearWatch(watchId);
  };
  window.__geoClearWatch = function(watchId) {
    if (window.__geoCallbacks[watchId]) delete window.__geoCallbacks[watchId];
  };
})();
true;
`;

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timeout de seguridad: si la página no dispara onLoadEnd en X segundos, ocultamos el loading
  const LOAD_TIMEOUT_MS = 15000;

  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, []);

  const startLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      loadTimeoutRef.current = null;
      setLoading(false);
    }, LOAD_TIMEOUT_MS);
  }, []);

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === 'granted');
      return status === 'granted';
    } catch {
      setLocationGranted(false);
      return false;
    }
  }, []);

  const ensureLocationPermission = useCallback(async () => {
    if (locationGranted === true) {
      return true;
    }
    const granted = await requestLocationPermission();
    return granted;
  }, [locationGranted, requestLocationPermission]);

  const getCurrentPosition = useCallback(async (): Promise<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  } | null> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        altitude: location.coords.altitude ?? null,
        altitudeAccuracy: location.coords.altitudeAccuracy ?? null,
        heading: location.coords.heading ?? null,
        speed: location.coords.speed ?? null,
      };
    } catch {
      return null;
    }
  }, []);

  const injectGeoSuccess = useCallback(
    (id: string, coords: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      altitude?: number | null;
      altitudeAccuracy?: number | null;
      heading?: number | null;
      speed?: number | null;
    }) => {
      const position = {
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy ?? 0,
          altitude: coords.altitude ?? 0,
          altitudeAccuracy: coords.altitudeAccuracy ?? 0,
          heading: coords.heading ?? 0,
          speed: coords.speed ?? 0,
        },
        timestamp: Date.now(),
      };
      const script = `
        (function() {
          var c = window.__geoCallbacks && window.__geoCallbacks['${id.replace(/'/g, "\\'")}'];
          if (c && c.success) {
            c.success(${JSON.stringify(position)});
          }
          if (window.__geoCallbacks && window.__geoCallbacks['${id.replace(/'/g, "\\'")}']) {
            delete window.__geoCallbacks['${id.replace(/'/g, "\\'")}'];
          }
        })();
        true;
      `;
      webViewRef.current?.injectJavaScript(script);
    },
    []
  );

  const injectGeoError = useCallback((id: string, code: number, message: string) => {
    const escapedId = id.replace(/'/g, "\\'");
    const escapedMessage = message.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const script = `
      (function() {
        var c = window.__geoCallbacks && window.__geoCallbacks['${escapedId}'];
        if (c && c.error) {
          c.error({ code: ${code}, message: '${escapedMessage}' });
        }
        if (window.__geoCallbacks && window.__geoCallbacks['${escapedId}']) {
          delete window.__geoCallbacks['${escapedId}'];
        }
      })();
      true;
    `;
    webViewRef.current?.injectJavaScript(script);
  }, []);

  const onMessage = useCallback(
    async (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'getCurrentPosition' || data.type === 'watchPosition') {
          const id = data.id;
          const hasPermission = await ensureLocationPermission();
          if (!hasPermission) {
            injectGeoError(
              id,
              1,
              'Permiso de ubicación denegado'
            );
            return;
          }
          const coords = await getCurrentPosition();
          if (coords) {
            injectGeoSuccess(id, coords);
            if (data.type === 'watchPosition') {
              const watchId = setInterval(async () => {
                const c = await getCurrentPosition();
                if (c) injectGeoSuccess(id, c);
              }, 1000);
              setTimeout(() => clearInterval(watchId), 30000);
            }
          } else {
            injectGeoError(
              id,
              1,
              'Posición no disponible'
            );
          }
        }
      } catch (_) {
        // ignore parse errors
      }
    },
    [ensureLocationPermission, getCurrentPosition, injectGeoSuccess, injectGeoError]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="auto" />
        {locationGranted === false && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Ubicación no disponible. Algunas funciones del sitio pueden no funcionar.
          </Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: WEBVIEW_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoadStart={() => {
          setLoading(true);
          startLoadTimeout();
        }}
        onLoadEnd={() => {
          clearLoadTimeout();
          setLoading(false);
        }}
        onError={() => {
          clearLoadTimeout();
          setLoading(false);
        }}
        onHttpError={() => {
          clearLoadTimeout();
          setLoading(false);
        }}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={createInjectedScript()}
        originWhitelist={['*']}
        allowFileAccess={false}
        mixedContentMode="compatibility"
        geolocationEnabled={Platform.OS === 'android'}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}
      />
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Cargando sitio...</Text>
        </View>
      )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  banner: {
    backgroundColor: '#fff3cd',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bannerText: {
    color: '#856404',
    fontSize: 13,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
});
