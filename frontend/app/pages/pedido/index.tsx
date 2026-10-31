import { ChevronLeft, Delete } from "@mui/icons-material";
import { Card, CardContent, Container, Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { AppBar } from "~/components/AppBar";
import { Btn } from "~/components/Btn";
import { FooterApp } from "~/components/FooterApp";
import { Input } from "~/components/Input";
import { LoaderPage } from "~/components/LoaderPage";
import { useAlert } from "~/context/AlertContext";
import api from "~/services/axios";

import type { IItem } from "~/types/item.type";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";

import { defaultErrorMessage } from "~/utils/defaultErrorMessage";

interface IPedidoForm {
  cliente: string;
  items: Partial<IItem>[];
}

export function PedidoPage() {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const loteId = searchParams.get("loteId");

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [pedido, setPedido] = useState<IPedido>();
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IPedidoForm>({
    mode: "onTouched",
    defaultValues: {
      cliente: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const produtosRestantes = produtos.filter(
    (prod) => !items.some((item) => String(item.produtoId) === String(prod.id)),
  );

  const handleDeletePedido = async () => {
    showAlert({
      variant: "warning",
      title: "Excluir pedido",
      message:
        "Tem certeza de que deseja excluir esse pedido? Você não poderá mais usá-lo.",
      labelLeftButton: "Não",
      onClickLeftButton: () => {},
      labelRightButton: "Sim",
      onClickRightButton: async () => {
        await api.delete(`/pedidos/${id}`);
        navigate(`/lote?id=${loteId}`);
      },
    });
  };

  useEffect(() => {
    setIsLoadingPage(true);

    Promise.all([
      api.get("/produtos"),
      id ? api.get(`/pedidos/${id}`) : Promise.resolve(null),
    ])
      .then(([resProdutos, resPedido]) => {
        setProdutos(resProdutos.data);

        const pedidoData = resPedido?.data;

        setPedido(pedidoData);

        reset({
          cliente: pedidoData?.cliente ?? "",
          items: pedidoData?.items ?? [],
        });
      })
      .catch(() => {
        showAlert(defaultErrorMessage);
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, []);

  const handleSavePedido = async (data: IPedidoForm) => {
    try {
      if (data.items.length === 0) {
        showAlert({
          variant: "error",
          title: "Estão faltando dados",
          message: "Você precisa adicionar pelo menos um item na lista.",
        });
        return;
      }

      setIsLoading(true);

      const payload = {
        ...pedido,
        ...data,
      };

      if (id) {
        await api.put(`/pedidos/${id}`, payload);
      } else {
        await api.post("/pedidos", {
          ...payload,
          loteId,
        });
      }

      navigate(`/lote?id=${loteId}`);
    } catch (error) {
      showAlert(defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLote = () => {
    navigate(`/lote?id=${loteId}`);
  };

  return (
    <section>
      <AppBar />

      <Container maxWidth="lg" className="mt-4">
        {isLoadingPage ? (
          <LoaderPage />
        ) : (
          <div>
            <div className="flex flex-row items-center gap-2 md:gap-4">
              <IconButton
                color="secondary"
                size="small"
                onClick={handleRedirectLote}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              <h1>{id ? "Editar pedido" : "Novo pedido"}</h1>
            </div>

            <form onSubmit={handleSubmit(handleSavePedido)}>
              <div className="w-full mt-12">
                <Input
                  name="cliente"
                  control={control}
                  label="Cliente"
                  rules={{
                    required: "Campo obrigatório",
                  }}
                />
              </div>

              <h3 className="mt-12 mb-4">Itens</h3>

              <div className="flex flex-col w-full gap-4">
                {fields.map((field, index) => {
                  const produtosDisponiveis = produtos.filter(
                    (prod) =>
                      !items.some(
                        (item, itemIndex) =>
                          itemIndex !== index &&
                          String(item.produtoId) === String(prod.id),
                      ),
                  );

                  return (
                    <Card
                      key={field.id}
                      sx={{ borderRadius: "16px" }}
                      elevation={0}
                    >
                      <CardContent>
                        <div className="flex flex-row gap-4">
                          <div className="w-full">
                            <Grid container spacing={{ xs: 2, md: 4 }}>
                              <Grid size={8}>
                                <Input
                                  name={`items.${index}.produtoId`}
                                  control={control}
                                  select
                                  label="Produto"
                                  rules={{
                                    required: "Campo obrigatório",
                                  }}
                                  selectValues={produtosDisponiveis.map(
                                    (prod) => ({
                                      label: prod.nome,
                                      value: prod.id,
                                    }),
                                  )}
                                />
                              </Grid>

                              <Grid size={4}>
                                <Input
                                  name={`items.${index}.qtde`}
                                  control={control}
                                  label="Qtde"
                                  placeholder="0"
                                  type="number"
                                  rules={{
                                    required: "Campo obrigatório",
                                    validate: (value) =>
                                      Number(value) > 0 ||
                                      "Informe uma quantidade válida",
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </div>

                          <IconButton
                            color="error"
                            size="large"
                            onClick={() => remove(index)}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {produtosRestantes.length > 0 && (
                  <Card
                    className="p-0 bg-transparent h-full"
                    sx={{
                      backgroundColor: "#19273170",
                      borderRadius: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => append({})}
                  >
                    <CardContent className="flex justify-center items-center h-full p-0">
                      <span className="text-4xl text-[#ff4081]">+</span>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div
                className={`flex flex-row gap-4 ${!id ? "justify-end" : "justify-between"} my-12`}
              >
                <Btn
                  hidden={!id}
                  variant="secondary"
                  color="error"
                  onClick={handleDeletePedido}
                >
                  Excluir
                </Btn>
                <Btn type="submit" isLoading={isLoading || isSubmitting}>
                  Salvar
                </Btn>
              </div>
            </form>
          </div>
        )}
      </Container>

      <FooterApp />
    </section>
  );
}
