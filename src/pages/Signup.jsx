// src/pages/Signup.jsx
import SignupForm from "../components/SignupForm";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";

export default function Signup() {
  return (
    <main className={styles.login}>
      <PageNav />
      <SignupForm />
    </main>
  );
}
