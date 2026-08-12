/**
 * ProyectoRol - Lógica del Asistente de Creación de Personajes (Character Wizard)
 * Regla Estricta "Vieja Escuela": Tirada Única Definitiva (Sin relanzamientos)
 */

class CharacterWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;

        // Estado del personaje
        this.character = {
            name: "",
            race: "",
            characterClass: "",
            level: 1,
            experience: 0,
            
            // Regla Estricta: Control de tirada única de atributos
            hasRolledStats: false,
            rawRolls: [],          // Los 7 resultados de 3d6
            discardedRollIndex: -1,// Índice de la tirada descartada
            stats: {
                fue: null,
                des: null,
                con: null,
                intStat: null,
                sab: null,
                car: null
            },

            // Paso 3: Habilidades (Puntos asignados max 1 por habilidad, total 4)
            skillsPool: 4,
            skills: {
                alerta: 0,
                comunicacion: 0,
                manipulacion: 0,
                erudicion: 0,
                subterfugio: 0,
                supervivencia: 0
            },

            // Paso 4: Rasgos derivados
            derivedStats: {
                hitDice: "d8",
                maxHp: 8,
                currentHp: 8,
                movement: 12,
                defense: 10,
                bonusChoice: "ATQ" // "INS", "ATQ", "POD"
            },

            // Paso 5: Economía y Tienda
            economy: {
                startingGoldRoll: 0, // Suma de 3d6
                initialGoldInMo: 0,  // (3d6) * 5
                hasRolledGold: false,// Regla Estricta: Control de tirada única de oro
                currentMo: 0,
                currentMp: 0,
                currentMc: 0
            },
            inventory: []
        };
    }

    init() {
        this.bindEvents();
        this.renderStep(1);
        this.updatePreviewCard();
    }

    bindEvents() {
        // Navegación del Wizard
        document.getElementById("btn-prev").addEventListener("click", () => this.prevStep());
        document.getElementById("btn-next").addEventListener("click", () => this.nextStep());

        // Paso 1: Selección de Raza y Clase
        document.getElementById("char-name").addEventListener("input", (e) => {
            this.character.name = e.target.value.trim();
            this.updatePreviewCard();
        });

        document.getElementById("select-race").addEventListener("change", (e) => {
            this.character.race = e.target.value;
            this.updateRacialAndClassTalents();
            this.calculateDerivedStats();
            this.updatePreviewCard();
        });

        document.getElementById("select-class").addEventListener("change", (e) => {
            this.character.characterClass = e.target.value;
            this.updateRacialAndClassTalents();
            this.calculateDerivedStats();
            this.updatePreviewCard();
        });

        // Paso 2: Lanzamiento Único de Atributos
        document.getElementById("btn-roll-stats").addEventListener("click", () => this.rollAttributes3d6());
        document.getElementById("btn-auto-discard-lowest").addEventListener("click", () => this.autoDiscardLowestRoll());

        // Paso 4: Bonos Homebrew (INS, ATQ, POD)
        document.querySelectorAll(".bonus-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const bonus = e.currentTarget.dataset.bonus;
                this.character.derivedStats.bonusChoice = bonus;
                document.querySelectorAll(".bonus-btn").forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");
                this.updatePreviewCard();
            });
        });

        // Paso 5: Oro Inicial Único y Tienda
        document.getElementById("btn-roll-gold").addEventListener("click", () => this.rollStartingGold());

        // Guardar Personaje
        document.getElementById("btn-save-character").addEventListener("click", () => this.finishAndSaveCharacter());
        
        // Modal de JSON
        document.getElementById("btn-close-modal").addEventListener("click", () => {
            document.getElementById("json-modal").classList.remove("open");
        });
        document.getElementById("btn-copy-json").addEventListener("click", () => {
            const jsonStr = document.getElementById("json-preview-text").textContent;
            navigator.clipboard.writeText(jsonStr);
            alert("¡JSON copiado al portapapeles!");
        });
        document.getElementById("btn-download-json").addEventListener("click", () => {
            this.downloadJSON();
        });
    }

    renderStep(step) {
        this.currentStep = step;

        // Actualizar barra de navegación de pasos
        document.querySelectorAll(".step-item").forEach(item => {
            const itemStep = parseInt(item.dataset.step);
            item.classList.remove("active", "completed");
            if (itemStep === step) {
                item.classList.add("active");
            } else if (itemStep < step) {
                item.classList.add("completed");
            }
        });

        // Ocultar todas las secciones y mostrar la activa
        document.querySelectorAll(".wizard-step-content").forEach(content => {
            content.classList.remove("active");
        });
        const currentContent = document.getElementById(`step-content-${step}`);
        if (currentContent) currentContent.classList.add("active");

        // Botones de navegación
        const btnPrev = document.getElementById("btn-prev");
        const btnNext = document.getElementById("btn-next");
        const btnSave = document.getElementById("btn-save-character");

        btnPrev.disabled = step === 1;

        if (step === this.totalSteps) {
            btnNext.style.display = "none";
            btnSave.style.display = "inline-flex";
        } else {
            btnNext.style.display = "inline-flex";
            btnSave.style.display = "none";
        }

        // Renderizados específicos por paso
        if (step === 1) {
            this.updateRacialAndClassTalents();
        } else if (step === 2) {
            this.renderRollsPool();
            this.renderStatsAssignmentTable();
        } else if (step === 3) {
            this.renderSkillsStep();
        } else if (step === 4) {
            this.renderDerivedStatsStep();
        } else if (step === 5) {
            this.renderShopStep();
        }
    }

    nextStep() {
        if (!this.validateStep(this.currentStep)) return;
        if (this.currentStep < this.totalSteps) {
            this.renderStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.renderStep(this.currentStep - 1);
        }
    }

    validateStep(step) {
        if (step === 1) {
            if (!this.character.name) {
                alert("Por favor, ingresa el Nombre de tu personaje.");
                return false;
            }
            if (!this.character.race) {
                alert("Por favor, selecciona una Raza.");
                return false;
            }
            if (!this.character.characterClass) {
                alert("Por favor, selecciona una Clase.");
                return false;
            }
        }

        if (step === 2) {
            if (!this.character.hasRolledStats || this.character.rawRolls.length < 7) {
                alert("Debes realizar el lanzamiento de dados (3d6 x 7 veces).");
                return false;
            }
            if (this.character.discardedRollIndex === -1) {
                alert("Debes descartar 1 de las 7 tiradas de dados antes de continuar.");
                return false;
            }
            const stats = this.character.stats;
            const unassigned = Object.keys(stats).filter(key => stats[key] === null || stats[key] === undefined);
            if (unassigned.length > 0) {
                alert(`Debes asignar un valor a los 6 atributos. Faltan por asignar: ${unassigned.map(k => k.toUpperCase().replace("INTSTAT", "INT")).join(", ")}`);
                return false;
            }
        }

        if (step === 3) {
            if (this.character.skillsPool > 0) {
                const proceed = confirm(`Tienes ${this.character.skillsPool} punto(s) de habilidad sin asignar. ¿Deseas continuar de todos modos?`);
                if (!proceed) return false;
            }
        }

        if (step === 4) {
            if (!this.character.derivedStats.bonusChoice) {
                alert("Por favor, selecciona tu bono Homebrew de +1 (Instintos, Ataque o Poder).");
                return false;
            }
        }

        return true;
    }

    // ==========================================
    // PASO 1: DATOS BÁSICOS & TALENTOS DINÁMICOS
    // ==========================================
    updateRacialAndClassTalents() {
        const talentsContainer = document.getElementById("talents-display-container");
        talentsContainer.innerHTML = "";

        const raceData = GAME_DATA.races[this.character.race];
        const classData = GAME_DATA.classes[this.character.characterClass];

        if (!raceData && !classData) {
            talentsContainer.innerHTML = `<div class="empty-state">Selecciona una raza y clase para visualizar los talentos y rasgos pasivos oficiales.</div>`;
            return;
        }

        let combinedTalents = [];
        if (raceData) {
            raceData.talents.forEach(t => combinedTalents.push({ ...t, type: `Raza (${raceData.name})` }));
        }
        if (classData) {
            classData.talents.forEach(t => combinedTalents.push({ ...t, type: `Clase (${classData.name})` }));
        }

        combinedTalents.forEach(talent => {
            const card = document.createElement("div");
            card.className = "talent-card";
            card.innerHTML = `
                <div class="talent-header">
                    <span class="talent-title">${talent.name}</span>
                    <span class="talent-badge ${talent.origin === 'Raza' ? 'badge-race' : 'badge-class'}">${talent.type}</span>
                </div>
                <p class="talent-desc">${talent.description}</p>
            `;
            talentsContainer.appendChild(card);
        });
    }

    // ==========================================
    // PASO 2: LANZAMIENTO ÚNICO DE ATRIBUTOS (3d6 x 7)
    // REGLA: SIN RELANZAMIENTOS ("Vives con tus dados")
    // ==========================================
    rollAttributes3d6() {
        // Bloqueo estricto si ya se realizaron los dados
        if (this.character.hasRolledStats) {
            alert("⚠️ Regla Oficial 'Vieja Escuela': No se permite relanzar dados. Tu primer lanzamiento es definitivo.");
            return;
        }

        this.character.rawRolls = [];
        this.character.discardedRollIndex = -1;
        this.resetStatsAssignment();

        for (let i = 0; i < 7; i++) {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const d3 = Math.floor(Math.random() * 6) + 1;
            const total = d1 + d2 + d3;
            this.character.rawRolls.push({
                index: i,
                dice: [d1, d2, d3],
                total: total,
                assignedTo: null
            });
        }

        // Marcar como tirado definitivamente
        this.character.hasRolledStats = true;

        // Deshabilitar botón de lanzamiento
        const btnRoll = document.getElementById("btn-roll-stats");
        btnRoll.disabled = true;
        btnRoll.innerHTML = `🔒 Lanzamiento Realizado (1 / 1)`;
        btnRoll.classList.add("btn-disabled-completed");

        this.renderRollsPool();
        this.renderStatsAssignmentTable();
    }

    autoDiscardLowestRoll() {
        if (this.character.rawRolls.length === 0) return;

        let lowestIndex = 0;
        let minVal = 99;

        this.character.rawRolls.forEach((roll, idx) => {
            if (roll.total < minVal) {
                minVal = roll.total;
                lowestIndex = idx;
            }
        });

        this.selectDiscardRoll(lowestIndex);
    }

    selectDiscardRoll(index) {
        if (this.character.discardedRollIndex === index) {
            this.character.discardedRollIndex = -1;
        } else {
            this.character.discardedRollIndex = index;
            const roll = this.character.rawRolls[index];
            if (roll.assignedTo) {
                this.character.stats[roll.assignedTo] = null;
                roll.assignedTo = null;
            }
        }

        this.renderRollsPool();
        this.renderStatsAssignmentTable();
        this.updatePreviewCard();
    }

    resetStatsAssignment() {
        this.character.stats = {
            fue: null,
            des: null,
            con: null,
            intStat: null,
            sab: null,
            car: null
        };
    }

    renderRollsPool() {
        const poolContainer = document.getElementById("rolls-pool-container");
        const actionsBar = document.getElementById("rolls-actions-bar");

        if (!this.character.hasRolledStats) {
            poolContainer.innerHTML = `<div class="empty-state">Haz clic en "Lanzar 7x 3d6" para generar las tiradas de atributos. Recuera: ¡Solo tienes un intento!</div>`;
            actionsBar.style.display = "none";
            return;
        }

        actionsBar.style.display = "flex";
        poolContainer.innerHTML = "";

        this.character.rawRolls.forEach((roll, idx) => {
            const isDiscarded = this.character.discardedRollIndex === idx;
            const isAssigned = roll.assignedTo !== null;

            const card = document.createElement("div");
            card.className = `roll-card ${isDiscarded ? 'discarded' : ''} ${isAssigned ? 'assigned' : ''}`;
            card.innerHTML = `
                <div class="roll-value">${roll.total}</div>
                <div class="roll-dice-breakdown">(${roll.dice.join(" + ")})</div>
                <div class="roll-status">
                    ${isDiscarded ? '<span class="tag-discarded">DESCARTADO</span>' : 
                      isAssigned ? `<span class="tag-assigned">${roll.assignedTo.toUpperCase().replace("INTSTAT", "INT")}</span>` : 
                      '<span class="tag-available">DISPONIBLE</span>'}
                </div>
                <button class="btn-discard-toggle" title="Hacer clic para descartar esta tirada">
                    ${isDiscarded ? 'Restaurar' : 'Descartar'}
                </button>
            `;

            card.querySelector(".btn-discard-toggle").addEventListener("click", (e) => {
                e.stopPropagation();
                this.selectDiscardRoll(idx);
            });

            poolContainer.appendChild(card);
        });
    }

    renderStatsAssignmentTable() {
        const tableContainer = document.getElementById("stats-assignment-container");
        const statKeys = GAME_DATA.attributesList;

        const availableRolls = this.character.rawRolls.filter((r, idx) => idx !== this.character.discardedRollIndex);

        if (!this.character.hasRolledStats) {
            tableContainer.innerHTML = `<div class="empty-state">Genera primero tus tiradas para asignar atributos.</div>`;
            return;
        }

        let html = `<div class="stats-grid">`;

        statKeys.forEach(stat => {
            const currentValue = this.character.stats[stat.code];
            const modVal = currentValue !== null ? GAME_DATA.getAttributeModifier(currentValue) : null;
            const modStr = modVal !== null ? (modVal >= 0 ? `+${modVal}` : `${modVal}`) : "";

            html += `
                <div class="stat-assign-row">
                    <div class="stat-assign-info">
                        <span class="stat-name">${stat.name}</span>
                        <span class="stat-desc">${stat.desc}</span>
                    </div>
                    <div class="stat-assign-selector">
                        <select data-stat="${stat.code}" class="stat-select">
                            <option value="">-- Asignar --</option>
                            ${availableRolls.map(r => {
                                const isSelectedInThis = currentValue === r.total && r.assignedTo === stat.code;
                                const isUsedElsewhere = r.assignedTo !== null && r.assignedTo !== stat.code;
                                const mod = GAME_DATA.getAttributeModifier(r.total);
                                const modLabel = mod >= 0 ? `+${mod}` : `${mod}`;
                                return `<option value="${r.index}" ${isSelectedInThis ? 'selected' : ''} ${isUsedElsewhere ? 'disabled' : ''}>
                                    Valor: ${r.total} (Mod: ${modLabel}) ${isUsedElsewhere ? '- En ' + r.assignedTo.toUpperCase().replace("INTSTAT", "INT") : ''}
                                </option>`;
                            }).join("")}
                        </select>
                        <div class="stat-value-badge ${currentValue !== null ? 'has-value' : ''}">
                            ${currentValue !== null ? `${currentValue}<small style="font-size: 0.65rem; display: block;">Mod ${modStr}</small>` : '-'}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        tableContainer.innerHTML = html;

        tableContainer.querySelectorAll(".stat-select").forEach(select => {
            select.addEventListener("change", (e) => {
                const statKey = e.target.dataset.stat;
                const rollIndexStr = e.target.value;

                const previousRoll = this.character.rawRolls.find(r => r.assignedTo === statKey);
                if (previousRoll) {
                    previousRoll.assignedTo = null;
                }

                if (rollIndexStr === "") {
                    this.character.stats[statKey] = null;
                } else {
                    const rollIndex = parseInt(rollIndexStr);
                    const selectedRoll = this.character.rawRolls[rollIndex];

                    if (selectedRoll.assignedTo) {
                        this.character.stats[selectedRoll.assignedTo] = null;
                    }

                    selectedRoll.assignedTo = statKey;
                    this.character.stats[statKey] = selectedRoll.total;
                }

                this.renderRollsPool();
                this.renderStatsAssignmentTable();
                this.updatePreviewCard();
            });
        });
    }

    // ==========================================
    // PASO 3: HABILIDADES (4 Puntos, Max +1 por habilidad)
    // ==========================================
    renderSkillsStep() {
        const poolDisplay = document.getElementById("skills-pool-count");
        poolDisplay.textContent = this.character.skillsPool;

        const skillsContainer = document.getElementById("skills-list-container");
        skillsContainer.innerHTML = "";

        GAME_DATA.skillsList.forEach(skill => {
            const pointsAssigned = this.character.skills[skill.id] || 0;

            const skillCard = document.createElement("div");
            skillCard.className = `skill-card ${pointsAssigned > 0 ? 'allocated' : ''}`;
            skillCard.innerHTML = `
                <div class="skill-info">
                    <span class="skill-title">${skill.name}</span>
                    <span class="skill-desc">${skill.description}</span>
                </div>
                <div class="skill-controls">
                    <button class="btn-skill-adjust btn-minus" data-skill="${skill.id}" ${pointsAssigned === 0 ? 'disabled' : ''}>-</button>
                    <span class="skill-value-badge">+${pointsAssigned}</span>
                    <button class="btn-skill-adjust btn-plus" data-skill="${skill.id}" ${(pointsAssigned >= 1 || this.character.skillsPool <= 0) ? 'disabled' : ''}>+</button>
                </div>
            `;

            skillCard.querySelector(".btn-plus").addEventListener("click", () => {
                if (this.character.skillsPool > 0 && (this.character.skills[skill.id] || 0) < 1) {
                    this.character.skills[skill.id] = (this.character.skills[skill.id] || 0) + 1;
                    this.character.skillsPool--;
                    this.renderSkillsStep();
                    this.updatePreviewCard();
                }
            });

            skillCard.querySelector(".btn-minus").addEventListener("click", () => {
                if ((this.character.skills[skill.id] || 0) > 0) {
                    this.character.skills[skill.id]--;
                    this.character.skillsPool++;
                    this.renderSkillsStep();
                    this.updatePreviewCard();
                }
            });

            skillsContainer.appendChild(skillCard);
        });
    }

    // ==========================================
    // PASO 4: RASGOS DERIVADOS Y BONO HOMEBREW
    // ==========================================
    calculateDerivedStats() {
        const raceData = GAME_DATA.races[this.character.race];
        const classData = GAME_DATA.classes[this.character.characterClass];

        const hitDice = classData ? classData.hitDice : "d8";
        const baseHp = classData ? classData.maxHpBonus : 8;
        const conScore = this.character.stats.con;
        const conMod = GAME_DATA.getAttributeModifier(conScore);

        // PV = Máximo valor del DA + Modificador por CON (VE_jdr.pdf pág. 4)
        const maxHp = Math.max(1, baseHp + conMod);
        const movement = raceData ? raceData.movement : 12;

        // Defensa = 10 + Mod de DES (VE_jdr.pdf pág. 4)
        const desMod = GAME_DATA.getAttributeModifier(this.character.stats.des);
        const defense = 10 + desMod;

        this.character.derivedStats.hitDice = hitDice;
        this.character.derivedStats.maxHp = maxHp;
        this.character.derivedStats.currentHp = maxHp;
        this.character.derivedStats.movement = movement;
        this.character.derivedStats.defense = defense;
    }

    renderDerivedStatsStep() {
        this.calculateDerivedStats();

        document.getElementById("derived-da").textContent = this.character.derivedStats.hitDice;
        document.getElementById("derived-pv").textContent = `${this.character.derivedStats.maxHp} PV`;
        document.getElementById("derived-mov").textContent = `${this.character.derivedStats.movement} m`;
        document.getElementById("derived-def").textContent = this.character.derivedStats.defense;

        document.querySelectorAll(".bonus-btn").forEach(btn => {
            if (btn.dataset.bonus === this.character.derivedStats.bonusChoice) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // ==========================================
    // PASO 5: ECONOMÍA Y TIENDA BASE
    // REGLA: ORO ÚNICO (Sin relanzamiento)
    // ==========================================
    rollStartingGold() {
        if (this.character.economy.hasRolledGold) {
            alert("⚠️ Regla Oficial 'Vieja Escuela': Tu oro inicial ya fue lanzado. No se permite relanzar.");
            return;
        }

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2 + d3;
        const goldMo = sum * 5;

        this.character.economy.startingGoldRoll = sum;
        this.character.economy.initialGoldInMo = goldMo;
        this.character.economy.currentMo = goldMo;
        this.character.economy.currentMp = 0;
        this.character.economy.currentMc = 0;
        this.character.economy.hasRolledGold = true;
        this.character.inventory = [];

        // Deshabilitar botón de oro
        const btnGold = document.getElementById("btn-roll-gold");
        btnGold.disabled = true;
        btnGold.innerHTML = `🔒 Oro Inicial Lanzado (1 / 1)`;
        btnGold.classList.add("btn-disabled-completed");

        this.renderShopStep();
        this.updatePreviewCard();
    }

    renderShopStep() {
        const goldContainer = document.getElementById("gold-roll-result-container");
        const shopContent = document.getElementById("shop-main-content");

        if (!this.character.economy.hasRolledGold) {
            goldContainer.innerHTML = `<div class="empty-state">Tira tus dados 3d6 para calcular el oro inicial de tu personaje (Fórmula: 3d6 × 5 mo). Recuérdalo: ¡Solo se permite 1 tiro definitivo!</div>`;
            shopContent.style.display = "none";
            return;
        }

        goldContainer.innerHTML = `
            <div class="gold-rolled-banner">
                <div class="gold-roll-details">
                    <span class="gold-roll-title">Oro Inicial Obtenido (Lanzamiento Único):</span>
                    <span class="gold-roll-formula">(3d6 sumaron ${this.character.economy.startingGoldRoll}) × 5 = <strong>${this.character.economy.initialGoldInMo} mo</strong></span>
                </div>
            </div>
        `;
        shopContent.style.display = "grid";

        this.updateWalletDisplay();
        this.renderShopCatalog();
        this.renderInventoryList();
    }

    getExactCoinBreakdown() {
        const totalCopper = Math.round(
            (this.character.economy.currentMo || 0) * 100 +
            (this.character.economy.currentMp || 0) * 10 +
            (this.character.economy.currentMc || 0)
        );
        const mo = Math.floor(totalCopper / 100);
        const remCopper = totalCopper % 100;
        const mp = Math.floor(remCopper / 10);
        const mc = remCopper % 10;
        return { mo, mp, mc };
    }

    updateWalletDisplay() {
        const coins = this.getExactCoinBreakdown();
        document.getElementById("wallet-mo").textContent = `${coins.mo} mo`;
        document.getElementById("wallet-mp").textContent = `${coins.mp} mp`;
        document.getElementById("wallet-mc").textContent = `${coins.mc} mc`;
    }

    renderShopCatalog() {
        const catalogContainer = document.getElementById("shop-catalog-container");
        catalogContainer.innerHTML = "";

        const categories = ["Armas", "Armaduras", "Equipo"];

        categories.forEach(cat => {
            const itemsInCat = GAME_DATA.shopCatalog.filter(i => i.category === cat);
            if (itemsInCat.length === 0) return;

            const section = document.createElement("div");
            section.className = "shop-category-section";
            section.innerHTML = `<h4 class="category-header">${cat}</h4>`;

            const grid = document.createElement("div");
            grid.className = "shop-items-grid";

            itemsInCat.forEach(item => {
                const currentCoins = this.getExactCoinBreakdown();
                const totalMoAvailable = currentCoins.mo + (currentCoins.mp / 10) + (currentCoins.mc / 100);
                const canAfford = totalMoAvailable >= item.priceMo;
                const card = document.createElement("div");
                card.className = `shop-item-card ${canAfford ? '' : 'cannot-afford'}`;
                card.innerHTML = `
                    <div class="shop-item-info">
                        <span class="shop-item-title">${item.name}</span>
                        <span class="shop-item-price">${item.priceMo} mo</span>
                    </div>
                    <p class="shop-item-desc">${item.description}</p>
                    <button class="btn-buy-item" data-item-id="${item.id}" ${canAfford ? '' : 'disabled'}>
                        Comprar
                    </button>
                `;

                card.querySelector(".btn-buy-item").addEventListener("click", () => {
                    this.buyShopItem(item);
                });

                grid.appendChild(card);
            });

            section.appendChild(grid);
            catalogContainer.appendChild(section);
        });
    }

    buyShopItem(item) {
        const currentCoins = this.getExactCoinBreakdown();
        const totalMoAvailable = currentCoins.mo + (currentCoins.mp / 10) + (currentCoins.mc / 100);

        if (totalMoAvailable < item.priceMo) {
            alert("No tienes suficiente oro para comprar este objeto.");
            return;
        }

        const newTotalMo = totalMoAvailable - item.priceMo;
        const totalCopper = Math.round(newTotalMo * 100);
        this.character.economy.currentMo = Math.floor(totalCopper / 100);
        const remCopper = totalCopper % 100;
        this.character.economy.currentMp = Math.floor(remCopper / 10);
        this.character.economy.currentMc = remCopper % 10;

        const existing = this.character.inventory.find(i => i.id === item.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.character.inventory.push({
                id: item.id,
                name: item.name,
                category: item.category,
                priceInMo: item.priceMo,
                quantity: 1
            });
        }

        this.renderShopStep();
        this.updatePreviewCard();
    }

    sellInventoryItem(itemId) {
        const itemIdx = this.character.inventory.findIndex(i => i.id === itemId);
        if (itemIdx === -1) return;

        const item = this.character.inventory[itemIdx];
        const currentCoins = this.getExactCoinBreakdown();
        const totalMoAvailable = currentCoins.mo + (currentCoins.mp / 10) + (currentCoins.mc / 100);
        const newTotalMo = totalMoAvailable + item.priceInMo;
        const totalCopper = Math.round(newTotalMo * 100);

        this.character.economy.currentMo = Math.floor(totalCopper / 100);
        const remCopper = totalCopper % 100;
        this.character.economy.currentMp = Math.floor(remCopper / 10);
        this.character.economy.currentMc = remCopper % 10;

        if (item.quantity > 1) {
            item.quantity--;
        } else {
            this.character.inventory.splice(itemIdx, 1);
        }

        this.renderShopStep();
        this.updatePreviewCard();
    }

    renderInventoryList() {
        const inventoryContainer = document.getElementById("inventory-list-container");
        inventoryContainer.innerHTML = "";

        if (this.character.inventory.length === 0) {
            inventoryContainer.innerHTML = `<div class="empty-state">Tu inventario está vacío. Explora la tienda y adquiere tu equipo de aventura.</div>`;
            return;
        }

        this.character.inventory.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.className = "inventory-item-row";
            itemRow.innerHTML = `
                <div class="inventory-item-details">
                    <span class="inventory-item-name">${item.name} (x${item.quantity})</span>
                    <span class="inventory-item-sub">${item.category} • ${item.priceInMo} mo c/u</span>
                </div>
                <button class="btn-sell-item" data-item-id="${item.id}" title="Vender objeto y recuperar oro">Vender</button>
            `;

            itemRow.querySelector(".btn-sell-item").addEventListener("click", () => {
                this.sellInventoryItem(item.id);
            });

            inventoryContainer.appendChild(itemRow);
        });
    }

    // ==========================================
    // VISTA PREVIA LATERAL DEL PERSONAJE CON MODIFICADORES
    // ==========================================
    updatePreviewCard() {
        document.getElementById("preview-name").textContent = this.character.name || "Sin Nombre";
        document.getElementById("preview-race-class").textContent = 
            `${this.character.race || "Raza"} • ${this.character.characterClass || "Clase"} (Nivel ${this.character.level})`;

        // Atributos y Modificadores de VE_jdr.pdf
        const stats = this.character.stats;
        const formatStat = (score) => {
            if (score === null || score === undefined) return "-";
            const mod = GAME_DATA.getAttributeModifier(score);
            const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
            return `${score} (${modStr})`;
        };

        document.getElementById("preview-fue").textContent = formatStat(stats.fue);
        document.getElementById("preview-des").textContent = formatStat(stats.des);
        document.getElementById("preview-con").textContent = formatStat(stats.con);
        document.getElementById("preview-int").textContent = formatStat(stats.intStat);
        document.getElementById("preview-sab").textContent = formatStat(stats.sab);
        document.getElementById("preview-car").textContent = formatStat(stats.car);

        // Recalcular derivados con modificadores
        this.calculateDerivedStats();

        document.getElementById("preview-hp").textContent = `${this.character.derivedStats.maxHp} / ${this.character.derivedStats.maxHp}`;
        document.getElementById("preview-def").textContent = this.character.derivedStats.defense;
        document.getElementById("preview-mov").textContent = `${this.character.derivedStats.movement} m`;
        document.getElementById("preview-bonus").textContent = `+1 ${this.character.derivedStats.bonusChoice}`;

        const coins = this.getExactCoinBreakdown();
        let displayGold = `${coins.mo} mo`;
        if (coins.mp > 0 || coins.mc > 0) {
            displayGold += ` ${coins.mp} mp ${coins.mc} mc`;
        }
        document.getElementById("preview-gold").textContent = displayGold;
    }

    // ==========================================
    // PASO FINAL: GUARDAR PERSONAJE Y GENERAR JSON
    // ==========================================
    async finishAndSaveCharacter() {
        if (!this.validateStep(1) || !this.validateStep(2) || !this.validateStep(3) || !this.validateStep(4)) {
            return;
        }

        const raceData = GAME_DATA.races[this.character.race];
        const classData = GAME_DATA.classes[this.character.characterClass];
        let talentsList = [];

        if (raceData) {
            raceData.talents.forEach(t => talentsList.push({ name: t.name, origin: "Raza", description: t.description }));
        }
        if (classData) {
            classData.talents.forEach(t => talentsList.push({ name: t.name, origin: "Clase", description: t.description }));
        }

        const coins = this.getExactCoinBreakdown();
        const payload = {
            name: this.character.name,
            race: this.character.race,
            characterClass: this.character.characterClass,
            level: this.character.level,
            experience: this.character.experience,
            stats: {
                fue: this.character.stats.fue,
                des: this.character.stats.des,
                con: this.character.stats.con,
                intStat: this.character.stats.intStat,
                sab: this.character.stats.sab,
                car: this.character.stats.car
            },
            skills: {
                alerta: this.character.skills.alerta || 0,
                comunicacion: this.character.skills.comunicacion || 0,
                manipulacion: this.character.skills.manipulacion || 0,
                erudicion: this.character.skills.erudicion || 0,
                subterfugio: this.character.skills.subterfugio || 0,
                supervivencia: this.character.skills.supervivencia || 0
            },
            derivedStats: {
                hitDice: this.character.derivedStats.hitDice,
                maxHp: this.character.derivedStats.maxHp,
                currentHp: this.character.derivedStats.currentHp,
                movement: this.character.derivedStats.movement,
                defense: this.character.derivedStats.defense,
                bonusChoice: this.character.derivedStats.bonusChoice
            },
            economy: {
                startingGoldRoll: this.character.economy.startingGoldRoll,
                initialGoldInMo: this.character.economy.initialGoldInMo,
                remainingCoins: {
                    mo: coins.mo,
                    mp: coins.mp,
                    mc: coins.mc
                }
            },
            inventory: this.character.inventory,
            talents: talentsList
        };

        const jsonString = JSON.stringify(payload, null, 2);

        if (typeof window.saveCharacter === "function") {
            await window.saveCharacter(payload);
        }

        document.getElementById("json-preview-text").textContent = jsonString;
        document.getElementById("json-modal").classList.add("open");
    }

    downloadJSON() {
        const jsonStr = document.getElementById("json-preview-text").textContent;
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(this.character.name || "personaje").toLowerCase().replace(/\s+/g, "_")}_hoja_personaje.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

window.CharacterWizard = CharacterWizard;
