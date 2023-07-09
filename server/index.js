const fs = require("fs")
const { WebSocketServer } = require("ws")
const WebSocket = require("ws")

const socket = new WebSocketServer({
  port: 3000
})

const openLoader = () => {
  const data = JSON.parse(fs.readFileSync("./message.json", "utf-8"))
  return data
}

const saveMessage = (json) => {
  const loaders = openLoader()
  loaders.push(json)
  fs.writeFileSync(`./message.json`, JSON.stringify(loaders), "utf-8")
}

socket.on("connection", (sock) => {
  const loaders = openLoader()
  for(let i in [...Array(Math.floor(loaders.length / 20)+1)]) {
    const start = Number(i)*20
    sock.send(JSON.stringify({
      type: "send.loadermessage",
      list: loaders.slice(start, start+20)
    }))
  }
  sock.on("message", (e) => {
    try {
      const data = JSON.parse(e.toString())
      if(data.type === "send.message" && typeof (data.gif || data.text) === "string" && data.userId) {
        const results = {
          type: "send.newmessage",
          msgId: require("crypto").randomBytes(10).toString("hex"),
          userId: data.userId,
          timestamp: new Date().getTime(),
          text: data.text?.slice(0, 400) || undefined,
          gif: data.gif?.match("http")? data.gif : undefined
        }
        saveMessage(results)
        socket.clients.forEach(z => {
          if(z.readyState != WebSocket.OPEN) return;
          z.send(JSON.stringify(results))
        })
      }
    } catch(err) {}
  })
})