// Variables globales
window.rawData = null;
window.filteredData = null;

// Cargar datos del JSON
async function loadData() {
    try {
        const response = await fetch('calidad.json');
        const data = await response.json();
        window.rawData = data;
        window.filteredData = data;
        console.log('Datos cargados:', data.base_excel.length, 'registros');
        return data;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return null;
    }
}

// Inicializar filtros con valores únicos del dataset
function initializeFilters() {
    if (!window.rawData || !window.rawData.base_excel) return;
    
    const data = window.rawData.base_excel;
    
    // Obtener valores únicos para cada filtro
    const tiposMonitoreo = [...new Set(data.map(r => r['TIPO DE MONITOREO']).filter(Boolean))].sort();
    const canales = [...new Set(data.map(r => r.DATA_CANAL).filter(Boolean))].sort();
    const skills = [...new Set(data.map(r => r.DATA_SKILL).filter(Boolean))].sort();
    const subSkills = [...new Set(data.map(r => r.DATA_SUB_SKILL).filter(Boolean))].sort();
    const bpos = [...new Set(data.map(r => r.BPO).filter(Boolean))].sort();
    const agentes = [...new Set(data.map(r => r.AGENTE).filter(Boolean))].sort();
    const supervisores = [...new Set(data.map(r => r.SUPERVISOR).filter(Boolean))].sort();
    const analistas = [...new Set(data.map(r => r.ANALISTA).filter(Boolean))].sort();
    
    // Poblar selectores
    populateSelect('filterTipoMonitoreo', tiposMonitoreo);
    populateSelect('filterCanal', canales);
    populateSelect('filterSkill', skills);
    populateSelect('filterSubSkill', subSkills);
    populateSelect('filterBPO', bpos);
    populateSelect('filterAgente', agentes);
    populateSelect('filterSupervisor', supervisores);
    populateSelect('filterAnalista', analistas);
}

// Poblar un selector con opciones
function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Mantener la opción "Todos"
    const defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (defaultOption) select.appendChild(defaultOption);
    
    // Agregar opciones
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

// Convertir fecha de formato MM/DD/YY a objeto Date
function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    const month = parseInt(parts[0]) - 1; // Los meses en JS van de 0-11
    const day = parseInt(parts[1]);
    let year = parseInt(parts[2]);
    
    // Convertir año de 2 dígitos a 4 dígitos
    if (year < 100) {
        year += 2000;
    }
    
    return new Date(year, month, day);
}

// Comparar fechas (solo día)
function isSameDate(date1, date2) {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Aplicar filtros
function applyFilters() {
    if (!window.rawData || !window.rawData.base_excel) return;
    
    const filters = {
        interaccion: document.getElementById('filterInteraccion')?.value.trim(),
        fechaInteraccionDesde: document.getElementById('filterFechaInteraccionDesde')?.value,
        fechaInteraccionHasta: document.getElementById('filterFechaInteraccionHasta')?.value,
        tipoMonitoreo: document.getElementById('filterTipoMonitoreo')?.value,
        canal: document.getElementById('filterCanal')?.value,
        skill: document.getElementById('filterSkill')?.value,
        subSkill: document.getElementById('filterSubSkill')?.value,
        bpo: document.getElementById('filterBPO')?.value,
        fechaMonitoreoDesde: document.getElementById('filterFechaMonitoreoDesde')?.value,
        fechaMonitoreoHasta: document.getElementById('filterFechaMonitoreoHasta')?.value,
        agente: document.getElementById('filterAgente')?.value,
        supervisor: document.getElementById('filterSupervisor')?.value,
        analista: document.getElementById('filterAnalista')?.value
    };
    
    let filtered = window.rawData.base_excel.filter(record => {
        // Filtro por ID Interacción
        if (filters.interaccion && !record['ID_INTERACCIÓN']?.includes(filters.interaccion)) {
            return false;
        }
        
        // Filtro por Rango de Fecha de Interacción
        if (filters.fechaInteraccionDesde || filters.fechaInteraccionHasta) {
            const recordDate = parseDate(record['FECHA DE INTERACCIÓN']);
            if (!recordDate) return false;
            
            // Normalizar todas las fechas a medianoche para comparación
            const recordDateNormalized = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
            
            if (filters.fechaInteraccionDesde) {
                const fromDate = new Date(filters.fechaInteraccionDesde);
                const fromDateNormalized = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
                if (recordDateNormalized < fromDateNormalized) return false;
            }
            
            if (filters.fechaInteraccionHasta) {
                const toDate = new Date(filters.fechaInteraccionHasta);
                const toDateNormalized = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
                if (recordDateNormalized > toDateNormalized) return false;
            }
        }
        
        // Filtro por Tipo de Monitoreo
        if (filters.tipoMonitoreo && record['TIPO DE MONITOREO'] !== filters.tipoMonitoreo) {
            return false;
        }
        
        // Filtro por Canal
        if (filters.canal && record.DATA_CANAL !== filters.canal) {
            return false;
        }
        
        // Filtro por Skill
        if (filters.skill && record.DATA_SKILL !== filters.skill) {
            return false;
        }
        
        // Filtro por Sub-Skill
        if (filters.subSkill && record.DATA_SUB_SKILL !== filters.subSkill) {
            return false;
        }
        
        // Filtro por BPO
        if (filters.bpo && record.BPO !== filters.bpo) {
            return false;
        }
        
        // Filtro por Rango de Fecha de Monitoreo
        if (filters.fechaMonitoreoDesde || filters.fechaMonitoreoHasta) {
            const recordDate = parseDate(record['FECHA DE MONITOREO']);
            if (!recordDate) return false;
            
            // Normalizar todas las fechas a medianoche para comparación
            const recordDateNormalized = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
            
            if (filters.fechaMonitoreoDesde) {
                const fromDate = new Date(filters.fechaMonitoreoDesde);
                const fromDateNormalized = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
                if (recordDateNormalized < fromDateNormalized) return false;
            }
            
            if (filters.fechaMonitoreoHasta) {
                const toDate = new Date(filters.fechaMonitoreoHasta);
                const toDateNormalized = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
                if (recordDateNormalized > toDateNormalized) return false;
            }
        }
        
        // Filtro por Agente
        if (filters.agente && record.AGENTE !== filters.agente) {
            return false;
        }
        
        // Filtro por Supervisor
        if (filters.supervisor && record.SUPERVISOR !== filters.supervisor) {
            return false;
        }
        
        // Filtro por Analista
        if (filters.analista && record.ANALISTA !== filters.analista) {
            return false;
        }
        
        return true;
    });
    
    window.filteredData = {
        ...window.rawData,
        base_excel: filtered
    };
    
    console.log('========== FILTROS APLICADOS ==========');
    console.log('Filtros activos:', Object.entries(filters).filter(([k, v]) => v).map(([k, v]) => `${k}: ${v}`));
    console.log('Total registros:', window.rawData.base_excel.length);
    console.log('Registros filtrados:', filtered.length);
    console.log('========================================');
}

// Limpiar filtros
function clearFilters() {
    // Limpiar campos de texto
    const textInputs = ['filterInteraccion'];
    textInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    // Limpiar campos de fecha
    const dateInputs = [
        'filterFechaInteraccionDesde',
        'filterFechaInteraccionHasta',
        'filterFechaMonitoreoDesde',
        'filterFechaMonitoreoHasta'
    ];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    // Limpiar selectores
    const selects = [
        'filterTipoMonitoreo',
        'filterCanal',
        'filterSkill',
        'filterSubSkill',
        'filterBPO',
        'filterAgente',
        'filterSupervisor',
        'filterAnalista'
    ];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) select.value = '';
    });
    
    // Resetear datos filtrados
    window.filteredData = window.rawData;
    
    console.log('Filtros limpiados');
}

// Funciones de utilidad para subpáginas

// Obtener datos filtrados
function getFilteredData() {
    return window.filteredData || window.rawData;
}

// Calcular estadísticas básicas
function calculateStats(data) {
    if (!data || !data.base_excel || data.base_excel.length === 0) {
        return {
            total: 0,
            scorePromedio: 0,
            scoreMayor: 0,
            scoreMenor: 0
        };
    }
    
    const records = data.base_excel;
    const scores = records.map(r => parseFloat(r['QA SCORE']) || 0);
    
    return {
        total: records.length,
        scorePromedio: scores.reduce((a, b) => a + b, 0) / scores.length,
        scoreMayor: Math.max(...scores),
        scoreMenor: Math.min(...scores)
    };
}

// Agrupar datos por campo
function groupBy(data, field) {
    if (!data || !data.base_excel) return {};
    
    return data.base_excel.reduce((acc, record) => {
        const key = record[field] || 'Sin especificar';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(record);
        return acc;
    }, {});
}

// Contar ocurrencias
function countBy(data, field) {
    const grouped = groupBy(data, field);
    const counts = {};
    
    Object.keys(grouped).forEach(key => {
        counts[key] = grouped[key].length;
    });
    
    return counts;
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.getFilteredData = getFilteredData;
    window.calculateStats = calculateStats;
    window.groupBy = groupBy;
    window.countBy = countBy;
    window.parseDate = parseDate;
}