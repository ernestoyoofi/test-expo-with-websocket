import "react-native-get-random-values"
import { Alert, Image, Button, ToastAndroid, View, Dimensions, Text, ScrollView, Linking, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import localStorage from "@react-native-async-storage/async-storage"
import { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"

import Meta_BottomSheet from "./layout/bottom-sheet"
import Meta_ChatMessage from "./layout/chat"
import { TouchableHighlight } from "react-native"

const uuid = require("uuid")
const window = Dimensions.get("window")

export default function App() {
  const isLoad = useRef()
  const scrollRef = useRef()
  const sheetBottomRef = useRef()
  const socket_ref = useRef()
  const textInput = useRef()
  const [openSheet, setOpenSheet] = useState("")
  const [loadchat, setLoadchat] = useState([])

  if(loadchat.length > 3) {
    scrollRef.current.scrollToEnd()
  }

  const openSheetContent = (types) => {
    setOpenSheet(types)
    sheetBottomRef.current.present()
  }
  const sendMessage = async () => {
    socket_ref.current.send(JSON.stringify({
      type: "send.message",
      userId: await localStorage.getItem("user-id"),
      text: textInput.current
    }))
  }
  useEffect(() => {
    if(isLoad.current != true) {
      isLoad.current = true
      // Running This Script
      async function sayAndRegisterId() {
        const alasConnect = await localStorage.getItem("user-id")
        if(!alasConnect) {
          Alert.alert(
            "📦 Welcome To This App !",
            "Aplikasi ini hanyalah testing / prototipe yang dibuat oleh developer, jika kamu ingin mencobanya silahkan, aplikasi ini tidak meminta data yang akurat, semua data disini seperti akun hanya berupa id saja, bukan id nyata pada perangkat.\n\nSelaman mencoba !"
          )
          const id = uuid.v4()
          await localStorage.setItem("user-id", id)
          console.log("Register ID:", id)
        }
      }
      sayAndRegisterId()
      // WebSocket
      const sock = new WebSocket("ws://frighteningdoubleinsurance.ernestoyoofi.repl.co")
      socket_ref.current = sock
      sock.onmessage = (e) => {
        const st = JSON.parse(e.data)
        if(st.type === "send.loadermessage") {
          for(let a of st.list) {
            loadchat.push(a)
            setLoadchat([...loadchat])
          }
        }
        if(st.type === "send.newmessage") {
          loadchat.push(st)
          setLoadchat([...loadchat])
        }
      }
      sock.onopen = () => {
        ToastAndroid.show("Terhubung !", ToastAndroid.SHORT)
      }
      sock.onclose = () => {
        Alert.alert("Koneksi terputus !", "Silahkan coba untuk mengatur koneksi anda atau ulang kembali aplikasi ini dengan cara tutup dan masuk kembali !")
      }
    }
  })
  return (
    <SafeAreaView>
      <GestureHandlerRootView style={{height: window.height}}>
        <BottomSheetModalProvider>
          <KeyboardAvoidingView enabled behavior={Platform.OS === "ios"? "padding": "height"} style={{height: window.height}}>
            <View style={{flex:1}}>
              <ScrollView ref={scrollRef} style={{flex: 0.9}}>
                {loadchat.map((data, keys) => (
                  <Meta_ChatMessage data={data} key={`Message-${keys}`} bottomsheet={openSheetContent} />
                ))}
              </ScrollView>
              <View style={{flex:0.1, height: 30, padding: 7}}>
                <TextInput
                  style={{borderColor: "#d6d6d6", borderWidth: 2, padding: 4}}
                  onChangeText={(e) => {
                    textInput.current = e
                  }}
                />
                <View style={{display: "flex", flex: 1, flexDirection: "row"}}>
                  <TouchableOpacity style={{padding:9}} onPress={() => {
                    if(!socket_ref.current) return Alert.alert("Form Alert !","Tunggu Sampai Memuat Pesan !")
                    if(typeof textInput.current != "string" || !textInput.current) return Alert.alert("Form Alert !", "Isi pesan yang ingin dikirim")
                    socket_ref.current
                    
                    sendMessage()
                  }}>
                    <Text>Kirim Pesan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{padding:9}} onPress={() => {
                    openSheetContent({
                      type: "gif.select",
                      data: {}
                    })
                  }}>
                    <Text>Kirim Gif</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          <Meta_BottomSheet refs={sheetBottomRef} m_height={["20%", "40%", "60%"]}>
            {openSheet.type === "info.chat"? <View style={{padding:15}}>
              <Text style={{fontWeight:"bold",fontSize:18}}>Info Pesan</Text>
              <Text>Pengirim: {openSheet.data.userId}</Text>
              <Text>Pesan ID: {openSheet.data.msgId}</Text>
              <Text>Waktu: {new Date(openSheet.data.timestamp).toString()}</Text>
              <View>
                {openSheet.data.gif? <View>
                  <Button
                    onPress={() => Linking.openURL(openSheet.data.gif)}
                    title="Buka Media Gif"
                  />
                  <Image source={{uri:openSheet.data.gif}} style={{width: 200, height: 200}}/>
                </View>:""}
              </View>
            </View>:""}
            {openSheet.type === "gif.select"? <View style={{justifyContent: "center", alignItems: "center",height: 160}}>
              <Text style={{fontSize:15}}>Internal server error !</Text>
            </View>:""}
          </Meta_BottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}