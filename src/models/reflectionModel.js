const pool = require("../config/db");

const Reflection = {
  async create(userId, success, lowPoint, takeAway) {
    const query = `
            INSERT INTO reflections ("UserId", success, low_point, take_away)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
    const values = [userId, success, lowPoint, takeAway];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getReflections(userId) {
    const query = `
            SELECT * FROM reflections
            WHERE "UserId" = $1`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async updateReflection(reflectionId, userId, success, lowPoint, takeAway) {
    const query = `
    UPDATE reflections 
    SET success = $1, low_point = $2, take_away = $3 
    WHERE id = $4 AND "UserId" = $5 
    RETURNING id, success, low_point, take_away, "createdAt", "updatedAt";
  `;
    const values = [success, lowPoint, takeAway, reflectionId, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async deleteReflection(reflectionId, userId) {
    const query = `
    DELETE FROM reflections 
    WHERE id = $1 AND "UserId" = $2 
    RETURNING id;
  `;
    const { rows } = await pool.query(query, [reflectionId, userId]);
    return rows[0];
  },
};

module.exports = Reflection;
