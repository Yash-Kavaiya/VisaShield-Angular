import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileText, Upload, Filter, Search, MoreVertical, File, Download, Trash2, Eye } from 'lucide-angular';

@Component({
    selector: 'app-documents',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './documents.html',
    styleUrl: './documents.scss'
})
export class Documents {
    // Icons
    readonly icons = {
        file: FileText,
        upload: Upload,
        filter: Filter,
        search: Search,
        more: MoreVertical,
        defaultFile: File,
        download: Download,
        trash: Trash2,
        eye: Eye
    };

    // State
    searchQuery = signal('');
    selectedFilter = signal('all');

    documents = signal([
        {
            id: 1,
            name: 'Passport_Copy.pdf',
            type: 'PDF',
            category: 'Identification',
            size: '2.4 MB',
            uploadDate: '2024-12-18',
            uploadedBy: 'Client Portal',
            caseId: 'CASE-2024-101'
        },
        {
            id: 2,
            name: 'Employment_Offer_Letter.pdf',
            type: 'PDF',
            category: 'Employment',
            size: '1.1 MB',
            uploadDate: '2024-12-17',
            uploadedBy: 'Sarah Chen',
            caseId: 'CASE-2024-101'
        },
        {
            id: 3,
            name: 'Degree_Certificate_Masters.jpg',
            type: 'Image',
            category: 'Education',
            size: '4.5 MB',
            uploadDate: '2024-12-15',
            uploadedBy: 'Client Portal',
            caseId: 'CASE-2024-098'
        },
        {
            id: 4,
            name: 'LCA_Form_9035.pdf',
            type: 'PDF',
            category: 'Legal',
            size: '0.8 MB',
            uploadDate: '2024-12-10',
            uploadedBy: 'System',
            caseId: 'CASE-2024-105'
        },
        {
            id: 5,
            name: 'Resume_Updated_Final.docx',
            type: 'Word',
            category: 'Employment',
            size: '0.5 MB',
            uploadDate: '2024-12-05',
            uploadedBy: 'Sarah Chen',
            caseId: 'CASE-2024-101'
        }
    ]);

    filteredDocuments() {
        const query = this.searchQuery().toLowerCase();
        const filter = this.selectedFilter();

        return this.documents().filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(query) ||
                doc.caseId.toLowerCase().includes(query) ||
                doc.uploadedBy.toLowerCase().includes(query);

            const matchesFilter = filter === 'all' || doc.category.toLowerCase() === filter.toLowerCase();

            return matchesSearch && matchesFilter;
        });
    }

    uploadDocument() {
        alert('Upload functionality would open a file picker here.');
    }

    downloadDocument(doc: any) {
        console.log('Downloading', doc.name);
    }

    viewDocument(doc: any) {
        console.log('Viewing', doc.name);
    }
}
