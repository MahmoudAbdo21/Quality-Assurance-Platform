import { getActiveCourses } from '../lib/repositories/courses';
import { getForumTopics } from '../lib/repositories/forum';
import { getRegistrationsByVisitor } from '../lib/repositories/registrations';
import { getVisitorId } from '../lib/auth/visitor';
import MainClient from '../components/public/MainClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
    let courses = [];
    let forumTopics = [];
    let registrations = [];
    let dbError = false;

    try {
        courses = await getActiveCourses();
        forumTopics = await getForumTopics();
        const visitorId = getVisitorId();
        registrations = await getRegistrationsByVisitor(visitorId);
    } catch (e) {
        console.error("Database connection error", e);
        dbError = true;
    }

    return (
        <MainClient 
            initialCourses={courses} 
            initialForumTopics={forumTopics} 
            registrations={registrations} 
            dbError={dbError}
        />
    );
}
