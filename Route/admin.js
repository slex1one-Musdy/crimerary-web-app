const express = require("express");
const adminRoute = express.Router();
const path = require("path");
const {
  createUser,
  removeUser,
  createCrime,
  removeCrime,
  createCriminal,
  editCrime,
  editCriminal,
  removeCriminal,
  createMissingPerson,
  removeMissingPerson,
} = require("../Controller/admin");

//Admin Dashboard after success login
const { dashboard } = require("../Controller/auth");

//ADD VALIDATION MIDDLEWARE FUNCTIONS
const { registerValidation } = require("../Middleware/Validation/validation");

const { checkAuthorization, adminAccess } = require("../Middleware/Auth/auth");
const { errorValidation } = require("../Middleware/Validation/error");
const { uploadImage } = require("../Middleware/Uploads/upload");

adminRoute.delete(
  "/remove-user/:id",
  [checkAuthorization, adminAccess],
  removeUser
);

adminRoute.post(
  "/create-new-user",
  [checkAuthorization, registerValidation, errorValidation],
  createUser
);

adminRoute.post(
  "/add-new-criminal",
  [checkAuthorization, adminAccess, uploadImage.single("photo")],
  createCriminal
);

adminRoute.post(
  "/create-new-crime",
  [checkAuthorization, adminAccess, uploadImage.single("photo")],
  createCrime
);

adminRoute.put(
  "/edit-crime/:crimeID",
  [checkAuthorization, adminAccess, uploadImage.single("photo")],
  editCrime
);

adminRoute.put(
  "/edit-criminal/:criminalID",
  [checkAuthorization, adminAccess, uploadImage.single("photo")],
  editCriminal
);

adminRoute.post(
  "/remove-criminal/:criminalID",
  [checkAuthorization, adminAccess],
  removeCriminal
);

adminRoute.post(
  "/remove-crime/:crimeID",
  [checkAuthorization, adminAccess],
  removeCrime
);

adminRoute.post(
  "/create-missing-person",
  [checkAuthorization, adminAccess, uploadImage.single("photo")],
  createMissingPerson
);

adminRoute.post(
  "/remove-missing-person/:missingPersonID",
  [checkAuthorization, adminAccess],
  removeMissingPerson
);

adminRoute.get("/dashboard", [checkAuthorization, adminAccess], dashboard);

module.exports = adminRoute;
