import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  AsyncStorage
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather as Icon } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import Constants from "expo-constants";
import api from "../../../services/api";

import { useTheme } from "../../../contexts/theme";

import {
  ItemContainer,
  ItemTypeContainer,
  ItemContent,
  TextContainer,
  Date,
  Title,
  HelpedContainer,
  ImageContainer,
  Image,
  HelpedInfos,
  HelpedName,
  HelpedPoint
} from "./style"

interface Item {
  id: number;
  name: string;
  image_url: string;
}

interface Request {
  id: number;
  title: string;
  image: string;
  latitude: number;
  longitude: number;
  image_url: string;
  item: Item;
}

const Helps = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [requestsHelper, setRequestsHelper] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    async function getRequests() {
      const userId = await AsyncStorage.getItem("userId");
      setId(userId)
      await api
        .get("/helpers", {
          params: {
            userId: userId,
            status: 1
          }
        })
        .then((response) => {
          setRequestsHelper(response.data);
        }).catch(({response}) => {
          console.log(response);
        })
    }
    getRequests()
  })

  async function logOut() {
    await AsyncStorage.setItem("userId", "")
    await AsyncStorage.setItem("profile", "")
    navigation.navigate("Landing");
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate("HelpDetail", { request_id: id });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => logOut()}>
            <Icon name="log-out" color={theme.PrimaryColor} size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image source={{ uri: `https://api.adorable.io/avatars/32/${id}`}} />
          </TouchableOpacity>
        </View>
        <View style={{borderLeftWidth: 5, borderLeftColor: "#54C7C0", padding: 10, marginTop: 20}}>
          <Text style={styles.title}>Pedidos atendidos.</Text>
          <Text style={styles.description}>
            Esses são seus pedidos atendidos.
          </Text>
        </View>

        <ScrollView style={{flex: 1}}>
          {requestsHelper && requestsHelper?.requests?.map( request => (
            <ItemContainer key={request.id} onPress={() => handleNavigateToDetail(request.id)}>
              <ItemTypeContainer>
                <SvgUri width={60} height={60} uri={`http://192.168.0.22:3333/uploads/${request.item.image}`} />
              </ItemTypeContainer>
              <ItemContent>
                <TextContainer>
                  <Date>
                  {request.created_at}
                  </Date>

                  <Title>
                    {request.title}
                  </Title>
                </TextContainer>
                <HelpedContainer>
                  <ImageContainer>
                    <Image source={{ uri: `https://api.adorable.io/avatars/32/${request.owner.id}`}} />
                  </ImageContainer>
                  <HelpedInfos>
                    <HelpedName>
                      {request.owner.name}
                    </HelpedName>
                    <HelpedPoint>
                      4.7
                    </HelpedPoint>
                  </HelpedInfos>
                </HelpedContainer>
              </ItemContent>
            </ItemContainer>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Helps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 2
  }
});