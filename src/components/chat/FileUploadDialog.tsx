import { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  chunks?: number;
  error?: string;
}

export const FileUploadDialog = ({ open, onOpenChange }: FileUploadDialogProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File): Promise<void> => {
    const fileId = Math.random().toString(36);
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => [...prev, uploadedFile]);

    try {
      // Simulate file upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }

      // Switch to processing
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'processing', progress: 0 }
          : f
      ));

      // Simulate chunking process
      const estimatedChunks = Math.ceil(file.size / 1000); // Roughly 1000 chars per chunk
      
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress, chunks: Math.ceil(estimatedChunks * (progress / 100)) }
            : f
        ));
      }

      // Complete
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed', progress: 100, chunks: estimatedChunks }
          : f
      ));

      toast({
        title: "File processed successfully",
        description: `${file.name} has been chunked and stored in the vector database.`,
      });

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', error: 'Failed to process file' }
          : f
      ));

      toast({
        title: "Upload failed",
        description: `Failed to process ${file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter(file => {
      // Check file type
      const validTypes = ['application/pdf', 'text/plain', 'application/json'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not supported. Please upload PDF, TXT, or JSON files.`,
          variant: "destructive",
        });
        return false;
      }

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    validFiles.forEach(processFile);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-info" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return `Processing... (${file.chunks || 0} chunks)`;
      case 'completed':
        return `Completed (${file.chunks} chunks stored)`;
      case 'error':
        return file.error || 'Error';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Upload Files for RAG Processing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`file-upload-zone ${isDragOver ? 'dragover' : ''}`}
          >
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-text-muted mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-primary">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-text-muted">
                  Supports PDF, TXT, and JSON files up to 50MB
                </p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.json"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary">
                Processing Files ({files.length})
              </h3>
              
              <ScrollArea className="max-h-60">
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <File className="h-8 w-8 text-text-muted flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {file.name}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          {getStatusIcon(file.status)}
                          <span>{getStatusText(file)}</span>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                        
                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <Progress value={file.progress} className="mt-2 h-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};