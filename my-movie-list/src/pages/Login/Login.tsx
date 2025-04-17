import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/userAuth";
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';

type Props = object;

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginPage = (props: Props) => {
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.userName, form.password);
  };
  return (
    <div className="backdrop">
    <>
    <Form className="login-form" onSubmit={handleSubmit(handleLogin)}>
        <h3>Login Here</h3>

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

        <Button type="submit">Log In</Button>
        <div className="social">
          <h4>
            <a href="/registration">Register</a>
          </h4>
        </div>
      </Form>
    </>
    </div>
  );
};

export default LoginPage;