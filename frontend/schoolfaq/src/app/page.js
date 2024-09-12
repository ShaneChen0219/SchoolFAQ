"use client";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  //()initial type input will be a string, chatlog is an array of strings and boolean for isloading
  // [0] => the state value [1]=> function to set state value
  const [inputValue, setInputValue] = useState('')
  const [chatlog, setChatlog] = useState([])
  const [isloading, setIsLoading] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setChatlog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])
    sendMessage(inputValue)

    setInputValue('')
  }


  const sendMessage = (message) => {
    const url = "http://localhost:5050/chat"
    const header = {}
    header["Content-Type"] = "application/json"
    const body = {
      "message": message
    }

    setIsLoading(true)
    axios.post(url, body, { headers: header }).then((response) => {
      if (response.status === 200) {
        console.log(response.data.response)
      }
      setChatlog((prevChatLog) => [...prevChatLog, { type: response.data.bot, message: response.data.response }])
      setIsLoading(false)
    }).catch((error) => {
      setIsLoading(false)
      console.log(error)
    })
  }

  return (
    <div className="container mx-auto max-w-[700px]">
      <div className="flex flex-col h-screen bg-gray-800">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center font-bold text-6xl">
          School Faq
        </h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
            {
              chatlog.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-blue-500'} 
                    rounded-lg p-4 text-white max-w-sm` }>
                    {message.message}
                  </div>

                </div>
              ))
            }
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-600">
            <input type="text" className= "flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" 
            placeholder="Type in your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-purple-300 rounded-lg px-4 py-2 font-semibold focus:outline-none hover:bg-purple-800 transition-colors duration-300">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
