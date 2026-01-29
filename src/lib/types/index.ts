// Shared TypeScript types

export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LinkedInProfile {
    id: string;
    userId: string;
    linkedinId: string;
    name: string;
    headline?: string;
    profileUrl?: string;
    avatarUrl?: string;
    followers: number;
    connections: number;
    fetchedAt: Date;
}

export interface LinkedInPost {
    id: string;
    userId: string;
    linkedinPostId: string;
    content: string;
    postType: "text" | "image" | "carousel" | "video" | "article";
    publishedAt: Date;
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
}

export interface Goal {
    id: string;
    userId: string;
    type: "followers" | "engagement" | "consistency" | "visibility" | "authority" | "leads";
    title: string;
    targetValue: number;
    currentValue: number;
    unit: "count" | "percentage" | "per_week" | "per_month";
    deadline?: Date;
    status: "active" | "completed" | "paused" | "failed";
    aiSuggested: boolean;
}
