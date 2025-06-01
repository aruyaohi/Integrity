'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, Upload, User, Bot, X, Menu,
  CheckCircle, Settings, MoreVertical, Send
} from 'lucide-react';

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  file: File; 
}

interface Message {
  id: number;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
  analysis?: {
    factualInconsistencies: number;
    citationIssues: number;
    structuralRecommendations: number;
    improvements: number;
    details: string;
  };
}

const AnalysisPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI research assistant. Upload your white papers or documents and click "Analyze Documents" to get started with comprehensive analysis for errors, inconsistencies, and insights.',
      timestamp: new Date()
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      uploadedAt: new Date(),
      file: file
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    const fileMessage: Message = {
      id: Date.now(),
      type: 'system',
      content: `Uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, fileMessage]);
  };

  const sendToAPI = async (files: UploadedFile[]): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      
      files.forEach((fileObj, index) => {
        formData.append(`file_${index}`, fileObj.file);
      });
      
      formData.append('fileCount', files.length.toString());
      formData.append('fileNames', JSON.stringify(files.map(f => f.name)));
      formData.append('analysisType', 'comprehensive');
      
      const response = await fetch('/api/analyzer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      return result;
      
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim() || 'Analyze uploaded documents',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    try {
      if (uploadedFiles.length > 0) {
        const result = await sendToAPI(uploadedFiles);
        
        const botResponse: Message = {
          id: Date.now() + 100,
          type: 'bot',
          content: result.success 
            ? `Analysis complete! Results: ${result.data || 'Analysis successful'}`
            : `Analysis failed: ${result.error || 'Unknown error'}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        // Handle text-only messages
        const botResponse: Message = {
          id: Date.now() + 100,
          type: 'bot',
          content: "I understand your request. Please upload some documents so I can analyze them for you.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
      
    } catch (error) {
      console.log(error);
      const errorResponse: Message = {
        id: Date.now() + 100,
        type: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hidden File Input - THIS WAS MISSING! */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
        multiple
        className="hidden"
      />

      {/* Header */}
      <header 
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg border border-blue-100/50 py-3' 
            : 'bg-white/80 backdrop-blur-md border border-blue-50/30 py-4'
        } rounded-2xl`}
      >
        <div className="w-full mx-auto lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-500" />
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
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-4 py-10 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 h-[calc(100vh-12rem)]">
            <div className="lg:col-span-3 overflow-y-auto min-h-screen">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg h-full flex flex-col">
                
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-500"/>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Paper Analysis</h2>
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
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600' 
                            : message.type === 'system'
                            ? 'bg-gray-400'
                            : 'bg-white'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : message.type === 'system' ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'system'
                            ? 'bg-gray-100 text-gray-700 text-sm italic'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Input Section */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-col space-y-3">
          
          {/* Show uploaded files if any */}
          {uploadedFiles.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm font-medium text-blue-900 mb-2">Uploaded Files:</p>
              <div className="space-y-1">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between text-xs text-blue-800">
                    <span className="truncate max-w-xs">{file.name}</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-blue-200 rounded-xl p-3 text-center hover:border-blue-300 transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-600 mb-1">Drop files here or click to upload</p>
            <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
          </div>

          {/* Chat Input */}
          <div className="flex items-end space-x-3 bg-white rounded-2xl border border-gray-200 shadow-lg p-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to analyze your documents, check for errors, or any other questions..."
                className="w-full resize-none border-0 outline-none text-sm leading-6 max-h-[120px] min-h-[24px] placeholder-gray-400"
                rows={1}
                disabled={isAnalyzing}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={isAnalyzing || (!inputMessage.trim() && uploadedFiles.length === 0)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isAnalyzing || (!inputMessage.trim() && uploadedFiles.length === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isAnalyzing ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;