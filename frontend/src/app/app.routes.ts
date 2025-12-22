import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Settings } from './pages/settings/settings';
import { ComplianceCenter } from './pages/compliance-center/compliance-center';
import { Documents } from './pages/documents/documents';
import { CaseList } from './pages/cases/case-list/case-list';
import { CaseDetail } from './pages/cases/case-detail/case-detail';
import { Analytics } from './pages/analytics/analytics';
import { AiAdjudicator } from './pages/ai-adjudicator/ai-adjudicator';
import { AskVia } from './pages/ask-via/ask-via';

export const routes: Routes = [
    // Public routes
    { path: 'login', component: Login },

    // Protected routes with main layout
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'cases', component: CaseList },
            { path: 'cases/:id', component: CaseDetail },
            { path: 'ai-adjudicator', component: AiAdjudicator },
            { path: 'ask-via', component: AskVia },
            { path: 'analytics', component: Analytics },
            { path: 'settings', component: Settings },
            { path: 'compliance', component: ComplianceCenter },
            { path: 'documents', component: Documents },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'dashboard' }
];
