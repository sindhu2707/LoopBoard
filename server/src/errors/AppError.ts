export class AppError extends Error { 
    statusCode: number; 
    constructor(statusCode: number, message: string) { 
        super(message); 
        this.statusCode = statusCode; 
    } 
} 

export class NotFoundError extends AppError { 
    constructor(message = "Resource not found") { 
        super(404, message); 
    } 
} 

export class ValidationError extends AppError { 
    details?: unknown; 
    constructor(message = "Invalid data", details?: unknown) { 
        super(400, message); 
        this.details = details; 
    } 
} 