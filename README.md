# Simulador de Credito Hipotecario 🇨🇱

Calculadora de crédito hipotecario para Chile.

## Características

- Cálculo estimado del dividendo mensual en CLP y UF.
- Consulta del valor actual de la UF mediante la API pública de [mindicador.cl](https://mindicador.cl) (solo HTTPS).
- Interfaz simple, sin registro y sin almacenamiento de datos.

## Aviso de seguridad

- Este sitio **no está afiliado** a ningún banco ni institución financiera.
- **No se solicita ni guarda información personal**. Todos los cálculos se ejecutan localmente en el navegador del usuario.
- Única petición de red externa: `https://mindicador.cl/api` para obtener el valor de la UF.
- Los resultados son estimaciones con fines educativos; no constituyen una oferta de crédito.

## Tecnologías

- HTML5, CSS3 y JavaScript vanilla.
- Sin frameworks ni dependencias externas.
- Sin backend ni base de datos.