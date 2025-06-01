'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Brain, Upload, User, Bot, 
  CheckCircle, Settings, MoreVertical, Play
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
      uploadedAt: new Date(),
      file: file
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

  const sendToAPI = async (files: UploadedFile[]): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      
      // Add files to FormData
      files.forEach((fileObj, index) => {
        formData.append(`file_${index}`, fileObj.file);
      });
      
      // Add metadata
      formData.append('fileCount', files.length.toString());
      formData.append('fileNames', JSON.stringify(files.map(f => f.name)));
      formData.append('analysisType', 'comprehensive');
      
      const response = await fetch('/api/analyzer', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
        }
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


  const startAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      const errorMessage: Message = {
        id: Date.now(),
        type: 'system',
        content: 'Please upload at least one document before starting the analysis.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: 'Starting comprehensive document analysis...',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      await sendToAPI(uploadedFiles)
    } catch (error) {
      console.log(error)
    }

    // Simulate AI analysis with multiple stages
    setTimeout(() => {
      const analysisStages = [
        'Scanning documents for structural issues...',
        'Checking citations and references...',
        'Analyzing content for factual inconsistencies...',
        'Generating comprehensive analysis report...'
      ];

      analysisStages.forEach((stage, index) => {
        setTimeout(() => {
          const stageMessage: Message = {
            id: Date.now() + index,
            type: 'system',
            content: stage,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, stageMessage]);
        }, index * 1000);
      });

      // Final analysis result
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 100,
          type: 'bot',
          content: `Analysis complete! I've reviewed ${uploadedFiles.length} document(s) and found:\n\n✅ 3 potential factual inconsistencies\n✅ 2 citation formatting issues\n✅ 1 structural recommendation\n✅ 4 areas for improvement\n\nWould you like me to provide detailed findings for any specific category?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsAnalyzing(false);
      }, analysisStages.length * 1000 + 1000);
    }, 500);
  };

  // const formatFileSize = (bytes: number): string => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  // const handleQuickAction = (action: string) => {
  //   const actionMessage: Message = {
  //     id: Date.now(),
  //     type: 'user',
  //     content: action,
  //     timestamp: new Date()
  //   };

  //   setMessages(prev => [...prev, actionMessage]);
  //   setIsAnalyzing(true);

  //   // Simulate specific analysis
  //   setTimeout(() => {
  //     const botResponse: Message = {
  //       id: Date.now() + 1,
  //       type: 'bot',
  //       content: `I'll focus on: "${action}". Analyzing your documents now for this specific aspect...`,
  //       timestamp: new Date()
  //     };
  //     setMessages(prev => [...prev, botResponse]);
  //     setIsAnalyzing(false);
  //   }, 1500);
  // };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header 
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg border border-blue-100/50 py-3' 
            : 'bg-white/80 backdrop-blur-md border border-blue-50/30 py-4'
        } rounded-2xl`}
      >
        <div className="w-full mx-auto  lg:px-8">
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

            {/* <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-4 py-10 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 h-[calc(100vh-12rem)]">
            
            {/* Sidebar - File Management */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg h-full flex flex-col">
                <div className="p-3 border-b border-gray-100">
                  {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3> */}
                  
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
              </div>
            </div>

            {/* Main Chat Area */}
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
                        {/* Avatar */}
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
                        
                        {/* Message Content */}
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

      {/* Fixed Bottom Analyze Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={startAnalysis}
            disabled={isAnalyzing || uploadedFiles.length === 0}
            className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              isAnalyzing || uploadedFiles.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            <Play className="w-6 h-6" />
            <span className='text-sm'>{isAnalyzing ? 'Analyzing...' : 'Begin Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;