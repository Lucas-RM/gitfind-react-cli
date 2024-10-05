import { Link } from 'react-router-dom';
import "./styles.css";

const Header = () => {
  return (
    <header>
        <h1>GitFind</h1>
        <Link to="/">Voltar para a Página Inicial</Link>
    </header>
  );
};

export { Header };