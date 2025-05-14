/**
 * Service de gestion de l'économie et de la démographie des royaumes
 */

/**
 * Calcule la croissance de la population
 * pop += pop * croissanceBase * (Stabilité/100)
 * @param {Object} kingdom - Le royaume
 * @returns {Object} Les nouvelles valeurs de population
 */
function calculatePopulationGrowth(kingdom) {
    const { population, stats } = kingdom;
    const stabilité = stats.stabilité;
    
    // Déterminer le taux de croissance de base selon la stabilité
    let croissanceBase = 0;
    if (stabilité >= 70) {
        // Boom démographique
        croissanceBase = 0.02;
    } else if (stabilité <= 40) {
        // Stagnation
        croissanceBase = 0;
    } else {
        // Croissance normale, interpolation linéaire entre 0.01 et 0.02
        croissanceBase = 0.01 + ((stabilité - 40) / 30) * 0.01;
    }
    
    // Calculer la nouvelle population
    const croissance = Math.floor(population.total * croissanceBase * (stabilité / 100));
    const nouvellePopulation = population.total + croissance;
    
    // Répartir la croissance entre les classes sociales
    const nouveauxPaysans = Math.floor(croissance * 0.8); // 80% paysans
    const nouveauxBourgeois = Math.floor(croissance * 0.15); // 15% bourgeois
    const nouveauxNobles = croissance - nouveauxPaysans - nouveauxBourgeois; // Le reste en nobles
    
    return {
        total: nouvellePopulation,
        classes: {
            paysans: population.classes.paysans + nouveauxPaysans,
            bourgeois: population.classes.bourgeois + nouveauxBourgeois,
            nobles: population.classes.nobles + nouveauxNobles
        }
    };
}

/**
 * Calcule les revenus d'un royaume
 * revenus = population * (TauxImpôt/100) * (0,5 + Prospérité/100)
 * @param {Object} kingdom - Le royaume
 * @param {Number} tauxImpot - Le taux d'imposition (en %)
 * @returns {Number} Les nouveaux revenus
 */
function calculateRevenues(kingdom, tauxImpot = 10) {
    const { population, stats } = kingdom;
    const prospérité = stats.prospérité;
    
    // Calcul des revenus selon la formule
    return Math.floor(population.total * (tauxImpot / 100) * (0.5 + prospérité / 100));
}

/**
 * Calcule les dépenses administratives d'un royaume
 * Administration: pop × 0,03
 * @param {Object} kingdom - Le royaume
 * @returns {Number} Les dépenses administratives
 */
function calculateAdministrationExpenses(kingdom) {
    const { population } = kingdom;
    
    // Calcul direct selon la formule
    return Math.floor(population.total * 0.03);
}

module.exports = {
    calculatePopulationGrowth,
    calculateRevenues,
    calculateAdministrationExpenses
}; 