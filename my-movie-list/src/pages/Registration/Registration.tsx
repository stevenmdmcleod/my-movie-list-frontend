import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/userAuth";
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Registration.css';

type Props = object;

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.userName, form.password);
  };
  return (
    <div className="backdrop">
    <>
    <Form className="login-form" onSubmit={handleSubmit(handleLogin)}>
        <h3>Register New Account</h3>

        <label>Email</label>
        <input
          type="text"
          placeholder="Enter Email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-white">{errors.email.message}</p>
        ) : (
          ""
        )}

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter Username"
          {...register("userName")}
        />
        {errors.userName ? (
          <p className="text-white">{errors.userName.message}</p>
        ) : (
          ""
        )}

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          id="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="white-text">{errors.password.message}</p>
        ) : (
          ""
        )}

        <Button type="submit">Register</Button>
      </Form>
    </>
    </div>
  );
};

export default RegisterPage;