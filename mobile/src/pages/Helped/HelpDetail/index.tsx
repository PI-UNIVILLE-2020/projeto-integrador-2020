import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  AsyncStorage,
  Linking
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome as Icon, Feather as Fa } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import Constants from "expo-constants";
import MapView, { Marker, MapEvent } from "react-native-maps";
import * as MailComposer from "expo-mail-composer"

import api from "../../../services/api";

import { Button, Label, InputLabel, InputTextAreaLabel } from "../../../components";

import { useTheme } from "../../../contexts/theme";

interface Params {
  request_id: number,
}

interface Request {
  id: string;
  title: string;
  description: string;
  created_at: string;
  owner: {
    id: string;
    name: string;
    whatsapp: string;
    email: string;
  },
  helpers: [{
    user: {
      id: string;
      name: string;
      whatsapp: string;
      email: string;
    }
  }]
  latitude: string;
  longitude: string;
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const routeParams = route.params as Params;
  const [request, setRequest] = useState<Request>();

  const [id, setId] = useState<string | null>("");
  const message = `Olá ${request?.helpers[0].user.name}, estou entrando em contato pois você se interessou em me ajudar em: "${request?.title}".`

  useEffect(() => {
    async function getUser() {
      const userId = await AsyncStorage.getItem("userId");
      setId(userId);
    }
    getUser()
    api.get(`/requests/${routeParams.request_id}`).then(response => {
      setRequest(response.data);
    });
  })

  function sendEmail() {
    MailComposer.composeAsync({
      subject: `Ajudante do pedido: ${request?.title}`,
      recipients: [String(request?.helpers[0].user.email)],
      body: message
    })
  }

  function sendWhatsApp() {
    Linking.openURL(`whatsapp://send?phone=55${request?.owner?.whatsapp}&text=${message}`)
  }

  async function cancelHelp(request_id: string){
    
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Fa name="arrow-left" color={theme.PrimaryColor} size={20} />
        </TouchableOpacity>
        
          {request && (
            <View style={{ padding: 10, flex: 1, justifyContent: "space-between"}}>
              <View style={{flex: 1}}>
                <View style={{height: 100, flexDirection: "row", alignItems: "center"}}>
                  <Image style={{width: 80, height: 80, borderRadius: 40}} source={{ uri: `https://api.adorable.io/avatars/80/${request.helpers[0].user.id}`}} />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontSize: 25, color: "#0C2423"}}>{request.helpers[0].user.name}</Text>
                    <Text style={{fontSize: 18, color: "#0C2423"}}>4.7</Text>
                  </View>
                </View>
                <Text style={{marginTop: 20, marginBottom: 20, color: "#333", fontWeight: "bold", marginLeft: 5, fontSize: 16}}>{request.helpers[0].user.name}, irá te ajudar no seu pedido</Text>
                <View style={{backgroundColor: '#E6E6E6', borderRadius: 20, maxHeight: "30%", alignItems: "flex-start", padding: 15}}>
                  <Text style={{color: "#555", marginLeft: 5, fontSize: 10}}>Em {new Date(request.created_at).toLocaleDateString()} às {new Date(request.created_at).toLocaleTimeString()}</Text>
                  <Text style={{marginTop: 5, color: "#333", fontWeight: "bold", marginLeft: 5, fontSize: 16}}>{request.title}</Text>
                  <Text style={{marginTop: 5, color: "#555", marginLeft: 5}}>{request.description}</Text>
                </View>
              
                <View style={{marginTop: 30, flexDirection: "row"}}>
                  <TouchableOpacity onPress={() => sendEmail()} style={{marginRight: 15,width: 50, height: 50,backgroundColor: "#D1D8F9", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                    <Icon name="envelope" color="#2B3876" size={25} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => sendWhatsApp()} style={{flex:1, height: 50,backgroundColor: "#516DF5", borderRadius: 10, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                    <Icon name="whatsapp" color="#FFF" size={25} />
                    <Text style={{color: "#FFF", marginLeft: 10, fontSize: 20}}>
                      Entrar em contato
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{width: "100%", marginBottom: 10, justifyContent: "center", alignItems: "center"}}>
                <Button color="#F15C5C" text="Encerrar ajuda" onPress={() => cancelHelp(request.id)}/>
              </View>
            </View>
            )
          }
      </View>
    </SafeAreaView>
  );
};

export default Detail;

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
  },

  mapContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    height: Dimensions.get("screen").width / 1.5,
    marginTop: 4,
  },

  map: {
    width: "100%",
    height: Dimensions.get("screen").width / 1.5,
  },
});