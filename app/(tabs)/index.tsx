import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import * as Speech from "expo-speech";
import * as Location from "expo-location";

export default function HomeScreen() {

  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] =
    useCameraPermissions();

  const [message, setMessage] =
    useState("AI Navigation starting");

  const processingRef = useRef(false);

  const lastSpeech = useRef("");

  const SERVER_URL =
    "https://ai-visual-assistant-backend.vercel.app/api/analyze-image";

  const sendSOS = async () => {

    try {

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const location =
        await Location.getCurrentPositionAsync({});

      const link =
        `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

      const sms =
        `sms:9876543210?body=${encodeURIComponent("Emergency! My location: " + link)}`;

      await Linking.openURL(sms);

      Speech.speak("Emergency message sent");

    } catch {}

  };

  useEffect(() => {

    if (permission && !permission.granted)
      requestPermission();

  }, [permission]);

  const captureAndAnalyze = async () => {

    if (!cameraRef.current) return;

    if (processingRef.current) return;

    processingRef.current = true;

    try {

      const photo =
        await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.4
        });

      const response =
        await fetch(SERVER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: photo.base64
          })
        });

      const data = await response.json();

      const newMessage =
        data.message || "No guidance";

      setMessage(newMessage);

      if (newMessage !== lastSpeech.current) {

        lastSpeech.current = newMessage;

        Speech.stop();

        Speech.speak(newMessage);

      }

    } catch {

      setMessage("Connection issue");

    }

    processingRef.current = false;

  };

  useEffect(() => {

    const interval =
      setInterval(captureAndAnalyze, 2000);

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
          {message}
        </Text>

      </View>

      <TouchableOpacity
        style={styles.sos}
        onPress={sendSOS}
      >
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

  sos: {

    position: "absolute",

    top: 60,

    right: 20,

    backgroundColor: "red",

    paddingVertical: 12,

    paddingHorizontal: 18,

    borderRadius: 40

  },

  sosText: {

    color: "white",

    fontSize: 16,

    fontWeight: "bold"

  }

});