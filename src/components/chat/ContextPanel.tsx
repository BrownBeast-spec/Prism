import { useState } from 'react';
import { ChevronDown, ExternalLink, FileText, Database, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ContextPanelProps {
  isVisible: boolean;
}

interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number;
  source: string;
  metadata: {
    filename: string;
    chunkIndex: number;
    fileType: string;
  };
}

interface UploadedDocument {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  chunks: number;
  uploadedAt: Date;
  status: 'processed' | 'processing' | 'failed';
}

export const ContextPanel = ({ isVisible }: ContextPanelProps) => {
  const [documentsOpen, setDocumentsOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock data
  const [retrievedChunks] = useState<RetrievedChunk[]>([
    {
      id: '1',
      content: 'This document discusses the implementation of Retrieval-Augmented Generation (RAG) systems using vector databases for efficient semantic search and context retrieval.',
      similarity: 0.89,
      source: 'rag-implementation.pdf',
      metadata: {
        filename: 'rag-implementation.pdf',
        chunkIndex: 5,
        fileType: 'PDF'
      }
    },
    {
      id: '2',
      content: 'Vector embeddings are mathematical representations of text that capture semantic meaning, enabling similarity-based retrieval in high-dimensional space.',
      similarity: 0.76,
      source: 'vector-embeddings.txt',
      metadata: {
        filename: 'vector-embeddings.txt',
        chunkIndex: 12,
        fileType: 'TXT'
      }
    }
  ]);

  const [uploadedDocs] = useState<UploadedDocument[]>([
    {
      id: '1',
      filename: 'rag-implementation.pdf',
      fileType: 'PDF',
      size: 2.4 * 1024 * 1024,
      chunks: 45,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
      status: 'processed'
    },
    {
      id: '2',
      filename: 'vector-embeddings.txt',
      fileType: 'TXT',
      size: 1.2 * 1024 * 1024,
      chunks: 28,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'processed'
    },
    {
      id: '3',
      filename: 'claude-interface-specs.json',
      fileType: 'JSON',
      size: 890 * 1024,
      chunks: 15,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'processing'
    }
  ]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'text-success';
    if (similarity >= 0.6) return 'text-warning';
    return 'text-text-muted';
  };

  const getStatusBadge = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'processed':
        return <Badge variant="secondary" className="bg-success/10 text-success">Processed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-info/10 text-info">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-panel-bg border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">Context & Files</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Retrieved Context */}
          <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="font-medium text-text-primary">Retrieved Context</span>
                  <Badge variant="secondary" className="text-xs">
                    {retrievedChunks.length}
                  </Badge>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${contextOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3 space-y-3">
              {retrievedChunks.map((chunk, index) => (
                <div key={chunk.id} className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-text-secondary">
                      Result {index + 1}
                    </span>
                    <span className={`text-xs font-mono ${getSimilarityColor(chunk.similarity)}`}>
                      {(chunk.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-text-primary mb-2 line-clamp-3">
                    {chunk.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {chunk.metadata.filename}
                    </span>
                    <span>Chunk {chunk.metadata.chunkIndex}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 h-6 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Source
                  </Button>
                </div>
              ))}
              
              {retrievedChunks.length === 0 && (
                <div className="text-center py-6 text-text-muted">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No context retrieved yet</p>
                  <p className="text-xs mt-1">Ask a question to see relevant chunks</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Uploaded Documents */}
          <Collapsible open={documentsOpen} onOpenChange={setDocumentsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium text-text-primary">Documents</span>
                  <Badge variant="secondary" className="text-xs">
                    {uploadedDocs.length}
                  </Badge>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${documentsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3 space-y-3">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {doc.filename}
                      </h4>
                      <p className="text-xs text-text-muted">
                        {formatFileSize(doc.size)} • {doc.chunks} chunks • {formatTime(doc.uploadedAt)}
                      </p>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  {doc.status === 'processing' && (
                    <Progress value={65} className="h-1 mb-2" />
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-6 text-xs"
                    >
                      View Chunks
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* RAG Settings */}
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium text-text-primary">RAG Settings</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3 space-y-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary">Top K Results</label>
                    <p className="text-xs text-text-muted">Number of chunks to retrieve</p>
                    <div className="mt-1 text-sm font-mono text-text-primary">5</div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-text-secondary">Similarity Threshold</label>
                    <p className="text-xs text-text-muted">Minimum similarity score</p>
                    <div className="mt-1 text-sm font-mono text-text-primary">0.7</div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-text-secondary">Model</label>
                    <p className="text-xs text-text-muted">LLM for response generation</p>
                    <div className="mt-1 text-sm font-mono text-text-primary">Llama-3-8B-Instruct</div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};