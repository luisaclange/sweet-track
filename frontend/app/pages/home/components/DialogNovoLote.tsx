import { Inventory } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Btn } from "~/components/Btn";
import { Input } from "~/components/Input";
import api from "~/services/axios";

export function DialogNovoLote({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    titulo: string;
  }>({
    mode: "onTouched",
    defaultValues: {
      titulo: "",
    },
  });

  const navigate = useNavigate();

  const handleCreateLote = async (data: { titulo: string }) => {
    try {
      setIsLoading(true);
      const response = await api.post("/lotes", {
        titulo: data.titulo,
      });
      navigate(`/lote?id=${response.data?.id}&edit=true`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
        sx={{
          padding: "16px !important",
        }}
        id="alert-dialog-title"
      >
        <Inventory className="mr-2 -mt-1" />
        <b className="text-2xl">Novo lote</b>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "16px !important",
        }}
      >
        <form
          onSubmit={handleSubmit(handleCreateLote)}
          className="h-full flex flex-col gap-8"
        >
          <div className="flex flex-col w-full gap-4 py-2">
            <Input
              name="titulo"
              label="Titulo"
              control={control}
              rules={{
                required: "Campo obrigatório",
              }}
            />
          </div>

          <div className="w-full flex flex-row gap-4 justify-between">
            <Btn variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Btn>
            <Btn isLoading={isLoading} type="submit">
              Criar
            </Btn>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
