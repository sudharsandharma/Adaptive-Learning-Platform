export declare class RecommendationService {
    analyzeStudent(userId: string): Promise<any>;
    identifyWeakTopics(userId: string): Promise<any[]>;
    identifyStrongTopics(userId: string): Promise<any[]>;
    recommendNextTopic(userId: string, subject: string): Promise<any>;
    recommendResources(userId: string, topicId?: string): Promise<any[]>;
    generateLearningPath(userId: string, subject: string): Promise<any>;
    generateLearningInsight(userId: string): Promise<string>;
    updatePathAfterAssessment(userId: string, assessmentId: string): Promise<void>;
}
export declare const recommendationService: RecommendationService;
//# sourceMappingURL=recommendationService.d.ts.map