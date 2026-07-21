import { query } from '../db';

export async function createRegistration(data: {
    visitor_id: string;
    course_id: number;
    full_name: string;
    age: number;
    address: string;
    university: string;
    college: string;
    degree: string;
    specialty: string;
}) {
    const res = await query(
        `INSERT INTO registrations (visitor_id, course_id, full_name, age, address, university, college, degree, specialty)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [data.visitor_id, data.course_id, data.full_name, data.age, data.address, data.university, data.college, data.degree, data.specialty]
    );
    return res.rows[0];
}

export async function getRegistrationsByVisitor(visitor_id: string) {
    const res = await query(
        `SELECT r.*, c.title as course_name 
         FROM registrations r
         JOIN courses c ON r.course_id = c.id
         WHERE r.visitor_id = $1
         ORDER BY r.created_at DESC`,
        [visitor_id]
    );
    return res.rows;
}

export async function getRegistrationById(id: string) {
    const res = await query(
        `SELECT r.*, c.title as course_name 
         FROM registrations r
         JOIN courses c ON r.course_id = c.id
         WHERE r.id = $1`,
        [id]
    );
    return res.rows[0];
}

export async function getAllRegistrations() {
    const res = await query(
        `SELECT r.*, c.title as course_name 
         FROM registrations r
         JOIN courses c ON r.course_id = c.id
         ORDER BY r.created_at DESC`
    );
    return res.rows;
}

export async function deleteRegistration(id: string) {
    await query('DELETE FROM registrations WHERE id = $1', [id]);
}

export async function getTotalRegistrationsCount() {
    const res = await query('SELECT COUNT(*) as count FROM registrations');
    return parseInt(res.rows[0].count, 10);
}
