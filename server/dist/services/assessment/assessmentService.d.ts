export declare class AssessmentService {
    generateAssessment(subject: string, topicIds?: string[], difficulty?: string, count?: number): Promise<any[]>;
    gradeAssessment(assessmentId: string, answers: {
        questionId: string;
        selectedAnswer: number;
    }[]): Promise<any>;
    updateProgress(userId: string, assessmentResult: any): Promise<void>;
    getTopicBreakdown(assessmentId: string): Promise<any[]>;
}
export declare const assessmentService: AssessmentService;
//# sourceMappingURL=assessmentService.d.ts.map