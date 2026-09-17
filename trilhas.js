// A página usa links HTML para navegação, mantendo o comportamento simples
// e compatível com a estrutura atual do SmartPath.

document.querySelectorAll('.trilha-card').forEach((card) => {
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            card.click();
        }
    });
});
