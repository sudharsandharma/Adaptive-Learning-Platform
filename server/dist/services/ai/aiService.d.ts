export declare class AIService {
    private isConfigured;
    private getResponse;
    generateLearningInsight(studentContext: any): Promise<string>;
    answerStudentQuestion(question: string, studentContext: any): Promise<string>;
    generateLearningPath(studentContext: any): Promise<any>;
    generateRecommendations(studentContext: any): Promise<any>;
}
export declare const aiService: AIService;
//# sourceMappingURL=aiService.d.ts.map