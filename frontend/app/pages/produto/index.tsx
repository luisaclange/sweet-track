import { ChevronLeft } from "@mui/icons-material";
import { Container, Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { AppBar } from "~/components/AppBar";
import { Btn } from "~/components/Btn";
import { FooterApp } from "~/components/FooterApp";
import { Input } from "~/components/Input";
import { LoaderPage } from "~/components/LoaderPage";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";
import type { IProduto } from "~/types/produto.type";

export function ProdutoPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const {
    control,
    handleSubmit,
    setValues,
    formState: { isSubmitting },
  } = useForm<IProduto>({
    mode: "onTouched",
    defaultValues: {},
  });

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProduto = async (data: IProduto) => {
    try {
      if (id) {
        await api.put(`/produtos/${id}`, data);
      } else {
        await api.post(`/produtos`, data);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduto = async () => {
    showAlert({
      variant: "warning",
      title: "Excluir produto",
      message:
        "Tem certeza de que deseja excluir esse produto? Você não poderá mais usá-lo.",
      labelLeftButton: "Não",
      onClickLeftButton: () => {},
      labelRightButton: "Sim",
      onClickRightButton: async () => {
        await api.delete(`/produtos/${id}`);
        navigate("/");
      },
    });
  };

  const handleRedirectHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (id) {
      setIsLoadingPage(true);
      Promise.all([api.get(`/produtos/${id}`)])
        .then((data) => {
          const [resProduto] = data;
          setValues(resProduto.data);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, []);

  return (
    <section>
      <AppBar />
      <Container maxWidth="lg" className="mt-4 h-full">
        {isLoadingPage ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center gap-2 md:gap-4">
              <IconButton
                color="secondary"
                size="small"
                onClick={handleRedirectHome}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>
              <h1>{id ? "Editar produto" : "Novo produto"}</h1>
            </div>

            <form
              onSubmit={handleSubmit(handleSaveProduto)}
              className="h-full flex flex-col gap-8"
            >
              <Grid container spacing={{ xs: 2, md: 4 }}>
                <Grid size={12} className="flex flex-col">
                  <Input
                    name="nome"
                    label="Nome"
                    control={control}
                    rules={{
                      required: "Campo obrigatório",
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <div
                    className={`flex flex-row gap-4 ${!id ? "justify-end" : "justify-between"} my-12`}
                  >
                    <Btn
                      hidden={!id}
                      variant="secondary"
                      color="error"
                      onClick={handleDeleteProduto}
                    >
                      Excluir
                    </Btn>
                    <Btn loading={isLoading} type="submit">
                      Salvar
                    </Btn>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        )}
      </Container>

      <FooterApp />
    </section>
  );
}
