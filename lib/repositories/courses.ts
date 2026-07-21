import { query } from '../db';

export async function getActiveCourses() {
    const res = await query('SELECT * FROM courses WHERE is_active = TRUE ORDER BY sort_order ASC');
    return res.rows;
}

export async function getCourseById(id: number) {
    const res = await query('SELECT * FROM courses WHERE id = $1', [id]);
    return res.rows[0];
}

export async function getTotalCoursesCount() {
    const res = await query('SELECT COUNT(*) as count FROM courses');
    return parseInt(res.rows[0].count, 10);
}
