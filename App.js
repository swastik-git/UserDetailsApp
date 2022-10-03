import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  FlatList, Modal, Pressable, BackHandler, Alert, ActivityIndicator, RefreshControl, Wai
} from 'react-native';
import { DataTable, Avatar } from 'react-native-paper';

const App = () => {

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);


  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [])

  // valriables
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  // hooks for managing state
  const [allUsers, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserData, setUserData] = useState({});


  // function for getting user data
  const getUsersFromApi = async () => {
    try {
      const response = await fetch('https://dummyjson.com/users');
      const json = await response.json();
      setUsers(json.users);
    } catch (error) {
      console.error(error);
    }
  };

  // function for showing male or femal image
  function maleFemaleIconRender(itemData, size = 40) {
    return itemData == 'male' ? (
      <Avatar.Image
        size={size}
        style={{ alignSelf: "center" }}
        source={require('./assets/images/man.png')}
      />
    ) : (
      <Avatar.Image
        size={size}
        style={{ alignSelf: "center" }}
        source={require('./assets/images/woman.png')}
      />
    );
  };

  // for rendring tabble data
  const renderTableData = (Userdata) => {
    return (
      <DataTable.Row
        onPress={() => {
          setModalVisible(true)
          setUserData({
            name: Userdata.firstName + ' ' + Userdata.lastName,
            age: Userdata.age,
            gender: Userdata.gender,
            email: Userdata.email,
            address: Userdata.address.city,
            department: Userdata.company.department



          })
        }}
        style={{
          backgroundColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 5,
        }}
      >
        <DataTable.Cell>
          {Userdata.firstName} {Userdata.lastName}
        </DataTable.Cell>
        <DataTable.Cell>         {Userdata.age}</DataTable.Cell>
        <DataTable.Cell>
          {maleFemaleIconRender(Userdata.gender)}
        </DataTable.Cell>
      </DataTable.Row>)
  }



  useEffect(() => {
    getUsersFromApi();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {maleFemaleIconRender(currentUserData.gender, 120)}
            <Text style={styles.modalText}>Name - {currentUserData.name}</Text>
            <Text style={styles.modalText}>Email - {currentUserData.email}</Text>
            <Text style={styles.modalText}>Age - {currentUserData.age}</Text>
            <Text style={styles.modalText}>Address - {currentUserData.address}</Text>
            <Text style={styles.modalText}>Department - {currentUserData.department}</Text>
            <Pressable
              style={[{ marginVertical: 20 }, styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <StatusBar
        animated={true}
        backgroundColor="blue"
        barStyle={'light-content'}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>User Details</Text>
      </View>

      <View>
        <DataTable>
          <DataTable.Header style={{ backgroundColor: 'white' }}>
            <DataTable.Title>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
                Name
              </Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>        Age</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>Gender</Text>
            </DataTable.Title>
          </DataTable.Header>
          <View style={{ height: screenHeight }}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              data={Object.keys(allUsers)}
              renderItem={({ item }) => (renderTableData(allUsers[item]))}
              style={styles.scrollView}
              keyExtractor={(item, index) => {
                return allUsers[item].id;
              }}
            />
          </View>
          <View style={styles.overlay}></View>
        </DataTable>
      </View>
    </SafeAreaView>
  );
};

// all styles defined here
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    backgroundColor: 'white',
    // flexGrow: 1,
  },
  text: {
    fontSize: 15,
    color: 'black',
    padding: 10,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'StyleScript-Regular',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "blue",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 15,
    marginTop: 15,
    textAlign: "left",
    color: "black"
  }
});

export default App;
