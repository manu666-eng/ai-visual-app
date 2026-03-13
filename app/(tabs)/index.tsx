import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import * as Location from "expo-location";

export default function HomeScreen() {

  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState("AI Navigation Starting...");

  const processingRef = useRef(false);
  const lastMessageRef = useRef("");

const SERVER_URL =
"https://ai-visual-assistant-backend.vercel.app/api/analyze-image";

  // SOS FUNCTION
  const sendSOS = async () => {

    try {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const mapsLink =
        `https://maps.google.com/?q=${latitude},${longitude}`;

      const message =
        `EMERGENCY! I need help.\nMy location:\n${mapsLink}`;

      const phoneNumber = "9876543210"; // change to emergency contact

      const smsURL =
        `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

      await Linking.openURL(smsURL);

      Speech.speak("Emergency message sent");

    } catch (error) {

      console.log("SOS Error:", error);

    }

  };


  useEffect(() => {

    if (permission && !permission.granted) {
      requestPermission();
    }

  }, [permission]);


  useEffect(() => {

    const detectLoop = async () => {

      if (!cameraRef.current) return;
      if (processingRef.current) return;

      try {

        processingRef.current = true;

        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.4,
          skipProcessing: true
        });

        const response = await fetch(SERVER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: photo.base64
          })
        });

        const data = await response.json();

        const message = data.message || "No guidance";

        setResult(message);

        if (message !== lastMessageRef.current) {

          lastMessageRef.current = message;

          Speech.speak(message, {
            rate: 0.95,
            pitch: 1,
            language: "en"
          });

        }

      } catch (error) {

        console.log("AI error", error);
        setResult("Connection error");

      }

      processingRef.current = false;

    };

    const interval = setInterval(detectLoop, 1500);

    return () => clearInterval(interval);

  }, []);


  if (!permission) return <View />;

  if (!permission.granted) {

    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
      </View>
    );

  }

  return (

    <View style={styles.container}>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
      />

      <View style={styles.overlay}>

        <Text style={styles.title}>
          AI Navigation Assistant
        </Text>

        <Text style={styles.result}>
          {result}
        </Text>

      </View>

      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

    </View>

  );

}


const styles = StyleSheet.create({

  container: { flex: 1 },

  camera: { flex: 1 },

  overlay: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 12,
    width: "85%"
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  result: {
    color: "yellow",
    fontSize: 16,
    marginTop: 6,
    textAlign: "center"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  sosButton: {

    position: "absolute",
    top: 60,
    right: 20,

    backgroundColor: "red",

    paddingVertical: 12,
    paddingHorizontal: 18,

    borderRadius: 40,

    elevation: 5
  },

  sosText: {

    color: "white",
    fontSize: 16,
    fontWeight: "bold"

  }

});