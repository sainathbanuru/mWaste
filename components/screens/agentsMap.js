/* eslint-disable react-native/no-inline-styles */
import React, { Component, PureComponent } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { firestore } from "../../firebase";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Modal from "react-native-modal";

const values = ["latitude", "longitude", "temperature", "humidity", "warning"];

export default class AgentsMap extends PureComponent {
  state = {
    deviceData: [],
    index: 0,
    showModal: false,
    showAgentModal: false,
    users: []
  };

  render() {
    const { deviceData, index, users } = this.state;

    const requests = this.props.requests;
    const agents = users.filter(user => user.type == "agent");

    return (
      <>
        {/* <Text>{JSON.stringify(this.state.deviceData)}</Text> */}
        <View style={{ padding: 16, flex: 1 }}>
          <MapView
            style={styles.map}
            region={{
              latitude: 23.391024,
              longitude: 76.072537,
              latitudeDelta: 15,
              longitudeDelta: 15
            }}
            zoomControlEnabled={true}
            zoomEnabled={true}
          >
            {requests.map((point, index) => {
              return (
                <Marker
                  coordinate={{
                    latitude: Number(point.lat),
                    longitude: Number(point.long)
                  }}
                  {...point}
                  // title={'Its a marker'}
                  onPress={() => {
                    Alert.alert(
                      "Mark as completed",
                      "On clicking OK it will be marked as complete",
                      [
                        {
                          text: "OK",
                          onPress: this.props.onMarkerPress(point.id)
                        }
                      ],
                      { cancelable: false }
                    );
                  }}
                  key={index}
                />
              );
            })}
          </MapView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
