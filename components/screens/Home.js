/* eslint-disable react-native/no-inline-styles */
import React, { Component, PureComponent } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { firestore } from "../../firebase";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Modal from "react-native-modal";

const values = ["latitude", "longitude", "temperature", "humidity", "warning"];

export default class Home extends PureComponent {
  state = {
    deviceData: [],
    index: 0,
    showModal: false,
    showAgentModal: false,
    users: []
  };

  unsubscribeFromFirestore = null;
  unsubscribeFromFirestoreUsers = null;

  componentDidMount() {
    this.unsubscribeFromFirestore = firestore
      .collection("deviceData")
      .onSnapshot(snapshot => {
        const deviceData = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        console.log(deviceData);
        this.setState({ deviceData });
      });

    this.unsubscribeFromFirestoreUsers = firestore
      .collection("users")
      .onSnapshot(snapshot => {
        const users = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        console.log(users);
        this.setState({ users });
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromFirestore();
    this.unsubscribeFromFirestoreUsers();
  }

  renderDeviceDataRow = ({ item, index }) => {
    return (
      <>
        <View style={{ flexDirection: "row" }}>
          <Text>{item.custId} &nbsp;</Text>
          <Text>{item.temperature} &nbsp;</Text>
          <Text>{item.humidity}&nbsp;</Text>
        </View>
        <Text style={{ marginBottom: 8 }}>
          {item.latitude} - {item.longitude}
        </Text>
      </>
    );
  };

  onAgentPress = name => {
    const { deviceData, index } = this.state;
    this.setState(
      {
        showModal: false
      },
      () => {
        this.setState({
          showAgentModal: false
        });
      }
    );
    firestore.collection("requests").add({
      name,
      lat: deviceData[index].latitude,
      long: deviceData[index].longitude
    });
  };

  render() {
    const { deviceData, index, users } = this.state;

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
            {this.state.deviceData.map((point, index) => {
              return (
                <Marker
                  coordinate={{
                    latitude: Number(point.latitude),
                    longitude: Number(point.longitude)
                  }}
                  {...point}
                  // title={'Its a marker'}
                  onPress={() =>
                    this.setState({
                      index,
                      showModal: true
                    })
                  }
                  key={index}
                />
              );
            })}
          </MapView>
          {/* <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          /> */}
        </View>

        <Modal
          isVisible={this.state.showModal}
          // eslint-disable-next-line react-native/no-inline-styles
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          onBackdropPress={() =>
            this.setState({
              showModal: false
            })
          }
        >
          {!this.state.showAgentModal ? (
            <View
              style={{
                borderRadius: 4,
                backgroundColor: "#fff",
                padding: 16,
                width: "75%"
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  marginBottom: 16,
                  fontSize: 24
                }}
              >
                Data
              </Text>
              {deviceData.length > 0 &&
                Object.keys(deviceData[index])
                  .filter(data => values.includes(data))
                  .map(point => (
                    <Text
                      style={{
                        paddingVertical: 8
                      }}
                      key={point}
                    >{`${point} - ${deviceData[index][point]}`}</Text>
                  ))}

              <Text
                style={{
                  padding: 12,
                  width: "100%",
                  marginTop: 16,
                  backgroundColor: "green",
                  borderRadius: 8,
                  textAlign: "center",
                  color: "#fff"
                }}
                onPress={() =>
                  this.setState({
                    showAgentModal: true
                  })
                }
              >
                Assign Agent
              </Text>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 4,
                backgroundColor: "#fff",
                padding: 16,
                width: "75%"
              }}
            >
              {agents.map(agent => (
                <Text
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    padding: 12
                  }}
                  onPress={() => {
                    this.onAgentPress(agent.name);
                  }}
                  key={agent.name}
                >
                  {agent.name}
                </Text>
              ))}
            </View>
          )}
        </Modal>
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
