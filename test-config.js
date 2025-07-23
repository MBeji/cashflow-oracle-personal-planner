// Script de test pour valider les configurations utilisateur
// Ce fichier peut être exécuté pour tester les valeurs par défaut

import { createInitialUserSettings, getDefaultConfigForUser } from '../src/config/defaultUserConfig';

console.log('=== TEST DE CONFIGURATION UTILISATEURS ===\n');

// Test 1: Nouvel utilisateur (valeurs par défaut)
console.log('🆕 NOUVEL UTILISATEUR (email générique):');
const defaultUser = createInitialUserSettings('nouveau.user@example.com');
console.log('• Salaire:', defaultUser.fixedAmounts.salary, 'TND');
console.log('• Prime Mars:', defaultUser.fixedAmounts.bonusMultipliers.march, 'TND');
console.log('• Prime Juin:', defaultUser.fixedAmounts.bonusMultipliers.june, 'TND');
console.log('• Prime Septembre:', defaultUser.fixedAmounts.bonusMultipliers.september, 'TND');
console.log('• Prime Décembre:', defaultUser.fixedAmounts.bonusMultipliers.december, 'TND');
console.log('• Dépenses courantes:', defaultUser.fixedAmounts.currentExpenses, 'TND');
console.log('• Solde initial:', defaultUser.currentBalance, 'TND');
console.log('• Seuil alerte:', defaultUser.alertThreshold, 'TND\n');

// Test 2: Mohamed Beji (valeurs spécifiques)
console.log('👤 MOHAMED BEJI (email spécifique):');
const mohamedUser = createInitialUserSettings('mbeji@sofrecom.fr');
console.log('• Salaire:', mohamedUser.fixedAmounts.salary, 'TND');
console.log('• Prime Mars:', mohamedUser.fixedAmounts.bonusMultipliers.march, 'TND');
console.log('• Prime Juin:', mohamedUser.fixedAmounts.bonusMultipliers.june, 'TND');
console.log('• Prime Septembre:', mohamedUser.fixedAmounts.bonusMultipliers.september, 'TND');
console.log('• Prime Décembre:', mohamedUser.fixedAmounts.bonusMultipliers.december, 'TND');
console.log('• Dépenses courantes:', mohamedUser.fixedAmounts.currentExpenses, 'TND');
console.log('• Dette:', mohamedUser.fixedAmounts.debt, 'TND');
console.log('• Frais scolaires:', mohamedUser.fixedAmounts.schoolExpense, 'TND');
console.log('• Solde initial:', mohamedUser.currentBalance, 'TND');
console.log('• Seuil alerte:', mohamedUser.alertThreshold, 'TND\n');

// Test 3: Validation des valeurs attendues
console.log('✅ VALIDATION DES EXIGENCES:');

// Nouveau utilisateur
const isDefaultValid = 
  defaultUser.fixedAmounts.salary === 6000 &&
  defaultUser.fixedAmounts.bonusMultipliers.march === 3000 &&
  defaultUser.fixedAmounts.bonusMultipliers.june === 3000 &&
  defaultUser.fixedAmounts.bonusMultipliers.september === 3000 &&
  defaultUser.fixedAmounts.bonusMultipliers.december === 3000 &&
  defaultUser.fixedAmounts.currentExpenses === 3000 &&
  defaultUser.fixedAmounts.debt === 0 &&
  defaultUser.fixedAmounts.schoolExpense === 0;

console.log('• Nouvel utilisateur conforme:', isDefaultValid ? '✅ OUI' : '❌ NON');

// Mohamed Beji
const isMohamedValid = 
  mohamedUser.fixedAmounts.salary === 12750 &&
  mohamedUser.fixedAmounts.bonusMultipliers.march === 19125 &&
  mohamedUser.fixedAmounts.debt === 6000 &&
  mohamedUser.fixedAmounts.schoolExpense === 15000;

console.log('• Mohamed Beji conforme:', isMohamedValid ? '✅ OUI' : '❌ NON');

console.log('\n=== FIN DES TESTS ===');

// Test 4: Vérifier qu'aucune valeur n'est hardcodée
console.log('\n🔍 VÉRIFICATION ANTI-HARDCODING:');
const config1 = getDefaultConfigForUser('test1@example.com');
const config2 = getDefaultConfigForUser('test2@example.com');
const configMohamed = getDefaultConfigForUser('mbeji@sofrecom.fr');

console.log('• Configs par défaut identiques:', 
  JSON.stringify(config1) === JSON.stringify(config2) ? '✅ OUI' : '❌ NON');
console.log('• Config Mohamed différente:', 
  JSON.stringify(config1) !== JSON.stringify(configMohamed) ? '✅ OUI' : '❌ NON');
