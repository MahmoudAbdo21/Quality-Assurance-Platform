import { query } from '../db';

export async function createForumTopic(data: {
    author: string;
    title: string;
    content: string;
}) {
    const res = await query(
        `INSERT INTO forum_topics (author, title, content)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [data.author, data.title, data.content]
    );
    return res.rows[0];
}

export async function getForumTopics() {
    const res = await query('SELECT * FROM forum_topics ORDER BY created_at DESC');
    return res.rows;
}

export async function deleteForumTopic(id: string) {
    await query('DELETE FROM forum_topics WHERE id = $1', [id]);
}

export async function getTotalForumTopicsCount() {
    const res = await query('SELECT COUNT(*) as count FROM forum_topics');
    return parseInt(res.rows[0].count, 10);
}
