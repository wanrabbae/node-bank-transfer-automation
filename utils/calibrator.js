console.log('Tap di mana saja untuk dapatkan koordinat...');
execSync('adb shell getevent -l', { stdio: 'inherit' });