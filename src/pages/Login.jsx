import PageNav from "../components/PageNav";
import AuthForm from "../components/AuthForm";
import Card from "./card";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <main className={styles.login}>
      <PageNav />
      <div className={styles.container}>
        <Card />
        <AuthForm />
      </div>
    </main>
  );
};

export default Login;
