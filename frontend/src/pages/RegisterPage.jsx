import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import api from "../services/api";

const schema = yup
  .object({
    fullName: yup.string().required("Please Provide your Full Name"),
    email: yup
      .string("Please provide a valid email address")
      .required("Please provide your email address"),
    password: yup.string().required("Password is required"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  })
  .required();

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const registerUser = async (data) => {
    delete data["passwordConfirmation"];
    try {
      const response = await api.post("auth/register/", {
        fullName: data["fullName"],
        email: data["email"],
        password: data["password"],
      });
      console.log(response.data.message);

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (err) {
      toast.error(err?.response?.data?.error || "An error occurred", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <ToastContainer />

      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit(registerUser)}>
          <Box
            display="grid"
            gap={2}
            gridTemplateColumns="1fr"
          >
            <Typography
              variant="h4"
              align="center"
              className="text-gray-800 font-bold mb-4"
            >
              Register
            </Typography>

            <TextField
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              label="Full Name"
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7C4DFF",
                },
              }}
            />

            <TextField
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7C4DFF",
                },
              }}
            />

            <FormControl
              fullWidth
              error={!!errors.password}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7C4DFF",
                },
              }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                {...register("password")}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText>{errors.password?.message}</FormHelperText>
            </FormControl>

            <FormControl
              fullWidth
              error={!!errors.passwordConfirmation}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7C4DFF",
                },
              }}
            >
              <InputLabel htmlFor="outlined-adornment-confirm-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                {...register("passwordConfirmation")}
                id="outlined-adornment-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: "10px",
                backgroundColor: "#7C4DFF",
                "&:hover": {
                  backgroundColor: "#5C6BC0",
                },
              }}
            >
              Register
            </Button>

            <Typography
              align="center"
              variant="body2"
              className="mt-4 text-gray-600"
            >
              Already have an account?{" "}
              <a
                onClick={() => navigate("/")}
                className="text-indigo-500 hover:text-indigo-700 cursor-pointer transition duration-200"
              >
                Login
              </a>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
