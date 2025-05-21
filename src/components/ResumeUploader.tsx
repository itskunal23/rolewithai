"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploaderProps {
  onClose: () => void;
  onAnalysisComplete?: (data: any) => void;
}

export function ResumeUploader({ onClose, onAnalysisComplete }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "application/msword" || droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF or Word document");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.type === "application/msword" || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF or Word document");
    }
  }, []);

  const handleTextPaste = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    setFile(null);
    setError(null);
  }, []);

  const analyzeResume = useCallback(async () => {
    if (!file && !resumeText) {
      setError("Please upload a file or paste your resume content");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const formData = new FormData();
      if (file) {
        formData.append("resume", file);
      }
      if (resumeText) {
        formData.append("resumeText", resumeText);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result
      const analysisResult = {
        skills: [
          { name: "Python", level: "Advanced", years: 3 },
          { name: "Machine Learning", level: "Intermediate", years: 2 },
          { name: "Data Analysis", level: "Advanced", years: 4 }
        ],
        experience: [
          {
            title: "Data Scientist",
            company: "TechCorp",
            duration: "2021-2023",
            highlights: ["Led ML projects", "Improved accuracy by 25%"]
          }
        ],
        education: [
          {
            degree: "MSc in Computer Science",
            institution: "Tech University",
            year: "2020"
          }
        ],
        recommendations: [
          {
            type: "skill",
            name: "Deep Learning",
            priority: "high",
            reason: "Required for target role"
          }
        ]
      };

      onAnalysisComplete?.(analysisResult);
      onClose();
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [file, resumeText, onAnalysisComplete, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100">
          <X />
        </button>
        
        <h2 className="text-lg font-bold text-neutral-100 mb-2 flex items-center gap-2">
          <Upload className="h-5 w-5" /> Upload Resume
        </h2>
        
        <div className="text-neutral-200 mb-4">
          Upload your resume or paste its contents below
        </div>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-neutral-600"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-2" />
              <p className="text-sm text-neutral-400">
                Drag and drop your resume here, or click to browse
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Supports PDF and Word documents
              </p>
            </label>
          </div>

          {/* File Preview */}
          {file && (
            <div className="flex items-center gap-2 bg-neutral-900 rounded p-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-neutral-200 flex-1 truncate">
                {file.name}
              </span>
              <button
                onClick={() => setFile(null)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Text Input */}
          <div className="relative">
            <textarea
              className="w-full h-32 bg-neutral-900 rounded p-3 text-neutral-200 text-sm resize-none"
              placeholder="Or paste your resume content here..."
              value={resumeText}
              onChange={handleTextPaste}
            />
            {resumeText && (
              <button
                onClick={() => setResumeText("")}
                className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Action Button */}
          <Button
            className="w-full"
            onClick={analyzeResume}
            disabled={isAnalyzing || (!file && !resumeText)}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 