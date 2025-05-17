export const SQL = {
  all: `SELECT * FROM storycards ORDER BY created_at ASC`,
  find: `SELECT * FROM storycards WHERE id = $1`,
  create: `INSERT INTO storycards (content, pos_x, pos_y, height) VALUES ($1, $2, $3, $4) RETURNING *`,
  update: `UPDATE storycards SET content = $2, pos_x = $3, pos_y = $4, height = $5 WHERE id = $1 RETURNING *`,
  delete: `DELETE FROM storycards WHERE id = $1 RETURNING *`,
};
