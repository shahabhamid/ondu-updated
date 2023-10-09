import { useState } from "react";
import { Alert } from "react-native";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";
import { language } from "../constants/language";
const { width, height } = Dimensions.get("window");

function LanModal({ modalVisible, setModalVisible, onSelectLan }) {
  const [selectLan, setSelectLan] = useState(0);
  const [languages, setLanguage] = useState([
    { name: "English", selected: true },
    { name: "عربى", selected: false },
  ]);
  const onSelect = (index) => {
    const temp = languages;
    temp.map((item, ind) => {
      if (index == ind) {
        if (item.selected == true) {
          item.selected = false;
        } else {
          item.selected = true;
          setSelectLan(index);
        }
      } else {
        item.selected = false;
      }
    });
    let temp2 = [];
    temp.map((item) => {
      temp2.push(item);
    });
    setLanguage(temp2);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.fontDesign}>
            {selectLan == 0 ? language[14].eng : language[14].arab}{" "}
          </Text>
          <View style={{ width: "100%" }}>
            <FlatList
              data={languages}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.lanItem,
                      {
                        borderColor:
                          item.selected == true ? Colors.orange : Colors.black,
                      },
                    ]}
                    onPress={() => {
                      onSelect(index);
                    }}
                  >
                    {item.selected == true ? (
                      <Image
                        source={require("../assets/radio-button.png")}
                        style={styles.icon}
                      />
                    ) : (
                      <Image
                        source={require("../assets/radio.png")}
                        style={styles.icon}
                      />
                    )}

                    <Text style={{ marginLeft: 20, fontSize: 20 }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View style={styles.btns}>
            <TouchableOpacity
              style={{
                width: "40%",
                height: 50,
                borderWidth: 0.5,
                borderRadius: 10,
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text>
                {selectLan == 0 ? language[15].eng : language[15].arab}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                onSelectLan(selectLan);
                Alert.alert(
                  selectLan == 0 ? language[12].eng : language[12].arab
                );
              }}
              style={{
                width: "40%",
                height: 50,
                borderWidth: 0.5,
                borderRadius: 10,
                backgroundColor: Colors.brown,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>
                {selectLan == 0 ? language[16].eng : language[16].arab}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
export default LanModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: width - 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fontDesign: {
    fontFamily: "GothicA1-Medium",
    color: Colors.black,
    fontSize: 18,
  },
  lanItem: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    marginTop: 10,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  btns: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
});
