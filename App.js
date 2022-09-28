import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Dimensions
} from 'react-native';
import { DataTable, Avatar } from 'react-native-paper';

const App = () => {
  const screenHeight = Dimensions.get('window').height
  const [allUsers, setUsers] = useState([]);

  const getUsersFromApi = async () => {
    try {
      const response = await fetch('https://dummyjson.com/users');
      const json = await response.json();
      setUsers(json.users);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsersFromApi();
  }, []);


  const list = () => {
    return allUsers.map((element) => {
      return (
        <DataTable.Row key={element.id} style={{ backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1 }}>
          <DataTable.Cell>{element.firstName} {element.lastName}</DataTable.Cell>
          <DataTable.Cell>     {element.age}</DataTable.Cell>
          <DataTable.Cell>    {element.gender === 'male' ? <Avatar.Text size={35} label="M" color='white' style={{ backgroundColor: "#3078db" }} /> : <Avatar.Text size={35} label="F" style={{ backgroundColor: "#db30d0" }} />}</DataTable.Cell>
        </DataTable.Row>
      );
    });
  };


  return (
    <SafeAreaView style={[{ height: screenHeight }, styles.container]}>
      <StatusBar
        animated={true}
        backgroundColor="#36a1e3"

        barStyle={'light-content'} />
      <View style={styles.header}>
        <Text style={styles.headerText}>User Details</Text>
      </View>
      {/* <Text style={{ fontWeight: "bold", color: "black", backgroundColor:"#ddd"}}>First Name  Last Name</Text> */}
      <DataTable>
        <DataTable.Header style={{ backgroundColor: "white" }}>
          <DataTable.Title><Text style={{ fontWeight: "bold", fontSize: 15, color: "black" }}>Name</Text></DataTable.Title>
          <DataTable.Title><Text style={{ fontWeight: "bold", fontSize: 15, color: "black" }}>    Age</Text></DataTable.Title>
          <DataTable.Title><Text style={{ fontWeight: "bold", fontSize: 15, color: "black" }}>Gender</Text></DataTable.Title>
        </DataTable.Header>

        <ScrollView style={styles.scrollView} >
          {list()}
        </ScrollView>

      </DataTable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'white',
    // marginHorizontal: 20,
    flexGrow: 1,

  },
  text: {
    fontSize: 15,
    color: 'black',
    padding: 10
  },
  header: {
    // flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#36a1e3',

  },
  headerText: {
    fontSize: 30,
    fontFamily: "StyleScript-Regular"
  }
});

export default App;
