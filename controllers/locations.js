const Location = require("../models/location");
const Asset = require("../models/asset");
const defineSearchQuery = require("../utils/define-search-query");

const createLocation = async (req, res, next) => {
  try {
    const location = await new Location(req.body).save();
    res.status(200).json({ data: location });
  } catch (err) {
    next(err);
  }
};

const readLocations = async (req, res, next) => {
  try {
    const searchQuery = defineSearchQuery(req);
    const locations = await Location.find(searchQuery).sort("name");
    res.status(200).json({ data: locations });
  } catch (err) {
    next(err);
  }
};

const readLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.status(200).json({ data: location });
  } catch (err) {
    next(err);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    await location.set(req.body).save();
    res.status(200).json({ data: location });
  } catch (err) {
    next(err);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    const loc = await Location.findById(req.params.id);
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    const assets = await Asset.find({ location: loc._id });
    if (assets.length > 0) {
      return res
        .status(403)
        .json({ error: "Forbidden : Location is used in Asset documents" });
    }
    const deleted = await loc.deleteOne();
    res.status(200).json({ data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLocation,
  readLocations,
  readLocation,
  updateLocation,
  deleteLocation,
};
