import { Container } from "@mui/material";
import logo from "../assets/file.svg";

export const FooterApp = () => {
  return (
    <footer
      className="bg-[#19273150] absolute bottom-0 max-w-screen backdrop-blur-sm w-screen"
      style={{ minHeight: "100px" }}
    >
      <Container
        maxWidth="lg"
        className="flex flex-col justify-center items-center py-4"
      >
        <div className="flex flex-row items-center gap-2">
          <img src={logo} width="80px" />
        </div>

        <span className="text-sm text-center">
          © {new Date().getFullYear()} Sweet Track. Todos os direitos
          reservados.
        </span>
      </Container>
    </footer>
  );
};
