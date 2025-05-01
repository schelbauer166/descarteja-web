// Inicializa o mapa
const map = L.map('map').setView([-26.1174, -49.8013], 13);

// Adiciona o layer do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Armazena os marcadores ativos
let activeMarkers = [];

// Armazena os filtros ativos
let activeFilters = new Set();

// Define os ícones para cada tipo de resíduo
const typeIcons = {
    recyclable: 'recycling',
    electronic: 'devices',
    organic: 'eco',
    hazardous: 'warning',
    general: 'delete'
};

// Função para criar um ícone personalizado
function createCustomIcon(point) {
    const iconType = point.types[0]?.icon || 'delete'; // Usa o primeiro tipo ou 'delete' como padrão
    const typeCount = point.types.length; // Conta o número de tipos de lixo
    const showTypeCount = activeFilters.size > 1 && typeCount > 1; // Mostra o número apenas se mais de um filtro estiver ativo e o ponto tiver mais de um tipo
    return L.divIcon({
        html: `
            <div class="custom-marker" style="position: relative; background-color: #4CAF50; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                ${showTypeCount ? `<span class="type-count" style="position: absolute; top: -10px; right: -10px; background-color: red; color: white; font-size: 12px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${typeCount}</span>` : ''}
                <span class="material-icons" style="font-size: 20px; color: white;">${typeIcons[iconType]}</span>
            </div>
        `,
        className: 'custom-marker-container',
        iconSize: [32, 32]
    });
}

// Função para criar o conteúdo do popup
function createPopupContent(point) {
    return `
        <div class="marker-popup" style="text-align: center;">
            <h3 style="margin-bottom: 8px;">${point.name}</h3>
            ${point.description ? `<p style="margin: 4px 0;">${point.description}</p>` : ''}
            <div class="marker-types" style="margin-top: 8px;">
                ${point.types.map(type => `
                    <span class="marker-type" style="margin: 0 4px;">${type.name}</span>
                `).join('')}
            </div>
        </div>
    `;
}

// Função para limpar todos os marcadores do mapa
function clearMarkers() {
    activeMarkers.forEach(marker => marker.remove());
    activeMarkers = [];
}

// Função para adicionar marcadores ao mapa
function addMarkers(points) {
    if (activeFilters.size === 0) {
        return; // Não adiciona marcadores se nenhum filtro estiver ativo
    }

    points.forEach(point => {
        // Verifica se o ponto deve ser exibido com base nos filtros ativos
        const isVisible = point.types.some(type => activeFilters.has(type.icon));

        if (isVisible) {
            const marker = L.marker([point.coordinate.latitude, point.coordinate.longitude], {
                icon: createCustomIcon(point)
            }).bindPopup(createPopupContent(point));
            marker.addTo(map);
            activeMarkers.push(marker);
        }
    });
}

// Função para atualizar os marcadores baseado nos filtros
async function updateMarkers() {
    clearMarkers();

    if (activeFilters.size === 0) {
        return; // Não carrega pontos se nenhum filtro estiver ativo
    }

    let points = await collectionPointsClient.getCollectionPointsByType(Array.from(activeFilters));
    addMarkers(points);
}

// Inicializa o menu flutuante
const floatingMenu = document.querySelector('.floating-menu');
const floatingBtn = document.querySelector('.floating-btn');
const filterContainer = document.querySelector('.filter-container');

floatingBtn.addEventListener('click', () => {
    filterContainer.classList.toggle('show');
});

// Fecha o menu quando clicar fora dele
document.addEventListener('click', (event) => {
    if (!floatingMenu.contains(event.target)) {
        filterContainer.classList.remove('show');
    }
});

// Inicializa os botões de filtro
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterType = button.dataset.type;
        
        if (activeFilters.has(filterType)) {
            activeFilters.delete(filterType);
            button.classList.remove('active');
        } else {
            activeFilters.add(filterType);
            button.classList.add('active');
        }
        
        updateMarkers();
    });
});

// Carrega os pontos iniciais
updateMarkers();