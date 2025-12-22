import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Send, Paperclip, FileText, Bot, User, ThumbsUp, ThumbsDown, Copy } from 'lucide-angular';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    citations?: Citation[];
    confidence?: number;
    files?: AttachedFile[];
}

interface Citation {
    title: string;
    url: string;
    snippet: string;
}

interface AttachedFile {
    name: string;
    size: number;
    type: string;
}

@Component({
    selector: 'app-ask-via',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './ask-via.html',
    styleUrl: './ask-via.scss'
})
export class AskVia {
    // Icons
    readonly icons = {
        send: Send,
        paperclip: Paperclip,
        file: FileText,
        bot: Bot,
        user: User,
        thumbsUp: ThumbsUp,
        thumbsDown: ThumbsDown,
        copy: Copy
    };

    messages = signal<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Hello! I am your AskVia assistant. I can help you analyze documents, answer immigration questions, and provide citations from official sources. How can I help you today?',
            timestamp: new Date()
        }
    ]);

    inputMessage = signal('');
    isTyping = signal(false);
    attachedFiles = signal<AttachedFile[]>([]);

    sendMessage() {
        if (!this.inputMessage().trim() && this.attachedFiles().length === 0) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: this.inputMessage(),
            timestamp: new Date(),
            files: [...this.attachedFiles()]
        };

        this.messages.update(msgs => [...msgs, newUserMessage]);
        this.inputMessage.set('');
        this.attachedFiles.set([]);
        this.isTyping.set(true);

        // Simulate AI delay and response
        setTimeout(() => {
            this.generateMockResponse();
        }, 2000);
    }

    generateMockResponse() {
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: 'Based on the documents provided and current USCIS regulations, the H-1B visa cap for the fiscal year 2025 has been reached. However, certain exemptions apply for regular cap cases.',
            timestamp: new Date(),
            confidence: 0.94,
            citations: [
                {
                    title: 'USCIS H-1B Fiscal Year 2025 Cap Season',
                    url: 'https://www.uscis.gov/h-1b',
                    snippet: 'USCIS has received a sufficient number of petitions needed to reach the congressionally mandated 65,000 H-1B visa regular cap...'
                },
                {
                    title: 'Title 8 CFR § 214.2(h)',
                    url: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2',
                    snippet: 'Button text relating to temporary exclusion of certain H-1B nonimmigrants...'
                }
            ]
        };

        this.messages.update(msgs => [...msgs, aiMessage]);
        this.isTyping.set(false);
    }

    handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const newFiles: AttachedFile[] = Array.from(input.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            this.attachedFiles.update(files => [...files, ...newFiles]);
        }
    }

    removeFile(index: number) {
        this.attachedFiles.update(files => files.filter((_, i) => i !== index));
    }

    formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    formatSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}
