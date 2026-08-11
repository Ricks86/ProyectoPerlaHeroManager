/**
 * ProyectoRol - Diccionarios y Modelos de Datos Estáticos (Sistema "Vieja Escuela" Oficial + Homebrew)
 * Basado en las reglas y textos de VE_jdr.pdf
 */

const GAME_DATA = {
    // TABLA DE MODIFICADORES DE ATRIBUTOS (Página 3 del manual VE_jdr.pdf)
    getAttributeModifier: function(score) {
        if (score === null || score === undefined) return 0;
        if (score === 3) return -2;
        if (score >= 4 && score <= 6) return -1;
        if (score >= 7 && score <= 14) return 0;
        if (score >= 15 && score <= 17) return +1;
        if (score === 18) return +2;
        return 0;
    },

    // CLASES (Páginas 3 y 4 del manual VE_jdr.pdf)
    classes: {
        "Guerrero": {
            id: "guerrero",
            name: "Guerrero",
            hitDice: "d8",
            maxHpBonus: 8,
            proficiency: "Puedes usar cualquier arma y armadura.",
            description: "Ganas los talentos Lucha con X y Ataques Múltiples. Puedes usar cualquier arma y armadura. Dado de Aguante (DA): d8.",
            talents: [
                {
                    name: "Lucha con X",
                    origin: "Clase",
                    description: "Sustituye X por: arma de mano y escudo o dos armas de mano o armas a dos manos o armas de proyectiles. Peleando de esa forma ganas +1 al ataque y al daño."
                },
                {
                    name: "Ataques Múltiples",
                    origin: "Clase",
                    description: "Al abatir a un enemigo puedes realizar inmediatamente otro ataque. De esta forma puedes encadenar tantos ataques EXTRA como nivel tengas."
                }
            ]
        },
        "Hechicero": {
            id: "hechicero",
            name: "Hechicero",
            hitDice: "d4",
            maxHpBonus: 4,
            proficiency: "Solo puedes usar dagas, bastones y hondas. No puedes usar ninguna armadura.",
            description: "Ganas los talentos Sensibilidad Mágica y Transferir Esencia. Solo puedes usar dagas, bastones y hondas. No puedes usar ninguna armadura. Dado de Aguante (DA): d4.",
            talents: [
                {
                    name: "Sensibilidad Mágica",
                    origin: "Clase",
                    description: "Puedes gastar puntos de poder (Pod) para realizar conjuros."
                },
                {
                    name: "Transferir Esencia",
                    origin: "Clase",
                    description: "Puedes convertir 3 puntos de vida en un punto de poder (Pod)."
                }
            ]
        },
        "Bribón": {
            id: "bribon",
            name: "Bribón",
            hitDice: "d6",
            maxHpBonus: 6,
            proficiency: "Puedes usar cualquier arma pero solo armaduras ligeras (cuero).",
            description: "Ganas los talentos Emboscar y Dedos Ágiles. Puedes usar cualquier arma pero solo armaduras ligeras (cuero). Dado de Aguante (DA): d6.",
            talents: [
                {
                    name: "Emboscar",
                    origin: "Clase",
                    description: "Tienes ventaja en las pruebas de Subterfugio basadas en moverse en silencio y en ocultarse en las sombras. Añade 1d6 al daño cuando ataques a un blanco desprevenido."
                },
                {
                    name: "Dedos Ágiles",
                    origin: "Clase",
                    description: "Tienes ventaja en las pruebas de Manipulación que requieran precisión (por ejemplo abrir cerraduras o sustraer las posesiones de otra persona)."
                }
            ]
        }
    },

    // RAZAS (Página 3 del manual VE_jdr.pdf)
    races: {
        "Elfo": {
            id: "elfo",
            name: "Elfo",
            movement: 12,
            description: "Ganas los talentos Vista Aguda e Infravisión. Tu movimiento (Mov) es de 12.",
            talents: [
                {
                    name: "Vista Aguda",
                    origin: "Raza",
                    description: "Tienes ventaja en las pruebas de Alerta basadas en la vista."
                },
                {
                    name: "Infravisión",
                    origin: "Raza",
                    description: "Ves en la oscuridad hasta 20 metros. La visión se basa en el calor desprendido por los objetos."
                }
            ]
        },
        "Enano": {
            id: "enano",
            name: "Enano",
            movement: 9,
            description: "Ganas los talentos Afín a la Piedra e Infravisión. Tu movimiento (Mov) es de 9.",
            talents: [
                {
                    name: "Afín a la Piedra",
                    origin: "Raza",
                    description: "Tienes ventaja en cualquier prueba de Erudición relacionada con el trabajo sobre piedra. También puedes hacer una prueba de Alerta para detectar trampas hechas sobre roca."
                },
                {
                    name: "Infravisión",
                    origin: "Raza",
                    description: "Ves en la oscuridad hasta 20 metros. La visión se basa en el calor desprendido por los objetos."
                }
            ]
        },
        "Mediano": {
            id: "mediano",
            name: "Mediano",
            movement: 9,
            description: "Ganas los talentos Escurridizo y Certero. Tu movimiento (Mov) es de 9.",
            talents: [
                {
                    name: "Escurridizo",
                    origin: "Raza",
                    description: "Tienes ventaja en las pruebas de Subterfugio relacionadas con moverse en silencio."
                },
                {
                    name: "Certero",
                    origin: "Raza",
                    description: "Tienes un bono adicional de +1 en todos los ataques de proyectiles."
                }
            ]
        },
        "Humano": {
            id: "humano",
            name: "Humano",
            movement: 12,
            description: "Ganas los talentos Ímpetu Emprendedor y Adaptable. Tu movimiento (Mov) es de 12.",
            talents: [
                {
                    name: "Ímpetu Emprendedor",
                    origin: "Raza",
                    description: "Vives la vida con intensidad. Ganas un trasfondo adicional."
                },
                {
                    name: "Adaptable",
                    origin: "Raza",
                    description: "De alguna forma tienes facilidad para adaptarte a cualquier ambiente y entorno. Ganas un modificador adicional de +1 a tu rasgo de Instintos."
                }
            ]
        }
    },

    // ATRIBUTOS (Páginas 3 y 15 del manual VE_jdr.pdf)
    attributesList: [
        { code: "fue", name: "Fuerza (FUE)", desc: "Capacidad física. Usos: Resistir la paralización, resistir la petrificación. Añade modificador a ataques CaC y daño." },
        { code: "des", name: "Destreza (DES)", desc: "Agilidad y reflejos. Usos: Evitar caer por un pozo, esquivar proyectiles, proyectil mágico o trampa. Suma a Defensa y proyectiles." },
        { code: "con", name: "Constitución (CON)", desc: "Resistencia y vitalidad corporal. Usos: Resistir veneno, enfermedad o contagio. Añade modificador a los Puntos de Vida por nivel." },
        { code: "intStat", name: "Inteligencia (INT)", desc: "Razonamiento y aptitud arcana. Usos: Resistir el control mental sutil. Suma modificador a Puntos de Poder (Pod) de Hechiceros." },
        { code: "sab", name: "Sabiduría (SAB)", desc: "Percepción, voluntad y salud mental. Usos: Resistirse a ilusiones, glifos o símbolos mágicos. Mide la Salud Mental." },
        { code: "car", name: "Carisma (CAR)", desc: "Presencia personal y liderazgo. Usos: Cualquier efecto de control mental directo o intento evidente de influencia." }
    ],

    // HABILIDADES BASE (Páginas 4 y 15 del manual VE_jdr.pdf)
    skillsList: [
        { id: "alerta", name: "Alerta", description: "Notar algo visible, oír un ruido, buscar en o registrar un lugar." },
        { id: "comunicacion", name: "Comunicación", description: "Influir, motivar, entenderse con otros seres." },
        { id: "manipulacion", name: "Manipulación", description: "Abrir cerraduras, inutilizar mecanismos de trampas, robar sin ser descubierto." },
        { id: "erudicion", name: "Erudición", description: "Entender escritos en lenguas antiguas, conocer leyendas locales o datos históricos, identificar criaturas." },
        { id: "subterfugio", name: "Subterfugio", description: "Deslizarse en silencio, ocultarse en las sombras." },
        { id: "supervivencia", name: "Supervivencia", description: "Seguir rastros, orientarse al aire libre, forrajear para conseguir alimentos." }
    ],

    // BONOS HOMEBREW (PASO 4)
    homebrewBonuses: [
        { id: "INS", name: "Instintos (+1)", description: "Mejora la velocidad de reacción y tiradas para resistir o evitar peligros." },
        { id: "ATQ", name: "Ataque (+1)", description: "Mejora la precisión de golpe en tiradas de ataque cuerpo a cuerpo y a distancia." },
        { id: "POD", name: "Poder (+1)", description: "Incrementa los Puntos de Poder (Pod) para realizar conjuros y capacidades arcanas." }
    ],

    // TIENDA INICIAL (Página 13 y 14 del manual VE_jdr.pdf)
    shopCatalog: [
        // Armas
        { id: "espada_larga", name: "Espada Larga", category: "Armas", priceMo: 15, description: "Daño 1d8. Arma clásica de aventurero." },
        { id: "espada_corta", name: "Espada Corta", category: "Armas", priceMo: 8, description: "Daño 1d6. Manejable y versátil." },
        { id: "daga", name: "Daga de Acero", category: "Armas", priceMo: 2, description: "Daño 1d4. Se puede lanzar hasta 4 metros." },
        { id: "hacha_batalla", name: "Hacha de Batalla", category: "Armas", priceMo: 5, description: "Daño 1d8. Arma contundente de un filo." },
        { id: "arco", name: "Arco y Carcaj (20 flechas)", category: "Armas", priceMo: 15.8, description: "Daño 1d6. Alcance 60 metros." },
        { id: "baston", name: "Bastón (a dos manos)", category: "Armas", priceMo: 0, description: "Daño 1d6. Arma sencilla de madera." },

        // Armaduras
        { id: "cuero", name: "Armadura de Cuero", category: "Armaduras", priceMo: 5, description: "Defensa +2. Ligera, permitida para Bribones." },
        { id: "anillos", name: "Armadura de Anillos", category: "Armaduras", priceMo: 30, description: "Defensa +3. Protección intermedia." },
        { id: "mallas", name: "Cota de Mallas", category: "Armaduras", priceMo: 75, description: "Defensa +4. Protección pesada para Guerreros." },
        { id: "escudo", name: "Escudo de Madera/Metal", category: "Armaduras", priceMo: 15, description: "Defensa +1. Aporta bonificador a la defensa." },

        // Equipo Diverso
        { id: "mochila", name: "Mochila (10 kg capacidad)", category: "Equipo", priceMo: 5, description: "Imprescindible para llevar el equipo." },
        { id: "antorcha", name: "Antorchas (1 hora luz)", category: "Equipo", priceMo: 0.01, description: "Ilumina en la oscuridad subterránea." },
        { id: "cuerda", name: "Cuerda común (15 metros)", category: "Equipo", priceMo: 1, description: "Para escalar o atar prisioneros." },
        { id: "raciones_viaje", name: "Raciones de viaje (1 día)", category: "Equipo", priceMo: 1, description: "Alimento duradero para aventuras." },
        { id: "cantimplora", name: "Cantimplora (2 litros)", category: "Equipo", priceMo: 1, description: "Agua fresca de viaje." },
        { id: "vendas", name: "Vendas para heridas (x1)", category: "Equipo", priceMo: 0.1, description: "Permite recuperar 1d4 PV una vez por combate." }
    ],

    // Cargar datos de referencia opcionalmente desde el Backend H2 Database
    fetchReferenceFromBackend: async function() {
        try {
            const racesRes = await fetch('/api/reference/races');
            if (racesRes.ok) {
                const racesData = await racesRes.json();
                console.log("Cargadas razas desde la base de datos H2:", racesData);
            }

            const classesRes = await fetch('/api/reference/classes');
            if (classesRes.ok) {
                const classesData = await classesRes.json();
                console.log("Cargadas clases desde la base de datos H2:", classesData);
            }
        } catch (e) {
            console.log("Usando datos de referencia estáticos predeterminados de VE_jdr.pdf.");
        }
    }
};

// Intentar cargar referencias al iniciar
GAME_DATA.fetchReferenceFromBackend();
