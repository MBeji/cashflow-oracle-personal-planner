#!/bin/bash

# Script de test Chrome iPhone
echo "🧪 Testing Chrome iPhone compatibility..."

# Obtenir l'IP locale pour tester sur téléphone
IP=$(ipconfig | grep "IPv4" | tail -1 | cut -d ':' -f 2 | tr -d ' ')
PORT=8085

echo "📱 Test URLs for Chrome iPhone:"
echo "- Local: http://localhost:$PORT/"
echo "- Network: http://$IP:$PORT/"
echo "- Debug: http://$IP:$PORT/debug"
echo ""
echo "🔧 Debugging steps:"
echo "1. Open Chrome on iPhone"
echo "2. Navigate to http://$IP:$PORT/"
echo "3. If app doesn't load, try http://$IP:$PORT/debug"
echo "4. Check console for errors"
echo "5. Try refreshing (pull down)"
echo ""
echo "📋 Quick checks:"
echo "- Is the app loading?"
echo "- Are there JavaScript errors?"
echo "- Do touch interactions work?"
echo "- Is the layout responsive?"
echo ""
echo "🚨 If still not working:"
echo "- Try the fallback: Replace index.html with index-chrome-ios.html"
echo "- Clear Chrome cache and cookies"
echo "- Test in Safari for comparison"
echo "- Check network connectivity"
