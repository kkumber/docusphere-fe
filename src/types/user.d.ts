interface UserInterface {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    office: string;
    status: number;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    role: string;
}

export type User = UserInterface | null | undefined;