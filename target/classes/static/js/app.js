/**
 * Costa de la Perla - Lógica Frontend (Sprint 2: Autenticación & Dashboard)
 * Vanilla JavaScript ES6+ (Cero dependencias externas)
 */

// Estado Global de la Aplicación
const APP_STATE = {
    currentUser: null, // { username: string, role: string }
    characters: []
};

/**
 * 1. NAVEGACIÓN Y ALTERNANCIA DE VISTAS Y FORMULARIOS
 */

// Alternar a Formulario de Iniciar Sesión
function showLoginForm() {
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");

    if (formLogin && formRegister) {
        formLogin.style.display = "flex";
        formRegister.style.display = "none";
    }
    if (tabLogin && tabRegister) {
        tabLogin.classList.add("auth-tab--active");
        tabRegister.classList.remove("auth-tab--active");
    }
}

// Alternar a Formulario de Registro
function showRegisterForm() {
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");

    if (formLogin && formRegister) {
        formLogin.style.display = "none";
        formRegister.style.display = "flex";
    }
    if (tabLogin && tabRegister) {
        tabLogin.classList.remove("auth-tab--active");
        tabRegister.classList.add("auth-tab--active");
    }
}

// Mostrar Vista 1: Autenticación
function showAuthView() {
    document.getElementById("auth-view").style.display = "flex";
    document.getElementById("dashboard-view").style.display = "none";
    document.getElementById("wizard-view").style.display = "none";
    
    const headerNav = document.getElementById("header-user-nav");
    if (headerNav) headerNav.style.display = "none";
}

// Mostrar Vista 2: Dashboard ("Tus Personajes")
function showDashboardView() {
    document.getElementById("auth-view").style.display = "none";
    document.getElementById("dashboard-view").style.display = "flex";
    document.getElementById("wizard-view").style.display = "none";

    const headerNav = document.getElementById("header-user-nav");
    if (headerNav) headerNav.style.display = "flex";

    if (APP_STATE.currentUser) {
        const userDisplayName = document.getElementById("user-display-name");
        const headerUserName = document.getElementById("header-user-name");
        const roleBadge = document.getElementById("user-role-badge");

        if (userDisplayName) userDisplayName.textContent = APP_STATE.currentUser.username;
        if (headerUserName) headerUserName.textContent = APP_STATE.currentUser.username;
        if (roleBadge) roleBadge.textContent = APP_STATE.currentUser.role || "PLAYER";
    }

    loadCharacters();
}

// Mostrar Vista 3: Asistente Wizard de Creación
function showWizardView() {
    document.getElementById("auth-view").style.display = "none";
    document.getElementById("dashboard-view").style.display = "none";
    document.getElementById("wizard-view").style.display = "grid";

    const headerNav = document.getElementById("header-user-nav");
    if (headerNav) headerNav.style.display = "flex";
}


/**
 * 2. LÓGICA DE AUTENTICACIÓN (REGISTER, LOGIN, LOGOUT)
 */

// Interceptar submit de Registro
async function handleRegisterSubmit(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!username || !password) {
        alert("Por favor, ingresa un nombre de usuario y una contraseña válida.");
        return;
    }

    try {
        const response = await fetch('/api/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if (response.ok || response.status === 201) {
            alert("📜 ¡Registro exitoso! Tu héroe ha sido inscrito en Costa de la Perla. Por favor inicia sesión.");
            
            const loginUserInput = document.getElementById("login-username");
            if (loginUserInput) loginUserInput.value = username;
            
            showLoginForm();
        } else {
            const errData = await response.json().catch(() => ({}));
            alert("⚠️ Error en el registro: " + (errData.error || errData.message || "Nombre de usuario no disponible."));
        }
    } catch (err) {
        console.error("Error de red durante el registro:", err);
        alert("Error de conexión con el servidor de Costa de la Perla.");
    }
}

// Interceptar submit de Login
async function handleLoginSubmit(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!username || !password) {
        alert("Por favor ingresa usuario y contraseña.");
        return;
    }

    try {
        const response = await fetch('/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login exitoso en Costa de la Perla:", data);

            APP_STATE.currentUser = {
                username: data.username || username,
                role: data.role || "PLAYER"
            };

            sessionStorage.setItem("costa_user_session", JSON.stringify(APP_STATE.currentUser));
            showDashboardView();
        } else {
            const errData = await response.json().catch(() => ({}));
            alert("⚠️ " + (errData.error || errData.message || "Usuario o contraseña incorrectos."));
        }
    } catch (err) {
        console.error("Error de red durante el login:", err);
        alert("Error de conexión al servidor.");
    }
}

// Cerrar Sesión
function handleLogout() {
    sessionStorage.removeItem("costa_user_session");
    APP_STATE.currentUser = null;
    window.location.reload();
}


/**
 * 3. GESTIÓN Y CARGA DE PERSONAJES EN EL DASHBOARD
 */

async function loadCharacters() {
    const gridContainer = document.getElementById("character-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = `<div class="empty-state">Consultando la lista de héroes en la taberna...</div>`;

    try {
        const response = await fetch('/api/characters', {
            credentials: 'include'
        });

        if (response.ok) {
            const characters = await response.json();
            APP_STATE.characters = characters;
            renderCharacterGrid(characters);
        } else {
            renderCharacterGrid([]);
        }
    } catch (err) {
        console.error("Error al obtener personajes:", err);
        renderCharacterGrid([]);
    }
}

function renderCharacterGrid(characters) {
    const gridContainer = document.getElementById("character-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    if (!characters || characters.length === 0) {
        // Banner inicial si no hay personajes creados + tarjetas de muestra de prueba
        gridContainer.innerHTML = `
            <div class="empty-dashboard-banner">
                <div class="empty-dashboard-icon">🛡️</div>
                <h3>Aún no has creado ningún personaje</h3>
                <p>Usa el asistente oficial del manual <em>Vieja Escuela</em> para forjar tu primer héroe.</p>
                <button class="btn-primary" onclick="showWizardView()">➕ Crear Mi Primer Personaje</button>
            </div>
        `;
        renderDemoCharacterCards(gridContainer);
        return;
    }

    const cardsGrid = document.createElement("div");
    cardsGrid.className = "character-cards-grid";

    characters.forEach(char => {
        const card = createCharacterCardElement(char);
        cardsGrid.appendChild(card);
    });

    gridContainer.appendChild(cardsGrid);
}

function renderDemoCharacterCards(container) {
    const demoChars = [
        {
            id: 'demo-1',
            name: 'Valerius el Indómito',
            race: 'Humano',
            characterClass: 'Guerrero',
            level: 1,
            derivedStats: { maxHp: 8, defense: 12, movement: 12 },
            economy: { remainingCoins: { mo: 15, mp: 5, mc: 0 } },
            isDemo: true
        },
        {
            id: 'demo-2',
            name: 'Sylvana Sombrahoja',
            race: 'Elfo',
            characterClass: 'Hechicero',
            level: 1,
            derivedStats: { maxHp: 4, defense: 10, movement: 12 },
            economy: { remainingCoins: { mo: 42, mp: 0, mc: 0 } },
            isDemo: true
        }
    ];

    const demoWrapper = document.createElement("div");
    demoWrapper.className = "demo-cards-wrapper";
    demoWrapper.innerHTML = `<h4 class="demo-title">📜 Tarjetas de Personaje de Prueba (Maquetado):</h4>`;

    const grid = document.createElement("div");
    grid.className = "character-cards-grid";

    demoChars.forEach(char => {
        grid.appendChild(createCharacterCardElement(char));
    });

    demoWrapper.appendChild(grid);
    container.appendChild(demoWrapper);
}

function createCharacterCardElement(char) {
    const card = document.createElement("div");
    card.className = "character-card";

    const avatarIcon = char.characterClass === 'Hechicero' ? '🧙‍♂️' :
                       char.characterClass === 'Bribón' ? '🗡️' : '🛡️';

    const hp = char.derivedStats ? char.derivedStats.maxHp || 8 : 8;
    const def = char.derivedStats ? char.derivedStats.defense || 10 : 10;
    const mov = char.derivedStats ? char.derivedStats.movement || 12 : 12;

    const mo = char.economy && char.economy.remainingCoins ? char.economy.remainingCoins.mo || 0 : 0;
    const mp = char.economy && char.economy.remainingCoins ? char.economy.remainingCoins.mp || 0 : 0;
    const mc = char.economy && char.economy.remainingCoins ? char.economy.remainingCoins.mc || 0 : 0;

    let goldStr = `${mo} mo`;
    if (mp > 0 || mc > 0) goldStr += ` ${mp}mp ${mc}mc`;

    card.innerHTML = `
        <div class="character-card__header">
            <div class="character-card__avatar">${avatarIcon}</div>
            <div>
                <h3 class="character-card__title">${char.name || 'Sin Nombre'}</h3>
                <span class="character-card__subtitle">${char.race || 'Raza'} • ${char.characterClass || 'Clase'} (Niv ${char.level || 1})</span>
            </div>
        </div>
        <div class="character-card__body">
            <div class="character-card__stat">
                <span class="stat-lbl">Vida (PV):</span>
                <span class="stat-val text-green">${hp} PV</span>
            </div>
            <div class="character-card__stat">
                <span class="stat-lbl">Defensa:</span>
                <span class="stat-val">${def}</span>
            </div>
            <div class="character-card__stat">
                <span class="stat-lbl">Movimiento:</span>
                <span class="stat-val">${mov} m</span>
            </div>
            <div class="character-card__stat">
                <span class="stat-lbl">Tesoro:</span>
                <span class="stat-val text-gold">${goldStr}</span>
            </div>
        </div>
        <div class="character-card__footer">
            <button class="btn-danger btn-delete-char" data-id="${char.id}">
                🗑️ Borrar
            </button>
        </div>
    `;

    card.querySelector(".btn-delete-char").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteCharacter(char.id, char.isDemo);
    });

    return card;
}

async function deleteCharacter(charId, isDemo) {
    const confirmDelete = confirm("¿Estás seguro de que deseas borrar este personaje?");
    if (!confirmDelete) return;

    if (isDemo) {
        alert("Personaje de prueba eliminado.");
        loadCharacters();
        return;
    }

    try {
        const response = await fetch(`/api/characters/${charId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok || response.status === 204) {
            alert("¡Personaje eliminado exitosamente!");
            loadCharacters();
        } else {
            alert("No se pudo borrar el personaje del servidor.");
        }
    } catch (err) {
        console.error("Error al borrar personaje:", err);
        alert("Error de conexión al borrar personaje.");
    }
}


/**
 * 4. GUARDADO DE PERSONAJE DESDE EL WIZARD CON REDIRECCIÓN AL DASHBOARD
 */
async function saveCharacter(characterData) {
    const data = characterData || (window.characterWizard ? window.characterWizard.character : null);

    if (!data) {
        alert("Error: No hay datos de personaje para guardar.");
        return;
    }

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

    try {
        const response = await fetch('/api/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 201) {
            const savedCharacter = await response.json();
            alert(`¡Héroe "${savedCharacter.name}" guardado exitosamente en Costa de la Perla!`);
            
            // Regresar al Dashboard y recargar la lista
            showDashboardView();
            return savedCharacter;
        } else {
            alert("Error al guardar personaje en el servidor. Código: " + response.status);
        }
    } catch (error) {
        console.error("Error al conectar con /api/characters:", error);
        alert("Error de conexión al guardar el personaje.");
    }
}


/**
 * 5. INICIALIZACIÓN DE LA APLICACIÓN Y VINCULACIÓN DE EVENTOS (DOM)
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando Costa de la Perla...");

    // Eventos de Pestañas Auth
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    if (tabLogin) tabLogin.addEventListener("click", showLoginForm);
    if (tabRegister) tabRegister.addEventListener("click", showRegisterForm);

    // Eventos de Enlaces Toggle
    const linkRegister = document.getElementById("link-show-register");
    const linkLogin = document.getElementById("link-show-login");
    if (linkRegister) linkRegister.addEventListener("click", (e) => { e.preventDefault(); showRegisterForm(); });
    if (linkLogin) linkLogin.addEventListener("click", (e) => { e.preventDefault(); showLoginForm(); });

    // Formularios Submit
    const formRegister = document.getElementById("form-register");
    const formLogin = document.getElementById("form-login");
    if (formRegister) formRegister.addEventListener("submit", handleRegisterSubmit);
    if (formLogin) formLogin.addEventListener("submit", handleLoginSubmit);

    // Botones de Navegación y Logout
    const btnLogoutHeader = document.getElementById("btn-header-logout");
    const btnLogoutDash = document.getElementById("btn-dashboard-logout");
    if (btnLogoutHeader) btnLogoutHeader.addEventListener("click", handleLogout);
    if (btnLogoutDash) btnLogoutDash.addEventListener("click", handleLogout);

    const btnOpenWizard = document.getElementById("btn-open-create-wizard");
    const btnBackToDash = document.getElementById("btn-back-to-dashboard");
    if (btnOpenWizard) btnOpenWizard.addEventListener("click", showWizardView);
    if (btnBackToDash) btnBackToDash.addEventListener("click", showDashboardView);

    // Inicializar la vista adecuada según sesión activa
    const storedUser = sessionStorage.getItem("costa_user_session");
    if (storedUser) {
        try {
            APP_STATE.currentUser = JSON.parse(storedUser);
            showDashboardView();
        } catch (e) {
            showAuthView();
        }
    } else {
        showAuthView();
    }
});

// Funciones globales expuestas
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.showDashboardView = showDashboardView;
window.showWizardView = showWizardView;
window.handleLogout = handleLogout;
window.saveCharacter = saveCharacter;
