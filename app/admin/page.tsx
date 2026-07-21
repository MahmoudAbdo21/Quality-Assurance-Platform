import { getTotalCoursesCount } from '../../lib/repositories/courses';
import { getAllRegistrations, getTotalRegistrationsCount } from '../../lib/repositories/registrations';
import { getForumTopics, getTotalForumTopicsCount } from '../../lib/repositories/forum';
import { getContactMessages, getTotalContactMessagesCount } from '../../lib/repositories/contact';
import AdminClient from '../../components/admin/AdminClient';
import { getSession } from '../../lib/auth/admin';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) {
        redirect('/admin/login');
    }

    const [
        coursesCount, 
        registrationsCount, 
        forumCount, 
        contactCount,
        registrations,
        forumTopics,
        contactMessages
    ] = await Promise.all([
        getTotalCoursesCount(),
        getTotalRegistrationsCount(),
        getTotalForumTopicsCount(),
        getTotalContactMessagesCount(),
        getAllRegistrations(),
        getForumTopics(),
        getContactMessages()
    ]);

    return (
        <AdminClient 
            stats={{ coursesCount, registrationsCount, forumCount, contactCount }}
            registrations={registrations}
            forumTopics={forumTopics}
            contactMessages={contactMessages}
        />
    );
}
