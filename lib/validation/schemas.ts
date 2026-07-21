import { z } from 'zod';

export const registrationSchema = z.object({
    course_id: z.number().int().positive(),
    full_name: z.string().min(3).max(255),
    age: z.number().int().min(18).max(120),
    address: z.string().min(5).max(255),
    university: z.string().min(2).max(255),
    college: z.string().min(2).max(255),
    degree: z.string().min(2).max(255),
    specialty: z.string().min(2).max(255),
});

export const forumTopicSchema = z.object({
    author: z.string().min(2).max(255),
    title: z.string().min(5).max(255),
    content: z.string().min(10).max(2000),
});

export const contactMessageSchema = z.object({
    full_name: z.string().min(2).max(255),
    email: z.string().email().max(255),
    message: z.string().min(10).max(2000),
});

export const adminLoginSchema = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
});
