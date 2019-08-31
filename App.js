import React from "react";
import { View, StyleSheet } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import MapView from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps

import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import AgentHome from "./components/screens/AgentHome";
import AgentsMap from "./components/screens/agentsMap";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

const MainNavigation = createStackNavigator(
  {
    login: { screen: Login },
    home: { screen: Home },
    agentHome: { screen: AgentHome },
    agentsMap: { screen: AgentsMap }
  },
  {
    initialRouteName: "login",
    headerMode: "none"
  }
);

const MainNavigator = createAppContainer(MainNavigation);

export default () => (
  <View style={styles.container}>
    <MainNavigator />
  </View>
);
