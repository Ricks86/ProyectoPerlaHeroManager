/**
 * ProyectoRol - Inicialización de la Aplicación Frontend
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando Asistente de Creación de Personaje (ProyectoRol)...");
    const wizard = new CharacterWizard();
    wizard.init();
});
