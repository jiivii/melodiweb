# Web de Mélodi Villarroya — Psicóloga Sanitaria

Sitio estático (HTML + CSS + JS, sin frameworks ni dependencias de pago) que sustituye a la web de Wix. Totalmente responsive y pensado para alojarse gratis en **Netlify** o **GitHub Pages**.

## Estructura

```
melodi-web/
├── index.html                    Inicio
├── sobre-mi.html                 Sobre mí
├── servicios-infantil.html       Terapia infanto-juvenil
├── servicios-adultos.html        Terapia adultos
├── servicios-tercera-edad.html   Terapia tercera edad
├── tarifas.html                  Tarifas
├── contacto.html                 Contacto
├── legal.html                    Aviso legal / privacidad / cookies (PLANTILLA, hay que completarla)
├── css/styles.css                Todos los estilos
└── js/script.js                  Menú móvil, desplegable y formulario
```

## Cómo publicarla gratis

### Opción A: Netlify (más sencilla)
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `melodi-web` completa a la página.
3. En segundos tendrás una URL pública (tipo `nombre-al-azar.netlify.app`).
4. Desde el panel de Netlify puedes conectar tu propio dominio en "Domain settings".

### Opción B: GitHub Pages
1. Crea un repositorio nuevo en GitHub (por ejemplo `melodi-web`).
2. Sube todos los archivos de esta carpeta a la raíz del repositorio.
3. Ve a **Settings → Pages**, y en "Source" selecciona la rama `main` y la carpeta `/root`.
4. En un par de minutos tu web estará en `https://tu-usuario.github.io/melodi-web/`.

## El formulario de contacto

Al ser una web estática, el formulario no envía correos por sí solo (GitHub Pages y Netlify Drop no ejecutan código de servidor). Ahora mismo solo muestra un mensaje de confirmación en pantalla. Tienes dos formas sencillas y gratuitas de activarlo:

- **Netlify Forms** (si usas Netlify): añade el atributo `data-netlify="true"` a la etiqueta `<form id="contact-form">` en `index.html` y `contacto.html`, y Netlify empezará a recoger los envíos automáticamente en su panel.
- **Formspree** (funciona en cualquier hosting, incluido GitHub Pages): crea una cuenta gratuita en https://formspree.io, y cambia la etiqueta `<form id="contact-form" novalidate>` por `<form id="contact-form" action="https://formspree.io/f/TU_ID" method="POST">`. Te llegarán los mensajes directamente a tu correo.

## Antes de publicarla

- **Página `legal.html`**: contiene texto de ejemplo marcado con ⚠️. Al tratar datos de salud, conviene que un asesor o el colegio profesional revise el aviso legal y la política de privacidad antes de publicar la web.
- **Imágenes**: se ha optado por ilustraciones vectoriales propias (sin depender de fotos de stock de Wix) para que la web sea 100% tuya. Si prefieres añadir fotografías reales tuyas o de tu consulta, puedo ayudarte a integrarlas.
- **Dominio propio**: tanto Netlify como GitHub Pages permiten conectar un dominio personalizado (por ejemplo `melodivillarroya.com`) de forma gratuita una vez lo hayas comprado en un registrador de dominios.

## Personalizar colores y tipografía

Todo el sistema de diseño está centralizado en las primeras líneas de `css/styles.css`, dentro de `:root`. Cambiando esas variables (por ejemplo `--rose`, `--bg`, `--text`) se actualiza el color en toda la web de forma coherente.
