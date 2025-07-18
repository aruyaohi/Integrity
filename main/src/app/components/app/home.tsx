import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText, Bot, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  files?: File[];
}

interface AttachedFile {
  file: File;
  id: string;
  preview?: string;
}


const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Ask Anything Question! Begin your DYOR experience by querying with prompts",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      files: attachedFiles.map(af => af.file)
    };


    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);
    setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append('prompt', inputValue);
    attachedFiles.forEach((af) => {
      formData.append('files', af.file);
    });
    const fileCount = attachedFiles.length;
    formData.append('fileCount', fileCount.toString());
    

    const res = await fetch('/api/analyzer', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    console.log("This is the response from the backend",data)
    const answer = data.data.answer

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: answer,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
  } catch (error) {
    console.error('Error sending message:', error);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      content: "Sorry, something went wrong. Please try again.",
      isUser: false,
      timestamp: new Date()
    }]);
  } finally {
    setIsLoading(false);
  }
}


  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: AttachedFile = {
        file,
        id: Date.now().toString() + Math.random().toString(),
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachedFiles(prev => [...prev, newFile]);
    });
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col min-h-screen lg:py-5">
      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="fixed inset-0 bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-300 flex items-center justify-center z-50">
            <div className="text-center">
              <Paperclip className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-semibold text-blue-700">Drop files here to attach</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-3xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Message Content */}
              <div className={`rounded-lg px-4 py-2 ${
                message.isUser 
                  ? 'bg-[#3c3c3c] text-white' 
                  : 'bg-transparent text-gray-50 shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* File attachments */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.files.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs opacity-75">
                        <FileText className="w-3 h-3" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-3xl">
              <div className="bg-gray-200 rounded-full p-2">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

    {/*Recent Section */}
    {/* <div>
        <div className='flex flex-col px-2'>
            <h3 className='text-white'>Recent Searches</h3>
        </div>
    </div> */}
      {/* Input Area */}
      <div className="p-4">
        {/* File attachments preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((attachedFile) => (
              <div key={attachedFile.id} className="relative bg-gray-100 rounded-lg p-2 flex items-center space-x-2">
                {attachedFile.preview ? (
                  <img 
                    src={attachedFile.preview} 
                    alt="Preview" 
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-gray-500" />
                )}
                <span className="text-sm text-gray-700 max-w-32 truncate">
                  {attachedFile.file.name}
                </span>
                <button
                  onClick={() => removeFile(attachedFile.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* File upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 text-gray-50 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Token name, Ticker or Link to official Token or Project site. E.G $BTC"
              className="w-full p-3 pr-12 text-white border-3 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[44px] max-h-32"
              disabled={isLoading}
              rows={1}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
            className="flex-shrink-0 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>
    </div>
  );
};

export default HomePage;