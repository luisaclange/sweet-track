import { Card, CardContent, Container } from "@mui/material";
import { useState } from "react";
import logo from "../../assets/file.svg";
import { validateCPF } from "~/utils/validateCPF";
import { Input } from "~/components/Input";
import { useNavigate } from "react-router";
import { validatePassword } from "~/utils/validatePassword";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";
import { useForm } from "react-hook-form";
import { Btn } from "~/components/Btn";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";
import { isAxiosError } from "axios";

interface IRegisterForm {
  name?: string;
  username?: string;
  password?: string;
  passwordConfirm?: string;
}

export function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<IRegisterForm>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
      name: "",
      passwordConfirm: "",
    },
  });

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleRegister = async (data: IRegisterForm) => {
    try {
      setIsLoading(true);

      await api.post("/usuarios", {
        cpf: data.username?.replace(/\D/g, ""),
        senha: data.password,
        nome: data.name,
      });
      showAlert({
        variant: "success",
        title: "Cadastro realizado com sucesso!",
        message:
          "Seu cadastro foi realizado com sucesso! Aguarde sua solicitação ser aceita para acessar o sistema.",
        onClickRightButton: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (
          error.status == 401 &&
          error.response?.data.message == "Este CPF já está cadastrado."
        ) {
          showAlert({
            variant: "error",
            title: "CPF já cadastrado",
            message:
              "Este CPF já está cadastrado no nosso sistema. Caso não consiga acessar, entre em contato com um administrador.",
          });
          return;
        }
      }
      showAlert(defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full">
      <Container maxWidth="lg" className="h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <Card
            className="h-fit min-h-48 w-full rounded-2xl max-w-xl bg-[#19273170]"
            sx={{ borderRadius: "16px" }}
            style={{ minHeight: "650px" }}
            elevation={0}
          >
            <CardContent className="p-4 flex flex-col items-center h-full">
              <img src={logo} width="100px" />
              <b style={{ fontFamily: "Lora" }} className="text-4xl text-white">
                Sweet Track
              </b>
              <div className="w-full mt-8 flex flex-col gap-8">
                <p className="text-white text-center">
                  Faça seu cadastro em nosso sistema!
                </p>

                <form
                  onSubmit={handleSubmit(handleRegister)}
                  className="h-full flex flex-col gap-8"
                >
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      name="name"
                      label="Nome"
                      control={control}
                      placeholder="Informe seu nome"
                      rules={{
                        required: "Campo obrigatório",
                      }}
                    />

                    <Input
                      name="username"
                      label="CPF"
                      autoComplete="new-password"
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
                      autoComplete="new-password"
                      rules={{
                        required: "Campo obrigatório",
                        validate: (value) =>
                          validatePassword(value!) ||
                          "A senha deve possuir no mínimo 6 dígitos, números e letras",
                      }}
                    />

                    <Input
                      name="passwordConfirm"
                      label="Confirme sua senha"
                      placeholder="Digite sua senha"
                      control={control}
                      password
                      rules={{
                        required: "Campo obrigatório",
                        validate: (value) =>
                          value == getValues().password ||
                          "As senhas não batem",
                      }}
                    />
                  </div>

                  <div className="w-full flex flex-row gap-4 justify-between">
                    <Btn
                      className="w-100"
                      variant="secondary"
                      onClick={handleLogin}
                    >
                      Voltar
                    </Btn>
                    <Btn className="w-100" type="submit" isLoading={isLoading}>
                      Cadastrar
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
