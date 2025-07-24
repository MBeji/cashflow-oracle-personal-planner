// Test rapide de la configuration Mohamed
// À exécuter dans la console du navigateur (F12)

// Test avec différents emails
const testEmails = [
  'mbeji@sofrecom.fr',
  'mohamed.beji@sofrecom.fr', 
  'mohamed.beji@example.com',
  'test@example.com'
];

testEmails.forEach(email => {
  console.log(`\n🔍 Test pour email: ${email}`);
  
  // Simuler la fonction (copier-coller la logique)
  const mohamedEmails = [
    'mohamed.beji@example.com',
    'mbeji@sofrecom.fr',
    'mohamed.beji@sofrecom.fr',
    'mbeji@gmail.com',
    'mohamed@beji.com',
  ];
  
  if (email && mohamedEmails.includes(email.toLowerCase())) {
    console.log('✅ Configuration Mohamed Beji');
    console.log('💰 Salaire: 12750 TND');
    console.log('🏦 Dette: 6000 TND');
  } else {
    console.log('📋 Configuration par défaut');
    console.log('💰 Salaire: 6000 TND');
    console.log('🏦 Dette: 0 TND');
  }
});

// Instructions:
// 1. Ouvrir F12 (Console du navigateur)
// 2. Copier-coller ce code
// 3. Voir quel email correspond à la config Mohamed
