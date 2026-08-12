/**
 * ProyectoRol - Lógica del Frontend (Sprint 1 Integration)
 * Consumo de APIs y Guardado de Personajes
 */

// Variable global para almacenar las descripciones del diccionario de atributos (/api/reference/attributes)
window.ATTRIBUTE_DICTIONARY = [];

/**
 * Función que se ejecuta al cargar la página para consumir el endpoint
 * GET /api/reference/attributes y guardar las descripciones en la variable global.
 */
async function fetchAttributesDictionary() {
    try {
        const response = await fetch('/api/reference/attributes');
        if (response.ok) {
            window.ATTRIBUTE_DICTIONARY = await response.json();
            console.log("Diccionario de Atributos cargado desde el Backend:", window.ATTRIBUTE_DICTIONARY);
        } else {
            console.warn("No se pudo cargar el diccionario de atributos. Código HTTP:", response.status);
        }
    } catch (error) {
        console.error("Error al conectar con /api/reference/attributes:", error);
    }
}

/**
 * Función saveCharacter() activada al final del Wizard de creación.
 * Recolecta los datos del formulario HTML / Wizard y construye un objeto JSON
 * que coincide exactamente con la estructura anidada del CharacterDTO de Spring Boot.
 * Realiza un fetch() POST a /api/characters y maneja la respuesta.
 */
async function saveCharacter(characterData) {
    // Si se pasan datos directamente se usan, de lo contrario se extraen del formulario/wizard global
    const data = characterData || (window.characterWizard ? window.characterWizard.character : null);
    
    if (!data) {
        console.error("Error: No existen datos válidos de personaje para guardar.");
        alert("Error: No hay datos de personaje para guardar.");
        return;
    }

    // Construcción del objeto JSON coincidiendo exactamente con la estructura anidada de CharacterDTO
    const payload = {
        name: data.name || document.getElementById("char-name")?.value || "",
        race: data.race || document.getElementById("select-race")?.value || "",
        characterClass: data.characterClass || document.getElementById("select-class")?.value || "",
        level: data.level || 1,
        experience: data.experience || 0,
        stats: {
            fue: data.stats?.fue ?? null,
            des: data.stats?.des ?? null,
            con: data.stats?.con ?? null,
            intStat: data.stats?.intStat ?? null,
            sab: data.stats?.sab ?? null,
            car: data.stats?.car ?? null
        },
        skills: {
            alerta: data.skills?.alerta ?? 0,
            comunicacion: data.skills?.comunicacion ?? 0,
            manipulacion: data.skills?.manipulacion ?? 0,
            erudicion: data.skills?.erudicion ?? 0,
            subterfugio: data.skills?.subterfugio ?? 0,
            supervivencia: data.skills?.supervivencia ?? 0
        },
        derivedStats: {
            hitDice: data.derivedStats?.hitDice || "d8",
            maxHp: data.derivedStats?.maxHp || 8,
            currentHp: data.derivedStats?.currentHp || 8,
            movement: data.derivedStats?.movement || 12,
            defense: data.derivedStats?.defense || 10,
            bonusChoice: data.derivedStats?.bonusChoice || "ATQ"
        },
        economy: {
            startingGoldRoll: data.economy?.startingGoldRoll || 0,
            initialGoldInMo: data.economy?.initialGoldInMo || 0,
            remainingCoins: {
                mo: data.economy?.remainingCoins?.mo ?? data.economy?.currentMo ?? 0,
                mp: data.economy?.remainingCoins?.mp ?? data.economy?.currentMp ?? 0,
                mc: data.economy?.remainingCoins?.mc ?? data.economy?.currentMc ?? 0
            }
        },
        inventory: data.inventory || [],
        talents: data.talents || []
    };

    console.log("Enviando objeto JSON (CharacterDTO) hacia /api/characters:", payload);

    try {
        const response = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 201) {
            const savedCharacter = await response.json();
            console.log("¡Respuesta del servidor exitosa! Personaje guardado:", savedCharacter);
            alert(`¡Personaje "${savedCharacter.name}" guardado exitosamente con ID: ${savedCharacter.id}!`);
            return savedCharacter;
        } else {
            console.error("Fallo en la respuesta del servidor. Código HTTP:", response.status);
            alert("Error al guardar personaje en el servidor. Código HTTP: " + response.status);
        }
    } catch (error) {
        console.error("Error de red/conexión al realizar el POST a /api/characters:", error);
        alert("Error de conexión con el backend: " + error.message);
    }
}

// Inicialización de Eventos al Cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando Asistente de Creación de Personaje (ProyectoRol)...");

    // 1. Consumir diccionario de atributos expuesto en /api/reference/attributes
    fetchAttributesDictionary();

    // 2. Inicializar Asistente Wizard si está disponible
    if (typeof CharacterWizard !== "undefined") {
        window.characterWizard = new CharacterWizard();
        window.characterWizard.init();
    }
});

// Exportar globalmente para invocación desde el HTML o Wizard
window.ATTRIBUTE_DICTIONARY = window.ATTRIBUTE_DICTIONARY;
window.fetchAttributesDictionary = fetchAttributesDictionary;
window.saveCharacter = saveCharacter;

