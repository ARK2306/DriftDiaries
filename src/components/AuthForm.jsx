import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  async function handleEmailSignIn(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("not confirmed")) {
          setError(
            'Please check your email to confirm your account before logging in. Click "Resend confirmation" below if needed.'
          );
        } else {
          throw error;
        }
        return;
      }

      navigate("/app/cities", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendConfirmation() {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      setSuccess(
        "Confirmation email has been resent. Please check your inbox."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app/cities`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form" onSubmit={handleEmailSignIn}>
          <div className="title">
            Welcome,
            <br />
            <span>sign in to continue</span>
          </div>

          {success && <div className="success">{success}</div>}

          <input
            className="input"
            name="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              className="input"
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="icon" size={20} />
              ) : (
                <Eye className="icon" size={20} />
              )}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="button-confirm" disabled={loading}>
            {loading ? "Loading..." : "Let's go →"}
          </button>

          {error && error.includes("confirm") && (
            <button
              type="button"
              className="resend-button"
              onClick={handleResendConfirmation}
            >
              Resend confirmation email
            </button>
          )}

          <button
            type="button"
            className="oauthButton"
            onClick={handleGoogleSignIn}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="sign-up-label">
            Don't have an account?
            <span className="sign-up-link" onClick={() => navigate("/signup")}>
              Sign up
            </span>
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-dark--1);

  .container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
  }
  .password-container {
    position: relative;
    width: 100%;
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--font-color-sub);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
      color: var(--font-color);
    }

    .icon {
      stroke-width: 1.5px;
    }
  }

  .form {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: beige;
    --main-color: black;
    padding: 2rem;
    background: lightgreen;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 12px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    width: 100%;
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .sign-up-label {
    margin: 0;
    font-size: 12px;
    color: #747474;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
      "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  }

  .sign-up-link {
    margin-left: 5px;
    font-size: 14px;
    text-decoration: underline;
    text-decoration-color: teal;
    color: DarkBlue;
    cursor: pointer;
    font-weight: 900;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
      "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  }

  .input {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--input-focus);
  }

  .success {
    color: #2ecc71;
    font-size: 14px;
    width: 100%;
    text-align: center;
    background: rgba(46, 204, 113, 0.1);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #2ecc71;
  }

  .error {
    color: #e74c3c;
    font-size: 14px;
    width: 100%;
    text-align: center;
    background: rgba(231, 76, 60, 0.1);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #e74c3c;
  }

  .button-confirm {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .resend-button {
    background: none;
    border: none;
    color: var(--color-brand--2);
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      color: var(--color-brand--1);
    }
  }

  .oauthButton {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: auto 15px 15px auto;
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 16px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
    transition: all 250ms;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .oauthButton::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background-color: #212121;
    z-index: -1;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
  }

  .oauthButton:hover {
    color: #e8e8e8;
  }

  .oauthButton:hover::before {
    width: 100%;
  }

  .icon {
    width: 24px;
    height: 24px;
    fill: var(--main-color);
  }
`;

export default AuthForm;
