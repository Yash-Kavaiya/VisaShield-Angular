VisaShield AI - Website Feature Blueprint

Based on your comprehensive technical document, here's a structured breakdown of the features you should build:

🎯 Phase 1: Core Platform Features
1. Landing Page / Marketing Site

Hero section explaining the 11.3M backlog problem
Value proposition (938% processing time reduction)
Trust indicators (security badges, compliance certifications)
Animated statistics dashboard preview
Call-to-action for demo/signup

2. Authentication & User Management

Multi-role login (Immigration Attorney, Adjudicator, Admin, Compliance Officer)
OAuth integration (Google Workspace for law firms)
Two-factor authentication (mandatory for legal data)
Role-based access control (RBAC)

3. Case Submission Portal

Multi-step form wizard for petition types:

O-1 (Extraordinary Ability)
H-1B (Specialty Occupation)
EB-2 NIW (National Interest Waiver)
I-90, I-140, I-129


Drag-and-drop document upload (500+ page support)
OCR preview for scanned passports/visas
Evidence checklist generator


🤖 Phase 2: AI Co-Pilot Features
4. Legal Reasoning Engine Dashboard

Real-time "Chain of Thought" visualization
Criterion-by-criterion evaluation display
Confidence scores per evidence piece
Kazarian precedent compliance checker

5. RAG Knowledge Panel

USCIS Policy Manual search (12 volumes)
INA statute lookup
AAO decision database browser
Relevance score display for retrieved citations

6. Draft Determination Generator

AI-generated approval/denial drafts
Citation highlighting with source links
"Totality of Evidence" summary
One-click export to PDF/Word

7. Citation Validator

Real-time hallucination detection
Green/Red indicators for each legal citation
"Fake Case Alert" warnings
Manual override with attorney notes


📊 Phase 3: Immigration Command Center (Dashboards)
8. Executive Dashboard
WidgetPurposeBacklog Buster GraphCases processed vs. manual review requiredROI CalculatorCost savings per visa categoryProcessing Time TrendsH-1B vs O-1 vs EB-2 comparisons
9. Legal Quality Dashboard
WidgetPurposeHallucination HeatmapCitation validity by visa typeEvidence Sufficiency MeterWeak evidence flaggingPrecedent Match ScoresAAO decision alignment
10. Security & Compliance Dashboard
WidgetPurposePII Leakage FeedReal-time redaction log streamPrompt Injection AttemptsBlocked attack visualizationAudit Trail TimelineWho accessed what, when

🔒 Phase 4: Security & Compliance Features
11. Sensitive Data Scanner

A-Number detection & redaction (A\d{9})
Passport number masking
SSN/ITIN protection
GDPR/Privacy Act compliance badges

12. Threat Protection Panel

Jailbreak attempt alerts
Suspicious input pattern detection
IP blocking interface
Fraud review queue

13. Audit & Traceability

Full decision audit trail
Exportable compliance reports
FOIA request support
Immutable logging


🔧 Phase 5: Administrative Features
14. Case Management System

Kanban board view (Submitted → In Review → Complete)
Bulk case actions
Attorney assignment
Priority flagging

15. Human Review Queue

AI-flagged cases requiring intervention
Side-by-side AI draft vs. manual review
Approval/rejection workflow
Feedback loop to improve AI

16. System Configuration

Feature flags (human_only_mode toggle)
RAG knowledge base updates
Model version management
Alert threshold configuration


📱 Phase 6: User Experience Features
17. Applicant Portal (Optional B2C)

Case status tracker
Document upload interface
Secure messaging with attorney
Timeline visualization

18. Notifications & Alerts

Email/SMS for case updates
Slack integration for legal teams
P1 incident alerts for admins
Weekly summary reports

19. Help & Documentation

Interactive onboarding tour
Video tutorials
API documentation
Live chat support



------------------------------------------------------------

Part 1: Design Philosophy & Brand Identity
Core Theme Statement
Create an enterprise-grade immigration intelligence dashboard called "VisaGuardian AI" 
with a patriotic USA government aesthetic. The design should evoke trust, authority, 
and technological sophistication—similar to official government portals like USCIS.gov 
but modernized with a premium SaaS feel. Think: "If the Department of Homeland Security 
hired a Silicon Valley design team."
Visual Identity Keywords
CategoryDescriptorsMoodAuthoritative, Trustworthy, Secure, Professional, PatrioticStyleClean government aesthetic, Modern enterprise SaaS, Legal tech premiumInspirationUSCIS.gov, Login.gov, USA.gov, Bloomberg Terminal, Palantir Foundry

Part 2: Color System
Primary Palette (USA Government)
PRIMARY NAVY: #0A2647 (Deep government blue - headers, primary buttons)
SECONDARY BLUE: #1E5AA8 (Official seal blue - accents, links)
PATRIOT RED: #BF0A30 (American flag red - alerts, critical actions, badges)
PURE WHITE: #FFFFFF (Clean backgrounds, cards)
CREAM WHITE: #F7F9FC (Secondary backgrounds, alternating rows)
Accent & Status Colors
SUCCESS GREEN: #2E7D32 (Approved status, positive metrics)
WARNING AMBER: #F9A825 (Pending review, caution states)
DANGER RED: #C62828 (Denied, errors, critical alerts)
INFO BLUE: #1976D2 (Informational badges, tooltips)
GOLD ACCENT: #C9A227 (Premium features, achievements, seals)
Gradient Specifications
HERO GRADIENT: Linear from #0A2647 to #1E5AA8 (45 degrees)
CARD HOVER: Subtle white to cream (#FFFFFF to #F7F9FC)
PATRIOTIC ACCENT: Red #BF0A30 to Navy #0A2647 (for special banners)

Part 3: Typography System
Font Stack
PRIMARY HEADINGS: "Merriweather" (serif) - Evokes government documents, legal weight
SECONDARY HEADINGS: "Source Sans Pro" (sans-serif) - Modern, readable
BODY TEXT: "Inter" or "Open Sans" - Clean, accessible, enterprise-standard
MONOSPACE/DATA: "JetBrains Mono" or "Roboto Mono" - For case numbers, IDs
Type Scale
HERO TITLE: 48px / Bold / Merriweather / Letter-spacing: -0.02em
PAGE TITLE: 32px / Semibold / Merriweather
SECTION HEADER: 24px / Semibold / Source Sans Pro
CARD TITLE: 18px / Medium / Source Sans Pro
BODY LARGE: 16px / Regular / Inter / Line-height: 1.6
BODY STANDARD: 14px / Regular / Inter / Line-height: 1.5
CAPTION/LABEL: 12px / Medium / Inter / Uppercase / Letter-spacing: 0.05em
DATA DISPLAY: 14px / Regular / JetBrains Mono

Part 4: Page Structure & Layout
Global Layout Framework
NAVIGATION: Fixed left sidebar (280px collapsed to 72px) - Navy background
TOP BAR: 64px height - White with subtle shadow, contains search and user menu
CONTENT AREA: Fluid width with max-width 1440px, centered
PADDING: 32px standard page padding, 24px for cards
GRID: 12-column grid system, 24px gutters
Page Inventory
PagePurposePriorityLogin/AuthSecure government-style login with 2FAP0Dashboard HomeCommand center overviewP0Case ManagementList and manage petitionsP0Case DetailDeep dive into single caseP0AI AdjudicationReal-time AI processing viewP0Analytics/MetricsDatadog-powered insightsP1Document ViewerPDF evidence viewerP1SettingsUser and system configurationP2Compliance CenterAudit logs and reportsP2

Part 5: Component Specifications
5.1 Navigation Sidebar
PROMPT: Create a fixed left navigation sidebar with:
- Top section: VisaGuardian AI logo (shield icon with eagle silhouette, 
  American flag colors)
- Logo tagline: "Immigration Intelligence Platform"
- Navigation items with icons:
  • Dashboard (grid icon)
  • Cases (folder icon) with sub-items: All Cases, Pending Review, Approved, Denied
  • AI Adjudicator (brain/chip icon)
  • Analytics (chart icon)
  • Documents (file-text icon)
  • Compliance (shield-check icon)
  • Settings (gear icon)
- Each nav item: Icon + Label, hover state with left border accent (patriot red)
- Active state: Light navy background (#1E3A5F), white text, red left border
- Bottom section: User avatar, name, role badge ("Immigration Attorney"), logout
- Collapse toggle: Hamburger icon that collapses to icon-only mode (72px)
- Background: Deep navy (#0A2647)
- Text: White with 80% opacity, 100% on hover/active
5.2 Top Header Bar
PROMPT: Create a sticky top header bar containing:
- Left: Breadcrumb navigation (Home > Cases > H-1B-2024-00847)
- Center: Global search bar with:
  • Placeholder: "Search cases, applicants, or A-numbers..."
  • Search icon prefix
  • Keyboard shortcut hint (⌘K)
  • Dropdown results preview on focus
- Right section:
  • Notification bell with red badge counter
  • Help/documentation icon
  • User dropdown (avatar, name, role, sign out)
- Background: Pure white
- Border-bottom: 1px subtle gray (#E5E7EB)
- Shadow: Very subtle (0 1px 3px rgba(0,0,0,0.05))
5.3 Dashboard Home Page
PROMPT: Create an executive command center dashboard with USA government aesthetic:

HERO SECTION (Top):
- Welcome message: "Good morning, [Attorney Name]"
- Today's date in formal format: "Friday, December 19, 2025"
- Motivational stat: "You've helped process 1,247 cases this quarter"

METRIC CARDS ROW (4 cards):
1. "Cases Processed Today" - Large number (127), sparkline trend, green up arrow
2. "Pending AI Review" - Number (43), amber warning badge if >50
3. "Manual Review Required" - Number (8), red indicator
4. "System Health" - Percentage (99.2%), green status dot

MAIN GRID (2 columns):

LEFT COLUMN (60%):
- "Active Cases" table/list with:
  • Case number (clickable, monospace font)
  • Applicant name (partially redacted: "John D***")
  • Visa type badge (H-1B blue, O-1 gold, EB-2 green)
  • Status chip (Processing, Pending Review, Complete)
  • AI confidence score (percentage with color coding)
  • Assigned attorney
  • Last updated timestamp
  • Quick actions (View, Reassign, Flag)
  • Pagination at bottom

RIGHT COLUMN (40%):
- "AI Processing Queue" card:
  • Real-time list of cases being adjudicated
  • Each item shows: Case ID, visa type, progress bar, elapsed time
  • Animated processing indicator
  
- "Recent Alerts" card:
  • Icon + message format
  • Types: Citation warning (amber), PII detected (red), Processing complete (green)
  • Timestamp for each
  • "View All" link
  
- "Quick Actions" card:
  • Button: "Upload New Petition" (primary)
  • Button: "Generate Report" (secondary)
  • Button: "View Compliance Log" (tertiary)

BOTTOM SECTION:
- "Weekly Processing Volume" chart:
  • Bar chart showing cases by day
  • Stacked by status (Approved green, Denied red, Pending amber)
  • USA flag-inspired color scheme
5.4 Case Detail Page
PROMPT: Create a comprehensive case detail view for immigration petition:

HEADER:
- Case number in monospace (H1B-2024-00847)
- Large applicant name (with redaction toggle)
- Status badge (prominent)
- Visa type badge
- Filed date, Priority date
- Action buttons: "Run AI Analysis", "Export PDF", "Assign Reviewer"

TAB NAVIGATION:
- Overview | Documents | AI Analysis | Timeline | Notes | Compliance

OVERVIEW TAB CONTENT:

Left Panel (65%):
- "Applicant Information" card:
  • Photo placeholder (silhouette with "CONFIDENTIAL" watermark option)
  • Full name, DOB, Country of origin
  • A-Number (with copy button, masked by default)
  • Passport number (masked)
  • Current status, Previous visas

- "Petition Details" card:
  • Employer/Sponsor information
  • Job title, SOC code
  • Wage level, Location
  • Requested start date

- "Supporting Evidence" card:
  • Checklist of required documents with status icons
  • ✓ I-129 Form (Verified)
  • ✓ Labor Condition Application (Verified)
  • ⚠ Degree Evaluation (Pending Review)
  • ✗ Passport Copy (Missing)
  • Each item clickable to view document

Right Panel (35%):
- "AI Adjudication Summary" card:
  • Large confidence score gauge (0-100)
  • Recommendation badge: "LIKELY APPROVABLE" (green) or "REQUIRES REVIEW" (amber)
  • Key findings list with citations
  • "View Full Analysis" button

- "Processing Timeline" mini-view:
  • Vertical timeline with key dates
  • Filed → Received → AI Reviewed → [Current Status]
  • Estimated completion date

- "Assigned Team" card:
  • Lead attorney avatar + name
  • Paralegal avatar + name
  • Quick message buttons

DOCUMENTS TAB:
- Split view: Document list on left, PDF viewer on right
- Document categories: Forms, Evidence, Correspondence, AI Reports
- Drag-and-drop upload zone
- Version history for each document

AI ANALYSIS TAB:
- "Chain of Thought" visualization:
  • Step-by-step reasoning display
  • Each step shows: Action, Evidence referenced, Conclusion
  • Citations linked to actual policy manual sections
  • Confidence score for each criterion
  • Expandable "View Retrieved Context" for each citation
  
- "Legal Precedents Applied" section:
  • Case citations with relevance scores
  • Links to AAO decision documents
  
- "Risk Factors Identified" section:
  • Red/amber flagged items
  • Suggested mitigations

- "Hallucination Check" badge:
  • Green checkmark: "All citations verified"
  • Or red warning: "2 citations could not be verified - flagged for review"
5.5 AI Adjudicator Live View
PROMPT: Create a real-time AI processing interface:

SPLIT SCREEN LAYOUT:

LEFT SIDE - Document Viewer (50%):
- PDF viewer showing current document
- AI highlighting: Yellow boxes around sections being analyzed
- Floating annotation bubbles showing AI interpretation
- Page navigation, zoom controls
- "Evidence being analyzed" label at top

RIGHT SIDE - AI Reasoning Panel (50%):
- "Live Analysis" header with animated processing indicator
- Streaming text output showing AI's reasoning (typewriter effect)
- Structured sections:
  • "Currently evaluating: [Criterion name]"
  • "Evidence found: [Quote from document]"
  • "Policy reference: [USCIS Manual citation]"
  • "Preliminary assessment: [Pass/Fail/Needs Review]"

BOTTOM PANEL - Progress Dashboard:
- Overall progress bar with stages:
  Form Validation → Evidence Review → Policy Matching → Risk Assessment → Draft Generation
- Current stage highlighted
- Time elapsed, Estimated remaining
- "Pause Analysis" and "Skip to Summary" buttons

SIDEBAR - Criteria Checklist:
- List of all evaluation criteria for visa type
- Status icons: ✓ Complete, ⏳ In Progress, ○ Pending
- Click to jump to that section's analysis
5.6 Analytics Dashboard (Datadog Integration)
PROMPT: Create an analytics dashboard matching Datadog aesthetic but with USA theme:

TOP METRICS BAR:
- 6 metric cards in a row:
  • Total Cases Processed (with trend)
  • Average Processing Time
  • AI Accuracy Rate
  • Manual Review Rate
  • Citation Validity Rate
  • System Uptime

CHART SECTION (2x2 Grid):

Chart 1: "Processing Volume Over Time"
- Area chart with stacked categories (by visa type)
- Toggle: Daily/Weekly/Monthly
- Hover shows exact values

Chart 2: "Hallucination Rate Heatmap"
- Heatmap grid: Visa types (rows) x Time periods (columns)
- Color scale: Green (0%) → Yellow (1-5%) → Red (>5%)
- Click cell for detailed breakdown

Chart 3: "Processing Cost by Visa Category"
- Horizontal bar chart
- Bars colored by visa type
- Shows ML token cost in dollars
- Sort toggle: Cost/Volume

Chart 4: "Case Outcome Distribution"
- Donut chart
- Segments: Approved (green), Denied (red), RFE Issued (amber), Pending (gray)
- Center shows total count
- Legend with percentages

BOTTOM SECTION:

"Real-Time Event Stream":
- Live log feed (like Datadog Live Tail)
- Color-coded by severity
- Filter buttons: All, Errors, Warnings, Info
- Search within stream

"Active Monitors":
- List of Datadog monitors
- Status: OK (green), Alert (red), Warn (amber), No Data (gray)
- Monitor names: "Citation Hallucination Rate", "PII Detection", "Latency Threshold"
- Click to see monitor details
5.7 Login & Authentication Page
PROMPT: Create a secure government-style login page:

FULL PAGE LAYOUT:

LEFT SIDE (45%) - Branding Panel:
- Deep navy background with subtle American flag pattern (watermark style)
- Large VisaGuardian AI logo (white)
- Tagline: "Trusted Immigration Intelligence"
- Three trust indicators with icons:
  • "FedRAMP Authorized" badge
  • "SOC 2 Type II Certified" badge
  • "USCIS Partner Program" badge
- Decorative: Subtle eagle silhouette or Lady Liberty outline (very faint)

RIGHT SIDE (55%) - Login Form:
- White background
- Card with subtle shadow containing:
  
  Header:
  - "Sign In to VisaGuardian"
  - Subtext: "Access your immigration case management portal"
  
  Form Fields:
  - Email input with government email hint
  - Password input with show/hide toggle
  - "Remember this device" checkbox
  - "Forgot password?" link
  
  Primary Button:
  - "Sign In" - Full width, Navy blue, white text
  
  Divider:
  - "Or continue with" line
  
  SSO Options:
  - "Sign in with Login.gov" button (official styling)
  - "Sign in with Microsoft" button
  - "Sign in with Google Workspace" button
  
  Footer:
  - "Don't have an account? Request Access"
  - Privacy Policy | Terms of Service | Security
  
  Government Notice:
  - Small text: "This is a U.S. Government partner system. Unauthorized access is prohibited."
  - Warning icon

Part 6: Micro-Interactions & States
Button States
PRIMARY BUTTON:
- Default: Navy (#0A2647), white text
- Hover: Slightly lighter navy (#1E3A5F), subtle lift shadow
- Active/Pressed: Darker navy, inset shadow
- Disabled: Gray (#9CA3AF), no cursor
- Loading: Spinner icon, "Processing..." text

SECONDARY BUTTON:
- Default: White, navy border, navy text
- Hover: Light navy background (#F0F4F8)
- Active: Navy background, white text

DANGER BUTTON:
- Default: Patriot red (#BF0A30)
- Hover: Darker red (#9B0000)
Status Badges
APPROVED: Green background (#DEF7EC), dark green text (#03543F), checkmark icon
DENIED: Red background (#FDE8E8), dark red text (#9B1C1C), X icon  
PENDING: Amber background (#FDF6B2), dark amber text (#723B13), clock icon
PROCESSING: Blue background (#E1EFFE), dark blue text (#1E429F), spinner icon
RFE ISSUED: Purple background (#EDEBFE), dark purple text (#5521B5), alert icon
Loading States
SKELETON LOADERS:
- Pulse animation on placeholder shapes
- Match exact dimensions of content being loaded
- Subtle gray (#E5E7EB) with lighter pulse (#F3F4F6)

FULL PAGE LOADING:
- Centered spinner with VisaGuardian logo
- "Securing your session..." text
- Progress bar for longer loads

TABLE LOADING:
- Skeleton rows matching table structure
- Staggered animation (wave effect)
Empty States
NO CASES FOUND:
- Illustration: Empty folder with magnifying glass
- Headline: "No cases match your search"
- Subtext: "Try adjusting your filters or search terms"
- Action button: "Clear Filters"

FIRST TIME USER:
- Illustration: Welcome scene with documents
- Headline: "Welcome to VisaGuardian AI"
- Subtext: "Start by uploading your first petition"
- Primary action: "Upload Petition"
- Secondary: "Take a Tour"

Part 7: Responsive Design Requirements
BREAKPOINTS:
- Desktop Large: 1440px+ (Full experience)
- Desktop: 1024px - 1439px (Condensed sidebar)
- Tablet: 768px - 1023px (Collapsed sidebar, stacked layouts)
- Mobile: 320px - 767px (Bottom navigation, single column)

MOBILE ADAPTATIONS:
- Sidebar converts to bottom tab bar
- Tables convert to card lists
- Charts remain but simplified
- Document viewer goes full screen
- Dashboard metrics stack vertically (2x2 grid on tablet, single column on mobile)

Part 8: Accessibility Requirements
WCAG 2.1 AA COMPLIANCE:
- All interactive elements keyboard accessible
- Focus indicators visible (2px navy outline)
- Color contrast minimum 4.5:1 for text
- Status not conveyed by color alone (always include icons/text)
- Screen reader labels for all icons
- Skip navigation link
- Proper heading hierarchy
- Form labels associated with inputs
- Error messages linked to fields
- Reduced motion option for animations

Part 9: Government Trust Elements
Official Styling Touches
INCLUDE THESE ELEMENTS:

1. Official Seal/Badge Area:
   - "Authorized USCIS Technology Partner" badge
   - Security certification badges

2. Footer:
   - "An official technology partner portal"
   - USCIS logo (if licensed)
   - DHS/HIS compatibility note
   - Last security audit date
   - Version number

3. Security Indicators:
   - Lock icon in header near user menu
   - "Secure Connection" indicator
   - Session timeout warning modal
   - Auto-logout countdown

4. Legal Notices:
   - Privacy Act statement (collapsible)
   - Terms of Use link
   - System availability status
   - Paperwork Reduction Act notice (where applicable)

5. Government Typography Touches:
   - Small caps for labels
   - Formal date formats (December 19, 2025)
   - Official form-style layouts for data display

Part 10: Complete Generator Prompt
Single Unified Prompt for Frontend Generation
Create a comprehensive React/Next.js frontend application for "VisaGuardian AI" - 
an enterprise immigration intelligence platform. 

THEME: USA Government aesthetic meets modern SaaS. Think official government portal 
(USCIS.gov, Login.gov) combined with premium enterprise software (Palantir, Bloomberg).

COLOR PALETTE:
- Primary: Deep navy #0A2647
- Secondary: Official blue #1E5AA8  
- Accent: Patriot red #BF0A30
- Success: #2E7D32
- Warning: #F9A825
- Error: #C62828
- Gold accent: #C9A227
- Backgrounds: White #FFFFFF, Cream #F7F9FC

TYPOGRAPHY:
- Headlines: Merriweather (serif, authoritative)
- Body: Inter (clean, readable)
- Data/Monospace: JetBrains Mono

LAYOUT:
- Fixed left sidebar navigation (280px, collapsible)
- Sticky top header with search
- Responsive with breakpoints at 1440px, 1024px, 768px

REQUIRED PAGES:

1. LOGIN PAGE:
   Split layout. Left: Navy background with logo, trust badges (FedRAMP, SOC2), 
   subtle American iconography. Right: White card with email/password form, 
   SSO options (Login.gov, Microsoft, Google), government security notice.

2. DASHBOARD:
   Executive command center. Top: Welcome message, date, 4 metric cards 
   (Cases Processed, Pending Review, Manual Review, System Health). 
   Main: Two-column layout with cases table (left) and sidebar widgets 
   (AI Processing Queue, Alerts, Quick Actions). Bottom: Weekly volume chart.

3. CASE LIST:
   Filterable table with columns: Case Number, Applicant, Visa Type (colored badges), 
   Status (chips), AI Confidence, Attorney, Updated. Include search, filters 
   (status, visa type, date range), pagination, bulk actions.

4. CASE DETAIL:
   Comprehensive view with header (case number, status, actions), tabbed content 
   (Overview, Documents, AI Analysis, Timeline, Notes). Overview shows applicant 
   info, petition details, evidence checklist, AI summary card. AI Analysis shows 
   chain-of-thought reasoning with citations.

5. AI ADJUDICATOR:
   Real-time processing view. Split screen: Document viewer with AI highlighting 
   (left), Live reasoning output with streaming text (right). Bottom progress bar 
   showing stages. Criteria checklist sidebar.

6. ANALYTICS:
   Datadog-inspired metrics dashboard. Top metric cards, 2x2 chart grid 
   (Processing Volume timeseries, Hallucination Heatmap, Cost by Category bars, 
   Outcome donut). Real-time event stream, active monitors list.

COMPONENTS TO INCLUDE:
- Sidebar nav with logo, nav items, user profile
- Top header with breadcrumbs, search, notifications, user menu
- Metric cards with trends and status indicators
- Data tables with sorting, filtering, pagination
- Status badges (Approved/Denied/Pending/Processing)
- Document viewer for PDFs
- Timeline/activity feed
- Charts (line, bar, donut, heatmap)
- Modal dialogs for confirmations
- Toast notifications
- Loading skeletons
- Empty states with illustrations

SPECIAL FEATURES:
- Dark mode toggle (navy becomes near-black, maintains patriotic accents)
- Accessibility: Keyboard nav, screen reader support, high contrast
- Trust elements: Security badges, session indicators, government notices
- Micro-interactions: Smooth transitions, hover states, loading animations

STYLE NOTES:
- Avoid excessive decoration - clean and professional
- Use subtle shadows and borders, not heavy
- Red used sparingly (alerts, critical actions only)
- Gold for premium/achievement elements
- Include official-looking badges and seals
- Formal typography for legal content
- Monospace for case numbers, IDs, codes

Generate production-ready code using:
- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide icons
- Recharts for data visualization
- Proper component architecture
- Responsive design
- Dark mode support