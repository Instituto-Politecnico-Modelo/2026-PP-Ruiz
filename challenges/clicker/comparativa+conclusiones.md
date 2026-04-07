# Comparativa: ClickGame Sonnet vs Opus

## Diseño visual

La diferencia más inmediata entre ambas implementaciones es estética. Sonnet apuesta por una identidad visual fuerte: tipografía arcade (*Black Ops One* + *Rajdhani* desde Google Fonts), paleta neón verde sobre negro profundo, una cuadrícula ambiental de fondo y múltiples animaciones — `popIn`, `pulseGlow` y un efecto ripple en el botón al hacer click. Opus, en cambio, opta por una dark UI funcional y contenida, usando `system-ui` como fuente, colores azul y verde sobre un fondo `#0f172a`, y una única animación `pulse` para la cuenta regresiva. Ninguno de los dos es incorrecto; simplemente priorizan cosas distintas: Sonnet quiere impresionar, Opus quiere no distraer.

## Precisión del timer

Aquí Opus tiene una ventaja técnica clara. Para el temporizador del juego, ancla el conteo a `Date.now()` y ejecuta el intervalo cada 100 ms, lo que significa que el tiempo mostrado refleja el tiempo real transcurrido con alta fidelidad. Sonnet, en cambio, usa `setInterval` de 1000 ms tanto para la cuenta regresiva como para el timer del juego, lo que puede acumular pequeños desfases con el paso del tiempo. Para un juego de 5 segundos la diferencia es imperceptible, pero la solución de Opus es más robusta ante el throttling del navegador o tabs en segundo plano.

## Feedback al usuario

Sonnet es considerablemente más expresivo en este aspecto. La barra de progreso cambia de color (verde → amarillo → rojo) a medida que el tiempo se agota, el botón de inicio muta su texto entre `INICIO`, `EN CURSO...` y `JUGAR DE NUEVO` según la fase, y al terminar el juego aparece una estrella dorada junto al texto `¡NUEVO RÉCORD!` si se superó el máximo. Opus maneja todo esto con texto simple: un mensaje inline que dice `"¡Nuevo récord! X clicks"` y el botón de inicio siempre dice `Iniciar`. Más sobrio, pero también menos memorable.

## Arquitectura y estructura

En cuanto al código, Sonnet concentra todo en un único archivo `.jsx` con estilos definidos como un objeto JS inline. Esto lo hace completamente autocontenido pero más difícil de mantener a escala. Opus separa responsabilidades de forma más convencional: `App.jsx` para la lógica, `App.css` para los estilos del componente, `index.css` para variables globales CSS y el resto de archivos de configuración de Vite. Las variables de tema están centralizadas en `:root` (`--accent`, `--success`, etc.), lo que facilita cambiar la paleta sin tocar el componente. Además, Opus entrega un proyecto ejecutable listo para `npm install && npm run dev`, mientras que Sonnet es un componente standalone que necesita integrarse en un proyecto existente.

## Conclusión

Si tuviese que elegir una base para un proyecto real, tomaría la la estructura de Opus como punto de partida, y le agregaría el visual de Sonnet como la barra de progreso, las animaciones y los estados del botón hacen que el juego se sienta más vivo sin complejidad técnica adicional. Ademas Sonnet tiene una ventaja al mostrar una preview del proyecto armado antes de siquiera descargar los archivos, mientras que con opus tuve que descargar y recien ahi probar.