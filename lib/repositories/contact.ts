import { query } from '../db';

export async function createContactMessage(data: {
    full_name: string;
    email: string;
    message: string;
}) {
    const res = await query(
        `INSERT INTO contact_messages (full_name, email, message)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [data.full_name, data.email, data.message]
    );
    return res.rows[0];
}

export async function getContactMessages() {
    const res = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return res.rows;
}

export async function deleteContactMessage(id: string) {
    await query('DELETE FROM contact_messages WHERE id = $1', [id]);
}

export async function getTotalContactMessagesCount() {
    const res = await query('SELECT COUNT(*) as count FROM contact_messages');
    return parseInt(res.rows[0].count, 10);
}
