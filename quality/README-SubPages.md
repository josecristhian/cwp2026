# PROMPT PARA CREAR NUEVAS SUBPÁGINAS

Copia y pega este prompt completo en una nueva conversación de Claude para crear subpáginas adicionales:

---

## CONTEXTO DEL PROYECTO

Tengo una webapp de análisis de calidad con arquitectura modular. Necesito crear una nueva subpágina que siga exactamente los lineamientos establecidos.

**Sistema de Filtros:** La webapp tiene 11 filtros principales que se aplican a todas las subpáginas:
- ID Interacción
- Fecha de Interacción  
- Tipo de Monitoreo
- Canal (DATA_CANAL)
- Skill (DATA_SKILL)
- Sub-Skill (DATA_SUB_SKILL)
- BPO (Vendor: KN o AT)
- Fecha de Monitoreo
- Agente
- Supervisor
- Analista

Los datos que recibe cada subpágina YA vienen filtrados según la selección del usuario.

## ESTRUCTURA DEL PROYECTO

```
proyecto/
├── index.html              # Página principal (NO modificar)
├── styles.css              # Estilos compartidos (NO modificar)
├── app.js                  # Lógica compartida (NO modificar)
├── calidad.json            # Datos
└── page-[nombre].html      # Subpáginas (CREAR NUEVAS)
```

## LINEAMIENTOS OBLIGATORIOS

### 1. ESTRUCTURA HTML BASE

Toda subpágina DEBE seguir esta estructura exacta:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Nombre de la Página]</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Agregar librerías adicionales solo si es necesario -->
    <!-- Ejemplo: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> -->
</head>
<body style="background: transparent; padding: 0;">
    <div style="padding: 0;">
        <h2 style="margin-bottom: 24px; color: var(--text-primary);">[Título de la Página]</h2>
        
        <!-- CONTENIDO AQUÍ -->
        <div id="contenidoPrincipal">
            <div class="loading">Cargando datos...</div>
        </div>
    </div>

    <script>
        // PATRÓN OBLIGATORIO: Función para notificar altura al padre
        function notifyHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({
                type: 'RESIZE',
                height: height
            }, '*');
        }
        
        // PATRÓN OBLIGATORIO: Escuchar mensajes del padre
        window.addEventListener('message', (event) => {
            if (event.data.type === 'FILTERED_DATA') {
                cargarPagina(event.data.data);
            }
        });
        
        // PATRÓN OBLIGATORIO: Cargar datos si están disponibles
        if (window.parent.filteredData || window.parent.rawData) {
            cargarPagina(window.parent.filteredData || window.parent.rawData);
        }
        
        // FUNCIÓN PRINCIPAL DE CARGA
        function cargarPagina(data) {
            if (!data || !data.base_excel) return;
            
            // TU LÓGICA AQUÍ
            const records = data.base_excel;
            
            // ... procesamiento de datos ...
            
            // IMPORTANTE: Notificar altura después de renderizar
            setTimeout(notifyHeight, 100);
            setTimeout(notifyHeight, 500);
            setTimeout(notifyHeight, 1000);
        }
    </script>
</body>
</html>
```

### 2. ESTILO VISUAL OBLIGATORIO

**Paleta de Colores (Moderno y Minimalista):**
- Primary: `#3b82f6` (azul)
- Success: `#10b981` (verde)
- Warning: `#f59e0b` (naranja)
- Error: `#ef4444` (rojo)
- Fondo: `#f8fafc` (gris muy claro)
- Texto principal: `#1e293b` (gris oscuro)

**Diseño:**
- Espacios amplios (padding y margin generosos)
- Colores suaves
- Sombras sutiles
- Bordes redondeados (8px)

### 3. CLASES CSS DISPONIBLES

**Tarjetas:**
```html
<div class="cards-grid">
    <div class="card">
        <div class="card-title">Título</div>
        <div class="card-content">Contenido</div>
    </div>
</div>
```

**KPIs:**
```html
<div class="kpi-grid">
    <div class="kpi-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
        <div class="kpi-label">Etiqueta</div>
        <div class="kpi-value">100</div>
        <div class="kpi-change">Descripción</div>
    </div>
</div>
```

**Tablas:**
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

**Badges:**
```html
<span class="badge badge-success">Éxito</span>
<span class="badge badge-warning">Advertencia</span>
<span class="badge badge-error">Error</span>
```

**Contenedor de Gráficos (Chart.js):**
```html
<div class="chart-container">
    <div class="chart-title">Título del Gráfico</div>
    <canvas id="miGrafico"></canvas>
</div>
```

### 4. ESTRUCTURA DE DATOS JSON

Los datos vienen en este formato:

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
            "FECHA DE MONITOREO": "12/2/25",
            "ID AGENTE": "4568173",
            "AGENTE": "NOMBRE COMPLETO",
            "SUPERVISOR": "NOMBRE SUPERVISOR",
            "ANALISTA": "NOMBRE ANALISTA",
            "COMENTARIOS": "...",
            "Q1": "1",
            "Q2": "3",
            // ... Q3 a Q22 ...
            "QA SCORE": "80",
            "CUARTIL": "Q2",
            "MES": "Dec-25",
            "SEMANA": "SEM 49",
            "AÑO": "2025",
            "BPO": "KN",
            "CUMPLE PROCESO": "1",
            "RECONTACTO": "1",
            "POLITICAS": "1"
        }
        // ... más registros
    ],
    "atributos_evaluacion": [
        // Metadatos de columnas
    ]
}
```

### 5. GRÁFICOS CON CHART.JS

Si necesitas gráficos, usa Chart.js (ya incluido en CDN):

```javascript
const ctx = document.getElementById('miGrafico');
const chart = new Chart(ctx, {
    type: 'bar', // 'line', 'pie', 'doughnut', etc.
    data: {
        labels: ['Ene', 'Feb', 'Mar'],
        datasets: [{
            label: 'Mi Dataset',
            data: [12, 19, 3],
            backgroundColor: '#3b82f6',
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});
```

### 6. PATRONES COMUNES DE PROCESAMIENTO

**Agrupar por campo:**
```javascript
function groupBy(records, field) {
    return records.reduce((acc, r) => {
        const key = r[field] || 'Sin especificar';
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
    }, {});
}
```

**Calcular promedios:**
```javascript
function calcularPromedio(records, field) {
    const valores = records.map(r => parseFloat(r[field]) || 0);
    return valores.reduce((a, b) => a + b, 0) / valores.length;
}
```

**Contar por categoría:**
```javascript
function countBy(records, field) {
    return records.reduce((acc, r) => {
        const key = r[field] || 'Sin especificar';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}
```

### 7. EJEMPLOS DE VISUALIZACIONES

**Mezcla de Tablas, Gráficos y Tarjetas:**
La página debe incluir una combinación de:
- Tarjetas de resumen (KPIs o cards)
- Al menos 1-2 gráficos interactivos
- Tablas con datos detallados

## MI SOLICITUD ESPECÍFICA

[AQUÍ DESCRIBES QUÉ SUBPÁGINA NECESITAS]

**Ejemplo:**
"Necesito una subpágina llamada 'Supervisores' que muestre:
1. Tarjetas con los top 5 supervisores por score promedio
2. Un gráfico de barras comparando el score promedio de cada supervisor
3. Una tabla con todos los supervisores mostrando: nombre, cantidad de agentes, total interacciones, score promedio, % cumple proceso"

## REQUISITOS ADICIONALES

1. **Nombre del archivo:** `page-[nombre].html` (ejemplo: `page-supervisores.html`)
2. **Responsive:** Debe verse bien en móvil, tablet y desktop
3. **Performance:** Código optimizado, evitar loops innecesarios
4. **Comentarios:** Código bien comentado para futuras modificaciones
5. **Notificación de altura:** SIEMPRE incluir las llamadas a `notifyHeight()` después de renderizar

## IMPORTANTE

- NO uses localStorage, sessionStorage ni cookies
- NO modifies index.html, styles.css ni app.js
- SIEMPRE sigue el patrón de comunicación con postMessage
- SIEMPRE usa las clases CSS predefinidas
- Los datos YA vienen filtrados desde el padre (no necesitas re-filtrar)

## ENTREGABLES ESPERADOS

1. Archivo HTML completo de la subpágina
2. Instrucción de qué agregar en index.html (solo el botón del tab)
3. Breve explicación de lo que hace la página

---

**¿Listo? Describe la subpágina que necesitas crear.**

MI SOLICITUD ESPECÍFICA:

xxxx