# LinkedIn Profile Manager Agent
## Product Requirements Document (PRD) v1.0

**Document Version:** 1.0  
**Last Updated:** January 29, 2025  
**Status:** Draft - Pending Approval

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Objectives](#2-product-vision--objectives)
3. [Problem Statement](#3-problem-statement)
4. [Target User](#4-target-user)
5. [Use Cases & User Stories](#5-use-cases--user-stories)
6. [User Flows](#6-user-flows)
7. [Feature Specifications](#7-feature-specifications)
8. [Technical Architecture](#8-technical-architecture)
9. [Database Schema](#9-database-schema)
10. [Tech Stack](#10-tech-stack)
11. [Development Roadmap](#11-development-roadmap)
12. [Requirements](#12-requirements)
13. [Success Metrics](#13-success-metrics)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Future Considerations](#15-future-considerations)

---

## 1. Executive Summary

**LinkedIn Profile Manager Agent** is a personal AI-powered assistant designed to act as a "LinkedIn Digital Twin." It helps users manage their LinkedIn presence through intelligent content suggestions, automated analytics, goal tracking, and data-driven insights—all while maintaining complete user control through an approval-based workflow.

### Core Principle
> **"The agent can suggest, but only execute after explicit user approval."**

### Key Value Propositions
- 🕐 **Time Management**: Reduce time spent on LinkedIn while increasing effectiveness
- 🔄 **Consistency**: Never miss posting goals with intelligent reminders
- 📊 **Analytics Clarity**: Understand what content works and why
- 🎯 **Goal-Driven Growth**: Achieve measurable LinkedIn objectives
- ✍️ **Content Creation**: AI-generated drafts that match your voice and style

---

## 2. Product Vision & Objectives

### Vision Statement
*"To be the most effective AI-powered LinkedIn growth assistant that empowers professionals to build their personal brand with minimal effort and maximum impact, while keeping the human firmly in control."*

### Primary Objectives

| Objective | Description | Success Indicator |
|-----------|-------------|-------------------|
| **Automate Analytics** | Fetch, process, and visualize LinkedIn data automatically | Daily data sync with <1min delay |
| **Enable Consistency** | Help users maintain regular posting habits | 80% adherence to posting goals |
| **Personalized Content** | Generate content that matches user's voice | >70% approval rate on first draft |
| **Goal Achievement** | Track progress toward user-defined goals | Users achieve 60%+ of set goals |
| **Actionable Insights** | Provide data-driven recommendations | Weekly insights with specific actions |

### Design Principles
1. **Approval-First**: No action executes without explicit user consent
2. **Privacy-Centric**: User data stays in their control, minimal external sharing
3. **Simplicity**: Complex AI under the hood, simple interface on top
4. **Transparency**: Show why recommendations are being made
5. **Incremental Value**: Each phase delivers standalone value

---

## 3. Problem Statement

### Pain Points Addressed

| Pain Point | Description | How We Solve It |
|------------|-------------|-----------------|
| **Time Scarcity** | Professionals want LinkedIn presence but lack time | AI handles analytics and drafts content |
| **Inconsistent Posting** | Intention to post regularly, but life gets in the way | Smart scheduling, reminders, goal tracking |
| **Analytics Blindness** | No understanding of what content performs well | Automated analytics with actionable insights |
| **Writer's Block** | Knowing you should post but not knowing what | AI suggests topics based on trends + your niche |
| **Manual Tracking** | Spreadsheets for follower counts, engagement rates | Automated dashboards with historical trends |
| **No Clear Strategy** | Posting without direction or measurable goals | Goal system with progress tracking |

### Current State (Without This Product)
- User manually checks LinkedIn for metrics
- Content creation is ad-hoc and inconsistent
- No visibility into what's working
- Goals are vague ("grow my presence") rather than measurable
- Time spent on LinkedIn is reactive, not strategic

### Desired State (With This Product)
- Automated daily data syncs
- AI-suggested content aligned with goals
- Clear analytics dashboard with trends
- Specific, measurable goals with progress tracking
- Strategic, proactive LinkedIn management in minutes/day

---

## 4. Target User

### Primary Persona: The Aspiring Thought Leader

**Demographics:**
- Professional (25-45 years old)
- Knowledge worker, entrepreneur, or career-focused individual
- Currently has <5 LinkedIn posts
- Wants to build personal brand but hasn't started seriously
- Tech-savvy enough to use a web dashboard

**Psychographics:**
- Values efficiency and automation
- Wants to be seen as an expert in their field
- Believes in the power of personal branding
- Prefers guided experiences over figuring things out alone
- Maintains high standards—won't post anything that doesn't represent them well

**Goals:**
- Build a consistent LinkedIn presence
- Grow followers in their niche
- Establish thought leadership
- Drive professional opportunities (jobs, clients, speaking, etc.)

**Frustrations:**
- "I know I should post more, but I don't know what to say"
- "I have no idea if my posts are even working"
- "I start strong but can't maintain consistency"
- "I spend too much time on LinkedIn with little to show for it"

---

## 5. Use Cases & User Stories

### Use Case 1: Understanding Current Performance

**User Story:**  
*As a user, I want to see my LinkedIn analytics in one place so that I can understand how my content is performing without manually checking LinkedIn.*

**Acceptance Criteria:**
- [ ] Dashboard shows total followers with growth trend
- [ ] Each post displays impressions, likes, comments, shares
- [ ] Engagement rate is calculated and displayed
- [ ] Historical data is available for trend analysis
- [ ] Data refreshes daily automatically + manual refresh option

---

### Use Case 2: Setting and Tracking Goals

**User Story:**  
*As a user, I want to set specific LinkedIn goals so that I have clear targets to work toward and can measure my progress.*

**Acceptance Criteria:**
- [ ] User can create goals of different types:
  - Follower growth (e.g., "Reach 5,000 followers by June")
  - Engagement rate (e.g., "Maintain 3% engagement rate")
  - Posting frequency (e.g., "Post 3 times per week")
  - Visibility (e.g., "50,000 impressions per month")
  - Niche authority (e.g., "Be known for AI content")
  - Profile visits (e.g., "100 profile visits per month")
- [ ] AI can suggest goals based on current performance
- [ ] Progress is tracked and visualized
- [ ] Alerts when behind on goals
- [ ] Goals can be modified or deleted

---

### Use Case 3: Receiving AI-Generated Content Suggestions

**User Story:**  
*As a user, I want the agent to suggest post topics based on trends and my niche so that I always have ideas for content.*

**Acceptance Criteria:**
- [ ] AI generates 3-5 topic suggestions
- [ ] Each suggestion includes reasoning (why this topic)
- [ ] Topics align with user's goals and historical performance
- [ ] User can select a topic or provide their own
- [ ] Rejected topics are stored for learning

---

### Use Case 4: Creating and Approving Posts

**User Story:**  
*As a user, I want to review and approve AI-generated drafts before they're posted so that I maintain control over my content.*

**Acceptance Criteria:**
- [ ] AI generates 2-3 draft variations per topic
- [ ] Drafts match user's writing style (learned from past posts)
- [ ] User can edit drafts freely
- [ ] User can approve, reject, or request regeneration
- [ ] Approved posts can be scheduled or posted immediately
- [ ] Nothing is posted without explicit approval

---

### Use Case 5: Receiving Daily Progress Updates

**User Story:**  
*As a user, I want a daily summary of my LinkedIn activity and progress so that I stay informed and motivated.*

**Acceptance Criteria:**
- [ ] Daily digest shows:
  - New followers (gain/loss)
  - Post performance from last 24 hours
  - Goal progress status
  - Recommended next actions
- [ ] Accessible via dashboard
- [ ] Optional push notification

---

### Use Case 6: Receiving Weekly Reports

**User Story:**  
*As a user, I want a weekly summary report so that I can see trends and adjust my strategy.*

**Acceptance Criteria:**
- [ ] Weekly report includes:
  - Follower growth this week vs last
  - Top performing post
  - Engagement rate trend
  - Goal progress (on track / behind / ahead)
  - AI recommendations for next week
- [ ] Report is generated automatically
- [ ] Historical reports are accessible

---

### Use Case 7: Getting Data-Driven Insights

**User Story:**  
*As a user, I want AI-generated insights about my performance so that I can make informed decisions about my content strategy.*

**Acceptance Criteria:**
- [ ] Insights are specific and actionable (not generic)
- [ ] Examples:
  - "Your Tuesday posts get 2.3x more engagement"
  - "Posts with questions get 40% more comments"
  - "You're most engaging when writing about X topic"
- [ ] Insights update as new data comes in
- [ ] Insights are tied to specific recommendations

---

## 6. User Flows

### Flow 1: First-Time User Setup

```
┌─────────────────────────────────────────────────────────────┐
│                    ONBOARDING FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User lands on homepage                                  │
│              ↓                                              │
│  2. Clicks "Get Started" / "Connect LinkedIn"               │
│              ↓                                              │
│  3. OAuth flow → LinkedIn authorization                     │
│              ↓                                              │
│  4. Initial data sync (profile + posts)                     │
│              ↓                                              │
│  5. Goal setting wizard:                                    │
│     - AI suggests goals based on current data               │
│     - User selects/modifies goals                           │
│              ↓                                              │
│  6. Dashboard loads with initial data                       │
│              ↓                                              │
│  7. Welcome tour highlights key features                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 2: Content Creation & Approval

```
┌─────────────────────────────────────────────────────────────┐
│                  CONTENT CREATION FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User opens Content Studio                               │
│              ↓                                              │
│  2. Sees AI-suggested topics (3-5 options)                  │
│     Each shows: Topic title + reasoning                     │
│              ↓                                              │
│  3. User selects a topic (or enters custom topic)           │
│              ↓                                              │
│  4. AI generates 2-3 draft variations                       │
│     Styled to match user's voice                            │
│              ↓                                              │
│  5. User reviews drafts:                                    │
│     [Edit] [Regenerate] [Approve] [Reject]                  │
│              ↓                                              │
│  6a. If Edit: Opens editor, user modifies, saves            │
│  6b. If Regenerate: AI creates new variation                │
│  6c. If Reject: Draft discarded, feedback stored            │
│  6d. If Approve: Proceeds to scheduling                     │
│              ↓                                              │
│  7. Scheduling options:                                     │
│     - Post immediately                                      │
│     - Schedule for specific date/time                       │
│     - AI-suggested optimal time                             │
│              ↓                                              │
│  8. Confirmation + post queued/published                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Daily Dashboard Check

```
┌─────────────────────────────────────────────────────────────┐
│                    DAILY CHECK-IN FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User opens dashboard (or receives notification)         │
│              ↓                                              │
│  2. Sees daily summary card:                                │
│     - New followers: +12                                    │
│     - Yesterday's post: 2.4K impressions                    │
│     - Goal status: On track                                 │
│              ↓                                              │
│  3. Quick actions available:                                │
│     - [Create Post] → Content flow                          │
│     - [View Analytics] → Analytics page                     │
│     - [Check Goals] → Goals page                            │
│              ↓                                              │
│  4. AI insight of the day:                                  │
│     "Consider posting today - you haven't posted            │
│      in 3 days and your goal is 3x/week"                    │
│              ↓                                              │
│  5. User takes action or closes                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 4: Goal Management

```
┌─────────────────────────────────────────────────────────────┐
│                    GOAL MANAGEMENT FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User navigates to Goals page                            │
│              ↓                                              │
│  2. Sees active goals with progress bars:                   │
│     📈 Followers: 1,234 / 5,000 (24%)                       │
│     🔥 Posting: 2/3 this week (66%)                         │
│     💬 Engagement: 2.8% / 3% (93%)                          │
│              ↓                                              │
│  3. Options:                                                │
│     [Add Goal] [Edit Goal] [View History]                   │
│              ↓                                              │
│  4a. Add Goal:                                              │
│      - Choose goal type                                     │
│      - Set target value                                     │
│      - Set deadline                                         │
│      - Or accept AI suggestion                              │
│              ↓                                              │
│  4b. Edit Goal:                                             │
│      - Modify target/deadline                               │
│      - Pause goal                                           │
│      - Delete goal                                          │
│              ↓                                              │
│  5. View AI recommendations for each goal                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Feature Specifications

### 7.1 Dashboard & Overview

| Feature | Priority | Description |
|---------|----------|-------------|
| Profile Mirror | P0 | Display synced LinkedIn profile data |
| Quick Stats | P0 | Followers, posts count, avg engagement |
| Daily Summary Card | P0 | At-a-glance daily performance |
| Goal Progress Widget | P1 | Visual progress on active goals |
| Recent Activity | P1 | Last 5 posts with quick metrics |
| AI Insight Card | P1 | Daily tip or observation |

### 7.2 Analytics

| Feature | Priority | Description |
|---------|----------|-------------|
| Post Performance Table | P0 | All posts with impressions, engagement, etc. |
| Follower Growth Chart | P0 | Line chart showing followers over time |
| Engagement Rate Trend | P0 | Engagement rate over time |
| Best Performing Posts | P1 | Top posts ranked by engagement |
| Optimal Posting Times | P2 | Heatmap of when your audience engages |
| Content Type Analysis | P2 | Performance by post type (text, carousel, etc.) |

### 7.3 Content Studio

| Feature | Priority | Description |
|---------|----------|-------------|
| Topic Suggestions | P0 | AI-generated topic ideas with reasoning |
| Draft Generation | P0 | 2-3 variations per selected topic |
| Draft Editor | P0 | Edit drafts before approval |
| Approval Workflow | P0 | Approve/Reject/Edit actions |
| Scheduling | P1 | Schedule posts for future dates |
| Post Queue | P1 | View all scheduled posts |
| Style Learning | P2 | AI learns from past posts |

### 7.4 Goal System

| Feature | Priority | Description |
|---------|----------|-------------|
| Manual Goal Creation | P0 | User sets custom goals |
| Goal Types | P0 | Support all 6 goal types |
| Progress Tracking | P0 | Visual progress indicators |
| AI Goal Suggestions | P1 | System suggests goals based on data |
| Goal Alerts | P1 | Notifications when behind |
| Goal History | P2 | View past goals and achievements |

### 7.5 Insights & Reporting

| Feature | Priority | Description |
|---------|----------|-------------|
| Daily Digest | P0 | Auto-generated daily summary |
| Weekly Report | P1 | Comprehensive weekly analysis |
| AI Insights | P1 | Specific, actionable observations |
| Trend Analysis | P2 | Long-term pattern detection |
| Export Reports | P3 | Download reports as PDF |

### 7.6 Data Management

| Feature | Priority | Description |
|---------|----------|-------------|
| Auto Daily Sync | P0 | Automatic data fetch once per day |
| Manual Sync | P0 | "Sync Now" button |
| Data History | P1 | Store historical snapshots |
| Data Export | P3 | Export all data as JSON/CSV |

---

## 8. Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│                        (Next.js Frontend)                           │
│                                                                     │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│   │ Dashboard │  │ Analytics │  │  Content  │  │   Goals   │       │
│   │   Page    │  │   Page    │  │  Studio   │  │   Page    │       │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘       │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────┐      │
│   │              Shared Components & Hooks                   │      │
│   │  (Charts, Cards, Modals, useAuth, useData, etc.)        │      │
│   └─────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                           API LAYER                                 │
│                    (Next.js API Routes)                             │
│                                                                     │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│   │   /api/auth   │  │  /api/linkedin │  │ /api/content  │          │
│   │  (OAuth)      │  │  (Data Sync)   │  │ (AI Generate) │          │
│   └───────────────┘  └───────────────┘  └───────────────┘          │
│                                                                     │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│   │  /api/goals   │  │ /api/analytics │  │  /api/posts   │          │
│   │  (CRUD)       │  │  (Aggregation) │  │ (Create/List) │          │
│   └───────────────┘  └───────────────┘  └───────────────┘          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
┌─────────────────────┐ ┌───────────────┐ ┌─────────────────────┐
│     SUPABASE        │ │  LINKEDIN     │ │     GEMINI AI       │
│                     │ │  API          │ │                     │
│  ┌───────────────┐  │ │               │ │  - Topic Suggest    │
│  │  PostgreSQL   │  │ │  - Profile    │ │  - Draft Generate   │
│  │  Database     │  │ │  - Posts      │ │  - Insight Create   │
│  └───────────────┘  │ │  - Analytics  │ │  - Goal Suggest     │
│                     │ │  - Publish    │ │                     │
│  ┌───────────────┐  │ │               │ └─────────────────────┘
│  │     Auth      │  │ │               │
│  │  (OAuth)      │  │ └───────────────┘
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Storage     │  │
│  │  (optional)   │  │
│  └───────────────┘  │
└─────────────────────┘

              │
┌─────────────▼─────────────┐
│      CRON JOBS            │
│    (Vercel Cron)          │
│                           │
│  - Daily Sync (6 AM)      │
│  - Weekly Report (Monday) │
│  - Goal Check (Daily)     │
└───────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/linkedin` | GET | Initiate LinkedIn OAuth |
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/auth/logout` | POST | Logout user |
| `/api/linkedin/sync` | POST | Trigger data sync |
| `/api/linkedin/profile` | GET | Get synced profile data |
| `/api/linkedin/posts` | GET | Get all synced posts |
| `/api/posts` | POST | Create new post (publish/schedule) |
| `/api/posts/[id]` | PUT/DELETE | Update/delete post |
| `/api/goals` | GET/POST | List/create goals |
| `/api/goals/[id]` | PUT/DELETE | Update/delete goal |
| `/api/analytics/summary` | GET | Get analytics summary |
| `/api/analytics/trends` | GET | Get trend data |
| `/api/content/topics` | GET | Get AI topic suggestions |
| `/api/content/generate` | POST | Generate post drafts |
| `/api/insights` | GET | Get AI insights |
| `/api/reports/daily` | GET | Get daily digest |
| `/api/reports/weekly` | GET | Get weekly report |

---

## 9. Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │   li_profiles   │       │    li_posts     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │   ┌───│ id (PK)         │
│ email           │   │   │ user_id (FK)    │───┤   │ user_id (FK)    │
│ created_at      │   └──▶│ linkedin_id     │   │   │ linkedin_post_id│
│ updated_at      │       │ name            │   │   │ content         │
│ li_access_token │       │ headline        │   │   │ post_type       │
│ li_refresh_token│       │ profile_url     │   │   │ published_at    │
│ token_expires_at│       │ avatar_url      │   │   │ impressions     │
└─────────────────┘       │ followers       │   │   │ likes           │
                          │ connections     │   │   │ comments        │
                          │ fetched_at      │   │   │ shares          │
                          │ created_at      │   │   │ engagement_rate │
                          │ updated_at      │   │   │ fetched_at      │
                          └─────────────────┘   │   │ created_at      │
                                                │   │ updated_at      │
                          ┌─────────────────┐   │   └─────────────────┘
                          │     goals       │   │
                          ├─────────────────┤   │   ┌─────────────────┐
                          │ id (PK)         │   │   │  post_drafts    │
                          │ user_id (FK)    │───┤   ├─────────────────┤
                          │ type            │   │   │ id (PK)         │
                          │ target_value    │   │   │ user_id (FK)    │
                          │ current_value   │   └──▶│ topic           │
                          │ deadline        │       │ content         │
                          │ status          │       │ status          │
                          │ ai_suggested    │       │ scheduled_for   │
                          │ created_at      │       │ published_at    │
                          │ updated_at      │       │ created_at      │
                          └─────────────────┘       │ updated_at      │
                                                    └─────────────────┘
┌─────────────────┐       ┌─────────────────┐
│   analytics     │       │    insights     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ date            │       │ type            │
│ followers       │       │ content         │
│ impressions     │       │ priority        │
│ engagement_rate │       │ is_read         │
│ posts_count     │       │ generated_at    │
│ created_at      │       │ expires_at      │
└─────────────────┘       │ created_at      │
                          └─────────────────┘
```

### Table Definitions

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  li_access_token TEXT,
  li_refresh_token TEXT,
  token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `li_profiles`
```sql
CREATE TABLE li_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  linkedin_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  headline TEXT,
  profile_url VARCHAR(500),
  avatar_url VARCHAR(500),
  followers INTEGER DEFAULT 0,
  connections INTEGER DEFAULT 0,
  fetched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `li_posts`
```sql
CREATE TABLE li_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  linkedin_post_id VARCHAR(255) UNIQUE,
  content TEXT,
  post_type VARCHAR(50), -- 'text', 'image', 'carousel', 'video', 'article'
  published_at TIMESTAMP,
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  fetched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `goals`
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'followers', 'engagement', 'consistency', 'visibility', 'authority', 'leads'
  title VARCHAR(255),
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(50), -- 'count', 'percentage', 'per_week', 'per_month'
  deadline DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'failed'
  ai_suggested BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `post_drafts`
```sql
CREATE TABLE post_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(500),
  topic_reasoning TEXT,
  content TEXT,
  variations JSONB, -- Store multiple variations
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'approved', 'scheduled', 'published', 'rejected'
  scheduled_for TIMESTAMP,
  published_at TIMESTAMP,
  linkedin_post_id VARCHAR(255),
  feedback TEXT, -- User feedback on rejected drafts
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `analytics_snapshots`
```sql
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers INTEGER,
  followers_change INTEGER, -- Change from previous day
  total_impressions INTEGER,
  total_engagements INTEGER,
  engagement_rate DECIMAL(5,2),
  posts_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### `insights`
```sql
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50), -- 'performance', 'timing', 'content', 'goal', 'trend'
  title VARCHAR(255),
  content TEXT,
  data JSONB, -- Supporting data for the insight
  priority INTEGER DEFAULT 0, -- Higher = more important
  is_read BOOLEAN DEFAULT FALSE,
  is_actionable BOOLEAN DEFAULT TRUE,
  action_type VARCHAR(50), -- 'create_post', 'update_goal', 'check_analytics', etc.
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. Tech Stack

### Core Technologies

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Frontend** | Next.js | 14.x | Best Vercel integration, App Router, React 18 |
| **Styling** | Tailwind CSS | 3.x | Rapid UI development, utility-first |
| **UI Components** | shadcn/ui | Latest | Beautiful, accessible, customizable |
| **Charts** | Recharts | 2.x | React-native charting, good Next.js compat |
| **Backend** | Next.js API Routes | 14.x | Serverless, no separate backend needed |
| **Database** | Supabase (PostgreSQL) | Latest | Free tier, real-time, built-in auth |
| **ORM** | Prisma | 5.x | Type-safe, great DX, works with Supabase |
| **Auth** | Supabase Auth + LinkedIn OAuth | Latest | Handles OAuth complexity |
| **AI/LLM** | Google Gemini API | 1.5 Pro | Free tier, good for content generation |
| **Cron Jobs** | Vercel Cron | Latest | Free on hobby plan, native integration |
| **Hosting** | Vercel | Latest | Zero-config Next.js deployment |
| **State Management** | React Query (TanStack) | 5.x | Server state management, caching |

### External APIs

| API | Purpose | Cost |
|-----|---------|------|
| LinkedIn API | Profile data, posts, analytics, publishing | Free (with approved app) |
| Google Gemini | Content generation, insights, suggestions | Free tier (60 req/min) |

### Development Tools

| Tool | Purpose |
|------|---------|
| TypeScript | Type safety across the stack |
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks for quality |
| GitHub Actions | CI/CD |

---

## 11. Development Roadmap

### Phase Overview

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 1 | Data Foundation | 1-2 weeks | 🔜 Planned |
| 2 | Analytics Engine | 1 week | 📋 Planned |
| 3 | Visualization & Insights | 1-2 weeks | 📋 Planned |
| 4 | Goal System | 1 week | 📋 Planned |
| 5 | Content Engine | 2-3 weeks | 📋 Planned |
| 6 | Benchmarking | 1-2 weeks | 📋 Planned |
| 7 | Notifications & Polish | 1 week | 📋 Planned |

---

### Phase 1: Data Foundation 📥
*"Get the data fetcher right"*

**Estimated Duration:** 1-2 weeks

**Deliverables:**
- [ ] Project setup (Next.js, Supabase, Prisma)
- [ ] LinkedIn OAuth integration
- [ ] LinkedIn Developer App setup
- [ ] Fetch and store: Profile, Posts, Basic Analytics
- [ ] Database schema implementation
- [ ] Manual "Sync Now" functionality
- [ ] Basic dashboard showing raw synced data

**Success Criteria:**
- User can log in with LinkedIn
- Profile and posts are fetched and stored
- Data displays on dashboard
- Manual sync works

---

### Phase 2: Analytics Engine 📊
*"Get the data analyzer right"*

**Estimated Duration:** 1 week

**Deliverables:**
- [ ] Post performance calculations (engagement rate, etc.)
- [ ] Follower growth tracking (daily snapshots)
- [ ] Historical data storage
- [ ] Analytics aggregation functions
- [ ] Basic trend detection (what's improving/declining)

**Success Criteria:**
- Engagement metrics calculated correctly
- Historical data accumulates over time
- Trend direction is identifiable

---

### Phase 3: Visualization & Insights 📈
*"Get the data visualizer right"*

**Estimated Duration:** 1-2 weeks

**Deliverables:**
- [ ] Dashboard redesign with proper analytics display
- [ ] Follower growth chart
- [ ] Engagement rate trend chart
- [ ] Post performance table with sorting/filtering
- [ ] Daily summary card
- [ ] AI-powered insight generation
- [ ] Insights display component

**Success Criteria:**
- Dashboard is visually polished
- Charts render correctly with real data
- At least 3 types of insights generate

---

### Phase 4: Goal System 🎯
*"Add the coaching layer"*

**Estimated Duration:** 1 week

**Deliverables:**
- [ ] Goal CRUD operations
- [ ] All 6 goal types supported
- [ ] Goal progress calculation
- [ ] AI goal suggestion based on data
- [ ] Goal alerts (behind/on-track/ahead)
- [ ] Daily progress check
- [ ] Weekly summary generation

**Success Criteria:**
- Users can create all goal types
- Progress updates automatically
- AI suggests reasonable goals
- Weekly summary generates

---

### Phase 5: Content Engine ✍️
*"The core value delivery"*

**Estimated Duration:** 2-3 weeks

**Deliverables:**
- [ ] Topic suggestion system
- [ ] Draft generation with multiple variations
- [ ] Style learning from past posts
- [ ] Draft editor component
- [ ] Approval workflow (approve/reject/edit)
- [ ] Post scheduling
- [ ] LinkedIn publishing integration
- [ ] Post queue management

**Success Criteria:**
- Topic suggestions are relevant
- Drafts sound like the user
- Approved posts publish successfully
- Scheduling works correctly

---

### Phase 6: Benchmarking 🔍
*"The competitive edge"*

**Estimated Duration:** 1-2 weeks

**Deliverables:**
- [ ] Industry trend detection (may need external sources)
- [ ] Manual competitor tracking
- [ ] Benchmark comparisons
- [ ] "What's trending in your niche" suggestions
- [ ] Comparative analytics

**Success Criteria:**
- External trends are surfaced
- Competitor data can be tracked
- Benchmarks inform content suggestions

---

### Phase 7: Notifications & Polish 🔔
*"Make it delightful"*

**Estimated Duration:** 1 week

**Deliverables:**
- [ ] Push notifications (PWA)
- [ ] Email digest (optional)
- [ ] Mobile responsiveness
- [ ] Dark mode
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Empty states
- [ ] Onboarding tour

**Success Criteria:**
- App works well on mobile
- Notifications are received
- Overall experience is polished

---

## 12. Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | System shall allow users to authenticate via LinkedIn OAuth | P0 |
| FR-002 | System shall fetch and store LinkedIn profile data | P0 |
| FR-003 | System shall fetch and store LinkedIn post data | P0 |
| FR-004 | System shall calculate engagement metrics for posts | P0 |
| FR-005 | System shall track follower count over time | P0 |
| FR-006 | System shall allow manual data sync | P0 |
| FR-007 | System shall perform automatic daily sync | P0 |
| FR-008 | System shall display analytics in visual charts | P1 |
| FR-009 | System shall allow users to create goals | P0 |
| FR-010 | System shall track goal progress automatically | P0 |
| FR-011 | System shall suggest goals based on data | P1 |
| FR-012 | System shall generate AI content topic suggestions | P1 |
| FR-013 | System shall generate post drafts in user's style | P1 |
| FR-014 | System shall require approval before any LinkedIn action | P0 |
| FR-015 | System shall allow post scheduling | P1 |
| FR-016 | System shall publish approved posts to LinkedIn | P1 |
| FR-017 | System shall generate daily summaries | P1 |
| FR-018 | System shall generate weekly reports | P1 |
| FR-019 | System shall provide AI-powered insights | P1 |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Page load time | < 2 seconds |
| NFR-002 | API response time | < 500ms (p95) |
| NFR-003 | Uptime | 99.9% |
| NFR-004 | Data sync latency | < 1 minute |
| NFR-005 | Mobile responsiveness | Works on 320px+ |
| NFR-006 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-007 | Accessibility | WCAG 2.1 AA |
| NFR-008 | Data retention | Indefinite (user controls deletion) |

### Security Requirements

| ID | Requirement |
|----|-------------|
| SEC-001 | All API endpoints must be authenticated |
| SEC-002 | LinkedIn tokens must be encrypted at rest |
| SEC-003 | HTTPS enforced for all connections |
| SEC-004 | OAuth tokens refreshed automatically |
| SEC-005 | No sensitive data logged |
| SEC-006 | Rate limiting on API endpoints |

---

## 13. Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **User Retention** | 70% MAU | Users returning within 30 days |
| **Content Approval Rate** | >70% | First-draft approvals / total drafts |
| **Goal Completion Rate** | >60% | Completed goals / total goals set |
| **Posting Consistency** | 80% adherence | Posts made / posting goal |
| **Time Saved** | 5+ hours/month | User survey |
| **Insight Utility** | >50% actioned | Insights clicked / insights shown |

### Phase 1 Success Metrics
- OAuth flow completes successfully
- Profile data matches LinkedIn
- Posts sync with correct metrics
- Manual sync < 10 seconds

### Full Product Success Metrics
- User posts at least 3x/week using the platform
- User checks dashboard daily
- AI suggestions lead to published content
- Goals are tracked and achieved

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **LinkedIn API access denied** | Medium | High | Apply early, have browser automation fallback |
| **LinkedIn API rate limits** | Medium | Medium | Cache data, limit sync frequency, batch requests |
| **LinkedIn API changes** | Low | High | Abstract LinkedIn layer, monitor API announcements |
| **AI content quality low** | Medium | Medium | User feedback loop, prompt engineering, allow edits |
| **User doesn't return** | Medium | High | Push notifications, email digests, valuable insights |
| **Data sync failures** | Low | Medium | Retry logic, error notifications, manual sync option |
| **Token expiration issues** | Medium | Medium | Automatic refresh, re-auth prompts |
| **Gemini API limits reached** | Low | Low | Fallback model, request caching |

---

## 15. Future Considerations

### Post-V1 Features (Backlog)
- 🔗 **Multi-platform support**: Twitter/X, Instagram (personal branding consistency)
- 🤝 **Connection management**: Smart connection suggestions
- 💬 **Comment management**: AI-suggested replies (with approval)
- 📧 **InMail templates**: For outreach campaigns
- 👥 **Team features**: Agency/team accounts
- 📱 **Native mobile app**: iOS/Android
- 🎨 **Image generation**: AI-created visuals for posts
- 🎙️ **Audio/Video content**: Support for LinkedIn Live, podcasts
- 📚 **Content library**: Saved templates and reusable content
- 🔄 **A/B testing**: Test variations, track performance
- 🌐 **Localization**: Multi-language support

### Integration Possibilities
- Notion (content calendar)
- Slack (notifications)
- Zapier (automation)
- Google Calendar (scheduling)
- Canva (image creation)

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Engagement Rate** | (Likes + Comments + Shares) / Impressions × 100 |
| **Impression** | Number of times a post was displayed |
| **Draft** | AI-generated post content pending approval |
| **Goal** | User-defined measurable target |
| **Insight** | AI-generated observation about performance |
| **Digital Twin** | AI agent that represents and acts on behalf of user |

### B. LinkedIn API Scopes Required

| Scope | Purpose |
|-------|---------|
| `r_liteprofile` | Read basic profile |
| `r_emailaddress` | Read email (for auth) |
| `w_member_social` | Post on behalf of user |
| `r_organization_social` | Read post analytics |

### C. References

- [LinkedIn Marketing API Documentation](https://learn.microsoft.com/en-us/linkedin/marketing/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Google Gemini API](https://ai.google.dev/)

---

**Document Status:** Draft - Awaiting Review  
**Next Steps:** Review and approve to begin Phase 1 implementation
