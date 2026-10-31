import {
  BarChart,
  CalendarMonth,
  ChevronLeft,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  ReceiptLong,
  Sell,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AppBar } from "~/components/AppBar";
import { CardNew } from "~/components/CardNew";
import { CardPedido } from "./components/CardPedido";
import { LoaderPage } from "~/components/LoaderPage";
import api from "~/services/axios";
import type { ILote } from "~/types/lote.type";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";
import { parseDate } from "~/utils/parseDate";
import { FooterApp } from "~/components/FooterApp";
import { Input } from "~/components/Input";
import { useForm } from "react-hook-form";
import { Btn } from "~/components/Btn";
import { useAlert } from "~/context/AlertContext";
import { defaultErrorMessage } from "~/utils/defaultErrorMessage";

interface IResLote extends ILote {
  createdAt: Date;
  updatedAt: Date;
  pedidos: IPedido[];
}

export function LotePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const edit = searchParams.get("edit");

  const {
    control,
    handleSubmit,
    setValues,
    formState: { isSubmitting },
  } = useForm<IResLote>({
    mode: "onTouched",
    defaultValues: {},
  });

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [lote, setLote] = useState<IResLote>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHeart, setIsLoadingHeart] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [resume, setResume] = useState<
    {
      produto: string;
      qtde: number;
    }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(edit == "true");

  const handleSaveLote = async (data: IResLote) => {
    try {
      setIsLoading(true);
      await api.put(`/lotes/${id}`, {
        titulo: data.titulo,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      });
      setLote(data);
      setIsEdit(false);
    } catch (error) {
      showAlert(defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      setIsLoadingHeart(true);
      await api.put(`/lotes/${id}`, { favorito: !lote?.favorito });
      setLote({
        ...lote!,
        favorito: !lote?.favorito!,
      });
      setValues({
        ...lote,
        favorito: !lote?.favorito!,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingHeart(false);
    }
  };

  const handleDeleteLote = () => {
    showAlert({
      variant: "warning",
      title: "Excluir lote",
      message:
        "Tem certeza de que deseja excluir esse lote? Você não poderá mais usá-lo.",
      labelLeftButton: "Não",
      onClickLeftButton: () => {},
      labelRightButton: "Sim",
      onClickRightButton: async () => {
        await api.delete(`/lotes/${id}`);
        navigate(`/`);
      },
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleRedirectPedido = (idPedido?: string) => {
    navigate(`/pedido?loteId=${id}${idPedido ? `&id=${idPedido}` : ""}`);
  };

  const getResume = (dataProdutos: IProduto[], dataPedidos: IPedido[]) => {
    const data = dataProdutos
      .map((produto) => {
        return {
          produto: produto.nome,
          qtde: dataPedidos.reduce((count: number, pedido) => {
            pedido.items.forEach((item) => {
              if (item.produtoId == produto.id) {
                count += Number(item.qtde);
              }
            });
            return count;
          }, 0),
        };
      })
      .filter((produto) => produto.qtde > 0);

    setResume(data);
  };

  useEffect(() => {
    if (id) {
      setIsLoadingPage(true);
      Promise.all([api.get(`/lotes/${id}`), api.get("/produtos")])
        .then((data) => {
          const [resLote, resProdutos] = data;
          setLote(resLote.data);
          setValues(resLote.data);
          setProdutos(resProdutos.data);
          getResume(resProdutos.data, resLote.data.pedidos);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, []);

  return (
    <section>
      <AppBar />
      <Container maxWidth="lg" className="my-4">
        {isLoadingPage ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex flex-row items-start gap-2 md:gap-4">
                    <IconButton onClick={handleBack} size="small">
                      <ChevronLeft fontSize="large" color="secondary" />
                    </IconButton>
                    <h1 className="break-all mt-1">{lote?.titulo}</h1>
                  </div>

                  {!!lote?.data_fim && !!lote?.data_inicio && !isEdit ? (
                    <div className="flex flex-row gap-4 md:hidden mt-2">
                      <CalendarMonth className="mr-2" />
                      <b>{`${parseDate(lote.data_inicio)} à ${parseDate(lote.data_fim)}`}</b>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <IconButton
                    color="primary"
                    className="h-fit"
                    onClick={handleFavorite}
                  >
                    {isLoadingHeart ? (
                      <CircularProgress size="1rem" />
                    ) : lote?.favorito ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <IconButton
                    className="h-fit"
                    onClick={() => setIsEdit(!isEdit)}
                  >
                    <Edit className="text-blue-400" />
                  </IconButton>
                  <IconButton className="h-fit" onClick={handleDeleteLote}>
                    <Delete className="text-red-400" />
                  </IconButton>
                </div>
              </div>
              {isEdit ? (
                <form
                  onSubmit={handleSubmit(handleSaveLote)}
                  className="h-full flex flex-col gap-8"
                >
                  <div className="pt-8">
                    <Grid container spacing={{ xs: 2, md: 4 }}>
                      <Grid size={12} className="flex flex-col">
                        <Input
                          name="titulo"
                          label="Titulo"
                          placeholder="Digite aqui"
                          color="secondary"
                          control={control}
                          rules={{
                            required: "Campo obrigatório",
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }} className="flex flex-col">
                        <Input
                          name="data_inicio"
                          label="Data início"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          color="secondary"
                          control={control}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }} className="flex flex-col">
                        <Input
                          name="data_fim"
                          label="Data fim"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          color="secondary"
                          control={control}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }} className="flex flex-col">
                        <Btn loading={isLoading} type="submit">
                          Salvar
                        </Btn>
                      </Grid>
                    </Grid>
                  </div>
                </form>
              ) : !!lote?.data_fim && !!lote?.data_inicio ? (
                <div className="flex-row gap-4 hidden md:flex">
                  <CalendarMonth className="mr-2" />
                  <b>{`${parseDate(lote.data_inicio)} à ${parseDate(lote.data_fim)}`}</b>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {resume.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4 border-b-2 border-dashed pb-2">
                  <BarChart />
                  <h2>Resumo</h2>
                </div>

                <Grid container spacing={{ xs: 2, md: 4 }}>
                  {resume.map((item) => (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card
                        className="w-full rounded-2xl"
                        sx={{ borderRadius: "16px", height: "auto" }}
                        elevation={0}
                      >
                        <CardContent className="p-0">
                          <div className="flex  flex-row justify-between text-[#f4f6fc] w-full align-middle items-center h-full">
                            <div className="flex flex-row gap-2 items-center">
                              <Sell />
                              <b className="text-lg">{item.produto}</b>
                            </div>
                            <b className="text-xl">{item.qtde}</b>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4 border-b-2 border-dashed pb-2">
                <ReceiptLong />
                <h2>Pedidos</h2>
              </div>

              <Grid container spacing={{ xs: 2, md: 4 }}>
                {lote?.pedidos.map((item) => (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <CardPedido item={item} loteId={id!} produtos={produtos} />
                  </Grid>
                ))}

                <Grid size={{ xs: 12, md: 4 }}>
                  <CardNew handleClick={() => handleRedirectPedido()} />
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Container>

      <FooterApp />
    </section>
  );
}
