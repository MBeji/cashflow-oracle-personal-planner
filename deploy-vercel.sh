#!/bin/bash

# Script de déploiement Vercel pour les 3 versions
echo "🚀 Deploying 3 versions to Vercel..."

# Version 1: Application principale
echo "📱 Deploying main app..."
vercel --prod --yes

# Version 2: Version avec emergency.html accessible
echo "🚨 Emergency version already included in main build"

# Version 3: Version debug spécialisée
echo "🔍 Debug version already included in main build"

echo "✅ All versions deployed!"
echo ""
echo "📋 Production URLs will be:"
echo "- Main app: https://[vercel-url]/"
echo "- Debug page: https://[vercel-url]/debug" 
echo "- Emergency: https://[vercel-url]/emergency.html"
