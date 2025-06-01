'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Brain, Upload, FileText, Send, User, Bot, 
  Paperclip, Trash2, CheckCircle, Settings, MoreVertical, Zap
} from 'lucide-react';

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface Message {
  id: number;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

const AnalysisPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI research assistant. Upload your white papers or documents and I\'ll help you analyze them for errors, inconsistencies, and insights.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    const files = Array.from(event.target.files);
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Add system message about file upload
    const fileMessage: Message = {
      id: Date.now(),
      type: 'system',
      content: `Uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, fileMessage]);
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I'll analyze your request: "${inputMessage}". Based on the uploaded documents, I can help you with error detection, fact-checking, citation verification, and structural analysis. Would you like me to start with a specific aspect?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg border border-blue-100/50 py-3' 
            : 'bg-white/80 backdrop-blur-md border border-blue-50/30 py-4'
        } rounded-2xl`}
      >
        <div className="w-full mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-xl w-10 h-10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PeerReview</span>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <button className="p-2 hover:bg-blue-50 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300">
                New Analysis
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            
            {/* Sidebar - File Management */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg h-full flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  
                  {/* Upload Area */}
                  <div 
                    className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-gray-600 mb-1">Drop files here or click to upload</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto p-6">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No documents uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="bg-gray-50 rounded-xl p-3 group hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3 overflow-y-auto border-red-500">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg h-full flex flex-col">
                
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl w-10 h-10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">AI Analysis Assistant</h2>
                        <p className="text-sm text-gray-500">Ready to analyze your documents</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600' 
                            : message.type === 'system'
                            ? 'bg-gray-400'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : message.type === 'system' ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Message Content */}
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'system'
                            ? 'bg-gray-100 text-gray-700 text-sm italic'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                    >
                      <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me to analyze your documents for errors, insights, or specific patterns..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      'Check for factual errors',
                      'Analyze citations',
                      'Find inconsistencies',
                      'Summarize key points'
                    ].map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;