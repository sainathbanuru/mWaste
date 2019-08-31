import React, { PureComponent } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { firestore } from "../../firebase";

export default class Login extends PureComponent {
  state = {
    users: [],
    username: "",
    password: "",
    editable: true
  };

  unsubscribeFromFirestore = null;

  componentDidMount() {
    this.unsubscribeFromFirestore = firestore
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
  }

  inputUpdater = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  onSubmit = () => {
    const { username, password, users } = this.state;
    this.setState({
      editable: false
    });

    const userDetails = users.filter(user => user.name == username);
    if (userDetails.length !== 0 && userDetails[0].password == password) {
      if (userDetails[0].type === "govt") {
        this.props.navigation.navigate("home");
      } else {
        this.props.navigation.navigate("agentHome", { username });
      }
    }
  };

  render() {
    const {
      container,
      wrapper,
      heading,
      textInputStyle,
      submitButtonSytle
    } = styles;

    const { username, password } = this.state;

    return (
      <SafeAreaView style={container}>
        <View style={wrapper}>
          <Text style={heading}>Login</Text>
          <TextInput
            style={textInputStyle}
            placeholder={"Username"}
            onChangeText={text => {
              this.inputUpdater("username", text);
            }}
            value={username}
          />
          <TextInput
            style={textInputStyle}
            placeholder={"Password"}
            onChangeText={text => {
              this.inputUpdater("password", text);
            }}
            value={password}
            secureTextEntry
          />
          <Text style={submitButtonSytle} onPress={this.onSubmit}>
            Submit
          </Text>
          <Text>{JSON.stringify(this.state)}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24
  },

  textInputStyle: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 4
  },
  submitButtonSytle: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: 12,
    width: "100%",
    borderRadius: 4,
    textAlign: "center",
    marginTop: 16
  }
});
