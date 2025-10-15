import Products from "../models/Products.js";

function parseSegmentRules(rulesText) {
  const lines = rulesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const query = {};

  for (const line of lines) {
    const [field, operator, valueRaw] = line.split(/\s+/);
    let value = valueRaw;

    // Convert booleans and numbers
    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (!isNaN(Number(value))) value = Number(value);

    switch (operator) {
      case "=":
        query[field] = value;
        break;
      case ">":
        query[field] = { $gt: value };
        break;
      case "<":
        query[field] = { $lt: value };
        break;
      case ">=":
        query[field] = { $gte: value };
        break;
      case "<=":
        query[field] = { $lte: value };
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  return query;
}

export const evaluateSegmentController = async (req, res) => {
  try {
    const { rules } = req.body;

    if (!rules || typeof rules !== "string") {
      return res.status(400).json({ error: "Rules text is required" });
    }

    const query = parseSegmentRules(rules);
    const results = await Products.find(query);

    res.status(200).json({
      count: results.length,
      query,
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
