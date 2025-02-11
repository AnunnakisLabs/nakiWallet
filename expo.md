```bash
bunx expo run:ios --device
bunx expo prebuild --clean

# Android
bunx eas build -p android --profile local --local

bunx gluestack-ui init

bunx eas build --auto-submit --platform=ios
```

