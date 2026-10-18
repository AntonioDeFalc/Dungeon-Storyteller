/* ===================================================
   1. STATO CENTRALE DELL'APPLICAZIONE
   Contiene tutti i dati vivi del giocatore, dello scontro
   e delle impostazioni del motore narrativo.
   =================================================== */
const gameState = {
  player: {
    name: "Valerius",
    characterClass: "Chierico di Selûne",
    level: 3,
    currentHp: 24,
    maxHp: 28,
    ac: 14,
    spellSlots: 2,
    maxSpellSlots: 3,
    potionsCount: 2,
    turnNumber: 8,
    xp: 1250,
    gold: 45,
    silver: 120,
    copper: 15
  },
  enemy: {
    name: "Guardiano d'Ossa",
    cr: "CR 1",
    currentHp: 22,
    maxHp: 22,
    ac: 13,
    isDefeated: false
  },
  settings: {
    seed: "#9402-A",
    personality: "classic",
    lethality: "normal",
    fontSize: 14,
    tts: false
  },
  currentScreen: "screen-home",
  historyTurns: [
    "Turno 01: Ingresso nel vestibolo della Cripta di Aethelgard con torcia accesa.",
    "Turno 04: Rilevamento di trappole a filo nei gradini e disinnesco con esito positivo.",
    "Turno 08: Sosta esplorativa dinanzi al sepolcro centrale in basalto."
  ]
};

/* ===================================================
   2. ELEMENTI DOM CHIAVE
   Memorizziamo i riferimenti agli elementi HTML principali
   usando document.querySelector per la massima didattica.
   =================================================== */
const appContainer = document.querySelector("#app-container");
const subNav = document.querySelector("#sub-nav");
const subNavTitle = document.querySelector("#sub-nav-title");
const btnSubnavBack = document.querySelector("#btn-subnav-back");
const toastNotification = document.querySelector("#toast-notification");

// Tutte le schermate dell'app
const screens = document.querySelectorAll(".screen");

// Modali
const modalDice = document.querySelector("#modal-dice-resolution");
const modalHistory = document.querySelector("#modal-history-viewer");

/* ===================================================
   3. FUNZIONI DI NAVIGAZIONE E CAMBIO SCHERMATA
   Permettono di mostrare una schermata alla volta e
   gestire la visibilità della barra superiore.
   =================================================== */

/**
 * Mostra la schermata specificata e aggiorna il menu superiore
 * @param {string} screenId - L'id della schermata (es. 'screen-game')
 * @param {string} titleLabel - Il titolo per la barra secondaria
 */
function navigateTo(screenId, titleLabel) {
  // Nascondiamo tutte le schermate togliendo la classe 'active'
  screens.forEach(function(screen) {
    screen.classList.remove("active");
  });

  // Attiviamo la schermata desiderata
  const targetScreen = document.querySelector("#" + screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
    gameState.currentScreen = screenId;
  }

  // Se siamo sulla Home, nascondiamo la sotto-barra, altrimenti la mostriamo
  if (screenId === "screen-home") {
    subNav.style.display = "none";
  } else {
    subNav.style.display = "flex";
    subNavTitle.textContent = titleLabel || "DUNGEON";
  }

  // Aggiorniamo i bottoni tab nella sub-nav
  updateSubNavTabs(screenId);

  // Scorriamo in cima
  window.scrollTo(0, 0);
}

/**
 * Evidenzia l'icona attiva nella barra di navigazione secondaria
 */
function updateSubNavTabs(screenId) {
  const tabMap = {
    "screen-game": "tab-btn-game",
    "screen-combat": "tab-btn-combat",
    "screen-sheet": "tab-btn-sheet",
    "screen-inventory": "tab-btn-inv",
    "screen-settings": "tab-btn-settings"
  };

  // Togliamo la classe active da tutte le linguette
  document.querySelectorAll(".sub-nav-tab-btn").forEach(function(btn) {
    btn.classList.remove("active");
  });

  const activeBtnId = tabMap[screenId];
  if (activeBtnId) {
    const activeBtn = document.querySelector("#" + activeBtnId);
    if (activeBtn) activeBtn.classList.add("active");
  }
}

/* ===================================================
   4. FUNZIONI DI AGGIORNAMENTO GRAFICO (UI UPDATE)
   Sincronizzano i valori numerici di HP, CA e barre
   =================================================== */

/**
 * Aggiorna tutti i contatori della barra superiore del giocatore
 */
function updatePlayerUI() {
  const p = gameState.player;

  // Testo HP e larghezza percentuale della barra verde
  const hpPercent = Math.max(0, Math.min(100, (p.currentHp / p.maxHp) * 100));
  const topbarHpBar = document.querySelector("#topbar-hp-bar");
  const topbarHpText = document.querySelector("#topbar-hp-text");
  if (topbarHpBar) topbarHpBar.style.width = hpPercent + "%";
  if (topbarHpText) topbarHpText.textContent = p.currentHp + " / " + p.maxHp;

  // Pallini per gli slot incantesimi
  const slotsRow = document.querySelector("#topbar-spell-slots");
  if (slotsRow) {
    slotsRow.innerHTML = "";
    for (let i = 0; i < p.maxSpellSlots; i++) {
      const dot = document.createElement("span");
      dot.className = "spell-slot-dot" + (i < p.spellSlots ? "" : " empty");
      slotsRow.appendChild(dot);
    }
  }

  // Turno sulla home
  const homeTurnPill = document.querySelector("#home-turn-pill");
  if (homeTurnPill) homeTurnPill.textContent = "Turno 0" + p.turnNumber;
}

/**
 * Aggiorna lo stato visivo dei punti ferita del nemico
 */
function updateEnemyUI() {
  const e = gameState.enemy;
  const enemyHpBar = document.querySelector("#enemy-hp-bar");
  const enemyHpText = document.querySelector("#enemy-hp-text");

  const enemyPercent = Math.max(0, Math.min(100, (e.currentHp / e.maxHp) * 100));
  if (enemyHpBar) enemyHpBar.style.width = enemyPercent + "%";
  if (enemyHpText) enemyHpText.textContent = e.currentHp + " / " + e.maxHp + " HP";
}

/**
 * Mostra una breve notifica toast fluttuante sullo schermo
 * @param {string} message - Testo del messaggio
 */
function showToast(message) {
  toastNotification.textContent = message;
  toastNotification.classList.add("show");
  setTimeout(function() {
    toastNotification.classList.remove("show");
  }, 2600);
}

/* ===================================================
   5. SISTEMA DI RISOLUZIONE TIRI DI DADO (4.3)
   Simula il tiro del d20 con animazione, calcolo
   matematico e conseguenze narrative immediate.
   =================================================== */

/**
 * Esegue un tiro e apre la finestra modale coi risultati
 * @param {string} actionName - Descrizione dell'azione tentata
 * @param {number} modifier - Bonus da sommare (es. +3)
 * @param {number} dc - Classe Difficoltà (es. 12)
 * @param {string} successText - Conseguenza in caso di successo
 * @param {string} failureText - Conseguenza in caso di fallimento
 */
function executeDiceCheck(actionName, modifier, dc, successText, failureText) {
  // Genera un numero casuale tra 1 e 20
  const d20Roll = Math.floor(Math.random() * 20) + 1;
  const totalScore = d20Roll + modifier;
  const isSuccess = totalScore >= dc;

  // Aggiorniamo i campi del modale
  document.querySelector("#dice-action-recap").textContent = "Azione: " + actionName;
  document.querySelector("#modal-d20-number").textContent = d20Roll;
  document.querySelector("#dice-formula-breakdown").innerHTML =
    "d20 (" + d20Roll + ") + Modificatore (" + (modifier >= 0 ? "+" + modifier : modifier) +
    ") = <strong>Totale " + totalScore + "</strong> vs CD " + dc;

  const badge = document.querySelector("#dice-result-badge");
  const consequences = document.querySelector("#dice-consequences-text");

  if (d20Roll === 20) {
    badge.textContent = "SUCCESSO CRITICO!";
    badge.className = "result-badge success";
    consequences.textContent = successText + " (Colpo Magistrale! Guadagni +100 PE)";
    gameState.player.xp += 100;
  } else if (isSuccess) {
    badge.textContent = "SUCCESSO";
    badge.className = "result-badge success";
    consequences.textContent = successText;
    gameState.player.xp += 50;
  } else {
    badge.textContent = "FALLIMENTO";
    badge.className = "result-badge failure";
    consequences.textContent = failureText;
    // Penalità di 3 HP per fallimento
    gameState.player.currentHp = Math.max(1, gameState.player.currentHp - 3);
    updatePlayerUI();
  }

  // Registriamo il turno nello storico
  gameState.player.turnNumber += 1;
  const turnLog = "Turno 0" + gameState.player.turnNumber + ": " + actionName + " ➔ " + (isSuccess ? "Successo (" : "Fallimento (") + totalScore + " vs CD " + dc + ")";
  gameState.historyTurns.push(turnLog);
  updateHistoryModal();
  updatePlayerUI();

  // Apriamo il modale
  modalDice.classList.add("active");
}

/**
 * Aggiorna l'elenco dei turni nella modale storico
 */
function updateHistoryModal() {
  const container = document.querySelector("#history-log-list");
  if (container) {
    container.innerHTML = "";
    gameState.historyTurns.forEach(function(turn) {
      const p = document.createElement("p");
      p.style.marginBottom = "6px";
      p.textContent = turn;
      container.appendChild(p);
    });
  }
}

/* ===================================================
   6. COMBATTIMENTO A TURNI TATTICO (4.4)
   Gestisce attacchi, magie e reazioni del nemico.
   =================================================== */

/**
 * Aggiunge un messaggio alla cronologia del combattimento
 */
function addCombatLog(text) {
  const box = document.querySelector("#combat-log-box");
  const entry = document.createElement("div");
  entry.className = "combat-log-entry";
  entry.innerHTML = text;
  box.appendChild(entry);
  box.scrollTop = box.scrollHeight;
}

/**
 * Attacco con la Mazza Benedicta
 */
function playerAttack() {
  if (gameState.enemy.isDefeated) return;

  const damage = Math.floor(Math.random() * 6) + 3; // 1d6 + 2
  gameState.enemy.currentHp = Math.max(0, gameState.enemy.currentHp - damage);
  addCombatLog("⚔️ <strong>Valerius</strong> scaglia la Mazza Benedicta: <strong>-" + damage + " HP</strong> al Guardiano!");
  updateEnemyUI();

  checkCombatStatus();
  if (!gameState.enemy.isDefeated) {
    setTimeout(enemyCounterAttack, 700);
  }
}

/**
 * Lancio di un incantesimo radioso
 */
function playerCastSpell() {
  if (gameState.enemy.isDefeated) return;

  if (gameState.player.spellSlots <= 0) {
    showToast("Slot incantesimi esauriti!");
    return;
  }

  gameState.player.spellSlots -= 1;
  updatePlayerUI();

  const spellDamage = Math.floor(Math.random() * 8) + 6; // 8-13 danni radiosi
  gameState.enemy.currentHp = Math.max(0, gameState.enemy.currentHp - spellDamage);
  addCombatLog("✨ <strong>Valerius</strong> invoca la <em>Luce Sacra di Selûne</em>: bagliore radioso infligge <strong>-" + spellDamage + " HP</strong>!");
  updateEnemyUI();

  checkCombatStatus();
  if (!gameState.enemy.isDefeated) {
    setTimeout(enemyCounterAttack, 700);
  }
}

/**
 * Uso rapido di una pozione in combattimento
 */
function playerBonusHeal() {
  if (gameState.player.potionsCount <= 0) {
    showToast("Nessuna pozione disponibile nello zaino!");
    return;
  }

  gameState.player.potionsCount -= 1;
  const healAmount = 7;
  gameState.player.currentHp = Math.min(gameState.player.maxHp, gameState.player.currentHp + healAmount);
  updatePlayerUI();
  addCombatLog("🧪 <strong>Valerius</strong> trangugia una pozione: <strong>+" + healAmount + " HP</strong> ripristinati!");

  if (!gameState.enemy.isDefeated) {
    setTimeout(enemyCounterAttack, 700);
  }
}

/**
 * Manovra tattica di difesa
 */
function playerDodge() {
  addCombatLog("🛡️ <strong>Valerius</strong> alza la guardia: Schivata attiva (+3 CA per questo turno).");
  setTimeout(function() {
    enemyCounterAttack(true);
  }, 600);
}

/**
 * Controffensiva automatica del Guardiano d'Ossa
 */
function enemyCounterAttack(isDodging) {
  if (gameState.enemy.isDefeated) return;

  const hitRoll = Math.floor(Math.random() * 20) + 3;
  const playerAC = isDodging ? gameState.player.ac + 3 : gameState.player.ac;

  if (hitRoll >= playerAC) {
    const damage = Math.floor(Math.random() * 5) + 2; // 2-6 danni
    gameState.player.currentHp = Math.max(1, gameState.player.currentHp - damage);
    updatePlayerUI();
    addCombatLog("💀 Il <strong>Guardiano</strong> colpisce con la scimitarra: <strong>-" + damage + " HP</strong> a Valerius!");
  } else {
    addCombatLog("🛡️ Il fendente del <strong>Guardiano</strong> rimbalza sulla tua corazza!");
  }
}

/**
 * Controlla se il mostro è caduto a 0 HP
 */
function checkCombatStatus() {
  if (gameState.enemy.currentHp <= 0) {
    gameState.enemy.isDefeated = true;
    document.querySelector("#victory-box").style.display = "block";
    addCombatLog("🏆 <strong>VITTORIA!</strong> Il Guardiano si sbriciola.");
    showToast("Nemico sconfitto! Raccogli il bottino.");
  }
}

/* ===================================================
   7. LOGICA INVENTARIO, BOTTINO E ASSISTENTE AI
   =================================================== */

// Oggetto esposto globalmente per i pulsanti inline dell'inventario
window.app = {
  showToast: showToast,

  // Filtra gli oggetti nello zaino per categoria
  filterInventory: function(category, clickedBtn) {
    document.querySelectorAll(".filter-pill").forEach(function(pill) {
      pill.classList.remove("active");
    });
    clickedBtn.classList.add("active");

    const items = document.querySelectorAll(".inv-item-card");
    items.forEach(function(item) {
      if (category === "all" || item.getAttribute("data-category") === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  },

  // Elimina un oggetto dalla vista zaino
  discardItem: function(buttonElement) {
    const card = buttonElement.closest(".inv-item-card");
    if (card) {
      card.remove();
      showToast("Oggetto rimosso dallo zaino.");
    }
  },

  // Raccoglie un singolo oggetto dallo scrigno bottino
  lootSingleItem: function(itemName, buttonElement) {
    buttonElement.disabled = true;
    buttonElement.textContent = "Raccolto";
    buttonElement.style.background = "#e2e8f0";
    showToast(itemName + " aggiunto allo zaino!");
  },

  // Chiede una risposta diegetica all'AI Master su un oggetto
  askAiAboutItem: function(itemName) {
    const aiBox = document.querySelector("#ai-inventory-response");
    aiBox.textContent = "Il Master AI consulta il grimorio per: " + itemName + "...";
    setTimeout(function() {
      aiBox.textContent = "«" + itemName + " è intriso di risonanza sacra della prima era di Aethelgard. Può svelare passaggi segreti nelle cripte.»";
    }, 400);
  }
};

/* ===================================================
   8. ASSEGNAZIONE EVENT LISTENER (INTERAZIONI UTENTE)
   Tutti gli ascoltatori di eventi organizzati in un unico blocco.
   =================================================== */
function initializeEvents() {

  // Tasto Torna nella barra superiore
  btnSubnavBack.addEventListener("click", function() {
    if (gameState.currentScreen === "screen-game") {
      navigateTo("screen-home", "HUB");
    } else {
      navigateTo("screen-game", "CRIPTA");
    }
  });

  // Tab navigazione rapida sub-nav
  document.querySelector("#tab-btn-game").addEventListener("click", function() {
    navigateTo("screen-game", "CRIPTA");
  });
  document.querySelector("#tab-btn-combat").addEventListener("click", function() {
    navigateTo("screen-combat", "SCONTRO TATTICO");
  });
  document.querySelector("#tab-btn-sheet").addEventListener("click", function() {
    navigateTo("screen-sheet", "SCHEDA EROE");
  });
  document.querySelector("#tab-btn-inv").addEventListener("click", function() {
    navigateTo("screen-inventory", "INVENTARIO");
  });
  document.querySelector("#tab-btn-settings").addEventListener("click", function() {
    navigateTo("screen-settings", "CONFIGURAZIONE");
  });

  // --- Home Screen Events ---
  document.querySelector("#btn-resume-adventure").addEventListener("click", function() {
    navigateTo("screen-game", "CRIPTA DI AETHELGARD");
  });

  document.querySelector("#btn-new-character").addEventListener("click", function() {
    navigateTo("screen-sheet", "NUOVO PERSONAGGIO");
    showToast("Creazione nuova scheda con il Master AI");
  });

  document.querySelector("#btn-load-character").addEventListener("click", function() {
    showToast("Campagna 'Valerius' sincronizzata dal cloud!");
    navigateTo("screen-game", "CRIPTA DI AETHELGARD");
  });

  document.querySelector("#btn-open-settings").addEventListener("click", function() {
    navigateTo("screen-settings", "IMPOSTAZIONI");
  });

  document.querySelector("#btn-exit-game").addEventListener("click", function() {
    showToast("Stato salvato sul Grimorio Cloud! Arrivederci.");
  });

  // --- Game Screen Events (Branching Choices & D20) ---
  document.querySelector("#btn-choice-a").addEventListener("click", function() {
    executeDiceCheck(
      "Esamina le rune sacre con Selûne",
      3, // Modificatore Saggezza/Religione +3
      12, // Classe Difficoltà 12
      "Le rune si accendono di bagliore argenteo: comprendi il verso sacro e trovi un rilievo segreto!",
      "La luce runica si oscura respingendo il tocco: una scossa arcana ti infligge -3 HP."
    );
  });

  document.querySelector("#btn-choice-b").addEventListener("click", function() {
    executeDiceCheck(
      "Forza la cerniera in ferro del sarcofago",
      2, // Modificatore Forza +2
      14, // CD 14
      "Con un poderoso sforzo fai saltare il cardine antico: il forziere interno è accessibile!",
      "La leva scivola e il ferro ti schiaccia le nocche: perdi -3 HP e la cripta echeggia."
    );
  });

  document.querySelector("#btn-choice-c").addEventListener("click", function() {
    navigateTo("screen-combat", "SCONTRO TATTICO");
  });

  // Azione Libera dal Prompt dell'Utente
  document.querySelector("#btn-send-free-action").addEventListener("click", function() {
    const inputField = document.querySelector("#input-free-action");
    const actionText = inputField.value.trim();
    if (actionText === "") {
      showToast("Scrivi prima un'azione!");
      return;
    }

    inputField.value = "";
    executeDiceCheck(
      actionText,
      2,
      11,
      "Il Master AI asseconda il tuo piano: l'azione ha pieno successo!",
      "Il Master AI stabilisce un imprevisto: il tentativo incontra resistenza."
    );
  });

  document.querySelector("#btn-goto-combat").addEventListener("click", function() {
    navigateTo("screen-combat", "SCONTRO TATTICO");
  });

  document.querySelector("#btn-goto-loot").addEventListener("click", function() {
    navigateTo("screen-loot", "BOTTINO DELLA CRIPTA");
  });

  // Storico Turni
  document.querySelector("#btn-toggle-history").addEventListener("click", function() {
    updateHistoryModal();
    modalHistory.classList.add("active");
  });

  document.querySelector("#btn-close-history-modal").addEventListener("click", function() {
    modalHistory.classList.remove("active");
  });

  // Chiusura Modale Dado
  document.querySelector("#btn-close-dice-modal").addEventListener("click", function() {
    modalDice.classList.remove("active");
  });

  // --- Combat Screen Events ---
  document.querySelector("#btn-combat-attack").addEventListener("click", playerAttack);
  document.querySelector("#btn-combat-spell").addEventListener("click", playerCastSpell);
  document.querySelector("#btn-combat-bonus").addEventListener("click", playerBonusHeal);
  document.querySelector("#btn-combat-tactical").addEventListener("click", playerDodge);

  document.querySelector("#btn-victory-loot").addEventListener("click", function() {
    navigateTo("screen-loot", "BOTTINO DELLA CRIPTA");
  });

  // --- Loot Screen Events ---
  document.querySelector("#btn-loot-all").addEventListener("click", function() {
    document.querySelectorAll("#loot-items-container .btn-item-action").forEach(function(btn) {
      btn.disabled = true;
      btn.textContent = "Raccolto";
      btn.style.background = "#e2e8f0";
    });
    showToast("Tutte le spoglie e le monete sono state riposte nello zaino!");
  });

  document.querySelector("#btn-loot-to-inventory").addEventListener("click", function() {
    navigateTo("screen-inventory", "GESTIONE ZAINO");
  });

  // --- Character Sheet Events ---
  document.querySelector("#btn-sheet-to-inv").addEventListener("click", function() {
    navigateTo("screen-inventory", "GESTIONE ZAINO");
  });

  // --- Inventory Events ---
  document.querySelector("#btn-use-potion-quick").addEventListener("click", function() {
    if (gameState.player.currentHp >= gameState.player.maxHp) {
      showToast("Punti Ferita già al massimo!");
      return;
    }
    gameState.player.currentHp = Math.min(gameState.player.maxHp, gameState.player.currentHp + 8);
    updatePlayerUI();
    showToast("Pozione bevuta! Punti Ferita ripristinati a " + gameState.player.currentHp + " HP.");
  });

  document.querySelector("#btn-send-inv-ai").addEventListener("click", function() {
    const queryInput = document.querySelector("#input-ai-inv");
    const query = queryInput.value.trim();
    if (query) {
      window.app.askAiAboutItem(query);
      queryInput.value = "";
    }
  });

  document.querySelector("#btn-apply-inventory").addEventListener("click", function() {
    showToast("Modifiche all'equipaggiamento applicate!");
    navigateTo("screen-game", "CRIPTA DI AETHELGARD");
  });

  // --- Settings Events ---
  document.querySelector("#btn-regenerate-seed").addEventListener("click", function() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const letters = ["A", "B", "C", "X", "Ω"];
    const randLetter = letters[Math.floor(Math.random() * letters.length)];
    const newSeed = "#" + randomNum + "-" + randLetter;

    document.querySelector("#setting-seed-input").value = newSeed;
    document.querySelector("#home-seed-label").textContent = newSeed;
    gameState.settings.seed = newSeed;
    showToast("Nuovo Seed Procedurale: " + newSeed);
  });

  document.querySelector("#setting-font-size").addEventListener("input", function(e) {
    const newSize = e.target.value;
    document.documentElement.style.setProperty("--base-font-size", newSize + "px");
  });

  document.querySelector("#btn-save-settings").addEventListener("click", function() {
    showToast("Regole e impostazioni del Master salvate!");
    navigateTo("screen-home", "HUB");
  });

  // Chiudi le modali cliccando sullo sfondo oscurato
  [modalDice, modalHistory].forEach(function(modal) {
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

/* ===================================================
   9. AVVIO DELL'APPLICAZIONE (BOOTSTRAP)
   Inizializza grafici, dati ed eventi al caricamento.
   =================================================== */
document.addEventListener("DOMContentLoaded", function() {
  updatePlayerUI();
  updateEnemyUI();
  initializeEvents();
});
