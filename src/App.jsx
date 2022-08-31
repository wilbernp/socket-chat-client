import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { io } from "socket.io-client";


// const socket = io("http://localhost:3001")
const socket = io("https://socket-io-api.herokuapp.com")
export default function App() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [socketId, setSocketId] = useState("")


  socket.on("connect", () => {
    console.log(socket.id)
    // setSocketId(socket.id)
  })

  useEffect(() => {
    function receive(message) {
      setMessages(prev => {
        return [...prev, message]
      })
    }

    socket.on("message", receive)

    return () => {
      socket.off("message", receive)
    }
  }, [messages])

  function hadleSubmit(e) {
    e.preventDefault()
    setMessages(prev => {
      return [...prev, { msg: input, user: "Me" }]
    })
    socket.emit("message", input, socketId)
    setInput("")
  }

  return (
    <div>
      <form onSubmit={hadleSubmit}>
        <div>
          <input placeholder='message' value={input} type="text" onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <input placeholder='socket_id' value={socketId} type="text" onChange={(e) => setSocketId(e.target.value)} />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
      {
        messages.map((data) => {
          return (
            <div>
              <p>{data.user}: {data.msg}</p>
            </div>
          )
        })
      }
    </div>
  )
}
