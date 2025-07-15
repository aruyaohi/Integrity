'use client'
import React, { useState, useRef, useEffect, } from 'react';
import { Upload, User,ExternalLink,Search,FileText,Copy,} from 'lucide-react';
// import Link from 'next/link';


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
    // {
    //   id: 1,
    //   type: 'bot',
    //   content: 'Hello! I\'m your AI research assistant. Upload your white papers or documents and click "Analyze Documents" to get started with comprehensive analysis for errors, inconsistencies, and insights.',
    //   timestamp: new Date(),
    //   result: null
    // }
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
   <div className="min-h-screen flex flex-col bg-white max-w-7xl auto items-center">
      {/* Header */}
      <header 
        className="fixed top-4 left-4 right-4 z-50 bg-white rounded-2xl w-full">
        <div className="w-full mx-auto px-6 lg:px-20">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-1">
              <div 
                className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center transition-all duration-300 w-10 h-10"
              >
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span 
                className="font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent transition-all duration-300 text-xl"
              >
                RIVA
              </span>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Navigation items can go here */}
            </nav>
            
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                className="bg-orange-50 text-gray-900 border border-gray-300 flex justify-between items-center gap-2 hover:bg-orange-100 rounded-xl font-semibold transition-all duration-300 transform px-6 py-3"
              >
                <User className='text-gray-900' size={20}/>
                F1dmadfadfdfagdfdffdfjeeieuei
                <button className="hover:text-orange-500">
                  <Copy size={16}/>
                </button>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - positioned below header */}
      <div className="flex-1 flex pt-24 px-4">
        <div className="w-full max-w-7xl mx-auto flex gap-6 h-full">
          
          {/* Left Sidebar/Navigation */}
          <div className="w-64 bg-gray-50 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-orange-100 text-orange-700 font-medium">
                Token Analysis
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                History
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700">
                Help
              </button>
            </nav>
          </div>

          {/* Right Section Container */}
          <div className="flex-1 flex flex-col gap-6 items-center">
            {/* Main Results Section */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 min-h-96 w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400"/>
                  <p>Upload a file or enter token details to begin analysis</p>
                </div>
              </div>
            </div>

            {/* Bottom Input Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Token Analysis Input</h3>
              
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                    <Upload className="mx-auto mb-2 text-gray-400" size={24}/>
                    <p className="text-sm text-gray-600">
                      Drag and drop PDF or DOCX files here, or 
                      <button className="text-orange-500 hover:text-orange-600 ml-1">browse</button>
                    </p>
                  </div>
                </div>

                {/* Token Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter token name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Shortcut/Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BTC, ETH"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Official Site Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <ExternalLink className="absolute right-3 top-2.5 text-gray-400" size={16}/>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-500 transition-all duration-300 flex items-center gap-2">
                    <Search size={16}/>
                    Analyze Token
                  </button>
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