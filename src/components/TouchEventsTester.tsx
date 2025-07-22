import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

const TouchEventsTester: React.FC = () => {
  const [touchLog, setTouchLog] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const testButtonRef = useRef<HTMLButtonElement>(null);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTouchLog(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const runTouchTest = () => {
    setIsTestRunning(true);
    setTouchLog([]);
    
    addToLog('🧪 Starting Touch Events Test...');
    
    // Test 1: Basic touch support
    const hasTouchStart = 'ontouchstart' in window;
    const hasPointerEvents = 'onpointerdown' in window;
    const hasClick = 'onclick' in window;
    
    addToLog(`Touch Start: ${hasTouchStart ? '✅' : '❌'}`);
    addToLog(`Pointer Events: ${hasPointerEvents ? '✅' : '❌'}`);
    addToLog(`Click Events: ${hasClick ? '✅' : '❌'}`);
    
    // Test 2: Touch event creation
    try {
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      addToLog('Touch Event Creation: ✅');
    } catch (e) {
      addToLog('Touch Event Creation: ❌');
    }
    
    // Test 3: Touch action support
    const testDiv = document.createElement('div');
    testDiv.style.touchAction = 'manipulation';
    const supportsTouchAction = testDiv.style.touchAction === 'manipulation';
    addToLog(`Touch Action: ${supportsTouchAction ? '✅' : '❌'}`);
    
    // Test 4: Viewport touch support
    const viewport = document.querySelector('meta[name="viewport"]');
    const hasViewport = viewport !== null;
    addToLog(`Viewport Meta: ${hasViewport ? '✅' : '❌'}`);
    
    setTimeout(() => {
      setIsTestRunning(false);
      addToLog('🏁 Test completed!');
    }, 1000);
  };

  const handleTestButtonTouch = () => {
    addToLog('🤚 Test button touched!');
  };

  const handleTestButtonClick = () => {
    addToLog('👆 Test button clicked!');
  };

  const clearLog = () => {
    setTouchLog([]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Chrome iPhone Touch Events Tester</h2>
      
      <div className="space-y-4 mb-6">
        <Button 
          onClick={runTouchTest}
          disabled={isTestRunning}
          className="w-full"
        >
          {isTestRunning ? 'Testing...' : 'Run Touch Events Test'}
        </Button>
        
        <Button
          ref={testButtonRef}
          onTouchStart={handleTestButtonTouch}
          onClick={handleTestButtonClick}
          variant="outline"
          className="w-full mobile-button mobile-touchable"
          style={{ 
            touchAction: 'manipulation',
            minHeight: '44px',
            fontSize: '16px'
          }}
        >
          Touch/Click Me to Test
        </Button>
        
        <Button
          onClick={clearLog}
          variant="ghost"
          size="sm"
        >
          Clear Log
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
        <h3 className="font-medium mb-2">Touch Events Log:</h3>
        {touchLog.length === 0 ? (
          <p className="text-gray-500 italic">No events logged yet...</p>
        ) : (
          <div className="space-y-1">
            {touchLog.map((entry, index) => (
              <div 
                key={index} 
                className="text-sm font-mono bg-white p-2 rounded border"
              >
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Chrome iPhone Touch Fixes Applied:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Touch Action: manipulation</li>
          <li>✅ Tap Highlight: transparent</li>
          <li>✅ User Select: none</li>
          <li>✅ Touch Callout: none</li>
          <li>✅ Hardware Acceleration</li>
          <li>✅ Minimum Touch Target: 44px</li>
          <li>✅ Font Size: 16px (no zoom)</li>
        </ul>
      </div>

      <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Troubleshooting:</h3>
        <ul className="text-sm space-y-1">
          <li>• If touch events fail, try refreshing the page</li>
          <li>• Check if JavaScript is enabled</li>
          <li>• Compare with Safari on the same device</li>
          <li>• Clear Chrome cache and reload</li>
          <li>• Try enabling "Request Desktop Site" temporarily</li>
        </ul>
      </div>
    </div>
  );
};

export default TouchEventsTester;
