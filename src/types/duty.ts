export interface Duty {
    id: number;
    title: string;
    description: string;
    date: string;
    assignedTo: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Schedule {
    id: number;
    duties: Duty[];
    user: User;
    startDate: string;
    endDate: string;
}