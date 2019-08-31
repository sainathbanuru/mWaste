import React, { Component } from "react";
import { View, Text, SafeAreaView, FlatList, Alert } from "react-native";
import { firestore } from "../../firebase";
import AgentsMap from "./agentsMap";

export default class AgentHome extends Component {
  state = {
    requests: []
  };

  unsubscribeFromFirestore = null;
  // unsubscribeFromFirestoreUsers = null;

  componentDidMount() {
    const userName = this.props.navigation.getParam("username");
    this.unsubscribeFromFirestore = firestore
      .collection("requests")
      .onSnapshot(snapshot => {
        const requests = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        console.log(requests);
        const userRequests = requests.filter(
          request => request.name == userName
        );
        this.setState({ requests: userRequests, total: requests.length });
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromFirestore();
    // this.unsubscribeFromFirestoreUsers();
  }

  onMarkerPress = id => {
    firestore
      .collection("requests")
      .doc(id)
      .update({
        status: 1
      });
  };

  render() {
    const { requests } = this.state;
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, color: "#000", marginBottom: 16 }}>
          Home
        </Text>
        <Text style={{ marginBottom: 16, color: "#000" }}>
          Total requests for you: {this.state.requests.length}
        </Text>

        <Text style={{ marginBottom: 16, color: "#000" }}>
          Total requests completed:
          {this.state.requests.filter(request => request.status === 1).length}
        </Text>
        {requests.length > 0 && (
          <AgentsMap requests={requests} onMarkerPress={this.onMarkerPress} />
        )}

        {/* {requests.length > 0 && (
          <Text
            onPress={() =>
              this.props.navigation.navigate("agentsMap", { requests })
            }
            style={{
              width: "100%",
              textAlign: "center",
              backgroundColor: "#00689f",
              color: "#fff",
              marginTop: 16,
              padding: 16,
              borderRadius: 8
            }}
          >
            See Requests
          </Text>
        )} */}
      </View>
    );
  }
}
