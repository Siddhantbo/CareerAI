const { register, logout, SendOtp, verifyOtp, login , ResetPassword, getProfile, updateProfile, deleteProfilePhoto, loginWithGoogle, SendEmailCode, verifyEmailCode, getAllUser } = require("../controller/authcontroller");
const { auth } = require("../middleware/authenticate");
const upload = require("../middleware/uploadMiddleware");

const router=require("express").Router();

//register
router.post("/register",register)
router.get("/logout",logout)
router.post("/sendotp",SendOtp)
router.post("/verify",verifyOtp)

// LogIn 
router.post("/login", login);
router.post("/login-with-google", loginWithGoogle)

//reset password 
router.post("/resetpassword", ResetPassword);

// Add these new routes
router.get("/profile", auth, getProfile);
router.put("/profile/update", auth, upload.single('profilePhoto'), updateProfile);
router.delete("/profile/photo", auth, deleteProfilePhoto);

//get all register user
router.get("/getalluser",getAllUser)

// login send email code
router.post("/send-code",SendEmailCode)
router.post("/verify-code",verifyEmailCode)


module.exports=router;