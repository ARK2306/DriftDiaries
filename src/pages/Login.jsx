import PageNav from "../components/PageNav";
import AuthForm from "../components/AuthForm";
import WelcomeCard from "./WelcomeCard";
import styles from "./LoginPage.module.css";

const Login = () => {
  return (
    <main className={styles.login}>
      <PageNav />
      <div className={styles.container}>
        <WelcomeCard />
        <AuthForm />
      </div>
    </main>
  );
};

export default Login;
