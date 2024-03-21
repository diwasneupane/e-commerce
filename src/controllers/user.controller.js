import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import userValidation from "../utils/user_validation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    userValidation.parse({ username, email, password });
  } catch (error) {
    throw new ApiError(400, error.errors);
  }
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(409, "all field are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, "user already exist");
  }
  let profileLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.profile) &&
    req.files.profile.lenght > 0
  ) {
    profileLocalPath = req.files.profile[0].path;
  }

  const profile = await uploadOnCloudinary(profileLocalPath);
  const user = await User.create({
    username,
    email,
    password,
    profile: profile?.url || "",
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "error while creating user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "user registered successfully"));
});

export { registerUser };
