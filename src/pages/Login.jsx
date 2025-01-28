import PageNav from "../components/PageNav";
import styles from "./Login.module.css";

import AuthForm from "../components/AuthForm";
import Card from "./card";

export default function Login() {
  return (
    <main className={styles.login}>
      <PageNav />
      <Card />
      <AuthForm />
    </main>
  );
}
