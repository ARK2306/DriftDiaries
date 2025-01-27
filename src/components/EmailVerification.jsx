import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../lib/supabase";

const EmailVerification = ({ email }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (resendError) throw resendError;
      setSuccess(
        "Verification email has been resent. Please check your inbox."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Icon>✉️</Icon>
        <Title>Verify your email</Title>
        <Description>We've sent a verification email to:</Description>
        <EmailText>{email}</EmailText>
        <Description>
          Please check your inbox and click the verification link to complete
          your registration.
        </Description>

        {error && <Error>{error}</Error>}
        {success && <Success>{success}</Success>}

        <ButtonGroup>
          <ResendButton onClick={handleResendEmail} disabled={loading}>
            {loading ? "Sending..." : "Resend verification email"}
          </ResendButton>
          <LoginButton onClick={() => navigate("/login")}>
            Go to login
          </LoginButton>
        </ButtonGroup>

        <Note>
          Can't find the email? Check your spam folder or try resending the
          verification email.
        </Note>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-dark--1);
  padding: 2rem;
`;

const Card = styled.div`
  background-color: #90ee90;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #323232;
  margin-bottom: 1rem;
`;

const Description = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const EmailText = styled.div`
  font-weight: bold;
  color: #323232;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
`;

const Button = styled.button`
  padding: 0.8rem;
  border: 2px solid #323232;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResendButton = styled(Button)`
  background-color: beige;
  color: #323232;
  box-shadow: 4px 4px #323232;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px #323232;
  }
`;

const LoginButton = styled(Button)`
  background-color: transparent;
  color: #323232;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Note = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 2rem;
`;

const Error = styled.div`
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  padding: 0.8rem;
  border-radius: 6px;
  margin: 1rem 0;
`;

const Success = styled.div`
  color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid #2ecc71;
  padding: 0.8rem;
  border-radius: 6px;
  margin: 1rem 0;
`;

export default EmailVerification;
