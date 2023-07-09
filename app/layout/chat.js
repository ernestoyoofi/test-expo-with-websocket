import { StyleSheet } from "react-native"
import { TouchableOpacity, View, Text, Image } from "react-native"

const style = StyleSheet.create({
  viewport: {
    padding: 9
  },
  view_sis: {
    marginBottom: 8
  },
  userTages: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  timestamps: {
    fontSize: 12,
    color: "#ababab"
  }
})

export default function Meta_ChatMessage({ data, bottomsheet }) {
  return (
    <TouchableOpacity
      style={style.viewport}
      onPress={() => {
        bottomsheet({
          type: "info.chat",
          data: data
        })
      }}
    >
      <View style={style.view_sis}>
        <Text style={style.userTages}>User ID: {data.userId}</Text>
        <Text style={style.timestamps}>{new Date(data.timestamp).toString().split(" GMT+")[0]}</Text>
      </View>
      <View>
        {typeof data.gif === "string"? <View style={{width:200, height:200,borderRadius: 10, overflow:"hidden"}}><Image source={{ uri: data.gif }} style={{width:200, height:200}}/></View>:""}
        {typeof data.text === "string"? <Text>{data.text}</Text>:""}
      </View>
    </TouchableOpacity>
  )
}