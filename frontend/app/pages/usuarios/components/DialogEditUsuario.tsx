import { PeopleAlt } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Btn } from "~/components/Btn";
import { Input } from "~/components/Input";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";
import { EStatusUsuario, type IUsuario } from "~/types/usuario.type";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";
import { validateCPF } from "~/utils/validateCPF";

export function DialogEditUsuario({
  isOpen,
  setIsOpen,
  usuario,
  updateUsuario,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  usuario?: IUsuario;
  updateUsuario: (usuario: IUsuario) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setValues,
    formState: { isSubmitting },
  } = useForm<Partial<IUsuario>>({
    mode: "onTouched",
    defaultValues: {
      nome: usuario?.nome,
      cpf: usuario?.cpf,
      status: usuario?.status,
    },
  });

  const { showAlert } = useAlert();

  const handleEditUsuario = async (data: Partial<IUsuario>) => {
    try {
      setIsLoading(true);
      await api.put(`/usuarios/${usuario!.id}`, {
        nome: data.nome,
        cpf: data.cpf?.replace(/\D/g, ""),
        status: data.status,
      });
      updateUsuario(data as IUsuario);
      setIsOpen(false);
      showAlert({
        variant: "success",
        title: "Usuário alterado com sucesso!",
        message: `As alterações nos dados do usuário ${data?.nome} foram aplicadas com sucesso!`,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (
          error.status == 401 &&
          error.response?.data.message ==
            "Não é possível desativar o único usuário ativo do sistema."
        ) {
          showAlert({
            variant: "error",
            title: "Ação inválida",
            message:
              "Você não pode trocar o status deste usuário pois é o único usuário ativo do sistema. Certifique-se de que haja um outro usuário ativo e tente novamente.",
          });
          return;
        }
      }
      showAlert(defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && usuario) {
      setValues(usuario);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          padding: "16px !important",
        }}
      >
        <PeopleAlt className="mr-2 -mt-1" />
        <b className="text-2xl">Editar usuário</b>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "16px !important",
        }}
        id="alert-dialog-description"
      >
        <form
          onSubmit={handleSubmit(handleEditUsuario)}
          className="h-full flex flex-col gap-8"
        >
          <div className="py-4 flex flex-col gap-4">
            <Input
              name="nome"
              label="Nome"
              placeholder="Nome completo"
              control={control}
              rules={{
                required: "Campo obrigatório",
              }}
            />
            <Input
              name="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              control={control}
              mask="cpf"
              rules={{
                required: "Campo obrigatório",
                validate: (value) =>
                  validateCPF(value as string) || "CPF inválido",
              }}
            />
            <Input
              name="status"
              label="Status"
              placeholder="Selecione"
              control={control}
              rules={{
                required: "Campo obrigatório",
              }}
              select
              selectValues={[
                {
                  label: "Ativo",
                  value: EStatusUsuario.ativo,
                },
                {
                  label: "Pendente",
                  value: EStatusUsuario.pendente,
                },
                {
                  label: "Bloqueado",
                  value: EStatusUsuario.recusado,
                },
              ]}
            />
          </div>
          <div className="w-full flex flex-row justify-between">
            <Btn variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Btn>
            <Btn isLoading={isLoading} type="submit" autoFocus>
              Salvar
            </Btn>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
