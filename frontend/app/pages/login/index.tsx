import { Card, CardContent, Container } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/file.svg";
import { validateCPF } from "~/utils/validateCPF";
import { Input } from "~/components/Input";
import { useNavigate } from "react-router";
import api from "~/services/axios";
import { isAxiosError } from "axios";
import { useAlert } from "~/context/AlertContext";
import { filterErrorLogin } from "./utils/filterErrorLogin";
import { Btn } from "~/components/Btn";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";
import { useForm } from "react-hook-form";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    username?: string;
    password?: string;
  }>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const handleLogin = async (data: {
    username?: string;
    password?: string;
  }) => {
    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", {
        cpf: data.username?.replace(/\D/g, ""),
        senha: data.password,
      });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "expireSession",
        new Date().getTime() + response.data.expiresIn,
      );
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        showAlert(filterErrorLogin(error));
      } else {
        showAlert(defaultErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/cadastro");
  };

  return (
    <section className="h-full">
      <Container maxWidth="lg" className="h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <Card
            className="h-fit w-full rounded-2xl max-w-xl"
            style={{ minHeight: "650px" }}
            sx={{ borderRadius: "16px" }}
            elevation={0}
          >
            <CardContent className="p-4 flex flex-col items-center h-full">
              <img src={logo} width="100px" />
              <b style={{ fontFamily: "Lora" }} className="text-4xl text-white">
                Sweet Track
              </b>
              <div className="w-full mt-8 flex flex-col gap-8 h-full">
                <p className="text-white text-center">
                  Faça seu login na plataforma!
                </p>

                <form
                  onSubmit={handleSubmit(handleLogin)}
                  className="h-full flex flex-col gap-8"
                >
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      name="username"
                      label="CPF"
                      control={control}
                      placeholder="000.000.000-00"
                      mask="cpf"
                      rules={{
                        required: "Campo obrigatório",
                        validate: (value) =>
                          validateCPF(value!) || "CPF inválido",
                      }}
                    />

                    <Input
                      name="password"
                      label="Senha"
                      control={control}
                      password
                      rules={{
                        required: "Campo obrigatório",
                      }}
                    />
                  </div>

                  <div className="w-full flex flex-row gap-4 justify-between">
                    <Btn
                      variant="secondary"
                      className="w-100"
                      onClick={handleRegister}
                    >
                      Cadastrar
                    </Btn>
                    <Btn isLoading={isLoading} className="w-100" type="submit">
                      Entrar
                    </Btn>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
