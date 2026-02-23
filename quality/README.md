# Sistema de Monitoreo de Calidad - Webapp

## 📋 Descripción

Webapp moderna y minimalista para análisis y visualización de datos de monitoreo de calidad. Diseñada con una arquitectura modular que permite agregar nuevas páginas de análisis fácilmente.

## 🗂️ Estructura del Proyecto

```
proyecto/
├── index.html              # Página principal con navegación y filtros
├── styles.css              # Estilos compartidos (moderno y minimalista)
├── app.js                  # Lógica compartida (carga de datos, filtros)
├── calidad.json            # Archivo de datos
├── page-dashboard.html     # Subpágina 1: Dashboard con KPIs y gráficos
├── page-agentes.html       # Subpágina 2: Análisis por agente
├── page-tendencias.html    # Subpágina 3: Tendencias temporales
└── README.md               # Este archivo
```

## 🚀 Cómo Usar

### Instalación Local

1. Coloca todos los archivos en el mismo directorio
2. Abre `index.html` en un navegador moderno
3. ¡Listo! La aplicación se carga automáticamente

**Nota:** Debido a las restricciones de CORS, necesitas servir los archivos desde un servidor web local. Opciones:

```bash
# Opción 1: Python 3
python -m http.server 8000

# Opción 2: Node.js (http-server)
npx http-server

# Opción 3: PHP
php -S localhost:8000
```

Luego visita: `http://localhost:8000`

## 🎨 Características Principales

### Sistema de Navegación
- **Tabs horizontales** modernos en la parte superior
- **Página de bienvenida** con estadísticas generales
- **3 subpáginas especializadas** (Dashboard, Agentes, Tendencias)

### Sistema de Filtros
- **Colapsable** mediante botón "Filtros"
- **10 filtros disponibles** que gobiernan todas las subpáginas:
  - ID Interacción
  - Fecha de Interacción
  - Tipo de Monitoreo
  - Canal
  - Skill
  - Sub-Skill
  - Fecha de Monitoreo
  - Agente
  - Supervisor
  - Analista
- **Aplicación con botón** (no en tiempo real)
- **Botón limpiar filtros** para resetear

### Visualizaciones
- **KPIs en tarjetas** con gradientes de color
- **Gráficos interactivos** (Chart.js)
- **Tablas responsivas** con búsqueda
- **Tarjetas de resumen** con métricas destacadas

## 📝 Cómo Agregar una Nueva Subpágina

### Paso 1: Crear el Archivo HTML

Crea un nuevo archivo siguiendo el patrón: `page-[nombre].html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Nueva Página</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Agregar librerías adicionales si es necesario -->
</head>
<body style="background: transparent; padding: 0;">
    <div style="padding: 0;">
        <h2 style="margin-bottom: 32px; font-family: var(--font-display); font-size: 32px; font-weight: 700; background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-electric) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.5px;">Título de Mi Página</h2>
        
        <!-- Tu contenido aquí -->
        <div id="contenido">
            <div class="loading">Cargando datos...</div>
        </div>
    </div>

    <script>
        // Escuchar datos filtrados del padre
        window.addEventListener('message', (event) => {
            if (event.data.type === 'FILTERED_DATA') {
                cargarMiPagina(event.data.data);
            }
        });
        
        // Cargar datos si están disponibles
        if (window.parent.filteredData || window.parent.rawData) {
            cargarMiPagina(window.parent.filteredData || window.parent.rawData);
        }
        
        function cargarMiPagina(data) {
            if (!data || !data.base_excel) return;
            
            // Tu lógica aquí
            console.log('Datos recibidos:', data.base_excel.length);
            
            // Actualizar el contenido
            document.getElementById('contenido').innerHTML = `
                <p>Total de registros: ${data.base_excel.length}</p>
            `;
        }
    </script>
</body>
</html>
```

### Paso 2: Agregar el Tab en index.html

En el archivo `index.html`, busca la sección `<nav class="tabs">` y agrega:

```html
<button class="tab" data-page="nombre">Mi Nueva Página</button>
```

### Paso 3: ¡Listo!

El sistema automáticamente:
- ✅ Cargará tu página cuando se haga click en el tab
- ✅ Pasará los datos filtrados a tu página
- ✅ Aplicará los estilos compartidos

## 🎨 Usar los Estilos Compartidos

Todas las subpáginas tienen acceso a las clases CSS definidas en `styles.css`:

### Tarjetas (Cards)
```html
<div class="cards-grid">
    <div class="card">
        <div class="card-title">Título</div>
        <div class="card-content">Contenido</div>
    </div>
</div>
```

### KPIs
```html
<div class="kpi-grid">
    <div class="kpi-card">
        <div class="kpi-label">Etiqueta</div>
        <div class="kpi-value">100</div>
        <div class="kpi-change">Cambio +5%</div>
    </div>
</div>
```

### Tablas
```html
<table class="data-table">
    <thead>
        <tr>
            <th>Columna 1</th>
            <th>Columna 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
        </tr>
    </tbody>
</table>
```

### Badges
```html
<span class="badge badge-success">Éxito</span>
<span class="badge badge-warning">Advertencia</span>
<span class="badge badge-error">Error</span>
```

### Contenedores de Gráficos
```html
<div class="chart-container">
    <div class="chart-title">Mi Gráfico</div>
    <canvas id="miGrafico"></canvas>
</div>
```

## 🔧 Acceder a los Datos en Subpáginas

### Estructura de Datos

```javascript
{
    "base_excel": [
        {
            "ID_INTERACCIÓN": "33708908",
            "FECHA DE INTERACCIÓN": "12/1/25",
            "TIPO DE MONITOREO": "ALTO VALOR",
            "DATA_CANAL": "VOZ",
            "DATA_SKILL": "CARE",
            "DATA_SUB_SKILL": "ADMIN",
            "AGENTE": "NOMBRE APELLIDO",
            "SUPERVISOR": "NOMBRE SUPERVISOR",
            "QA SCORE": "80",
            "CUARTIL": "Q2",
            // ... más campos
        },
        // ... más registros
    ],
    "atributos_evaluacion": [
        // ... metadatos de evaluación
    ]
}
```

### Funciones Útiles Disponibles

Las subpáginas tienen acceso a funciones útiles desde `app.js`:

```javascript
// Obtener datos filtrados actuales
const data = window.parent.filteredData || window.parent.rawData;

// Funciones de utilidad (disponibles desde el padre)
// window.parent.groupBy(data, 'AGENTE')
// window.parent.countBy(data, 'CUARTIL')
// window.parent.calculateStats(data)
// window.parent.parseDate('12/1/25')
```

### Ejemplo de Procesamiento

```javascript
function procesarDatos(data) {
    const records = data.base_excel;
    
    // Agrupar por agente
    const porAgente = {};
    records.forEach(r => {
        const agente = r.AGENTE;
        if (!porAgente[agente]) {
            porAgente[agente] = [];
        }
        porAgente[agente].push(r);
    });
    
    // Calcular promedios
    Object.keys(porAgente).forEach(agente => {
        const interacciones = porAgente[agente];
        const promedio = interacciones.reduce((sum, i) => {
            return sum + (parseFloat(i['QA SCORE']) || 0);
        }, 0) / interacciones.length;
        
        console.log(`${agente}: ${promedio.toFixed(1)}%`);
    });
}
```

## 📊 Crear Gráficos con Chart.js

Todas las subpáginas pueden usar Chart.js (ya incluido):

```javascript
const ctx = document.getElementById('miGrafico');
const chart = new Chart(ctx, {
    type: 'bar', // 'line', 'pie', 'doughnut', 'radar', etc.
    data: {
        labels: ['Ene', 'Feb', 'Mar'],
        datasets: [{
            label: 'Mi Dataset',
            data: [12, 19, 3],
            backgroundColor: '#1b98e0',
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true
    }
});
```

## 🎨 Variables CSS Disponibles

```css
--primary-color: #1b98e0
--primary-hover: #2563eb
--secondary-color: #64748b
--background: #f8fafc
--surface: #ffffff
--border: #e2e8f0
--text-primary: #1e293b
--text-secondary: #64748b
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--radius: 8px
```

## 📱 Responsive Design

Todos los estilos son responsive por defecto. La webapp se adapta automáticamente a:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Escritorio (> 1024px)

## 🔄 Cómo Funcionan los Filtros

1. Usuario selecciona filtros en el panel colapsable
2. Hace click en "Aplicar Filtros"
3. `app.js` procesa los filtros y actualiza `window.filteredData`
4. La página activa se recarga con los nuevos datos filtrados
5. Los datos filtrados se pasan automáticamente a la subpágina via `postMessage`

## ⚙️ Personalización de Estilos

Para modificar el esquema de colores, edita las variables en `styles.css`:

```css
:root {
    --primary-color: #1b98e0;  /* Cambia a tu color principal */
    --background: #f8fafc;      /* Cambia el color de fondo */
    /* ... otras variables ... */
}
```

## 📦 Dependencias

- **Chart.js** (CDN): Para gráficos interactivos
- Sin otras dependencias externas
- Vanilla JavaScript puro
- CSS nativo (sin frameworks)

## 🐛 Solución de Problemas

### Los datos no se cargan
- Verifica que `calidad.json` esté en el mismo directorio
- Asegúrate de estar usando un servidor web local
- Revisa la consola del navegador para errores

### Los filtros no funcionan
- Verifica que los campos en el JSON coincidan con los filtros
- Asegúrate de hacer click en "Aplicar Filtros"

### Los gráficos no se muestran
- Verifica que Chart.js se cargue correctamente
- Revisa que el canvas tenga un ID único
- Asegúrate de destruir gráficos anteriores antes de crear nuevos

## 📄 Licencia

Este proyecto es de código abierto y puede ser usado y modificado libremente.

## 🤝 Contribuciones

¡Las mejoras son bienvenidas! Puedes agregar:
- Nuevas visualizaciones
- Más tipos de filtros
- Exportación de datos (Excel, PDF)
- Temas de color adicionales

---

**Creado con ❤️ para análisis de calidad eficiente**