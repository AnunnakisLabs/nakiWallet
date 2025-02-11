import "@expo/metro-runtime";
import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";
import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
renderRootComponent(App);
