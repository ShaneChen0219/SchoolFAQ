"use client";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TypingAnimation from "../../component/typingAnimation";

export default function ChatBot() {
    const [inputValue, setInputValue] = useState('');
    const [chatlog, setChatlog] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [useLLM, setUseLLM] = useState(false);
    const [showChatBot, setShowChatBot] = useState(false);

    const chatEndRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setChatlog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }]);
        sendMessage(inputValue);
        setInputValue('');
    }

    const sendMessage = (message) => {
        const url = useLLM
            ? process.env.NEXT_PUBLIC_LLM_URI
            : process.env.NEXT_PUBLIC_BASIC_URI + "/chat";

        const header = {
            "Content-Type": "application/json"
        };
        let body;

        if (useLLM) {
            body = {
                "model": "llama3.2",
                "prompt": message,
                "stream": false
            };
        } else {
            body = {
                "message": message
            };
        }

        setIsLoading(true);
        axios.post(url, body, { headers: header })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.response);
                }
                setChatlog((prevChatLog) => [
                    ...prevChatLog,
                    { type: response.data.bot, message: response.data.response }
                ]);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    }

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatlog]);

    if (!showChatBot) {
        return (
            <div className="fixed bottom-5 right-5 p-4 bg-blue-500 text-white rounded-full shadow-lg cursor-pointer" 
                onClick={() => setShowChatBot(true)}>
                <h3 className="text-lg font-bold">School Faq</h3>
                <p>Click to ask!</p>
            </div>
        );
    }
    return (
        <div className="fixed bottom-5 right-5 w-full max-w-[400px] h-[500px] bg-gray-800 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <h1 className="font-bold">School Faq Chatbot</h1>
                <button onClick={() => setShowChatBot(false)} className="text-xl font-bold">&times;</button>
            </div>
            
            <div className="p-4 text-center">
                <button 
                    onClick={() => setUseLLM(!useLLM)}
                    className={`px-4 py-2 font-semibold rounded-lg focus:outline-none transition-colors duration-300 
                        ${useLLM ? 'bg-purple-800 text-white' : 'bg-purple-300 text-gray-900'}`}
                >
                    {useLLM ? "Disable LLM" : "Enable LLM"}
                </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {
                        chatlog.map((message, index) => (
                            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-blue-500'} 
                                    rounded-lg p-4 text-white max-w-sm`}>
                                    {message.message}
                                </div>
                            </div>
                        ))
                    }
                    {
                        isloading &&
                        <div key={chatlog.length} className="flex justify-start">
                            <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                                <TypingAnimation />
                            </div>
                        </div>
                    }
                    <div ref={chatEndRef} />
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-none p-4">
                <div className="flex rounded-lg border border-gray-700 bg-gray-600">
                    <input 
                        type="text" 
                        className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
                        placeholder="Type in your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} 
                    />
                    <button 
                        type="submit" 
                        className="bg-purple-300 rounded-lg px-4 py-2 font-semibold focus:outline-none hover:bg-purple-800 transition-colors duration-300"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}