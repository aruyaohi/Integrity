'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, User, Bot,
  CheckCircle, MoreVertical, Send, Trash, FileText,
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
  result : ProjectData | null,
  timestamp: Date;
}

interface ProjectData {
  icon: string,
  projectName: string,
  about?:string,
  summary? : {
    coreInnovation:string ,
    businessModel: string,
    valueGeneration: string,
  },
  AI : {
    metrics: string 
    whyinvest: string 
    howtoinvest: string 
  },
  projectPlatforms?:   
  {
  website?: string;
  socials?: {
    X?: string;
    Discord:string;
    telegram:string;
    other?: string;
  };
  articles?: string[]; //
};
  contactFounder?: string;
  achievements?: string[];
  success: boolean;
  data?: string;
  error?: string;
}

const AnalysisPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [responseData, setResponseData] = useState<ProjectData | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI research assistant. Upload your white papers or documents and click "Analyze Documents" to get started with comprehensive analysis for errors, inconsistencies, and insights.',
      timestamp: new Date(),
      result: null
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      const invalidMessage: Message = {
        id: Date.now(),
        type: 'system',
        content: `${files.length - validFiles.length} file(s) were rejected. Only PDF, DOC, DOCX files under 10MB are allowed.`,
        timestamp: new Date(),
        result: null
      };
      setMessages(prev => [...prev, invalidMessage]);
    }

    if (validFiles.length > 0) {
      const newFiles: UploadedFile[] = validFiles.map(file => ({
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
        content: `Successfully uploaded ${validFiles.length} file(s): ${validFiles.map(f => f.name).join(', ')}`,
        timestamp: new Date(),
        result: null
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    handleFiles(Array.from(event.target.files));
    // Reset the input so the same file can be uploaded again
    event.target.value = '';
  };

  const handleRemoveFile = (fileId: number) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    
    if (fileToRemove) {
      const removeMessage: Message = {
        id: Date.now(),
        type: 'system',
        content: `Removed file: ${fileToRemove.name}`,
        timestamp: new Date(),
        result : null
      };
      setMessages(prev => [...prev, removeMessage]);
    }
  };

  const sendToAPI = async (files: UploadedFile[]) => {
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
        if (response.status === 500) {
          throw new Error('Network Error: Check network Connection');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      

      const result = await response.json();
      console.log("This is the actual response", result.analysis[0])
      return result;
      
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };

  const handleRequest = async () => {
    if (uploadedFiles.length === 0) {
      const errorMessage: Message = {
        id: Date.now(),
        type: 'bot',
        content: "Please upload at least one document (PDF, DOC, or DOCX) for analysis.",
        timestamp: new Date(),
        result: null
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await sendToAPI(uploadedFiles);
      console.log("Analysis result:", result.analysis);
      const data = result.analysis[0]
      
      if (data) {
        setResponseData(data);
        console.log(responseData)
        
        const botResponse: Message = {
          id: Date.now(),
          type: 'bot',
          content: data? `Analysis complete!`: `Analysis failed: ${result.error || 'Unknown error'}`,
          timestamp: new Date(),
          result : data,
        };
        setMessages(prev => [...prev, botResponse]);
      }
      
    } catch (error) {
      console.error('Request error:', error);
      const errorResponse: Message = {
        id: Date.now(),
        result: null,
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
      if (inputMessage.trim()) {
        const userMessage: Message = {
          id: Date.now(),
          result: null,
          type: 'user',  
          content: inputMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        
        // Simple bot response for text messages
        setTimeout(() => {
          const botResponse: Message = {
            id: Date.now() + 100,
            result: null,
            type: 'bot',
            content: "I can help you analyze documents. Please upload your research papers or white papers using the upload area below, then click 'Analyze Documents'.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1000);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
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

  const clearAllFiles = () => {
    setUploadedFiles([]);
    const clearMessage: Message = {
      id: Date.now(),
      result: null,
      type: 'system',
      content: 'All files have been cleared.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, clearMessage]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
        multiple
        className="hidden"
      />


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-28 pb-4 px-4">
        <div className="flex-1 max-w-7xl mx-auto w-full">
          <div className="h-full flex flex-col">
            {/* Chat Container */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl flex flex-col overflow-hidden">
              
              {/* Chat Header */}
              <div className="flex-shrink-0 p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-blue-500"/>
                    </div>
                    <div>
                      <h2 className="text-md font-semibold text-gray-900">Project Analysis</h2>
                      <p className="text-sm text-gray-600">AI-powered Project review and analysis via White paper and project recent activities</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500' 
                          : message.type === 'system'
                          ? 'bg-gray-500'
                          : 'bg-white border-2 border-blue-100'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : message.type === 'system' ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : message.type === 'system'
                          ? 'bg-gray-100 text-gray-700 text-sm italic border'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <div>
                          {message.result != null?  
                          <div className='w-full h-screen/2 rounded-2xl bg-gray-50 px-10 py-3'>
                            

                            {/* Project Name & Icon */}
                            <div className='flex justify-between items-center py-3'>
                              {/* Icon */}
                            <div className='flex gap-4'>
                              {/* <div className='rounded-md border'>
                                <img src={message.result?.icon || "placeholder.png"} alt="logo" className='w-4 h-4'/>
                              </div> */}
                            <div>
                            <div className='flex flex-col'>
                            <span className='font-bold text-lg'>{message.result?.projectName}</span>
                            <span>{message.result?.about}</span>
                            </div>
                            <div>
                            </div>
                            </div>
                            </div>
                            </div>

                            {/* Project Summary */}
                            <h3 className='text-lg font-bold text-blue-900'> Project Information</h3>
                            <div className='flex justify-between gap-3'>
                            <div className='flex flex-col gap-4'>
                            <div className='flex flex-col'>
                            <h3 className='font-bold text-md'>Core Innovation</h3>
                            <span className='text-sm font-medium text-gray-600'>{message.result?.summary?.coreInnovation}</span>
                            </div>
                            <div className='flex flex-col'>
                            <h3 className='font-bold text-md'>Business Model</h3>
                            <span className='text-sm font-medium text-gray-600'>{message.result?.summary?.businessModel}</span>
                            </div>

                            <div className='flex flex-col'>
                            <h3 className='font-bold text-md'>Value Generation</h3>
                            <span className='text-sm font-medium text-gray-600'>{message.result?.summary?.valueGeneration}</span>
                            </div>
                            </div>
                            </div>

                            {/**AI findings and metric evaluation */}
                            <h3 className='text-lg font-bold text-blue-900'> Ai analysis and Suggestion</h3>
                           <div className='flex justify-between gap-3'>
                            <div className='flex flex-col gap-4'>
                          <div className="flex flex-col gap-2">
  <h3 className="font-bold text-md">Metrics</h3>

  {message.result?.AI.metrics &&
    Object.entries(message.result.AI.metrics).map(([key, value]) => (
      <div key={key} className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">{key}</span>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
    ))}
</div>

                            <div className='flex flex-col'>
                            <h3 className='font-bold text-md'>Why you should Invest</h3>
                            <span className='text-sm font-medium text-gray-600'>{message.result?.AI.whyinvest}</span>
                            </div>

                            <div className='flex flex-col'>
                            <h3 className='font-bold text-md'>How to Invest</h3>
                            <span className='text-sm font-medium text-gray-600'>{message.result?.AI.howtoinvest}</span>
                            </div>

                            </div>
                            </div>
                          </div>
                           : 
                           <p>{message.content}</p>
                           }
                        </div>
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
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">Analyzing documents...</span>
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

      {/* Fixed Bottom Input Section */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-col space-y-4">
          
          {/* Show uploaded files if any */}
          {uploadedFiles.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-900">
                  Uploaded Files ({uploadedFiles.length})
                </p>
                <button
                  onClick={clearAllFiles}
                  className="text-xs text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-white rounded-lg p-3 group hover:bg-blue-50 transition-colors border shadow-sm">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-blue-800 truncate font-medium block">{file.name}</span>
                        <span className="text-xs text-blue-600">({formatFileSize(file.size)})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="ml-2 p-1 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove file"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 transition-all ${
              dragActive ? 'text-blue-500 scale-110' : 'text-blue-400'
            }`} />
            <p className="text-sm text-gray-700 mb-1 font-medium">
              {dragActive ? 'Drop files here' : 'Drop files here or click to upload'}
            </p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB each</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRequest}
              disabled={isAnalyzing || uploadedFiles.length === 0}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isAnalyzing || uploadedFiles.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:from-blue-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze Documents'
              )}
            </button>

            {/* Chat Input */}
            <div className="flex-1 flex items-center space-x-3 bg-white rounded-xl border border-gray-200 shadow-lg p-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask questions about your documents..."
                className="flex-1 resize-none border-0 outline-none text-sm leading-6 max-h-[80px] min-h-[24px] placeholder-gray-400 text-gray-900"
                rows={1}
                disabled={isAnalyzing}
              />
              <button
                onClick={() => {
                  if (inputMessage.trim()) {
                    const userMessage: Message = {
                      id: Date.now(),
                      result: null,
                      type: 'user',
                      content: inputMessage,
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, userMessage]);
                    setInputMessage('');
                    
                    setTimeout(() => {
                      const botResponse: Message = {
                        id: Date.now() + 100,
                        result: null,
                        type: 'bot',
                        content: "I can help you analyze documents. Please upload your research papers or white papers using the upload area above, then click 'Analyze Documents'.",
                        timestamp: new Date()
                      };
                      setMessages(prev => [...prev, botResponse]);
                    }, 1000);
                  }
                }}
                disabled={!inputMessage.trim()}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  !inputMessage.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;