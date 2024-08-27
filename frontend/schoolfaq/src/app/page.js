"use client";
import Image from "next/image";
import Head from "next/head";
import { useState,useEffect } from "react";
export default function Home() {
  //()initial type input will be a string, chatlog is an array of strings and boolean for isloading
  // [0] => the state value [1]=> function to set state value
  const [inputValue, setInputValue] = useState('')
  const [chatlog,setChatlog] = useState([])
  const [isloading,setIsLoading] = useState(false)

  const handleSubmit = (event)=>{
    event.preventDefault()
    
    setChatlog((prevChatLog)=>[...prevChatLog, {type:'user',message:inputValue}])

    setInputValue('')
  }

  return (
    <>
      <h1>
        School Faq
      </h1>
      {
        chatlog.map((message, index)=> {
          <div key="index">{message.message}</div>
        })
      }
      <form onSubmit={handleSubmit}>
        <input type ="text" placeholder="Type in your message..." 
        value = {inputValue} 
        onChange = {(e)=>setInputValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </>
  );
}
