import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import api from "../services/api";
import { setLogin } from "../store/state";

const schema = yup
  .object({
    email: yup
      .string("Please provide a valid email address")
      .required("Please provide your email address"),
    password: yup.string().required("Password is required"),
  })
  .required();

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const login = async (data) => {
    try {
      const response = await api.post("auth/token/", {
        email: data["email"],
        password: data["password"],
      });

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const decodedJwt = jwtDecode(access);
      const user = {
        user_id: decodedJwt.user_id,
        firstName: decodedJwt.firstName,
        lastName: decodedJwt.lastName,
        email: decodedJwt.email,
        date_joined: decodedJwt.date_joined,
      };

      dispatch(
        setLogin({
          accessToken: access,
          refreshToken: refresh,
          user: user,
        })
      );

      navigate("/home");
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
        <form onSubmit={handleSubmit(login)}>
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
              Login
            </Typography>
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
                        showPassword
                          ? "Hide the password"
                          : "Display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
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
              Login
            </Button>
            <Typography
              align="center"
              variant="body2"
              className="mt-4 text-gray-600"
            >
              Don’t have an account?{" "}
              <a
                onClick={() => navigate("/register")}
                className="text-indigo-500 hover:text-indigo-700 cursor-pointer transition duration-200"
              >
                Register
              </a>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
