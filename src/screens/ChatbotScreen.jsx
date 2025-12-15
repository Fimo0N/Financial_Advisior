import React, { useState } from 'react';

const ChatbotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (!input.trim()) return;

        // Add user message to chat history
        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);

        // Simulate chatbot response
        const botMessage = { sender: 'bot', text: `You said: ${input}` };
        setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);

        setInput(''); // Clear input field
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-3 rounded-lg max-w-xs ${
                            message.sender === 'user'
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-300 text-gray-800 self-start'
                        }`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatbotScreen;