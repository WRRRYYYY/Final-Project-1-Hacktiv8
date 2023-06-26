const Reflection = require("../models/reflectionModel");
const pool = require("../config/db");

exports.create = async (req, res) => {
  try {
    const { success, low_point, take_away } = req.body;
    const reflection = await Reflection.create(
      req.user.id,
      success,
      low_point,
      take_away
    );
    res.status(201).json(reflection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const reflections = await Reflection.getReflections(req.user.id);
    if (!reflections || reflections.length === 0) {
      return res.status(404).json({ error: "No reflections found" });
    }
    res.status(200).json(reflections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const reflectionId = req.params.id;
  const userId = req.user.id;

  const query = `
      SELECT * FROM reflections
      WHERE id = $1`;
  const values = [reflectionId];
  const { rows } = await pool.query(query, values);
  const reflection = rows[0];
  if (!reflection) {
    return res.status(404).json({ error: "No reflection found" });
  }
  if (reflection.UserId !== userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { success, low_point, take_away } = req.body;
    const updatedReflection = await Reflection.updateReflection(
      reflectionId,
      userId,
      success,
      low_point,
      take_away
    );
    return res.status(200).json(updatedReflection);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const reflectionId = req.params.id;
  const userId = req.user.id;

  try {
    const query = `SELECT * FROM reflections WHERE id = $1`;
    const values = [reflectionId];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Reflection not found" });
    }

    const reflection = rows[0];
    if (reflection.UserId !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deleteQuery = `DELETE FROM reflections WHERE id = $1`;
    await pool.query(deleteQuery, [reflectionId]);
    res.status(200).json({ message: "Reflection deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
