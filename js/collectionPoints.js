// Tipos de pontos de coleta
const CollectionPointTypeIcon = {
    RECYCLABLE: 'recyclable',
    ELECTRONIC: 'electronic',
    ORGANIC: 'organic',
    HAZARDOUS: 'hazardous',
    GENERAL: 'general'
};

// Dados mockados
const mockCollectionPoints = [
    {
        "id": "d515646f-929b-47eb-b496-0be6406ae723",
        "name": "Jardim América - Centro",
        "description": "Lixeiras na Rua.",
        "types": [
            {
                "icon": "recyclable",
                "name": "Reciclável",
                "description": "Materiais que podem ser reciclados como papel, plástico, vidro e metal"
            },
            {
                "icon": "organic",
                "name": "Orgânico",
                "description": "Resíduos de origem animal ou vegetal"
            }
        ],
        "coordinate": {
            "latitude": -26.120356191698303,
            "longitude": -49.78491279618519
        }
    },
    {
        "id": "832d4f70-6f4f-4c3a-8876-b38f8c344499",
        "name": "Mig Supermercados - Avenida",
        "description": "Pontos de coleta no estacionamento.",
        "types": [
            {
                "icon": "electronic",
                "name": "Eletrônicos",
                "description": "Equipamentos eletrônicos como celulares, computadores e televisores"
            }
        ],
        "coordinate": {
            "latitude": -26.11494962343918,
            "longitude": -49.79561891383797
        }
    }
];

// Configuração da API
const API_BASE_URL = 'http://localhost:3000';
const USE_MOCK_DATA = true;

// Cliente para buscar pontos de coleta
class CollectionPointsClient {
    async getCollectionPoints() {
        if (USE_MOCK_DATA) {
            // Retorna dados mockados com delay para simular chamada API
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(mockCollectionPoints);
                }, 500);
            });
        } else {
            // Usa Fetch para chamar a API real
            try {
                const response = await fetch(`${API_BASE_URL}/places`);
                return await response.json();
            } catch (error) {
                console.error('Erro ao buscar pontos de coleta:', error);
                return [];
            }
        }
    }

    async getCollectionPointsByType(types) {
        if (USE_MOCK_DATA) {
            // Filtra dados mockados baseado nos tipos
            return new Promise(resolve => {
                setTimeout(() => {
                    const filteredPoints = mockCollectionPoints.filter(point =>
                        point.types.some(type => types.includes(type.icon))
                    );
                    resolve(filteredPoints);
                }, 500);
            });
        } else {
            // Usa Fetch para chamar a API real com filtro de tipo
            try {
                const response = await fetch(`${API_BASE_URL}/places?types=${types.join(',')}`);
                return await response.json();
            } catch (error) {
                console.error('Erro ao buscar pontos de coleta por tipo:', error);
                return [];
            }
        }
    }
}

// Exporta uma instância do cliente
const collectionPointsClient = new CollectionPointsClient();