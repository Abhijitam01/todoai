export interface AIResponse { text: string }

export interface GoalPlanRequest {
  title: string
  description?: string
}

export interface GoalPlanResponse {
  suggestedTasks: string[]
}
